import { useSiteData } from '../context/SiteDataContext';
import tuguKarangImg from '../images/TuguKarang.jpeg';

export default function About() {
  const { about } = useSiteData();

  if (!about) return null;

  const halfLength = Math.ceil(about.misi.length / 2);

  return (
    <section id="tentang" className="py-16 md:py-24 bg-warm-50 border-b border-warm-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-xl mb-12">
          <p className="text-xs text-leaf-600 font-medium uppercase tracking-widest mb-2">
            {about.subtitle}
          </p>
          <h2 className="text-2xl md:text-[1.7rem] font-semibold text-leaf-900">
            {about.title}
          </h2>
        </div>

        {/* ── Row 1: Foto & Sejarah ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          <div className="lg:col-span-5 rounded-xl overflow-hidden shadow-sm border border-warm-200 aspect-[16/10]">
            <img
              src={about.image || tuguKarangImg}
              alt={about.title}
              className="w-full h-full object-cover object-[center_90%]"
            />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Sejarah Singkat</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">
              {about.sejarah}
            </p>
          </div>
        </div>

        {/* ── Row 2: Visi & Misi — single card ── */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-warm-200 shadow-sm">
          {/* Visi */}
          <div className="mb-6 pb-6 border-b border-warm-100">
            <h3 className="text-xs font-semibold text-leaf-700 uppercase tracking-wider mb-3">
              Visi
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
              "{about.visi}"
            </p>
          </div>

          {/* Misi */}
          <div>
            <h3 className="text-xs font-semibold text-leaf-700 uppercase tracking-wider mb-4">
              Misi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-0">
              {/* Kolom Kiri */}
              <div className="space-y-3">
                {about.misi.slice(0, halfLength).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 list-none">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-leaf-50 text-leaf-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </div>
              
              {/* Kolom Kanan */}
              <div className="space-y-3">
                {about.misi.slice(halfLength).map((item, idx) => {
                  const actualIdx = halfLength + idx;
                  return (
                    <li key={actualIdx} className="flex items-start gap-2.5 list-none">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-leaf-50 text-leaf-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                        {actualIdx + 1}
                      </span>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {item}
                      </p>
                    </li>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

