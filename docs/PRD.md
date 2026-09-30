# PRD — artharestu.com (Portofolio Pribadi Artha Restu)

**Versi:** 1.0 | **Tanggal:** 30 September 2026 | **Status:** Draft
**Dokumen pendamping:** `DESIGN-BRIEF.md` (wajib dibaca sebelum menulis UI)

## 1. Ringkasan satu paragraf

Situs pribadi dua bahasa (Indonesia/English) di `artharestu.com` untuk memamerkan karya Artha Restu sebagai freelancer di tiga bidang: website, aplikasi mobile, dan video AI. Situs ini murni showcase: tidak ada harga, tidak ada form, tidak ada akun. Pengunjung melihat karya, membuka detail proyek dalam modal (termasuk video YouTube yang di-embed), lalu bila tertarik menghubungi lewat WhatsApp. Situs ini sendiri harus menjadi bukti kemampuan: animasi halus, cepat di HP, dan tidak terlihat seperti template.

## 2. Pengguna dan konteks

**Pengguna utama:** calon klien langsung, baik lokal (Indonesia) maupun internasional. Umumnya pemilik usaha atau marketer, bukan developer. Sebagian besar datang dari HP lewat link di bio media sosial, pencarian Google, kartu nama, atau pesan penawaran langsung.
**Yang dilakukan sekarang tanpa situs ini:** karya tersebar di berbagai tempat (YouTube, file lokal, profil platform), sehingga calon klien tidak punya satu tempat untuk menilai kualitas kerja.
**Peran yang ada di sistem:** hanya satu jenis pengguna, yaitu pengunjung anonim. Tidak ada login dan tidak ada admin; konten dikelola lewat file data di kode.

**Catatan penting:** situs ini TIDAK ditautkan dari profil Fastwork, Projects.co.id, Upwork, maupun Fiverr, karena memuat kontak WhatsApp. Jangan menambahkan tombol atau tautan ke platform tersebut.

## 3. Aksi inti

Pengunjung bisa membuka satu karya dan melihat preview-nya dalam ukuran besar (screenshot atau video YouTube) dalam maksimal dua klik dari halaman awal.

## 4. Ruang lingkup

### Dibangun sekarang
- Satu halaman per bahasa (`/id`, `/en`): Hero → Layanan → Portofolio → Tentang → Ajakan kontak → Footer
- Grid portofolio dengan filter kategori (Semua / Website / Aplikasi Mobile / Video AI) dan modal detail proyek; video AI di-embed dari YouTube
- Dua bahasa dengan deteksi bahasa browser dan tombol ganti bahasa
- Tema gelap (default) dan terang dengan toggle, pilihan tersimpan
- Animasi berbasis GSAP + smooth scroll Lenis, glassmorphism, dan dukungan `prefers-reduced-motion`

### Belum sekarang — jangan dibuat
- Blog atau halaman artikel
- Form kontak, form newsletter, atau pengiriman email apa pun
- Testimoni atau ulasan klien
- Daftar harga, paket, atau kalkulator biaya
- Panel admin, CMS, database, atau Supabase
- Login, akun, atau area klien
- Halaman detail proyek terpisah (detail hanya lewat modal)
- Tautan atau badge ke Fastwork, Projects.co.id, Upwork, Fiverr
- Tautan media sosial di footer (lihat Pertanyaan terbuka)
- Tombol WhatsApp di luar dua lokasi yang ditetapkan (navbar dan ajakan kontak)
- Iframe YouTube di kartu grid (iframe hanya di dalam modal)
- Preloader / layar loading pembuka
- Analytics, cookie banner, chat widget
- Bahasa ketiga

## 5. Alur utama

