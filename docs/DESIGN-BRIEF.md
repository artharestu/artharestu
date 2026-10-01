# Design Brief — artharestu.com

Dokumen ini melengkapi `PRD.md`. Semua angka dan warna di sini adalah keputusan, bukan saran. Kalau ada yang tidak tercantum, pilih yang paling sederhana dan konsisten dengan dokumen ini, jangan kembali ke default.

## 1. Rasa produk

Tiga kata: **modern, hidup, jernih**
Yang harus dihindari:
- modern ↔ **template** (hero di tengah dengan gradient ungu, kartu ber-shadow, font Inter)
- hidup ↔ **berisik** (semua elemen bergerak, animasi yang menghalangi membaca, preloader)
- jernih ↔ **berat** (blur di mana-mana, teks di atas kaca yang sulit dibaca, scroll tersendat)

Arah: portofolio creative developer dengan tipografi besar, animasi yang dipicu scroll, dan panel kaca di atas latar gelap. Karya adalah bintang utama; UI hanya bingkai.

## 2. Warna

Satu warna aksen: **lime #C8FF3D**. Semua token didefinisikan sebagai CSS variables di `:root` (terang) dan `.dark` (gelap), lalu dipetakan ke Tailwind.

| Token | Gelap (default) | Terang | Dipakai untuk |
|---|---|---|---|
| `--bg` | `#0B0B0F` | `#F4F3EE` | latar halaman (selalu solid) |
| `--surface` | `#16161C` | `#FFFFFF` | kartu portofolio, skeleton, panel pengganti |
| `--line` | `#26262E` | `#E2E0D8` | garis pemisah, border kartu |
| `--text` | `#F2F0EA` | `#111114` | teks utama |
| `--text-2` | `#8A8A93` | `#5C5C66` | teks sekunder, meta, placeholder |
| `--accent` | `#C8FF3D` | `#C8FF3D` | isi tombol utama, tab aktif, indikator |
| `--accent-ink` | `#0B0B0F` | `#0B0B0F` | teks di atas `--accent` |
| `--accent-text` | `#C8FF3D` | `#4A6B00` | tautan teks, focus ring, angka aksen |
| `--danger` | `#FF6B6B` | `#C62828` | pesan gagal (embed video) |

Aturan:
- Lime **tidak pernah** dipakai sebagai warna teks di tema terang; gunakan `--accent-text`.
- Tidak ada warna aksen kedua. Pembeda sekunder memakai kepekatan (`--text-2`) atau ukuran.
- Transisi warna saat ganti tema: `background-color`, `color`, `border-color` 200ms; properti lain tidak ditransisikan.

### Glass (hanya untuk navbar, kartu Layanan, Modal, dan toast)

