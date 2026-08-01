/**
 * ═══════════════════════════════════════════════════════════════
 *  KONFIGURASI API — Google Sheets LANGSUNG (Tanpa SheetDB)
 * ═══════════════════════════════════════════════════════════════
 *
 *  CARA SETUP:
 *
 *  1. Buka Google Spreadsheet Anda di browser.
 *  2. Klik  File → Share → Publish to web → Klik "Publish".
 *  3. Copy Spreadsheet ID dari URL browser Anda:
 *     https://docs.google.com/spreadsheets/d/[INI_SPREADSHEET_ID]/edit
 *  4. Paste ID tersebut di variabel SPREADSHEET_ID di bawah.
 *
 *  CATATAN PENTING:
 *  - Spreadsheet ID SAMA untuk semua 12 dusun.
 *  - Yang BEDA hanya nama sheet (tab) per dusun.
 *  - Gratis tanpa batas request! (tidak pakai SheetDB lagi)
 *
 * ═══════════════════════════════════════════════════════════════
 */

// ┌───────────────────────────────────────────────────────────┐
// │  GANTI NILAI DI BAWAH DENGAN SPREADSHEET ID ANDA         │
// │  Contoh: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms'  │
// └───────────────────────────────────────────────────────────┘
const SPREADSHEET_ID = '1E7SBfDyWBZ6RXDo7rESduNuWayhB2NFKHGSoEN8qkSM';
const SHEET_POTENSI = 'Potensi Karang';

// ┌───────────────────────────────────────────────────────────┐
// │  SPREADSHEET ID KHUSUS GALERI KKN                         │
// │  Silakan ganti dengan ID spreadsheet baru Anda.           │
// └───────────────────────────────────────────────────────────┘
const SPREADSHEET_ID_GALERI = '1rPxKLiaZVViReaC3uVVyWr0Y1cBakR0-jnFv_IaFnnk';
const SHEET_GALERI = 'Galeri Karang';

/**
 * Membangun URL Google Sheets gviz/tq
 */
function buildGoogleSheetsUrl(sheetId, sheetName) {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=0&sheet=${encodeURIComponent(sheetName)}`;
}

// Cek apakah Spreadsheet ID sudah dikonfigurasi
const isConfigured = SPREADSHEET_ID !== 'PASTE_SPREADSHEET_ID_DISINI';
const isGaleriConfigured = SPREADSHEET_ID_GALERI !== 'PASTE_SPREADSHEET_ID_GALERI_DISINI';

export const API_CONFIG = {
  /**
   * URL untuk data Potensi
   */
  umkm: isConfigured ? buildGoogleSheetsUrl(SPREADSHEET_ID, SHEET_POTENSI) : null,
  
  /**
   * URL untuk data Galeri
   */
  galeri: isGaleriConfigured ? buildGoogleSheetsUrl(SPREADSHEET_ID_GALERI, SHEET_GALERI) : null,
};