1. Pengunjung membuka `artharestu.com`. Middleware membaca `Accept-Language`: bila mengandung `id` → alihkan ke `/id`, selain itu → `/en`. Bila cookie `NEXT_LOCALE` sudah ada, cookie yang dipakai.
2. **Hero** tampil dengan animasi judul. Pengunjung menekan "Lihat karya" / "See work" atau scroll.
3. (Opsional) Di **Layanan**, pengunjung menekan "Lihat karya →" pada salah satu kartu → halaman scroll ke Portofolio dengan filter kategori itu sudah aktif.
4. Di **Portofolio**, pengunjung memilih filter; kartu tersusun ulang dengan animasi.
5. Pengunjung menekan sebuah kartu → **Modal Proyek** terbuka, URL berubah menjadi `?project=<slug>` (tanpa reload, `history.pushState`).
6. Di modal, pengunjung melihat preview besar: galeri screenshot (web/mobile) atau video YouTube (video AI), deskripsi, tag, dan tautan.
7. Pengunjung menutup modal (tombol ×, `Esc`, klik backdrop, atau tombol back browser) → kembali ke posisi scroll semula.
8. Pengunjung scroll ke **Ajakan kontak** dan menekan "Chat WhatsApp" → tab baru membuka `wa.me` dengan pesan pembuka sesuai bahasa.

## 6. Daftar layar

### Navbar (global)
- **Tujuan:** navigasi antar-bagian dan akses cepat ke bahasa, tema, dan WhatsApp.
- **Isi:** wordmark "Artha Restu" (kiri); tautan Layanan, Portofolio, Tentang; pengalih bahasa `ID / EN`; toggle tema; tombol kecil "WhatsApp".
- **Aksi tersedia:** tautan → smooth scroll ke section; `ID/EN` → pindah ke locale lain dengan section dan `?project` yang sama dipertahankan; toggle tema → ganti tema dan simpan di `localStorage`; WhatsApp → buka `wa.me` di tab baru.
- **Layar < 768px:** tautan section pindah ke menu layar penuh (tombol hamburger). Bahasa, tema, dan WhatsApp tetap ada di dalam menu.
- **Perilaku scroll:** navbar mengecil (tinggi 64px → 52px) setelah scroll 80px; tetap terlihat.
- **Saat kosong / memuat / gagal / tanpa akses:** tidak berlaku (konten statis).

### Hero
- **Tujuan:** menjelaskan dalam 5 detik siapa Artha dan apa yang dikerjakannya.
- **Isi:** label kecil mono ("Freelancer · Yogyakarta, Indonesia"), judul besar, subjudul 1–2 kalimat, tombol "Lihat karya" / "See work", indikator scroll, dan bingkai showcase yang bergantian menampilkan satu karya unggulan per kategori (lihat `DESIGN-BRIEF.md` §5 dan §6).
- **Aksi tersedia:** "Lihat karya" → smooth scroll ke Portofolio. Klik bingkai showcase → Modal Proyek karya yang sedang tampil. Tombol jeda/putar → menghentikan atau melanjutkan animasi bingkai.
- **Teks:** lihat `DESIGN-BRIEF.md` §7.
- **Saat kosong / memuat / gagal / tanpa akses:** tidak berlaku. Teks harus terlihat walau JavaScript gagal dimuat (state awal animasi tidak boleh `opacity: 0` di HTML server).

### Layanan
- **Tujuan:** menunjukkan tiga layanan dan menjadi pintu ke portofolio per kategori.
- **Isi:** 3 kartu glass: Website, Aplikasi Mobile, Video AI. Tiap kartu: nomor (`01`–`03`), judul, satu kalimat, 3 poin deliverable, tautan "Lihat karya →".
- **Aksi tersedia:** "Lihat karya →" → scroll ke Portofolio dan set filter ke kategori kartu.
- **Saat kosong / memuat / gagal / tanpa akses:** tidak berlaku.

