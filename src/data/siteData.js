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
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.739485121408!2d110.2393356!3d-7.8649752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7af9428cd1a76f%3A0x2b46ae57a1557e28!2sKarang%2C%20Tuksono%2C%20Kec.%20Sentolo%2C%20Kabupaten%20Kulon%20Progo%2C%20Daerah%20Istimewa%20Yogyakarta!5e1!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
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
    subtitle: 'Sejarah Padukuhan Karang, Visi & Misi Kalurahan Tuksono',
    sejarah: 'Padukuhan Karang merupakan salah satu dari 12 dusun yang berada di wilayah Kalurahan Mandiri Budaya Tuksono, Kapanewon Sentolo, Kabupaten Kulon Progo. Secara umum, sejarah Kalurahan Tuksono terbentuk dari penggabungan dua kelurahan masa lampau, yakni Kelurahan Kalikutuk dan Kelurahan Kalisana.',
    visi: 'Bersama masyarakat kita wujudkan Desa Tuksono yang bersih, jujur, amanah demi tercapainya masyarakat yang religius, adil, makmur dan berkepribadian yang luhur.',
    misi: [
      'Memperkokoh persatuan dan kerukunan antar warga Desa Tuksono tanpa memandang agama, status sosial, golongan dan mengusahakan peningkatan kesejahteraan kegiatan keagamaan.',
      'Memberdayakan semua elemen masyarakat dalam proses pembangunan mulai perencanaan, pelaksanaan, dan pengawasan sebagai upaya mewujudkan pembangunan yang berkualitas, transparan dan dapat dipertanggungjawabkan.',
      'Memaksimalkan kinerja perangkat desa sesuai tugas pokok dan fungsi demi tercapainya pelayanan kepada masyarakat yang prima.',
      'Melestarikan adat tradisi, seni, dan budaya yang sudah ada di masyarakat untuk mewujudkan jati diri Tuksono sebagai Desa Budaya.',
      'Membina, mengembangkan, dan selalu koordinasi untuk memfungsikan LPMD, PKK, Karang Taruna, FKPM, dan lembaga kemasyarakatan lainnya demi tercapainya suasana yang aman, tentram, damai, dan nyaman di kalangan masyarakat.',
      'Membina dan memfungsikan generasi muda melalui karang taruna sebagai tulang punggung desa yang memiliki budi pekerti yang luhur dan mandiri dalam menyikapi Tuksono sebagai kawasan industri sehingga warga Tuksono bisa menjadi pelaku bukan hanya jadi penonton.',
      'Mencermati ulang bantuan bagi masyarakat kurang mampu, kaum difabel dan lansia agar tidak salah sasaran.',
    ],
    image: null, // Ganti dengan gambar profil padukuhan
  },
};
