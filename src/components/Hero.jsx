import { useSiteData } from '../context/SiteDataContext';
import tuguKarangImg from '../images/TuguKarang.jpeg';

export default function Hero() {
  const { hero, padukuhan } = useSiteData();

  return (
    <section
      id="beranda"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <img
        src={tuguKarangImg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[center_80%]"
      />

      {/* Golden gradient overlay — blends with the image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(150deg, rgba(69,26,3,0.92) 0%, rgba(120,53,15,0.85) 35%, rgba(180,83,9,0.75) 65%, rgba(120,53,15,0.88) 100%)',
        }}
      />

      {/* Extra radial glow for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.25) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-24">
        {/* Accent line */}
        <div className="w-10 h-[2px] bg-leaf-400/50 mx-auto mb-8" />

        {/* Location */}
        <p className="text-leaf-300/40 text-[11px] font-medium uppercase tracking-[0.25em] mb-7">
          {padukuhan.desa} · {padukuhan.kecamatan} · {padukuhan.kabupaten}
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-snug mb-5">
          {hero.title}
        </h1>

        <p className="text-white/40 text-[15px] max-w-lg mx-auto mb-10 leading-relaxed font-light">
          {hero.subtitle}
        </p>

        {/* CTA — bordered, fills on hover */}
        <a
          href="#umkm"
          className="inline-flex items-center gap-2.5 px-7 py-3 border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white hover:text-leaf-900 transition-all duration-300"
        >
          {hero.ctaText}
          <span className="opacity-50">→</span>
        </a>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-100 to-transparent pointer-events-none" />
    </section>
  );
}
