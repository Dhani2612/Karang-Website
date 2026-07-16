import { createContext, useContext, useState, useEffect } from 'react';
import { siteConfig } from '../data/siteData';
import { API_CONFIG } from '../data/apiConfig';

const SiteDataContext = createContext(null);

/* ═══════════════════════════════════════════════════════════
   Google Sheets Response Parser
   ═══════════════════════════════════════════════════════════
   Google Sheets gviz/tq mengembalikan format JSONP:
   google.visualization.Query.setResponse({...});

   Parser ini menangani kasus-kasus khusus:
   1. parsedNumHeaders=0 → baris pertama = header, bukan data
   2. Kolom bertipe number (misal WhatsApp) → pakai formatted value
   3. Cell null → default ke empty string
   ═══════════════════════════════════════════════════════════ */
function parseGoogleSheetsResponse(text) {
  // Extract JSON dari wrapper JSONP
  const match = text.match(
    /google\.visualization\.Query\.setResponse\(({.*})\)/s
  );
  if (!match) {
    throw new Error('Format response Google Sheets tidak valid');
  }

  const json = JSON.parse(match[1]);
  const table = json.table;

  // ── Tentukan nama kolom (header) ──
  // Cek apakah Google Sheets mendeteksi header otomatis
  const hasAutoHeaders = table.cols.some((col) => col.label && col.label.trim() !== '');

  let cols;
  let dataRows;

  if (hasAutoHeaders) {
    // Google mendeteksi header → ambil dari cols.label
    cols = table.cols.map((col) => col.label || '');
    dataRows = table.rows;
  } else {
    // parsedNumHeaders=0 → baris pertama adalah header
    // Ambil nama kolom dari row pertama
    cols = table.rows[0].c.map((cell) =>
      cell ? String(cell.v || '') : ''
    );
    dataRows = table.rows.slice(1); // Skip baris header
  }

  // ── Konversi setiap baris menjadi object { NamaKolom: nilai } ──
  return dataRows
    .map((row) => {
      const obj = {};
      row.c.forEach((cell, i) => {
        if (!cols[i]) return;

        if (!cell || cell.v == null) {
          obj[cols[i]] = '';
          return;
        }

        // Untuk URL (http/https), selalu gunakan raw value (cell.v)
        // karena cell.f bisa berisi teks tampilan yang terpotong.
        // Untuk angka (misal WhatsApp 6.285E12), gunakan cell.f
        // agar tampil benar ("6285158424337").
        const rawVal = cell.v;
        if (typeof rawVal === 'string' && /^https?:\/\//i.test(rawVal)) {
          obj[cols[i]] = rawVal;
        } else if (cell.f != null) {
          obj[cols[i]] = String(cell.f);
        } else {
          obj[cols[i]] = rawVal;
        }
      });
      return obj;
    })
    .filter((row) => {
      // Filter baris kosong (semua value empty string)
      return Object.values(row).some((v) => v !== '');
    });
}

/* ═══════════════════════════════════════════════════════════
   localStorage Cache — Mengurangi fetch & mempercepat load
   ═══════════════════════════════════════════════════════════ */
const CACHE_PREFIX = 'padukuhan_karang_data_v3_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

function getCached(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null; // Cache expired
    }
    return data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    // localStorage penuh atau tidak tersedia — abaikan
  }
}

/**
 * Mengubah URL Google Drive sharing menjadi URL gambar langsung.
 *
 * Input:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * Output: https://drive.google.com/thumbnail?id=FILE_ID&sz=w800
 *
 * Jika bukan URL Google Drive, dikembalikan apa adanya.
 */
function toDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return null;

  let fileId = null;

  // Pattern 1: drive.google.com/file/d/{FILE_ID}/...
  const driveMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (driveMatch) fileId = driveMatch[1];

  // Pattern 2: drive.google.com/open?id={FILE_ID}
  if (!fileId) {
    const openMatch = url.match(
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
    );
    if (openMatch) fileId = openMatch[1];
  }

  // Pattern 3: drive.google.com/uc?id={FILE_ID}
  if (!fileId) {
    const ucMatch = url.match(
      /drive\.google\.com\/uc\?.*id=([a-zA-Z0-9_-]+)/
    );
    if (ucMatch) fileId = ucMatch[1];
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  }

  return url;
}

  /* ── Mapper: row → format UMKM app ── */