| Properti | Gelap | Terang |
|---|---|---|
| background | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.55)` |
| border | `1px solid rgba(255,255,255,0.10)` | `1px solid rgba(11,11,15,0.08)` |
| backdrop-filter | `blur(16px) saturate(140%)` | `blur(16px) saturate(140%)` |
| highlight atas | `inset 0 1px 0 rgba(255,255,255,0.06)` | `inset 0 1px 0 rgba(255,255,255,0.8)` |

- Backdrop modal: `rgba(11,11,15,0.6)` + `blur(12px)` di kedua tema.
- Bila `backdrop-filter` tidak didukung (`@supports not`), pakai `--surface` solid.
- Kartu portofolio **tidak** memakai glass: `--surface` solid + border `--line`.

### Ornamen latar (supaya kaca punya sesuatu untuk diburamkan)

- Satu layer `position: fixed` di belakang konten berisi 3 blob bulat berdiameter 40–60vw, `radial-gradient` warna `--accent`, `filter: blur(80px)`.
- Opasitas blob: 12% di tema gelap, 20% di tema terang.
- Blob bergerak pelan (translate + scale kecil, loop 24 detik, `ease: sine.inOut`) dan bergeser 0,1× kecepatan scroll. Hanya `transform` yang dianimasikan.
- Di atasnya satu overlay grain (SVG `feTurbulence`), opasitas 4% (gelap) / 3% (terang), `pointer-events: none`.
- Latar halaman tetap `--bg` solid; blob hanya aksen samar, bukan gradient latar.

## 3. Tipografi

Semua dari Google Fonts lewat `next/font/google`:

- **Display (judul hero dan section):** Unbounded — bobot 600. `letter-spacing: -0.02em`, `line-height: 1.0`
- **Isi:** Geist — bobot 400 dan 500. `line-height: 1.6`
- **Label/meta (tag, tahun, nomor section, kategori):** Geist Mono — bobot 400, huruf kapital, `letter-spacing: 0.08em`, 12px

Skala (px): 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64
- Judul hero: `clamp(36px, 7vw, 96px)`
- Judul section: `clamp(32px, 5vw, 56px)`
- Judul kartu: 20px Geist 500
- Isi: 16px (mobile) / 18px (≥ 1024px)

Panjang baris teks: maksimal 64 karakter (`max-width: 64ch`).
Maksimal tiga bobot font dalam satu layar, dan hanya ini: 600 (display), 500 (judul kartu dan label tombol), 400 (isi dan meta).

## 4. Bentuk dan ruang

- **Radius:** 16px untuk semua kontainer (kartu, glass, modal); 12px untuk gambar di dalam kartu; pill (`9999px`) untuk tombol, tab, dan chip. Hanya tiga nilai ini.
- **Skala spacing (px):** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 128
- **Pemisah antar elemen:** garis tipis 1px (`--line` atau border glass) + jarak. **Tanpa drop shadow** di mana pun (highlight inset pada glass adalah satu-satunya pengecualian).
- **Kepadatan:** longgar.
- **Padding section:** 128px atas-bawah di ≥ 1024px, 80px di layar kecil.
- **Lebar konten maksimal:** 1280px, gutter 24px (≥ 768px) / 16px (< 768px), grid 12 kolom.

### Tombol
- **Utama:** latar `--accent`, teks `--accent-ink`, Geist 500 16px, tinggi 48px, padding horizontal 24px, ikon panah ↗ di kanan. Di navbar: tinggi 36px, 14px.
- **Sekunder:** transparan, border `--line`, teks `--text`, tinggi 44px.
- **Teks/tautan:** `--accent-text`, garis bawah muncul saat hover.

## 5. Tata letak

- **Navigasi:** navbar glass mengambang di atas (jarak 16px dari tepi atas), lebar mengikuti kontainer 1280px, radius 16px.
- **Perataan:** semua judul dan teks rata kiri, termasuk hero. Rata tengah hanya untuk state kosong dan halaman 404.
- **Hero:** tinggi minimal `100svh`. Label mono di atas, judul besar mengisi 10 dari 12 kolom, subjudul maks. 56ch, tombol di bawahnya. Indikator scroll di pojok kiri bawah.
  - Bingkai showcase (lihat §6), ≥ 1024px: rata kanan di kolom 8–12. Letaknya di samping baris terakhir judul bila baris itu berakhir minimal 48px sebelum bingkai; selain itu di bawah judul, sejajar subjudul. Tepi bawahnya maksimal sejajar indikator scroll, dan tinggi bingkai tertinggi (HP/video vertikal) 260–340px.
  - < 1024px: di bawah tombol, rata kiri, tinggi bingkai tertinggi 260px (280px di ≥ 768px). Lebar area showcase sama dengan lebar bingkai website.
- **Heading section:** label mono berformat `(01) LAYANAN`, `(02) PORTOFOLIO`, `(03) TENTANG`, lalu judul display di bawahnya.
- **Layanan:** 3 kartu glass sejajar (≥ 1024px), bertumpuk di bawahnya.
- **Portofolio:** tab filter di atas grid (bar yang bisa di-scroll horizontal di HP). Grid 3 kolom (≥ 1024px), 2 kolom (≥ 640px), 1 kolom (< 640px), gap 24px.
- **Modal:** lihat PRD §6. Desktop dialog tengah maks. 1080px (media 60% / info 40%); < 768px sheet layar penuh dari bawah dengan handle 40×4px di atas.
- **Tentang:** 2 kolom (bio 7 kolom, angka 5 kolom) di ≥ 1024px; marquee tool selebar layar di bawahnya.
  - Foto profil bulat berwarna di atas bio: 112px (160px di ≥ 1024px), dalam cincin 1px `--line` berjarak 4px.
  - Angka: tiap item bergaris atas `--line`, nilai `--accent-text`. Satu kolom di ≥ 1024px, tiga kolom sejajar di bawahnya.
- **Ajakan kontak:** judul display sangat besar rata kiri, tombol WhatsApp di bawahnya.
- **Layar sempit:** tautan navbar pindah ke menu layar penuh; tidak ada elemen yang hilang selain itu; tidak ada scroll horizontal di level halaman.

## 6. Interaksi

Kurva default: `power3.out` (GSAP) / `cubic-bezier(0.22, 1, 0.36, 1)` (CSS). Durasi: mikro 150–200ms, UI 250–450ms, reveal 500–700ms.

- **Hero saat dimuat:** judul dipecah per kata dengan SplitText, tiap kata naik dari `yPercent: 100` di dalam mask, 700ms, stagger 40ms. Label, subjudul, tombol, dan bingkai showcase fade + naik 16px setelahnya. Berjalan sekali.
- **Motion graphic hero (bingkai showcase):** satu bingkai bergaya bingkai HP di galeri modal (radius 16/12, border `--line`, bezel `#0A0A0C`, bukan glass) yang bergantian menampilkan satu karya per kategori, urut Website → Aplikasi Mobile → Video AI. Karya yang dipakai adalah yang `featured`; bila tidak ada, yang terbaru. Bentuk bingkai mengikuti rasio karyanya: 16:10, 9:19.5, lalu 9:16 atau 16:9. Di atas bingkai ada label mono `(01) WEBSITE · KOPI LERENG`, tiga segmen progres 2px (`--accent-text`), dan tombol jeda/putar 32px.
  - Tiap adegan 4,4 detik. Saat ganti adegan: ukuran bingkai berubah 900ms `power3.inOut`, label bergulir di dalam mask 450ms, isi lama fade 250ms, isi baru fade 300ms.
  - Website: wireframe bergaris `--accent-text` tergambar sendiri (DrawSVG, stagger 50ms), lalu screenshot fade + `scale 1.03 → 1` 600ms.
  - Aplikasi Mobile: layar pertama naik 6% + fade; di detik 2,4 bergeser ke layar kedua (700ms `power3.inOut`) bila ada.
  - Video AI: noise piksel 12×21 berubah menjadi versi piksel dari cover, lalu gambar tajam (kanvas fade 600ms). Cover zoom pelan `1.12 → 1` linier. Tidak ada file video yang diputar.
  - Kata di judul yang sesuai adegan diberi garis bawah `--accent-text` (tebal 0.05em, jarak 0.14em, transisi 300ms).
  - Mulai 200ms setelah animasi judul selesai. Putaran pertama hanya menahan adegan 1 (sudah tampil), tanpa membangunnya ulang. Hanya satu hal yang bergerak dalam satu waktu.
  - Berhenti saat tombol jeda ditekan, saat di-hover (`pointer: fine`), saat bingkai fokus lewat keyboard, saat hero di luar layar, dan saat tab tidak aktif.
  - Klik bingkai → Modal Proyek karya yang sedang tampil, lewat jalur yang sama dengan kartu (`?project=<slug>`, fokus kembali ke bingkai saat modal ditutup). Hover: border `--accent` 40%.
  - Tanpa JavaScript dan saat reduced motion: bingkai diam di adegan 1, tanpa garis bawah, tanpa segmen progres dan tombol jeda.
