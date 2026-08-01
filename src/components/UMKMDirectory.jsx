import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

/* ── Batas karakter deskripsi di kartu landing page ── */
const DESC_LIMIT = 70;

function truncate(text, limit) {
  if (!text || text.length <= limit) return text;
  return text.slice(0, limit).trimEnd() + '…';
}

/* ── Icons ── */
const WhatsAppIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const QrisIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const ImagePlaceholder = () => (
  <div className="flex flex-col items-center justify-center gap-1">
    <svg
      className="w-7 h-7 text-warm-200"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
    <span className="text-[11px] text-warm-200">Foto Produk</span>
  </div>
);

const UMKMSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg border border-warm-200 overflow-hidden flex flex-col">
    <div className="h-44 bg-warm-100" />
    <div className="p-5 space-y-2.5 flex-1">
      <div className="h-4 bg-warm-200 rounded w-16" />
      <div className="h-5 bg-warm-200 rounded w-3/4" />
      <div className="h-3 bg-warm-100 rounded w-full" />
      <div className="h-3 bg-warm-100 rounded w-2/3" />
      <div className="h-10 bg-leaf-100 rounded-lg w-full mt-2" />
    </div>
  </div>
);

/* ════════════════════════════════════════════════════
   Detail Modal — tampil saat user klik kartu produk
   ════════════════════════════════════════════════════ */
function DetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          aria-label="Tutup"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative h-56 sm:h-64 bg-warm-100 flex items-center justify-center overflow-hidden rounded-t-xl">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-12 h-12 text-warm-200" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-xs text-warm-200">Foto Produk</span>
            </div>
          )}
          {/* Category badge on image */}
          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/90 text-gray-600 text-xs font-medium rounded">
            {item.category}
          </span>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {item.qris && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-wood-50 border border-wood-200 text-wood-600 text-xs font-medium rounded">
                <QrisIcon />
                Menerima QRIS
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {item.name}
          </h3>

          {/* Full description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {item.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {item.whatsapp && (
              <a
                href={`https://wa.me/${item.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 flex-1 justify-center px-5 py-3 bg-leaf-600 text-white text-sm font-medium rounded-lg hover:bg-leaf-700 transition-colors"
              >
                <WhatsAppIcon />
                Hubungi via WhatsApp
              </a>
            )}
            {item.gmaps && (
              <a
                href={item.gmaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-leaf-50 hover:text-leaf-700 hover:border-leaf-200 transition-colors"
                title="Lihat di Google Maps"
              >
                <MapPinIcon />
                Lokasi
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   UMKM Directory — Grid + Detail Modal
   ════════════════════════════════════════════════════ */
export default function UMKMDirectory() {
  const { umkm, loading } = useSiteData();
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('Semua');

  const tabs = ['Semua', 'UMKM', 'Fasilitas Umum', 'Kebudayaan dan Kesenian'];

  const filtered = activeTab === 'Semua'
    ? umkm
    : umkm.filter((item) => item.category === activeTab);

  return (
    <>
      <section id="umkm" className="py-16 md:py-24 bg-warm-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900 mb-2">
              Potensi Padukuhan
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              Daftar produk UMKM unggulan, fasilitas umum, kebudayaan, kesenian, dan aset yang ada di Padukuhan Karang.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab
                    ? 'bg-leaf-600 text-white shadow-md shadow-leaf-600/20'
                    : 'bg-white text-gray-500 border border-warm-200 hover:border-leaf-300 hover:text-leaf-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <UMKMSkeleton key={i} />
              ))
              : filtered.length === 0
                ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400 text-sm">Belum ada data untuk kategori ini.</p>
                  </div>
                )
                : filtered.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white rounded-lg border border-warm-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col cursor-pointer"
                    onClick={() => setSelected(item)}
                  >
                    {/* Image */}
                    <div className="relative h-44 bg-warm-100 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <ImagePlaceholder />
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/90 text-gray-600 text-[11px] font-medium rounded">
                        {item.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      {item.qris && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-wood-50 border border-wood-200 text-wood-600 text-[11px] font-medium rounded mb-2 self-start">
                          <QrisIcon />
                          QRIS
                        </div>
                      )}

                      <h3 className="text-[15px] font-medium text-gray-800 mb-1">
                        {item.name}
                      </h3>

                      {/* Truncated description */}
                      <p className="text-[13px] text-gray-400 leading-relaxed mb-4 flex-1">
                        {truncate(item.description, DESC_LIMIT)}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(item);
                          }}
                          className="inline-flex items-center gap-1.5 flex-1 justify-center px-4 py-2.5 bg-leaf-600 text-white text-sm font-medium rounded-lg hover:bg-leaf-700 transition-colors"
                        >
                          Lihat Detail
                        </button>
                        {item.gmaps && (
                          <a
                            href={item.gmaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 text-gray-500 rounded-lg hover:bg-leaf-50 hover:text-leaf-700 hover:border-leaf-200 transition-colors"
                            title="Lihat di Google Maps"
                          >
                            <MapPinIcon />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