### Portofolio
- **Tujuan:** menampilkan semua karya dengan filter kategori.
- **Isi:** judul section, tab filter (Semua / Website / Aplikasi Mobile / Video AI, dengan jumlah item per tab), grid kartu.
- **Kartu:** media cover rasio 4:3 (`object-cover`), badge kategori, judul, tahun, maksimal 3 tag. Kartu video memakai thumbnail YouTube + ikon play + badge "Vertikal"/"Vertical" bila `aspect` = `9:16`.
- **Aksi tersedia:** klik tab → filter + animasi susun ulang; klik kartu / `Enter` saat fokus → buka Modal Proyek.
- **Urutan:** item `featured: true` duluan, lalu `year` terbaru, lalu `order`.
- **Saat kosong (filter tanpa hasil):** judul "Belum ada karya di kategori ini", penjelas "Karya baru sedang disiapkan. Coba lihat kategori lain.", tombol "Lihat semua". (EN: "Nothing here yet" / "New work is on the way. Try another category." / "See all")
- **Saat memuat:** gambar cover memakai blur placeholder dari `next/image`; tidak ada spinner.
- **Saat gagal (gambar cover gagal dimuat):** tampilkan panel pengganti berwarna `surface` dengan judul proyek dan ikon kategori. Untuk thumbnail YouTube: coba `maxresdefault.jpg`, bila gagal pakai `hqdefault.jpg`, bila gagal lagi pakai panel pengganti.
- **Tanpa akses:** tidak berlaku.

### Modal Proyek
- **Tujuan:** melihat satu karya dalam ukuran besar.
- **Isi (semua kategori):** judul, kategori, tahun, deskripsi (maks. 400 karakter), tag, tautan, tombol "Salin tautan", tombol tutup ×, tombol sebelumnya/berikutnya (mengikuti filter aktif).
- **Isi Website:** galeri screenshot (1–5 gambar, rasio 16:10) dengan geser kiri/kanan dan indikator titik; tautan "Kunjungi situs" (bila `links.live` ada) dan "Lihat kode" (bila `links.repo` ada).
- **Isi Aplikasi Mobile:** galeri screenshot (1–5 gambar, rasio 9:19.5) dalam bingkai HP sederhana; tautan "Google Play" / "App Store" / "Demo" sesuai yang tersedia.
- **Isi Video AI:** player YouTube (lihat §8 Aturan YouTube), rasio mengikuti `aspect` (16:9 atau 9:16); tautan "Tonton di YouTube" selalu tampil bila `youtubeUrl` ada.
- **Aksi tersedia:** `Esc` / × / backdrop / back browser → tutup; `←`/`→` → proyek sebelumnya/berikutnya; "Salin tautan" → salin `https://artharestu.com/<locale>?project=<slug>` ke clipboard dan tampilkan toast "Tautan disalin" / "Link copied" selama 2 detik.
- **Tata letak:** desktop → dialog di tengah, lebar maks. 1080px, media di kiri (60%) dan info di kanan (40%). Layar < 768px → sheet layar penuh yang naik dari bawah, media di atas, info di bawah, bisa di-scroll.
- **Saat kosong (video dummy, `youtubeUrl: null`):** di area video tampil judul "Video sedang disiapkan", penjelas "Pratinjau untuk proyek ini segera hadir.", tanpa tombol. (EN: "Video coming soon" / "A preview for this project is on the way.")
- **Saat memuat:** area media menampilkan skeleton dengan rasio yang benar (tidak ada lompatan layout) sampai gambar/iframe siap.
- **Saat gagal (embed diblokir atau video dihapus):** pesan "Video tidak bisa diputar di sini." dengan tombol "Tonton di YouTube". (EN: "This video can't play here." / "Watch on YouTube")
- **Tanpa akses (`?project=` berisi slug yang tidak ada):** modal tidak dibuka, parameter dihapus dari URL, halaman tampil normal.

### Tentang
- **Tujuan:** membangun kepercayaan singkat.
- **Isi:** paragraf bio (maks. 80 kata), angka ringkas ("12+ tahun menulis kode", "3 bidang layanan", "Klien lokal & internasional"), baris marquee tool/stack (Next.js, React, Tailwind, Flutter/React Native, Supabase, Vercel, serta tool video AI), lokasi Yogyakarta. Tanpa foto (lihat Pertanyaan terbuka); gunakan monogram "AR".
- **Saat kosong / memuat / gagal / tanpa akses:** tidak berlaku.