- **Reveal saat scroll:** judul section dan kartu fade + naik 24px, 600ms, stagger 80ms untuk kartu, dipicu saat elemen mencapai 85% tinggi viewport, sekali saja.
- **Hover kartu portofolio (pointer: fine):** cover `scale(1.04)` 500ms; border berubah ke `--accent` 40% opasitas; panah ↗ bergeser 4px ke kanan atas. Kartu video: ikon play membesar 1.1×.
- **Label kursor (F19):** lingkaran 72px berwarna `--accent` dengan teks "Lihat"/"View" mengikuti kursor (lerp 0.15) hanya di atas kartu portofolio. Kursor sistem tidak diganti di tempat lain.
- **Ganti filter:** GSAP Flip, 450ms; indikator tab aktif bergeser (bukan melompat) 300ms.
- **Modal:** buka → backdrop fade 200ms, panel `scale 0.96 → 1` + fade 300ms (sheet mobile: `yPercent 100 → 0`, 400ms). Tutup → kebalikan, 200ms. Konten modal (media, teks) fade stagger 60ms.
- **Navbar saat scroll:** tinggi 64 → 52px, 250ms.
- **Tombol magnetic (F20):** tombol WhatsApp di Ajakan kontak bergeser maks. 12px ke arah kursor dalam radius 120px, kembali 400ms `elastic.out(1, 0.5)`.
- **Marquee tool:** geser horizontal konstan, satu putaran 40 detik, berhenti saat di-hover.
- **Ganti tema:** ikon matahari/bulan berputar + morph 300ms; warna transisi 200ms.
- **Smooth scroll:** Lenis `lerp: 0.1`, terhubung ke `gsap.ticker`. Tidak ada scroll-snap atau section yang "membajak" scroll.
- **Umpan balik aksi:**
  - "Salin tautan" berhasil → toast glass di bawah tengah: "Tautan disalin" / "Link copied", 2 detik, fade + naik 8px.
  - Salin gagal (clipboard ditolak) → toast "Gagal menyalin. Salin dari address bar." / "Couldn't copy. Use the address bar instead."
  - Embed video gagal → state gagal di area media (PRD §6).