function mapUmkmRow(row, index) {
  const rawImage = row['Foto'] || row['foto'] || null;

  // Bersihkan input WhatsApp (hanya ambil angka). Jika kosong/strip, jadikan null.
  let waNumber = String(row['WhatsApp'] || row['whatsapp'] || '').replace(/\D/g, '');
  if (!waNumber) waNumber = null;

  return {
    id: index + 1,
    name: row['Nama'] || row['nama'] || '',
    description: row['Deskripsi'] || row['deskripsi'] || '',
    image: toDirectImageUrl(rawImage),
    qris: String(row['QRIS'] || row['qris'] || '').toLowerCase() === 'ya',
    whatsapp: waNumber,
    category: row['Kategori'] || row['kategori'] || 'Lainnya',
    gmaps: row['Gmaps'] || row['gmaps'] || null,
  };
}

/* ── Mapper: row → format statistik app ── */
function mapStatsRow(row) {
  return {
    id: String(row['ID'] || row['id'] || row['Label'] || '').toLowerCase(),
    label: row['Label'] || row['label'] || '',
    value: parseInt(row['Nilai'] || row['nilai'] || 0, 10),
    description: row['Deskripsi'] || row['deskripsi'] || '',
    icon: row['Icon'] || row['icon'] || 'home',
  };
}

/**
 * Fetch data dari Google Sheets langsung.
 * Cek cache dulu → kalau ada & belum expired, pakai cache.
 * Kalau tidak ada / expired → fetch dari Google Sheets → simpan cache.
 */
async function fetchGoogleSheet(url, cacheKey) {
  // 1. Cek cache
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // 2. Fetch dari Google Sheets
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Sheets: HTTP ${res.status}`);

  const text = await res.text();
  const rows = parseGoogleSheetsResponse(text);

  // 3. Simpan ke cache
  setCache(cacheKey, rows);

  return rows;
}

/**
 * SiteDataProvider — React Context yang:
 * 1. Mulai dengan data statis dari siteData.js (instant, tanpa loading)
 * 2. Jika API URL dikonfigurasi di apiConfig.js → fetch & replace data
 * 3. Jika fetch gagal → tetap tampilkan data statis (fallback)
 */
export function SiteDataProvider({ children }) {
  const [data, setData] = useState(siteConfig);
  const [loading, setLoading] = useState(() =>
    Boolean(API_CONFIG.umkm || API_CONFIG.stats)
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tidak ada API URL? Langsung pakai data statis.
    if (!API_CONFIG.umkm && !API_CONFIG.stats) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        const updates = {};

        // Fetch UMKM dari Google Sheets
        if (API_CONFIG.umkm) {
          const rows = await fetchGoogleSheet(API_CONFIG.umkm, 'umkm');
          if (Array.isArray(rows) && rows.length > 0) {
            updates.umkm = rows.map(mapUmkmRow);
          }
        }

        // Fetch Statistik dari Google Sheets
        if (API_CONFIG.stats) {
          const rows = await fetchGoogleSheet(API_CONFIG.stats, 'stats');
          if (Array.isArray(rows) && rows.length > 0) {
            updates.stats = rows.map(mapStatsRow);
          }
        }

        if (!cancelled) {
          setData((prev) => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.error('⚠️ Gagal memuat data dari Google Sheets:', err);
        if (!cancelled) setError(err.message);
        // Data statis dari siteData.js tetap tampil sebagai fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteDataContext.Provider value={{ ...data, loading, error }}>
      {children}
    </SiteDataContext.Provider>
  );
}

/**
 * Hook untuk mengakses data site dari context.
 * Gunakan di semua komponen yang butuh data:
 *
 *   const { umkm, stats, loading } = useSiteData();
 */
export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error('useSiteData() harus digunakan di dalam <SiteDataProvider>');
  }
  return ctx;
}