### Ajakan kontak + Footer
- **Tujuan:** satu titik konversi yang jelas.
- **Isi:** judul besar (lihat Design Brief §7), satu kalimat penjelas, tombol utama "Chat WhatsApp" / "Chat on WhatsApp". Footer: "© 2026 Artha Restu", pengalih bahasa, tombol "Kembali ke atas".
- **Aksi tersedia:** "Chat WhatsApp" → tab baru `wa.me`.

### Halaman 404
- **Isi:** judul "Halaman tidak ditemukan", penjelas "Mungkin tautannya sudah berubah.", tombol "Kembali ke beranda". (EN: "Page not found" / "The link may have changed." / "Back to home")

## 7. Kebutuhan fungsional

| # | Kebutuhan | Prioritas |
|---|---|---|
| F1 | Mengakses `/` mengalihkan ke `/id` bila `Accept-Language` mengandung `id`, selain itu ke `/en`; cookie `NEXT_LOCALE` mengalahkan header | Must |
| F2 | Pengalih bahasa memindahkan ke locale lain dengan mempertahankan `?project=` dan hash section | Must |
| F3 | Semua teks UI tersedia dalam dua bahasa di `messages/id.json` dan `messages/en.json`; tidak ada teks UI yang di-hardcode di komponen | Must |
| F4 | Tema default gelap untuk kunjungan pertama; toggle menyimpan pilihan di `localStorage` dan tidak ada kedipan tema saat halaman dimuat | Must |
| F5 | Data portofolio dibaca dari `src/data/projects.ts` dan divalidasi dengan zod saat build; data tidak valid menggagalkan build dengan pesan yang menyebut slug dan field yang salah | Must |
| F6 | Filter kategori menampilkan hanya item kategori itu, menampilkan jumlah item per tab, dan menganimasikan susun ulang kartu | Must |
| F7 | Klik kartu membuka modal dan menulis `?project=<slug>` ke URL; membuka URL dengan parameter itu langsung membuka modal yang sesuai | Must |
| F8 | Modal bisa ditutup dengan ×, `Esc`, klik backdrop, dan tombol back browser; fokus kembali ke kartu asal | Must |
| F9 | Modal mengunci scroll halaman (Lenis di-stop) dan menjebak fokus keyboard di dalam modal | Must |
| F10 | Untuk item video, `youtubeUrl` dengan format `watch?v=`, `youtu.be/`, `/shorts/`, dan `/embed/` diubah menjadi video ID yang benar oleh fungsi `getYouTubeId()` | Must |
| F11 | Iframe YouTube hanya dibuat saat modal video terbuka dan dihapus dari DOM saat modal ditutup (audio berhenti) | Must |
| F12 | Kartu video memakai thumbnail YouTube otomatis kecuali field `cover` diisi | Must |
| F13 | Tombol WhatsApp hanya muncul di navbar (termasuk menu mobile) dan section Ajakan kontak, dengan pesan pembuka sesuai locale | Must |
| F14 | Saat `prefers-reduced-motion: reduce`, Lenis, animasi reveal, SplitText, marquee, blob latar, dan loop bingkai showcase hero dimatikan; konten langsung terlihat | Must |
| F15 | Konten tetap terbaca bila JavaScript gagal dimuat (HTML server berisi teks lengkap dalam keadaan terlihat) | Must |
| F16 | "Lihat karya →" di kartu layanan men-scroll ke Portofolio dan mengaktifkan filter kategori terkait | Should |
| F17 | Tombol sebelumnya/berikutnya dan tombol panah keyboard di modal berpindah proyek sesuai filter aktif | Should |
| F18 | "Salin tautan" menyalin URL proyek dan menampilkan toast 2 detik | Should |
| F19 | Label kursor "Lihat"/"View" mengikuti pointer saat hover kartu portofolio, hanya pada perangkat `pointer: fine` | Could |
| F20 | Tombol utama WhatsApp di Ajakan kontak bersifat magnetic (bergeser maks. 12px ke arah kursor) pada `pointer: fine` | Could |
| F21 | Bingkai showcase di hero bergantian menampilkan satu karya per kategori (featured, bila tidak ada yang terbaru), bisa dijeda, berhenti saat di-hover atau di luar layar, dan membuka Modal Proyek karya yang tampil saat diklik | Should |

