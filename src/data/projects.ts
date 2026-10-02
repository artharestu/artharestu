import { parseProjects, type ProjectInput } from "./schema";

/**
 * Portfolio content. Images live in public/portfolio/<slug>/ (WebP/AVIF, ≤ 2400px, ≤ 400KB).
 * For video items, set youtubeUrl to a YouTube link (watch, youtu.be, shorts, or embed) — null shows "coming soon".
 */
const data: ProjectInput[] = [
  // ——— Website ———
  {
    slug: "surya-berkat-abadi",
    category: "web",
    title: "CV. Surya Berkat Abadi",
    summary: {
      id: "Company profile supplier kompresor udara, water treatment, pompa, dan genset industri di Surabaya.",
      en: "Company profile for a Surabaya supplier of industrial air compressors, water treatment, pumps, and generator sets.",
    },
    description: {
      id: "CV. Surya Berkat Abadi memasok peralatan industri sekaligus mengerjakan instalasinya sejak 2011. Saya membangun situs dua bahasa dengan halaman per solusi dan merek rekanan, artikel teknis, unduhan company profile, dan formulir permintaan penawaran yang langsung masuk ke email. Setiap halaman di-prerender menjadi HTML statis dengan metadata sendiri agar mudah ditemukan di Google.",
      en: "CV. Surya Berkat Abadi has supplied industrial equipment and handled its installation since 2011. I built a bilingual site with pages for each solution and partner brand, technical articles, company profile downloads, and a request-for-quote form that lands straight in their inbox. Every page is prerendered to static HTML with its own metadata, so it is easy to find on Google.",
    },
    year: 2026,
    role: { id: "Desain & development", en: "Design & development" },
    tags: ["React", "Tailwind CSS", "SEO", "i18n", "Vite"],
    cover: "/portfolio/surya-berkat-abadi/cover.webp",
    gallery: ["/portfolio/surya-berkat-abadi/01.webp"],
    links: { live: "https://www.suryaberkatabadi.com" },
    order: 0,
  },
  {
    slug: "kopi-lereng",
    category: "web",
    title: "Kopi Lereng",
    summary: {
      id: "Company profile kedai kopi di Yogyakarta dengan menu digital dan peta lokasi.",
      en: "Company profile for a Yogyakarta coffee shop, with a digital menu and location map.",
    },
    description: {
      id: "Kopi Lereng ingin pelanggan bisa melihat menu dan jam buka tanpa harus membuka Instagram. Saya merancang situs satu halaman yang ringan dengan menu digital yang mudah diperbarui, galeri suasana kedai, dan peta lokasi. Halaman dimuat di bawah 1,5 detik di jaringan seluler.",
      en: "Kopi Lereng wanted customers to check the menu and opening hours without digging through Instagram. I designed a lightweight one-page site with an easy-to-update digital menu, a gallery of the shop, and a location map. Pages load in under 1.5 seconds on mobile networks.",
    },
    year: 2026,
    role: { id: "Desain & development", en: "Design & development" },
    tags: ["Next.js", "Tailwind CSS", "SEO lokal"],
    cover: "/portfolio/kopi-lereng/cover.webp",
    gallery: [
      "/portfolio/kopi-lereng/01.webp",
      "/portfolio/kopi-lereng/02.webp",
      "/portfolio/kopi-lereng/03.webp",
    ],
    links: {},
    featured: true,
    order: 1,
  },
  {
    slug: "nusa-retreat",
    category: "web",
    title: "Nusa Retreat",
    summary: {
      id: "Situs pemesanan villa di Bali untuk tamu mancanegara, dua bahasa.",
      en: "Bilingual villa booking site in Bali for international guests.",
    },
    description: {
      id: "Pengelola Nusa Retreat butuh situs yang meyakinkan tamu asing untuk memesan langsung, bukan lewat agen. Saya membangun situs dua bahasa dengan galeri kamar, cek ketersediaan tanggal, dan tombol pemesanan yang terhubung ke sistem reservasi mereka.",
      en: "Nusa Retreat needed a site that convinces international guests to book direct instead of through agencies. I built a bilingual site with room galleries, date availability checks, and booking buttons connected to their reservation system.",
    },
    year: 2025,
    role: { id: "Desain & development", en: "Design & development" },
    tags: ["Next.js", "i18n", "Booking"],
    cover: "/portfolio/nusa-retreat/cover.webp",
    gallery: [
      "/portfolio/nusa-retreat/01.webp",
      "/portfolio/nusa-retreat/02.webp",
      "/portfolio/nusa-retreat/03.webp",
    ],
    links: {},
    order: 2,
  },
  {
    slug: "ledgerly",
    category: "web",
    title: "Ledgerly",
    summary: {
      id: "Dashboard SaaS untuk memantau arus kas usaha kecil.",
      en: "SaaS dashboard for tracking small-business cash flow.",
    },
    description: {
      id: "Ledgerly merangkum pemasukan, pengeluaran, dan tagihan jatuh tempo dalam satu layar. Saya mengerjakan antarmuka dashboard, grafik arus kas mingguan, serta alur impor mutasi bank dari file CSV, dengan fokus pada angka yang mudah dibaca oleh pemilik usaha non-akuntan.",
      en: "Ledgerly brings income, expenses, and upcoming bills into a single screen. I built the dashboard UI, weekly cash-flow charts, and a CSV bank-statement import flow, focused on numbers that non-accountant business owners can read at a glance.",
    },
    year: 2025,
    role: { id: "Frontend development", en: "Frontend development" },
    tags: ["React", "TypeScript", "Supabase", "Charts"],
    cover: "/portfolio/ledgerly/cover.webp",
    gallery: [
      "/portfolio/ledgerly/01.webp",
      "/portfolio/ledgerly/02.webp",
      "/portfolio/ledgerly/03.webp",
    ],
    links: {},
    order: 3,
  },

  // ——— Aplikasi Mobile ———
  {
    slug: "pantaukas",
    category: "mobile",
    title: "PantauKas",
    summary: {
      id: "Aplikasi pencatat keuangan harian untuk pemilik UMKM.",
      en: "Daily bookkeeping app for small business owners.",
    },
    description: {
      id: "PantauKas membantu pemilik warung dan UMKM mencatat transaksi dalam hitungan detik, bahkan tanpa sinyal. Data tersinkron otomatis saat online, dan laporan laba sederhana bisa dibagikan ke WhatsApp dalam bentuk gambar.",
      en: "PantauKas helps shop owners and small businesses record transactions in seconds, even offline. Data syncs automatically once online, and a simple profit report can be shared to WhatsApp as an image.",
    },
    year: 2026,
    role: { id: "Desain & development", en: "Design & development" },
    tags: ["Flutter", "Offline-first", "Supabase"],
    cover: "/portfolio/pantaukas/cover.webp",
    gallery: [
      "/portfolio/pantaukas/01.webp",
      "/portfolio/pantaukas/02.webp",
      "/portfolio/pantaukas/03.webp",
    ],
    links: {},
    featured: true,
    order: 1,
  },
  {
    slug: "sehat-harian",
    category: "mobile",
    title: "Sehat Harian",
    summary: {
      id: "Pelacak kebiasaan sehat dengan pengingat minum air dan jalan kaki.",
      en: "Healthy-habit tracker with water and walking reminders.",
    },
    description: {
      id: "Sehat Harian dibuat untuk pekerja kantoran yang sering lupa minum dan jarang bergerak. Aplikasi ini mengirim pengingat yang bisa diatur, menghitung langkah dari sensor ponsel, dan menampilkan progres mingguan tanpa membuat pengguna merasa dihakimi.",
      en: "Sehat Harian is built for office workers who forget to drink water and rarely move. It sends adjustable reminders, counts steps from the phone's sensors, and shows weekly progress without making users feel judged.",
    },
    year: 2025,
    role: { id: "Desain & development", en: "Design & development" },
    tags: ["React Native", "Notifikasi", "Health"],
    cover: "/portfolio/sehat-harian/cover.webp",
    gallery: [
      "/portfolio/sehat-harian/01.webp",
      "/portfolio/sehat-harian/02.webp",
      "/portfolio/sehat-harian/03.webp",
    ],
    links: {},
    order: 2,
  },
  {
    slug: "trailmate",
    category: "mobile",
    title: "Trailmate",
    summary: {
      id: "Pendamping pendakian dengan peta offline dan catatan rute.",
      en: "Hiking companion with offline maps and route notes.",
    },
    description: {
      id: "Trailmate menyimpan peta jalur pendakian untuk dipakai tanpa sinyal, merekam rute dengan GPS, dan mencatat titik penting seperti sumber air dan pos. Pendaki bisa membagikan rute ke teman satu rombongan sebelum berangkat.",
      en: "Trailmate stores trail maps for use without signal, records routes with GPS, and marks key points like water sources and camps. Hikers can share a route with their group before setting off.",
    },
    year: 2024,
    role: { id: "Mobile development", en: "Mobile development" },
    tags: ["Flutter", "GPS", "Peta offline"],
    cover: "/portfolio/trailmate/cover.webp",
    gallery: [
      "/portfolio/trailmate/01.webp",
      "/portfolio/trailmate/02.webp",
      "/portfolio/trailmate/03.webp",
    ],
    links: {},
    order: 3,
  },

  // ——— Video AI ———
  {
    slug: "iklan-sepatu-lari",
    category: "video",
    title: "Iklan Sepatu Lari",
    summary: {
      id: "Iklan produk vertikal 15 detik untuk Reels dan TikTok.",
      en: "15-second vertical product ad for Reels and TikTok.",
    },
    description: {
      id: "Iklan vertikal 15 detik untuk peluncuran sepatu lari. Dari satu foto produk, saya membuat adegan lari pagi di jalanan kota, close-up detail sol, dan penutup dengan logo, lengkap dengan musik dan teks yang siap diunggah ke Reels dan TikTok.",
      en: "A 15-second vertical ad for a running shoe launch. From a single product photo, I produced a morning run through city streets, close-ups of the sole, and a logo end card, with music and captions ready for Reels and TikTok.",
    },
    year: 2026,
    role: { id: "Konsep, produksi & edit", en: "Concept, production & edit" },
    tags: ["9:16", "Iklan produk", "Reels"],
    cover: "/portfolio/iklan-sepatu-lari/cover.webp",
    youtubeUrl: null,
    aspect: "9:16",
    links: {},
    featured: true,
    order: 1,
  },
  {
    slug: "brand-film-kopi",
    category: "video",
    title: "Brand Film Kopi",
    summary: {
      id: "Film brand sinematik 60 detik tentang perjalanan biji kopi.",
      en: "A cinematic 60-second brand film about a coffee bean's journey.",
    },
    description: {
      id: "Film brand 60 detik yang mengikuti biji kopi dari kebun di lereng gunung sampai ke cangkir. Naskah, storyboard, generasi visual, voice over, dan color grading dikerjakan dalam satu alur produksi, dengan gaya sinematik yang konsisten di setiap adegan.",
      en: "A 60-second brand film following a coffee bean from a mountainside farm to the cup. Script, storyboard, visual generation, voice-over, and color grading were handled in one production pipeline, with a consistent cinematic look across every scene.",
    },
    year: 2025,
    role: { id: "Naskah, produksi & edit", en: "Script, production & edit" },
    tags: ["16:9", "Brand film", "Sinematik"],
    cover: "/portfolio/brand-film-kopi/cover.webp",
    youtubeUrl: null,
    aspect: "16:9",
    links: {},
    order: 2,
  },
  {
    slug: "ugc-skincare",
    category: "video",
    title: "UGC Skincare",
    summary: {
      id: "Video UGC dengan virtual influencer AI untuk kampanye skincare.",
      en: "UGC-style video with an AI virtual influencer for a skincare campaign.",
    },
    description: {
      id: "Serangkaian video bergaya UGC untuk kampanye serum wajah, dibawakan oleh virtual influencer AI yang tampil konsisten di setiap video. Formatnya dibuat seperti ulasan jujur di depan kamera, sehingga terasa natural di feed media sosial.",
      en: "A series of UGC-style videos for a face serum campaign, presented by an AI virtual influencer who stays consistent across every clip. The format mimics an honest to-camera review, so it feels natural in social feeds.",
    },
    year: 2025,
    role: { id: "Konsep & produksi", en: "Concept & production" },
    tags: ["9:16", "UGC", "Virtual influencer"],
    cover: "/portfolio/ugc-skincare/cover.webp",
    youtubeUrl: null,
    aspect: "9:16",
    links: {},
    order: 3,
  },
];

export const projects = parseProjects(data);

export function getProject(slug: string | null | undefined) {
  return slug ? projects.find((p) => p.slug === slug) : undefined;
}
