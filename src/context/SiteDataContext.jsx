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

  // ── Cari baris header secara manual ──
  // Karena kita pakai headers=0, semua baris masuk sebagai data.
  // Kita cari baris yang mengandung 'Nama' atau 'Deskripsi' sebagai header.
  let headerRowIndex = -1;
  const KNOWN_HEADERS = ['nama', 'deskripsi', 'kategori', 'foto'];

  for (let r = 0; r < Math.min(table.rows.length, 5); r++) {
    const rowVals = table.rows[r].c.map((cell) =>
      cell ? String(cell.v || '').trim().toLowerCase() : ''
    );
    const matchCount = rowVals.filter((v) => KNOWN_HEADERS.includes(v)).length;
    if (matchCount >= 2) {
      headerRowIndex = r;
      break;
    }
  }

  let cols;
  let dataRows;

  if (headerRowIndex >= 0) {
    // Gunakan baris header yang ditemukan
    cols = table.rows[headerRowIndex].c.map((cell) =>
      cell ? String(cell.v || '').trim() : ''
    );
    dataRows = table.rows.slice(headerRowIndex + 1);
  } else {
    // Fallback: cek apakah Google punya auto-headers
    const hasAutoHeaders = table.cols.some((col) => col.label && col.label.trim() !== '');
    if (hasAutoHeaders) {
      cols = table.cols.map((col) => col.label || '');
      dataRows = table.rows;
    } else {
      cols = table.rows[0].c.map((cell) =>
        cell ? String(cell.v || '') : ''
      );
      dataRows = table.rows.slice(1);
    }
  }

  // ── Konversi setiap baris menjadi object { NamaKolom: nilai } ──
  return dataRows
    .map((row) => {
      const obj = {};
      row.c.forEach((cell, i) => {
        // Gunakan nama kolom, atau fallback ke 'col_N' untuk kolom tanpa nama
        const colName = cols[i] || `col_${i}`;

        if (!cell || cell.v == null) {
          obj[colName] = '';
          return;
        }

        // Untuk URL (http/https), selalu gunakan raw value (cell.v)
        // karena cell.f bisa berisi teks tampilan yang terpotong.
        // Untuk angka (misal WhatsApp 6.285E12), gunakan cell.f
        // agar tampil benar ("6285158424337").
        const rawVal = cell.v;
        if (typeof rawVal === 'string' && /^https?:\/\//i.test(rawVal)) {
          obj[colName] = rawVal;
        } else if (cell.f != null) {
          obj[colName] = String(cell.f);
        } else {
          obj[colName] = rawVal;
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
const CACHE_PREFIX = 'padukuhan_karang_data_v5_';
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
  // Coba beberapa nama kolom yang mungkin (termasuk col_6 untuk kolom tanpa header)
  const waRaw = row['WhatsApp'] || row['whatsapp'] || row['col_6'] || '';
  let waNumber = String(waRaw).replace(/\D/g, '');
  if (!waNumber) waNumber = null;

  // Kategori: gunakan kolom Kategori. Jika isinya sub-kategori (misal 'Sanggar'),
  // cek kolom pertama (kolom A) yang mungkin berisi kategori utama.
  let category = row['Kategori'] || row['kategori'] || 'Lainnya';
  const colA = row['/'] || row['col_0'] || '';

  // Jika kolom A berisi kategori utama yang valid, gunakan itu
  const VALID_CATEGORIES = ['UMKM', 'Direktori UMKM', 'Fasilitas Umum', 'Kebudayaan dan Kesenian'];
  if (VALID_CATEGORIES.some(c => colA.toLowerCase() === c.toLowerCase())) {
    // Normalisasi: 'Direktori UMKM' → 'UMKM'
    category = colA === 'Direktori UMKM' ? 'UMKM' : colA;
  }

  return {
    id: index + 1,
    name: row['Nama'] || row['nama'] || '',
    description: row['Deskripsi'] || row['deskripsi'] || '',
    image: toDirectImageUrl(rawImage),
    qris: String(row['QRIS'] || row['qris'] || '').toLowerCase() === 'ya',
    whatsapp: waNumber,
    category: category,
    gmaps: row['Gmaps'] || row['gmaps'] || null,
  };
}

/* ── Mapper: row → format Galeri app ── */
function mapGaleriRow(row, index) {
  // Cari kolom yang mengandung kata 'gdrive' atau 'foto'
  const rowKeys = Object.keys(row);
  const gdriveKey = rowKeys.find(k => k.toLowerCase().includes('gdrive') || k.toLowerCase().includes('foto')) || 'col_2';
  
  const rawLinks = row[gdriveKey] || '';
  
  // Pecah link berdasarkan newline (\n) atau koma, lalu bersihkan spasi
  const links = rawLinks
    .split(/[\n,]+/)
    .map(link => link.trim())
    .filter(link => link.length > 0)
    .map(toDirectImageUrl)
    .filter(Boolean); // Hapus null jika gagal di-parse

  return {
    id: index + 1,
    title: row['Judul'] || row['judul'] || 'Tanpa Judul',
    description: row['Deskripsi Kegiatan'] || row['deskripsi'] || row['Deskripsi'] || '',
    images: links // Array of images
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
    Boolean(API_CONFIG.umkm)
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tidak ada API URL? Langsung pakai data statis.
    if (!API_CONFIG.umkm) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        const updates = {};

        // Fetch UMKM dan Galeri secara paralel
        const fetchPromises = [];

        if (API_CONFIG.umkm) {
          fetchPromises.push(
            fetchGoogleSheet(API_CONFIG.umkm, 'umkm')
              .then(rows => {
                if (Array.isArray(rows) && rows.length > 0) {
                  updates.umkm = rows.map(mapUmkmRow);
                }
              })
          );
        }

        if (API_CONFIG.galeri) {
          fetchPromises.push(
            fetchGoogleSheet(API_CONFIG.galeri, 'galeri')
              .then(rows => {
                if (Array.isArray(rows) && rows.length > 0) {
                  updates.galeri = rows.map(mapGaleriRow);
                }
              })
          );
        }

        // Tunggu semua fetch selesai
        await Promise.all(fetchPromises);
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
