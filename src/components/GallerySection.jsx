import { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

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

const GallerySkeleton = () => (
  <div className="animate-pulse bg-warm-100 rounded-xl overflow-hidden aspect-[4/3]" />
);

export default function GallerySection() {
  const { galeri, loading } = useSiteData();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Jangan tampilkan section jika tidak ada data dan tidak sedang loading
  if (!loading && (!galeri || galeri.length === 0)) {
    return null;
  }

  const openAlbum = (album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    if (selectedAlbum && currentImageIndex < selectedAlbum.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (selectedAlbum && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <section id="galeri" className="py-16 md:py-24 bg-white border-b border-warm-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900 mb-3">
              Galeri Kegiatan
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Dokumentasi kegiatan dan program kerja mahasiswa KKN di Padukuhan Karang.
            </p>
          </div>

          {/* Grid Galeri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <GallerySkeleton key={i} />)
            ) : (
              galeri.map((album) => {
                // Gambar pertama sebagai thumbnail
                const thumbnail = album.images && album.images.length > 0 ? album.images[0] : null;
                const photoCount = album.images ? album.images.length : 0;

                return (
                  <div 
                    key={album.id}
                    onClick={() => photoCount > 0 && openAlbum(album)}
                    className={`group relative rounded-xl overflow-hidden bg-warm-100 aspect-[4/3] shadow-sm hover:shadow-md transition-all duration-300 ${photoCount > 0 ? 'cursor-pointer' : ''}`}
                  >
                    {thumbnail ? (
                      <img 
                        src={thumbnail} 
                        alt={album.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-warm-300">
                        <ImageIcon />
                      </div>
                    )}

                    {/* Overlay Hitam saat hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">
                        {album.title}
                      </h3>
                      {photoCount > 1 && (
                        <div className="flex items-center gap-1.5 text-white/80 text-xs">
                          <ImageIcon />
                          <span>{photoCount} Foto</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Modal Album / Lightbox */}
      {selectedAlbum && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedAlbum(null)}
        >
          {/* Tombol Close */}
          <button 
            onClick={() => setSelectedAlbum(null)}
            className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <CloseIcon />
          </button>

          <div 
            className="relative w-full max-w-5xl h-full flex flex-col justify-center"
            onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak nutup modal
          >
            
            {/* Navigasi Kiri */}
            {currentImageIndex > 0 && (
              <button 
                onClick={prevImage}
                className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <ChevronLeftIcon />
              </button>
            )}

            {/* Gambar Utama */}
            <div className="relative flex-1 flex items-center justify-center min-h-0 mb-6">
              <img 
                src={selectedAlbum.images[currentImageIndex]} 
                alt={`${selectedAlbum.title} - Foto ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg drop-shadow-2xl"
              />
            </div>

            {/* Navigasi Kanan */}
            {currentImageIndex < selectedAlbum.images.length - 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <ChevronRightIcon />
              </button>
            )}

            {/* Footer Modal: Teks & Indikator */}
            <div className="text-center text-white shrink-0">
              <h3 className="text-lg font-semibold mb-2">{selectedAlbum.title}</h3>
              {selectedAlbum.description && (
                <p className="text-sm text-gray-300 max-w-2xl mx-auto mb-4 leading-relaxed">
                  {selectedAlbum.description}
                </p>
              )}
              
              {/* Dots Indicator */}
              {selectedAlbum.images.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {selectedAlbum.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