- **Fokus:** focus ring 2px `--accent-text`, offset 3px, pill/16px mengikuti bentuk elemen. Tidak pernah `outline: none` tanpa pengganti.
- **Reduced motion:** semua di atas dimatikan kecuali transisi warna 200ms dan fade modal 150ms.

## 7. Nada teks

- **Sapaan:** netral-profesional. ID memakai "Anda" dan "saya"; EN memakai "you" dan "I".
- **Panjang:** label tombol maks. 3 kata; judul section maks. 6 kata; judul hero maks. 8 kata.
- **Istilah:** "Aplikasi Mobile" (bukan "App"), "Video AI" (bukan "AI Video Generation").

Teks final (copy ini boleh diubah pemilik, tapi pakai persis ini dulu):

| Lokasi | ID | EN |
|---|---|---|
| Hero label | Freelancer · Remote | Freelancer · Remote |
| Hero judul | Saya membangun website, aplikasi, dan video AI. | I build websites, apps, and AI videos. |
| Hero sub | Developer web dengan 12+ tahun pengalaman. Kini juga memproduksi video dengan AI untuk brand lokal dan internasional. | Web developer with 12+ years of experience, now also producing AI video for brands in Indonesia and abroad. |
| Hero tombol | Lihat karya | See work |
| Layanan judul | Yang saya kerjakan | What I do |
| 01 Website | Company profile, landing page, sampai web app yang cepat dan mudah dikelola. | Company profiles, landing pages, and web apps that load fast and stay easy to manage. |
| 01 poin | Desain responsif · Next.js & SEO dasar · Deploy ke domain Anda | Responsive design · Next.js & core SEO · Deployed to your domain |
| 02 Aplikasi Mobile | Aplikasi Android dan iOS dari prototipe sampai rilis. | Android and iOS apps from prototype to launch. |
| 02 poin | UI yang nyaman di tangan · Satu kode untuk dua platform · Bantuan rilis ke store | Thumb-friendly UI · One codebase, two platforms · Store release support |
| 03 Video AI | Iklan produk, film brand, dan konten UGC yang diproduksi dengan AI. | Product ads, brand films, and UGC content produced with AI. |
| 03 poin | Format vertikal & horizontal · Naskah sampai edit akhir · Siap untuk Reels, TikTok, YouTube | Vertical & horizontal formats · Script to final cut · Ready for Reels, TikTok, YouTube |
| Tautan kartu layanan | Lihat karya → | See work → |
| Portofolio judul | Karya pilihan | Selected work |
| Tab filter | Semua · Website · Aplikasi Mobile · Video AI | All · Websites · Mobile Apps · AI Video |
| Tentang judul | Tentang saya | About me |
| Tentang bio | Saya Artha Restu, lulusan Teknik Informatika dengan 12+ tahun pengalaman membangun website. Selain website dan aplikasi, saya memproduksi video dengan AI untuk brand dan kreator. Saya bekerja secara remote untuk klien lokal dan internasional. | I'm Artha Restu, an informatics engineering graduate with 12+ years of experience building websites. Beyond websites and apps, I produce AI video for brands and creators. I work remotely with local and international clients. |
| Kontak judul | Punya proyek? Mari bicara. | Got a project? Let's talk. |
| Kontak sub | Ceritakan ide Anda lewat WhatsApp. Satu pesan sudah cukup untuk memulai. | Tell me about your idea on WhatsApp. One message is enough to start. |
| Kontak tombol | Chat WhatsApp | Chat on WhatsApp |
| Modal tautan | Kunjungi situs · Lihat kode · Tonton di YouTube · Salin tautan | Visit site · View code · Watch on YouTube · Copy link |
| Footer | © 2026 Artha Restu · Kembali ke atas | © 2026 Artha Restu · Back to top |

