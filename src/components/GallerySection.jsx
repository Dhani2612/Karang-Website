import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSiteData } from '../context/SiteDataContext';

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const ZoomIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </svg>
);

const GallerySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="animate-pulse bg-warm-200 rounded-2xl aspect-[4/3] w-full" />
    <div className="animate-pulse bg-warm-200 rounded-2xl aspect-[4/3] w-full" />
    <div className="animate-pulse bg-warm-200 rounded-2xl aspect-[4/3] w-full" />
  </div>
);

// Helper untuk mengubah URL Thumbnail kembali menjadi URL Preview (Player Google Drive)
const getDrivePreviewUrl = (thumbnailUrl) => {
  const match = thumbnailUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return thumbnailUrl;
};

export default function GallerySection() {
  const { galeri, loading } = useSiteData();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!loading && (!galeri || galeri.length === 0)) {
    return null;
  }

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedAlbum && lightboxIndex < selectedAlbum.images.length - 1) {
      setLightboxIndex((prev) => prev + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedAlbum && lightboxIndex > 0) {
      setLightboxIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <section id="galeri" className="py-16 md:py-20 bg-white min-h-screen flex flex-col">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
          
          {loading ? (
            <div className="mt-10">
              <GallerySkeleton />
            </div>
          ) : !selectedAlbum ? (
            /* =========================================
               TAMPILAN 1: DAFTAR ALBUM (OUR STORIES)
               ========================================= */
            <div className="animate-[fadeIn_0.3s_ease-out_forwards]">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-leaf-950 mb-2 tracking-tight">
                  Galeri Kegiatan
                </h2>
                <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                  Dokumentasi kegiatan dan program kerja mahasiswa KKN di Padukuhan Karang.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galeri.map((album) => {
                  const thumbnail = album.images && album.images.length > 0 ? album.images[0] : null;
                  
                  return (
                    <div 
                      key={album.id}
                      onClick={() => setSelectedAlbum(album)}
                      className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-warm-100 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      {thumbnail && (
                        <img 
                          src={thumbnail} 
                          alt={album.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      )}
                      {/* Overlay Gelap */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 via-[#111]/40 to-transparent"></div>
                      
                      {/* Teks di bawah */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 drop-shadow-md">
                          {album.title}
                        </h3>
                        <p className="text-leaf-300 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                          Buka Album <span className="text-lg leading-none">&rarr;</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* =========================================
               TAMPILAN 2: DETAIL ALBUM (BENTO GRID)
               ========================================= */
            <div className="animate-[fadeIn_0.3s_ease-out_forwards]">
              
              {/* Tombol Kembali */}
              <button 
                onClick={() => setSelectedAlbum(null)}
                className="group flex items-center gap-2 text-gray-500 hover:text-leaf-800 transition-colors mb-8 md:mb-12 font-medium"
              >
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> 
                Kembali ke Galeri
              </button>

              {/* Judul & Deskripsi Album */}
              <div className="text-center mb-10 md:mb-14 px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-leaf-950 mb-5 tracking-tight">
                  {selectedAlbum.title}
                </h2>
                <div className="w-20 h-1.5 bg-leaf-500 mx-auto rounded-full mb-6"></div>
                {selectedAlbum.description && (
                  <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed md:text-lg">
                    {selectedAlbum.description}
                  </p>
                )}
              </div>

              {/* Grid Foto Masonry (Auto-scale) */}
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 md:gap-6 md:space-y-6">
                {selectedAlbum.images.map((imgSrc, idx) => {
                  return (
                    <div 
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative overflow-hidden rounded-2xl bg-warm-100 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 break-inside-avoid"
                    >
                      <img 
                        src={imgSrc} 
                        alt={`${selectedAlbum.title} - Foto ${idx + 1}`} 
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23f5f5f4'%3E%3Crect width='400' height='300' /%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%23a8a29e'%3EGambar/Video Tidak Tersedia%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-[0px] group-hover:backdrop-blur-[2px] transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="transform scale-50 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIcon />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          MODAL LIGHTBOX FULLSCREEN (Pindah ke luar DOM root menggunakan Portal)
          ========================================= */}
      {lightboxIndex !== null && selectedAlbum && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <CloseIcon />
          </button>

          <div 
            className="relative w-full max-w-5xl h-full flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Navigasi Kiri */}
            {lightboxIndex > 0 && (
              <button 
                onClick={prevImage}
                className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <ChevronLeftIcon />
              </button>
            )}

            {/* Gambar/Video Utama di Modal (Menggunakan Iframe Google Drive) */}
            <div className="relative flex-1 flex items-center justify-center min-h-0 py-8 md:py-12 w-full">
              <div className="relative w-full max-w-[90vw] h-[80vh] rounded-xl overflow-hidden drop-shadow-2xl bg-black/40 flex items-center justify-center">
                <iframe 
                  src={getDrivePreviewUrl(selectedAlbum.images[lightboxIndex])} 
                  title={`${selectedAlbum.title} - Media ${lightboxIndex + 1}`}
                  className="w-full h-full border-none absolute inset-0"
                  allow="autoplay"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Navigasi Kanan */}
            {lightboxIndex < selectedAlbum.images.length - 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
              >
                <ChevronRightIcon />
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