## 8. Aturan dan batasan

- **Aturan YouTube:**
  - Embed memakai domain `https://www.youtube-nocookie.com/embed/<id>` dengan parameter `autoplay=1&rel=0&playsinline=1`, atribut `allow="autoplay; encrypted-media; picture-in-picture; fullscreen"` dan `allowfullscreen`, serta `title` berisi judul proyek.
  - Video harus berstatus Public atau Unlisted dan izin embed aktif; bila tidak, tampil state gagal (§6 Modal).
  - Thumbnail: `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`, fallback `hqdefault.jpg`. Tambahkan `i.ytimg.com` ke `images.remotePatterns` di `next.config`.
  - Thumbnail Shorts sering punya bar hitam; untuk item `aspect: "9:16"` disarankan mengisi `cover` sendiri.
- **Validasi data (zod):** `slug` kebab-case dan unik; `title` maks. 40 karakter; `summary.id`/`summary.en` maks. 140 karakter; `description.*` maks. 400 karakter; `tags` maks. 5; `gallery` 1–5 item untuk kategori `web` dan `mobile`; `youtubeUrl` wajib ada (boleh `null` untuk dummy) dan `aspect` wajib untuk kategori `video`; semua URL tautan harus `https://`.
- **Hak akses:** tidak berlaku (semua publik, tanpa data pengguna).
- **Batas pemakaian:** tidak berlaku.
- **File gambar:** disimpan di `public/portfolio/<slug>/`; format WebP atau AVIF; lebar maks. 2400px; ukuran maks. 400KB per file. Semua gambar dilayani lewat `next/image`.
- **WhatsApp:** nomor `6285750777740`. URL: `https://wa.me/6285750777740?text=<pesan terenkode>`. Pesan ID: "Halo Artha, saya melihat portofolio Anda di artharestu.com dan ingin berdiskusi tentang proyek." Pesan EN: "Hi Artha, I saw your portfolio at artharestu.com and would like to discuss a project." Tautan membuka tab baru dengan `rel="noopener"`.
- **Waktu:** tidak ada proses lama.

## 9. Entitas data

Satu entitas, disimpan sebagai array TypeScript di `src/data/projects.ts`.

| Entitas | Field utama | Relasi |
|---|---|---|
| Project | `slug` (string), `category` (`"web" \| "mobile" \| "video"`), `title` (string, nama diri, tidak diterjemahkan), `summary` (`{ id, en }`), `description` (`{ id, en }`), `year` (number), `role` (`{ id, en }`, opsional, mis. "Desain & development"), `tags` (string[]), `cover` (path gambar, opsional untuk video), `gallery` (string[], web/mobile), `youtubeUrl` (string \| null, video), `aspect` (`"16:9" \| "9:16"`, video), `links` (`{ live?, repo?, playStore?, appStore?, demo? }`), `featured` (boolean), `order` (number) | tidak ada |

**Data contoh:** isi 9 proyek dummy yang realistis (3 per kategori). Jangan pakai "Proyek 1" atau Lorem ipsum. Gambar dummy dibuat sebagai SVG/WebP mockup bergaya (bentuk UI abstrak dengan warna tema), bukan kotak abu-abu.

| Slug | Kategori | Judul | Ringkasan (ID) |
|---|---|---|---|
| `kopi-lereng` | web | Kopi Lereng | Company profile kedai kopi di Yogyakarta dengan menu digital dan peta lokasi. |
| `nusa-retreat` | web | Nusa Retreat | Situs pemesanan villa di Bali untuk tamu mancanegara, dua bahasa. |
| `ledgerly` | web | Ledgerly | Dashboard SaaS untuk memantau arus kas usaha kecil. |
| `pantaukas` | mobile | PantauKas | Aplikasi pencatat keuangan harian untuk pemilik UMKM. |
| `sehat-harian` | mobile | Sehat Harian | Pelacak kebiasaan sehat dengan pengingat minum air dan jalan kaki. |
| `trailmate` | mobile | Trailmate | Pendamping pendakian dengan peta offline dan catatan rute. |
| `iklan-sepatu-lari` | video | Iklan Sepatu Lari | Iklan produk vertikal 15 detik untuk Reels dan TikTok. (`aspect: "9:16"`, `youtubeUrl: null`) |
| `brand-film-kopi` | video | Brand Film Kopi | Film brand sinematik 60 detik tentang perjalanan biji kopi. (`aspect: "16:9"`, `youtubeUrl: null`) |
| `ugc-skincare` | video | UGC Skincare | Video UGC dengan virtual influencer AI untuk kampanye skincare. (`aspect: "9:16"`, `youtubeUrl: null`) |