Contoh teks kosong: "Belum ada karya di kategori ini" / "Karya baru sedang disiapkan. Coba lihat kategori lain." / "Lihat semua"
Contoh teks gagal: "Video tidak bisa diputar di sini." / tombol "Tonton di YouTube"

## 8. Yang dilarang

Bawaan:
- Gradient sebagai latar utama, terutama ungu-ke-biru (blob lime samar di §2 adalah satu-satunya ornamen)
- Emoji sebagai pengganti ikon — pakai satu set ikon garis (lucide-react), stroke 1.5px
- Bayangan di kartu; pemisah memakai garis tipis dan jarak
- Semua konten rata tengah — teks selalu rata kiri
- Teks isian seperti "Lorem ipsum", "Proyek 1", atau "Judul Contoh"
- Kalimat pembuka generik: "Selamat datang di...", "Solusi terbaik untuk...", "Wujudkan impian digital Anda"
- Label "AI-powered" atau sejenisnya
- Bobot font di luar 400 / 500 / 600, atau lebih dari tiga bobot dalam satu layar
- Ikon dan teks yang menyampaikan hal sama persis berdampingan
- Animasi pada elemen yang tidak sedang berubah status (kecuali blob latar, marquee, dan bingkai showcase di hero)
- Halaman kosong tanpa penjelasan langkah berikutnya

Khusus situs ini:
- Glass di luar navbar, kartu Layanan, Modal, dan toast
- Teks panjang di atas glass tanpa kontras AA
- Iframe YouTube di kartu grid, atau autoplay video sebelum modal dibuka
- Preloader, layar pembuka, atau animasi yang menahan konten lebih dari 1 detik
- Mengganti kursor sistem di seluruh halaman
- Scroll-jacking, scroll-snap, atau pin section yang memaksa pengunjung scroll lama
- Tombol WhatsApp melayang (floating) di pojok layar, atau lebih dari dua lokasi WhatsApp
- Tautan/badge Fastwork, Projects.co.id, Upwork, Fiverr
- Library animasi kedua selain GSAP (termasuk Framer Motion/Motion, AOS, animate.css)
- Konten yang `opacity: 0` di HTML server sehingga tak terlihat bila JavaScript gagal
