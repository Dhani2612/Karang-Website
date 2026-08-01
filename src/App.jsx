import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';

import UMKMDirectory from './components/UMKMDirectory';
import GallerySection from './components/GallerySection';
import MapSection from './components/MapSection';
import Footer from './components/Footer';

function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isGalleryPage = hash === '#/galeri';

  return (
    <div className="min-h-screen bg-white antialiased flex flex-col">
      <Navbar forceSolid={isGalleryPage} />
      
      {/* ── Konten Utama dengan Animasi Fade ── */}
      <main 
        key={isGalleryPage ? 'gallery' : 'home'} 
        className="flex-1 animate-[fadeIn_0.4s_ease-out_forwards]"
      >
        {isGalleryPage ? (
          <div className="pt-20 min-h-[calc(100vh-80px)] flex flex-col">
            <GallerySection />
            
            {/* Footer Khusus Galeri */}
            <div className="mt-auto py-8 text-center border-t border-warm-100">
              <p className="text-sm font-medium text-gray-400">
                Galeri KKN UPN "Veteran" Yogyakarta 84.065
              </p>
            </div>
          </div>
        ) : (
          <>
            <Hero />
            <About />
            <UMKMDirectory />
            <MapSection />
          </>
        )}
      </main>

      {/* Footer Utama (Sembunyikan di halaman Galeri) */}
      {!isGalleryPage && <Footer />}
    </div>
  );
}

export default App;
