# artharestu.com

Portofolio pribadi Artha Restu (Indonesia / English): website, aplikasi mobile, dan video AI.
Spesifikasi lengkap ada di [`docs/PRD.md`](docs/PRD.md) dan [`docs/DESIGN-BRIEF.md`](docs/DESIGN-BRIEF.md).

**Stack:** Next.js 16 (App Router, SSG) · Tailwind CSS 4 · next-intl · next-themes · GSAP (ScrollTrigger, SplitText, Flip) · Lenis · zod · lucide-react · Vercel.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build produksi (juga memvalidasi data portofolio)
npm run lint
```

## Mengelola konten

| Yang diubah | File |
|---|---|
| Daftar proyek | `src/data/projects.ts` (divalidasi zod saat build; data salah → build gagal dengan slug + field yang salah) |
| Teks UI | `messages/id.json`, `messages/en.json` |
| Daftar tool di section Tentang | `TOOLS` di `src/components/About.tsx` |
| Logo & warna tag teknologi | `src/data/tech.ts` (tag yang cocok dengan nama/alias di sini tampil dengan logo; versi di belakang nama, mis. "Seedance 2.5", diabaikan) |
| Ikon & terjemahan tag lain | `src/data/tags.ts` (ikon Lucide + label ID/EN; tag tanpa logo/ikon hanya tampil di modal, tidak di kartu) |
| Nomor & pesan WhatsApp | `src/lib/site.ts`, `common.whatsappMessage` di file messages |
| Foto profil | `public/images/artha-restu.webp` (dibuat dari `docs/images/photo profile.jpg`) |

### Menambah link YouTube untuk video AI

Isi `youtubeUrl` pada item video di `src/data/projects.ts`. Format `watch?v=`, `youtu.be/`, `/shorts/`, dan `/embed/` semuanya didukung. Video harus Public/Unlisted dengan izin embed aktif. Bila `cover` dikosongkan, thumbnail YouTube dipakai otomatis (untuk Shorts 9:16 sebaiknya tetap isi `cover`).

### Gambar proyek

Simpan di `public/portfolio/<slug>/` (WebP/AVIF, lebar ≤ 2400px, ≤ 400KB). Gambar mockup untuk data contoh dibuat oleh `npm run assets` (`scripts/generate-assets.mjs`), yang juga membuat blur placeholder di `src/data/blur.generated.json`. Setelah menambah gambar sendiri, jalankan ulang `npm run assets` agar blur placeholder-nya ikut dibuat — atau hapus entri mockup dari skrip bila sudah tidak diperlukan.

Saat mengganti gambar yang sudah tayang, simpan dengan nama file baru (mis. `cover-en.webp`), jangan menimpa file lama: hasil optimasi gambar di-cache browser dan CDN minimal 4 jam per URL (default `minimumCacheTTL` Next.js 16), jadi file yang ditimpa bisa tetap tampil versi lamanya.

## Catatan teknis

- Routing bahasa ada di `src/proxy.ts` (next-intl): `/` → `/id` bila `Accept-Language` mengandung `id`, selain itu `/en`; cookie `NEXT_LOCALE` diutamakan.
- Plugin `next-intl/plugin` sengaja tidak dipakai; `next.config.ts` memasang alias `next-intl/config` secara langsung (hasilnya sama, tanpa dependensi native `@swc/core`).
- Gambar Open Graph dibuat per bahasa oleh `src/app/[locale]/opengraph-image.tsx` memakai font di `assets/fonts/`.