Tulis juga `summary.en` dan `description` dua bahasa untuk semua item. Set `featured: true` pada satu item per kategori.

## 10. Non-fungsional

- **Performa (Lighthouse mobile, halaman `/id`):** Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- **Core Web Vitals:** LCP ≤ 2,5 detik, CLS ≤ 0,05, INP ≤ 200ms.
- **JavaScript:** first-load JS halaman utama ≤ 220KB (gzip). GSAP dan Lenis diimpor hanya di komponen client yang membutuhkannya.
- **Rendering:** semua halaman di-generate statis (SSG) untuk kedua locale.
- **Perangkat:** mobile-first; diuji di lebar 360px, 768px, 1280px, dan 1920px.
- **Aksesibilitas:** kontras teks minimal WCAG AA; semua elemen interaktif bisa dijangkau keyboard dengan focus ring terlihat; semua gambar punya `alt` dua bahasa (pakai judul + kategori bila tidak diisi).
- **SEO:** `metadata` per locale, `hreflang` `id`/`en`/`x-default`, canonical, `sitemap.xml`, `robots.txt`, gambar Open Graph 1200×630 per locale, JSON-LD `Person` (nama "Artha Restu", `url` `https://artharestu.com`, `address` Yogyakarta).
- **Bahasa antarmuka:** Indonesia dan Inggris.

## 11. Stack

- **Next.js** (App Router, TypeScript) — stack yang sudah biasa dipakai, SSG + `next/image` + `next/font`.
- **Tailwind CSS** — design token warna didefinisikan sebagai CSS variables untuk dua tema.
- **next-intl** — routing `/id` dan `/en`, deteksi locale di middleware.
- **next-themes** — toggle tema tanpa kedipan (atribut `class` di `<html>`).
- **GSAP** dengan ScrollTrigger, SplitText, dan Flip — satu-satunya library animasi (jangan tambah Framer Motion/Motion).
- **Lenis** — smooth scroll, terhubung ke ticker GSAP.
- **zod** — validasi data portofolio saat build.
- **lucide-react** — satu-satunya set ikon (garis, stroke 1.5px).
- **Vercel** — hosting, domain `artharestu.com`.
- Tanpa database, tanpa backend.

## 12. Asumsi

Hal berikut diisi sendiri dan perlu dicek sebelum coding dimulai:

- Tema default kunjungan pertama adalah gelap, tidak mengikuti setelan sistem.
- Locale selain Indonesia diarahkan ke `/en`.
- Situs berupa satu halaman per bahasa; tidak ada halaman proyek terpisah.
- Sapaan versi ID memakai "Anda", sudut pandang orang pertama ("saya").
- Tidak menampilkan email; kontak hanya WhatsApp.
- Cover kartu seragam 4:3; rasio asli hanya tampil di modal.
- Item video dummy memakai `youtubeUrl: null` sampai link asli diberikan.
- Daftar tool di marquee Tentang adalah contoh dan akan dikoreksi pemilik.
- Tidak ada analytics di v1.

## 13. Pertanyaan terbuka

- Link YouTube untuk tiga item video AI (akan diberikan pemilik; tinggal isi `youtubeUrl`).
- Foto profil di section Tentang: pakai foto asli atau tetap monogram "AR"?
- Tautan media sosial (Instagram, TikTok, YouTube) di footer: perlu atau tidak?
- Teks bio final dan daftar tool yang benar untuk section Tentang.
