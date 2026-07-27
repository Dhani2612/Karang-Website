/**
 * Data konten website Padukuhan Karang.
 *
 * Struktur ini dirancang agar mudah di-replace dengan fetch() dari API eksternal.
 * Cukup ganti isi variabel atau ubah menjadi async fetch tanpa mengubah komponen.
 *
 * Contoh migrasi ke API:
 *   const res = await fetch('/api/site-config');
 *   export const siteConfig = await res.json();
 */

export const siteConfig = {
  /* ─── Info Padukuhan ─── */
  padukuhan: {
    name: 'Karang',
    desa: 'Tuksono',
    kecamatan: 'Sentolo',
    kabupaten: 'Kulon Progo',
    provinsi: 'Daerah Istimewa Yogyakarta',
  },

  /* ─── Hero Section ─── */
  hero: {
    title: 'Selamat Datang di Padukuhan Karang',
    subtitle:
      'Portal informasi resmi Padukuhan Karang, Desa Tuksono, Kecamatan Sentolo, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta. Temukan potensi desa, produk UMKM unggulan, dan informasi layanan masyarakat.',
    ctaText: 'Jelajahi Potensi',
    backgroundImage: null, // Ganti dengan path: '/images/hero.jpg'
  },



  /* ─── Direktori UMKM ─── */
  umkm: [
    {
      id: 1,
      name: 'Keripik Tempe Bu Sari',
      description:
        'Keripik tempe renyah dengan bumbu rempah khas Jawa yang gurih dan nikmat. Tersedia berbagai varian rasa.',
      image: null, // Ganti: '/images/umkm/keripik-tempe.jpg'
      qris: true,
      whatsapp: '6281234567890',
      category: 'Makanan',
      gmaps: null, // Ganti: 'https://maps.app.goo.gl/...'
    },
    {
      id: 2,
      name: 'Batik Tulis Giling',
      description:
        'Batik tulis tradisional dengan motif khas Kulon Progo, dibuat secara handmade oleh pengrajin lokal.',
      image: null,
      qris: true,
      whatsapp: '6281234567891',
      category: 'Kerajinan',
    },
    {
      id: 3,
      name: 'Madu Hutan Sentolo',
      description:
        'Madu murni dari lebah hutan lokal, kaya manfaat untuk kesehatan dan dikemas secara higienis.',
      image: null,
      qris: false,
      whatsapp: '6281234567892',
      category: 'Pertanian',
    },
    {
      id: 4,
      name: 'Anyaman Bambu Pak Joko',
      description:
        'Produk anyaman bambu berkualitas untuk kebutuhan rumah tangga dan dekorasi interior.',
      image: null,
      qris: true,
      whatsapp: '6281234567893',
      category: 'Kerajinan',
    },
    {
      id: 5,
      name: 'Kopi Robusta Giling',
      description:
        'Kopi robusta pilihan dari kebun lokal, dipanggang sempurna untuk cita rasa premium.',
      image: null,
      qris: true,
      whatsapp: '6281234567894',
      category: 'Minuman',
    },
    {
      id: 6,
      name: 'Gula Kelapa Organik',
      description:
        'Gula kelapa organik tanpa bahan pengawet, cocok untuk gaya hidup sehat dan masakan tradisional.',
      image: null,
      qris: false,
      whatsapp: '6281234567895',
      category: 'Pertanian',
    },
  ],

  /* ─── Perangkat / Pimpinan ─── */
  leadership: [
    {
      name: '—', // Ganti dengan nama asli
      position: 'Kepala Padukuhan',
      phone: '6281234567800',
    },
  ],

  /* ─── Kontak ─── */
  contact: {
    address:
      'Padukuhan Karang, Desa Tuksono, Kec. Sentolo, Kab. Kulon Progo, Daerah Istimewa Yogyakarta',
  },

  /* ─── Peta ─── */
  map: {
    wilayah: {
      title: 'Peta Wilayah Padukuhan Karang',
      description: 'Peta lokasi dan batas wilayah Padukuhan Karang',
      embedUrl: 'https://maps.google.com/maps?q=Karang,+Tuksono,+Kec.+Sentolo,+Kabupaten+Kulon+Progo,+Daerah+Istimewa+Yogyakarta&t=k&z=15&output=embed',
      image: null, // Atau: '/images/peta-wilayah.jpg'
    },
    administrasi: {
      title: 'Peta Wilayah Kalurahan Tuksono',
      description: 'Peta cakupan wilayah Kalurahan Tuksono secara umum',
      embedUrl: 'https://maps.google.com/maps?q=Tuksono,+Kulon+Progo&t=k&z=13&output=embed',
    },
  },

  /* ─── Tentang Kami ─── */
  about: {
    title: 'Profil Padukuhan',
    subtitle: 'Sejarah, Visi & Misi Padukuhan Karang',
    sejarah: 'Padukuhan Karang merupakan salah satu dari 12 dusun yang berada di wilayah Kalurahan Mandiri Budaya Tuksono, Kapanewon Sentolo, Kabupaten Kulon Progo. Secara umum, sejarah Kalurahan Tuksono terbentuk dari penggabungan dua kelurahan masa lampau, yakni Kelurahan Kalikutuk dan Kelurahan Kalisana.',
    visi: 'Mewujudkan Desa Tuksono menjadi Desa Mandiri melalui bidang Pertanian dan Industri Kecil, serta menjadi Desa Budaya yang lestari.',
    misi: [
      'Meningkatkan perekonomian masyarakat melalui pemberdayaan UMKM dan kerajinan lokal.',
      'Memajukan sektor pertanian sebagai penopang utama ketahanan pangan.',
      'Melestarikan nilai-nilai tradisi dan seni budaya lokal, seperti pelestarian adat Baritan dan kesenian Oglek.'
    ],
    image: null, // Ganti dengan gambar profil padukuhan
  },
};
