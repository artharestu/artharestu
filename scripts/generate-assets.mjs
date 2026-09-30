/* eslint-disable @typescript-eslint/no-unused-vars -- screen builders share a (W, H) signature */
// Generates stylised mockup images for the dummy portfolio items, blur placeholders,
// and the About photo. Run with: npm run assets
import sharp from "sharp";
import { mkdir, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "portfolio");
const FONT = "Segoe UI, Helvetica, Arial, sans-serif";

const palettes = {
  "kopi-lereng": { bg: "#1C1410", surface: "#2A1E17", line: "#3A2A20", accent: "#D9A066", text: "#F3E9DD", muted: "#A48B76" },
  "nusa-retreat": { bg: "#EFE8DC", surface: "#FFFFFF", line: "#DCD2C2", accent: "#1F6F66", text: "#1B2A28", muted: "#72807D" },
  ledgerly: { bg: "#0E1116", surface: "#171B22", line: "#262C36", accent: "#C8FF3D", text: "#E8ECEF", muted: "#7C8591" },
  pantaukas: { bg: "#0F1A14", surface: "#16261D", line: "#22382B", accent: "#4ADE80", text: "#E6F4EC", muted: "#7FA08D" },
  "sehat-harian": { bg: "#EEF2F8", surface: "#FFFFFF", line: "#DCE3EE", accent: "#3B82F6", text: "#10203A", muted: "#6B7A93" },
  trailmate: { bg: "#13160F", surface: "#1E2318", line: "#2E3524", accent: "#F59E0B", text: "#EEF0E6", muted: "#8E957F" },
  "iklan-sepatu-lari": { bg: "#0B0B0F", surface: "#18181F", accent: "#FF5A36", text: "#F4F1EC", muted: "#8A8A93" },
  "brand-film-kopi": { bg: "#140D08", surface: "#24170E", accent: "#C98A4B", text: "#F2E6D8", muted: "#9C8069" },
  "ugc-skincare": { bg: "#F1E4DE", surface: "#FFFFFF", accent: "#C9757A", text: "#3A2326", muted: "#9E7D7F" },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const rect = (x, y, w, h, fill, r = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const text = (x, y, str, size, fill, weight = 600, extra = "") =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(str)}</text>`;
const lines = (x, y, widths, h, gap, fill) => widths.map((w, i) => rect(x, y + i * (h + gap), w, h, fill, h / 2)).join("");
const grain = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.06 0"/></filter>`;

// ——— Website screens (16:10) ———
function browser(p, title, body, W = 1600, H = 1000) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${grain}</defs>
  ${rect(0, 0, W, H, p.bg)}
  ${rect(0, 0, W, 56, p.surface)}${rect(0, 56, W, 1, p.line)}
  <circle cx="32" cy="28" r="7" fill="${p.line}"/><circle cx="56" cy="28" r="7" fill="${p.line}"/><circle cx="80" cy="28" r="7" fill="${p.line}"/>
  ${rect(W / 2 - 220, 14, 440, 28, p.bg, 14)}${text(W / 2 - 200, 34, title, 14, p.muted, 400)}
  <g transform="translate(0,57)">${body(W, H - 57)}</g>
  <rect width="${W}" height="${H}" filter="url(#g)"/>
</svg>`;
}

function siteNav(p, W, name) {
  return `${text(80, 64, name, 22, p.text, 700)}
  ${[0, 1, 2, 3].map((i) => rect(W - 620 + i * 110, 50, 80, 10, p.muted, 5, 'opacity="0.6"')).join("")}
  ${rect(W - 180, 36, 110, 40, p.accent, 20)}`;
}

const webScreens = {
  "kopi-lereng": [
    (p) => browser(p, "kopilereng.id", (W, H) => `
      ${siteNav(p, W, "Kopi Lereng")}
      ${text(80, 260, "Kopi dari lereng", 92, p.text)}${text(80, 360, "Merapi.", 92, p.accent)}
      ${lines(80, 420, [520, 440], 14, 14, p.muted)}
      ${rect(80, 500, 190, 56, p.accent, 28)}${rect(290, 500, 190, 56, "none", 28, `stroke="${p.muted}" stroke-width="2"`)}
      <g transform="translate(900,110)">
        ${rect(0, 0, 620, 740, p.surface, 24)}
        <circle cx="310" cy="330" r="190" fill="${p.accent}" opacity="0.18"/>
        <path d="M200 250 h220 v120 a110 110 0 0 1 -220 0z" fill="${p.accent}"/>
        <path d="M420 280 a50 50 0 0 1 0 90" stroke="${p.accent}" stroke-width="18" fill="none"/>
        <path d="M250 200 q20 -40 0 -80 M310 200 q20 -40 0 -80 M370 200 q20 -40 0 -80" stroke="${p.muted}" stroke-width="8" fill="none" stroke-linecap="round"/>
        ${lines(60, 600, [300, 200], 14, 16, p.muted)}
      </g>`),
    (p) => browser(p, "kopilereng.id/menu", (W, H) => `
      ${siteNav(p, W, "Kopi Lereng")}
      ${text(80, 200, "Menu", 64, p.text)}
      ${["Semua", "Kopi", "Non-kopi", "Makanan"].map((t, i) => rect(80 + i * 150, 240, 136, 44, i === 0 ? p.accent : p.surface, 22) + text(104 + i * 150, 270, t, 16, i === 0 ? p.bg : p.muted, 500)).join("")}
      ${[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 80 + (i % 3) * 490, y = 330 + Math.floor(i / 3) * 290;
        const names = ["Es Kopi Lereng", "Kopi Tubruk", "Manual Brew", "Susu Gula Aren", "Teh Rempah", "Roti Bakar"];
        return rect(x, y, 460, 260, p.surface, 20) + rect(x + 20, y + 20, 140, 220, p.line, 14) + `<circle cx="${x + 90}" cy="${y + 130}" r="44" fill="${p.accent}" opacity="0.7"/>` + text(x + 190, y + 70, names[i], 24, p.text, 600) + lines(x + 190, y + 100, [220, 170], 10, 12, p.muted) + text(x + 190, y + 210, `${18 + i * 3}K`, 28, p.accent, 700);
      }).join("")}`),
    (p) => browser(p, "kopilereng.id/lokasi", (W, H) => `
      ${siteNav(p, W, "Kopi Lereng")}
      <g transform="translate(80,130)">
        ${rect(0, 0, 900, 760, p.surface, 24)}
        ${[...Array(9)].map((_, i) => `<path d="M0 ${80 + i * 80} C 300 ${40 + i * 90}, 600 ${120 + i * 70}, 900 ${60 + i * 85}" stroke="${p.line}" stroke-width="${i % 3 === 0 ? 10 : 3}" fill="none"/>`).join("")}
        <path d="M450 250 a60 60 0 0 1 60 60 c0 50 -60 110 -60 110 s-60 -60 -60 -110 a60 60 0 0 1 60 -60z" fill="${p.accent}"/><circle cx="450" cy="310" r="22" fill="${p.bg}"/>
      </g>
      ${text(1040, 220, "Jl. Kaliurang", 40, p.text)}${text(1040, 270, "Km 12, Sleman", 40, p.text)}
      ${lines(1040, 320, [400, 320], 12, 14, p.muted)}
      ${text(1040, 450, "BUKA SETIAP HARI", 16, p.muted, 500, 'letter-spacing="3"')}${text(1040, 500, "07.00 – 22.00", 44, p.accent)}
      ${rect(1040, 560, 240, 56, p.accent, 28)}`),
  ],
  "nusa-retreat": [
    (p) => browser(p, "nusaretreat.com", (W, H) => `
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC9C1"/><stop offset="1" stop-color="#E9D8BE"/></linearGradient></defs>
      ${rect(0, 0, W, H, "url(#sky)")}
      <circle cx="1200" cy="260" r="110" fill="#F6E7C8"/>
      <path d="M0 640 C 400 560, 900 700, ${W} 600 L ${W} ${H} L 0 ${H}z" fill="#1F6F66" opacity="0.9"/>
      <path d="M0 740 C 500 680, 1000 780, ${W} 700 L ${W} ${H} L 0 ${H}z" fill="#174F49"/>
      ${text(80, 64, "Nusa Retreat", 22, "#10302C", 700)}${rect(W - 180, 36, 110, 40, "#10302C", 20)}
      ${text(80, 300, "Your quiet villa", 88, "#10302C")}${text(80, 400, "in Uluwatu.", 88, "#10302C")}
      <g transform="translate(80,470)">${rect(0, 0, 820, 90, "#FFFFFF", 45)}
        ${["Check-in", "Check-out", "Guests"].map((t, i) => text(40 + i * 220, 40, t.toUpperCase(), 13, "#72807D", 500, 'letter-spacing="2"') + rect(40 + i * 220, 54, 140, 12, "#DCD2C2", 6)).join("")}
        ${rect(680, 15, 125, 60, "#1F6F66", 30)}</g>`),
    (p) => browser(p, "nusaretreat.com/rooms", (W, H) => `
      ${siteNav(p, W, "Nusa Retreat")}
      ${text(80, 200, "Rooms & villas", 60, p.text)}
      ${[0, 1, 2].map((i) => {
        const x = 80 + i * 490; const hues = ["#9CC9C1", "#E9C9A0", "#B7C9A8"];
        return rect(x, 250, 460, 620, p.surface, 20, `stroke="${p.line}"`) + rect(x + 16, 266, 428, 320, hues[i], 14) + `<path d="M${x + 16} 520 l120 -110 l90 70 l80 -60 l138 100 v66 h-428z" fill="${p.accent}" opacity="0.5"/>` + text(x + 32, 640, ["Ocean Suite", "Garden Villa", "Cliff House"][i], 28, p.text) + lines(x + 32, 670, [300, 240], 10, 12, p.muted) + text(x + 32, 800, `$${180 + i * 70}`, 32, p.accent, 700) + text(x + 150, 800, "/ night", 18, p.muted, 400);
      }).join("")}`),
    (p) => browser(p, "nusaretreat.com/book", (W, H) => `
      ${siteNav(p, W, "Nusa Retreat")}
      <g transform="translate(80,130)">${rect(0, 0, 820, 740, p.surface, 24, `stroke="${p.line}"`)}
        ${text(40, 70, "October 2026", 30, p.text)}
        ${[...Array(35)].map((_, i) => { const x = 40 + (i % 7) * 106, y = 120 + Math.floor(i / 7) * 110; const sel = i >= 15 && i <= 18; const off = [3, 4, 10, 25, 26].includes(i); return rect(x, y, 92, 92, sel ? p.accent : p.bg, 14, off ? 'opacity="0.4"' : "") + text(x + 16, y + 36, String((i % 31) + 1), 20, sel ? "#FFFFFF" : p.text, 500); }).join("")}
      </g>
      <g transform="translate(960,130)">${rect(0, 0, 560, 740, p.surface, 24, `stroke="${p.line}"`)}
        ${text(40, 70, "Ocean Suite", 34, p.text)}${lines(40, 100, [380, 300], 10, 12, p.muted)}
        ${[0, 1, 2].map((i) => rect(40, 200 + i * 70, 480, 1, p.line) + lines(40, 225 + i * 70, [180], 12, 0, p.muted) + rect(420, 222 + i * 70, 100, 18, p.text, 9, 'opacity="0.7"')).join("")}
        ${text(40, 520, "$ 720", 56, p.accent, 700)}${rect(40, 600, 480, 72, p.accent, 36)}${text(200, 646, "Book now", 24, "#FFFFFF", 600)}
      </g>`),
  ],
  ledgerly: [
    (p) => browser(p, "app.ledgerly.io", (W, H) => dashboard(p, W, H, 0)),
    (p) => browser(p, "app.ledgerly.io/cashflow", (W, H) => dashboard(p, W, H, 1)),
    (p) => browser(p, "app.ledgerly.io/import", (W, H) => `
      ${sidebar(p, H)}
      <g transform="translate(340,40)">
        ${text(0, 50, "Import bank statement", 40, p.text)}
        ${rect(0, 90, 1180, 280, p.surface, 20, `stroke="${p.accent}" stroke-dasharray="12 10" stroke-width="2"`)}
        <path d="M590 170 v90 M550 210 l40 -40 l40 40" stroke="${p.accent}" stroke-width="8" fill="none" stroke-linecap="round"/>
        ${lines(460, 300, [260], 12, 0, p.muted)}
        ${rect(0, 410, 1180, 460, p.surface, 20)}
        ${[...Array(7)].map((_, i) => rect(30, 450 + i * 58, 1120, 1, p.line) + lines(30, 470 + i * 58, [120, 0], 12, 0, p.muted) + rect(220, 470 + i * 58, 380, 12, p.muted, 6, 'opacity="0.5"') + rect(1010, 468 + i * 58, 140, 16, i % 3 === 0 ? "#FF6B6B" : p.accent, 8, 'opacity="0.85"')).join("")}
      </g>`),
  ],
};

function sidebar(p, H) {
  return `${rect(0, 0, 280, H, p.surface)}${rect(280, 0, 1, H, p.line)}
    ${text(40, 60, "Ledgerly", 26, p.text, 700)}<circle cx="190" cy="52" r="6" fill="${p.accent}"/>
    ${[0, 1, 2, 3, 4].map((i) => rect(24, 110 + i * 56, 232, 44, i === 0 ? p.bg : "none", 12) + rect(44, 126 + i * 56, 16, 12, i === 0 ? p.accent : p.muted, 3) + rect(76, 128 + i * 56, 120 - i * 8, 10, i === 0 ? p.text : p.muted, 5)).join("")}`;
}

function dashboard(p, W, H, variant) {
  const pts = variant === 0 ? [520, 470, 490, 400, 430, 350, 380, 300, 320, 250, 270, 210] : [380, 420, 360, 390, 300, 340, 260, 300, 240, 280, 200, 230];
  const path = pts.map((y, i) => `${i ? "L" : "M"}${60 + i * 98} ${y - 150}`).join(" ");
  return `${sidebar(p, H)}
  <g transform="translate(340,40)">
    ${text(0, 50, variant === 0 ? "Overview" : "Cash flow", 40, p.text)}
    ${[0, 1, 2].map((i) => rect(i * 400, 90, 380, 170, p.surface, 20) + rect(i * 400 + 30, 120, 120, 10, p.muted, 5) + text(i * 400 + 30, 200, ["Rp 48,2 jt", "Rp 31,7 jt", "Rp 16,5 jt"][i], 44, i === 2 ? p.accent : p.text, 600) + rect(i * 400 + 30, 225, 70, 16, i === 1 ? "#FF6B6B" : p.accent, 8, 'opacity="0.3"')).join("")}
    ${rect(0, 290, variant === 0 ? 780 : 1180, 580, p.surface, 20)}
    <g transform="translate(0,430)">
      ${[0, 1, 2, 3].map((i) => rect(60, 40 + i * 90, (variant === 0 ? 660 : 1060), 1, p.line)).join("")}
      ${variant === 0 ? `<path d="${path} L ${60 + 11 * 98} 420 L 60 420z" fill="${p.accent}" opacity="0.12"/><path d="${path}" stroke="${p.accent}" stroke-width="5" fill="none"/>` : pts.map((y, i) => rect(90 + i * 90, y - 150, 36, 420 - (y - 150), i % 2 ? p.muted : p.accent, 8, i % 2 ? 'opacity="0.4"' : "")).join("")}
    </g>
    ${variant === 0 ? rect(800, 290, 380, 580, p.surface, 20) + text(830, 340, "Upcoming bills", 22, p.text, 600) + [0, 1, 2, 3, 4, 5].map((i) => rect(830, 380 + i * 76, 320, 60, p.bg, 12) + rect(850, 402 + i * 76, 120, 12, p.muted, 6) + rect(1060, 400 + i * 76, 70, 16, i === 0 ? "#FF6B6B" : p.accent, 8, 'opacity="0.8"')).join("") : ""}
  </g>`;
}

// ——— Mobile screens (9:19.5) ———
function phoneScreen(p, body, W = 720, H = 1560) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${grain}</defs>${rect(0, 0, W, H, p.bg)}
  ${text(48, 64, "9:41", 26, p.text, 600)}${rect(W - 140, 44, 90, 22, p.text, 6, 'opacity="0.7"')}
  <g transform="translate(0,100)">${body(W, H - 100)}</g>
  <rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
}

const mobileScreens = {
  pantaukas: [
    (p) => phoneScreen(p, (W) => `
      ${text(48, 60, "Halo, Bu Sari", 30, p.muted, 400)}${text(48, 130, "Rp 2.450.000", 66, p.text)}${text(48, 180, "Laba bulan ini", 24, p.accent, 500)}
      ${rect(48, 230, W - 96, 300, p.surface, 32)}
      ${[60, 110, 80, 150, 120, 190, 170].map((h, i) => rect(90 + i * 80, 490 - h, 44, h, i === 6 ? p.accent : p.line, 10)).join("")}
      ${text(48, 610, "Transaksi terbaru", 30, p.text)}
      ${[0, 1, 2, 3, 4, 5].map((i) => rect(48, 650 + i * 120, W - 96, 104, p.surface, 24) + `<circle cx="108" cy="${702 + i * 120}" r="30" fill="${i % 2 ? p.line : p.accent}" opacity="${i % 2 ? 1 : 0.3}"/>` + rect(160, 684 + i * 120, 200, 14, p.text, 7, 'opacity="0.8"') + rect(160, 710 + i * 120, 120, 10, p.muted, 5) + text(W - 250, 716 + i * 120, i % 2 ? "- 85.000" : "+ 120.000", 28, i % 2 ? p.muted : p.accent, 600)).join("")}
      <circle cx="${W - 110}" cy="1340" r="60" fill="${p.accent}"/><path d="M${W - 110} 1310 v60 M${W - 140} 1340 h60" stroke="${p.bg}" stroke-width="8" stroke-linecap="round"/>`),
    (p) => phoneScreen(p, (W) => `
      ${text(48, 70, "Catat transaksi", 44, p.text)}
      ${rect(48, 110, W - 96, 90, p.surface, 45)}${rect(56, 118, (W - 112) / 2, 74, p.accent, 37)}${text(140, 168, "Pemasukan", 26, p.bg, 600)}${text(420, 168, "Pengeluaran", 26, p.muted, 500)}
      ${text(48, 330, "Rp 120.000", 88, p.text)}${rect(48, 360, W - 96, 2, p.accent)}
      ${[0, 1, 2].map((i) => rect(48, 420 + i * 130, W - 96, 110, p.surface, 24) + rect(80, 460 + i * 130, 160, 12, p.muted, 6) + rect(80, 488 + i * 130, 260, 14, p.text, 7, 'opacity="0.8"')).join("")}
      ${[...Array(12)].map((_, i) => rect(48 + (i % 3) * 212, 840 + Math.floor(i / 3) * 110, 196, 94, p.surface, 20) + text(130 + (i % 3) * 212, 900 + Math.floor(i / 3) * 110, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "⌫"][i], 34, p.text, 500)).join("")}
      ${rect(48, 1300, W - 96, 100, p.accent, 50)}${text(W / 2 - 60, 1362, "Simpan", 32, p.bg, 600)}`),
    (p) => phoneScreen(p, (W) => `
      ${text(48, 70, "Laporan", 44, p.text)}
      ${rect(48, 110, W - 96, 560, p.surface, 32)}
      <circle cx="${W / 2}" cy="360" r="170" fill="none" stroke="${p.line}" stroke-width="48"/>
      <circle cx="${W / 2}" cy="360" r="170" fill="none" stroke="${p.accent}" stroke-width="48" stroke-dasharray="680 1068" transform="rotate(-90 ${W / 2} 360)"/>
      ${text(W / 2 - 80, 380, "64%", 64, p.text)}
      ${[0, 1, 2, 3].map((i) => rect(48, 710 + i * 120, W - 96, 100, p.surface, 24) + rect(80, 752 + i * 120, 16, 16, i === 0 ? p.accent : p.muted, 8) + rect(116, 752 + i * 120, 200, 14, p.text, 7, 'opacity="0.8"') + rect(W - 220, 750 + i * 120, 120, 18, p.muted, 9)).join("")}
      ${rect(48, 1250, W - 96, 100, "none", 50, `stroke="${p.accent}" stroke-width="3"`)}${text(W / 2 - 170, 1312, "Bagikan ke WhatsApp", 30, p.accent, 600)}`),
  ],
  "sehat-harian": [
    (p) => phoneScreen(p, (W) => `
      ${text(48, 60, "Selasa, 30 Sep", 28, p.muted, 400)}${text(48, 130, "Hari ini", 60, p.text)}
      ${rect(48, 170, W - 96, 460, p.surface, 36)}
      <circle cx="${W / 2}" cy="400" r="160" fill="none" stroke="${p.line}" stroke-width="36"/>
      <circle cx="${W / 2}" cy="400" r="160" fill="none" stroke="${p.accent}" stroke-width="36" stroke-linecap="round" stroke-dasharray="760 1005" transform="rotate(-90 ${W / 2} 400)"/>
      ${text(W / 2 - 110, 400, "6.840", 70, p.text)}${text(W / 2 - 50, 450, "langkah", 26, p.muted, 400)}
      ${[0, 1].map((i) => rect(48 + i * 322, 670, 290, 300, p.surface, 32) + text(80 + i * 322, 740, ["Air", "Tidur"][i], 30, p.muted, 500) + text(80 + i * 322, 830, ["5/8", "7j 20m"][i], 54, p.text) + rect(80 + i * 322, 880, 226, 16, p.line, 8) + rect(80 + i * 322, 880, [140, 190][i], 16, p.accent, 8)).join("")}
      ${rect(48, 1010, W - 96, 150, p.accent, 32)}${text(88, 1075, "Waktunya minum air", 32, "#FFFFFF", 600)}${text(88, 1120, "Sudah 2 jam sejak gelas terakhir", 24, "#FFFFFF", 400, 'opacity="0.85"')}`),
    (p) => phoneScreen(p, (W) => `
      ${text(48, 70, "Minggu ini", 50, p.text)}
      ${rect(48, 120, W - 96, 520, p.surface, 36)}
      ${["S", "S", "R", "K", "J", "S", "M"].map((d, i) => { const h = [220, 300, 260, 340, 200, 360, 280][i]; return rect(90 + i * 82, 560 - h, 50, h, i === 5 ? p.accent : p.line, 25) + text(104 + i * 82, 610, d, 24, p.muted, 500); }).join("")}
      ${[0, 1, 2, 3].map((i) => rect(48, 680 + i * 140, W - 96, 120, p.surface, 28) + `<circle cx="118" cy="${740 + i * 140}" r="34" fill="${p.accent}" opacity="0.15"/>` + rect(180, 720 + i * 140, 220, 14, p.text, 7, 'opacity="0.8"') + rect(180, 748 + i * 140, 140, 10, p.muted, 5) + rect(W - 190, 722 + i * 140, 100, 36, p.accent, 18, i > 1 ? 'opacity="0.25"' : "")).join("")}`),
    (p) => phoneScreen(p, (W) => `
      ${text(48, 70, "Pengingat", 50, p.text)}
      ${[0, 1, 2, 3, 4].map((i) => rect(48, 120 + i * 170, W - 96, 150, p.surface, 28) + text(88, 200 + i * 170, ["08.00", "10.00", "12.30", "15.00", "19.00"][i], 48, p.text) + rect(88, 222 + i * 170, 200, 12, p.muted, 6) + rect(W - 200, 170 + i * 170, 100, 56, i === 3 ? p.line : p.accent, 28) + `<circle cx="${i === 3 ? W - 172 : W - 128}" cy="${198 + i * 170}" r="22" fill="#FFFFFF"/>`).join("")}
      ${rect(48, 1010, W - 96, 100, "none", 50, `stroke="${p.accent}" stroke-width="3" stroke-dasharray="10 8"`)}${text(W / 2 - 130, 1072, "+ Tambah pengingat", 30, p.accent, 600)}`),
  ],
  trailmate: [
    (p) => phoneScreen(p, (W, H) => `
      ${rect(0, 0, W, H, p.surface)}
      ${[...Array(14)].map((_, i) => `<path d="M-20 ${120 + i * 95} C 200 ${60 + i * 100}, 450 ${180 + i * 85}, ${W + 20} ${90 + i * 98}" stroke="${p.line}" stroke-width="3" fill="none"/>`).join("")}
      <path d="M140 1180 C 220 1000, 180 880, 320 760 S 520 520, 470 360 S 560 200, 600 160" stroke="${p.accent}" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="1 22"/>
      <path d="M140 1180 C 220 1000, 180 880, 320 760" stroke="${p.accent}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="320" cy="760" r="24" fill="${p.accent}"/><circle cx="320" cy="760" r="48" fill="${p.accent}" opacity="0.25"/>
      <path d="M600 110 l30 50 h-60z" fill="${p.text}"/>
      ${rect(40, 20, W - 80, 90, p.bg, 45, 'opacity="0.92"')}${text(90, 78, "Gn. Merbabu via Selo", 28, p.text, 600)}
      ${rect(40, 1180, W - 80, 250, p.bg, 36, 'opacity="0.95"')}
      ${["4,2 km", "1.120 m", "2j 14m"].map((t, i) => text(80 + i * 210, 1270, t, 38, i === 0 ? p.accent : p.text) + rect(80 + i * 210, 1300, 100, 10, p.muted, 5)).join("")}
      ${rect(80, 1340, W - 160, 60, p.accent, 30)}`),
    (p) => phoneScreen(p, (W) => `
      ${text(48, 70, "Peta offline", 50, p.text)}
      ${[0, 1, 2, 3].map((i) => rect(48, 120 + i * 260, W - 96, 230, p.surface, 28) + rect(68, 140 + i * 260, 190, 190, p.line, 20) + `<path d="M78 ${310 + i * 260} l60 -80 l40 40 l30 -30 l40 70z" fill="${p.accent}" opacity="0.6"/>` + text(290, 200 + i * 260, ["Merbabu", "Prau", "Andong", "Sindoro"][i], 34, p.text) + rect(290, 230 + i * 260, 180, 12, p.muted, 6) + rect(290, 280 + i * 260, 300, 12, p.line, 6) + rect(290, 280 + i * 260, [300, 300, 160, 60][i], 12, p.accent, 6)).join("")}`),
    (p) => phoneScreen(p, (W) => `
      ${text(48, 70, "Catatan rute", 50, p.text)}
      <path d="M100 160 V 1250" stroke="${p.line}" stroke-width="4" stroke-dasharray="8 10"/>
      ${["Basecamp Selo", "Pos 1 — Dok Malang", "Sumber air", "Pos 3 — Batu Tulis", "Sabana 1", "Puncak Kenteng Songo"].map((t, i) => `<circle cx="100" cy="${190 + i * 205}" r="${i === 2 ? 20 : 14}" fill="${i === 2 ? p.accent : p.text}"/>` + rect(150, 130 + i * 205, W - 200, 150, p.surface, 24) + text(180, 190 + i * 205, t, 30, p.text, 600) + rect(180, 215 + i * 205, 220, 11, p.muted, 5)).join("")}`),
  ],
};

// Cover (4:3) for web: floating browser on a tinted stage
async function webCover(slug, p, firstScreenBuf) {
  const W = 1200, H = 900;
  const shot = await sharp(firstScreenBuf).resize(1000, 625).png().toBuffer();
  const stage = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${grain}</defs>
    ${rect(0, 0, W, H, p.bg)}<circle cx="${W * 0.8}" cy="${H * 0.15}" r="380" fill="${p.accent}" opacity="0.14"/>
    ${rect(96, 176, 1008, 633, p.line, 18)}<rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
  const mask = Buffer.from(`<svg width="1000" height="625"><rect width="1000" height="625" rx="14"/></svg>`);
  const rounded = await sharp(shot).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  return sharp(Buffer.from(stage)).composite([{ input: rounded, left: 100, top: 180 }]);
}

async function mobileCover(slug, p, screenBufs) {
  const W = 1200, H = 900;
  const stage = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${grain}</defs>
    ${rect(0, 0, W, H, p.bg)}<circle cx="${W * 0.2}" cy="${H * 0.9}" r="420" fill="${p.accent}" opacity="0.14"/>
    <rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
  const pw = 300, ph = 650;
  const frames = await Promise.all(
    screenBufs.map(async (buf) => {
      const screen = await sharp(buf).resize(pw - 20, ph - 20).png().toBuffer();
      const frame = Buffer.from(`<svg width="${pw}" height="${ph}"><rect width="${pw}" height="${ph}" rx="46" fill="#0A0A0C"/><rect x="${pw / 2 - 40}" y="18" width="80" height="18" rx="9" fill="#0A0A0C"/></svg>`);
      const mask = Buffer.from(`<svg width="${pw - 20}" height="${ph - 20}"><rect width="${pw - 20}" height="${ph - 20}" rx="38"/></svg>`);
      const roundedScreen = await sharp(screen).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
      const notch = Buffer.from(`<svg width="${pw}" height="${ph}"><rect x="${pw / 2 - 45}" y="22" width="90" height="22" rx="11" fill="#0A0A0C"/></svg>`);
      return sharp(frame).composite([{ input: roundedScreen, left: 10, top: 10 }, { input: notch, left: 0, top: 0 }]).png().toBuffer();
    }),
  );
  return sharp(Buffer.from(stage)).composite([
    { input: frames[1], left: 110, top: 170 },
    { input: frames[2], left: 790, top: 170 },
    { input: frames[0], left: 450, top: 110 },
  ]);
}

// Cover (4:3) for video: cinematic still with play-frame chrome
function videoCover(slug, p) {
  const W = 1200, H = 900;
  const vertical = slug !== "brand-film-kopi";
  const scenes = {
    "iklan-sepatu-lari": `
      <defs><linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A5B"/><stop offset="1" stop-color="#2A0F14"/></linearGradient></defs>
      ${rect(0, 0, 506, 900, "url(#sun)")}<circle cx="253" cy="330" r="120" fill="#FFD7A8" opacity="0.9"/>
      ${[...Array(6)].map((_, i) => rect(20 + i * 90, 420 - (i % 3) * 60, 60, 480, "#1A0B10", 4, 'opacity="0.85"')).join("")}
      <path d="M60 760 C 120 690, 220 670, 330 690 L 430 700 C 470 705, 470 760, 430 770 L 90 800 C 60 800, 45 780, 60 760z" fill="${p.accent}"/>
      <path d="M70 790 L 440 765" stroke="#FFFFFF" stroke-width="14"/><path d="M180 700 l20 40 M220 695 l20 40 M260 692 l20 40" stroke="#FFFFFF" stroke-width="6"/>
      ${[...Array(5)].map((_, i) => rect(-40 + i * 30, 600 + i * 22, 160 - i * 20, 6, "#FFFFFF", 3, 'opacity="0.4"')).join("")}`,
    "ugc-skincare": `
      ${rect(0, 0, 506, 900, "#E9CFC6")}${rect(0, 560, 506, 340, "#D8B2A6")}
      <circle cx="253" cy="340" r="130" fill="#C99A86"/><path d="M110 330 C 100 160, 406 160, 396 330 C 400 250, 330 200, 253 200 C 176 200, 106 250, 110 330z" fill="#3A2326"/>
      <path d="M90 900 C 100 560, 406 560, 416 900z" fill="#F5EFEA"/>
      ${rect(300, 470, 70, 180, "#FFFFFF", 16)}${rect(310, 430, 50, 50, p.accent, 8)}${rect(310, 530, 50, 60, p.accent, 8, 'opacity="0.35"')}
      <circle cx="210" cy="330" r="10" fill="#3A2326"/><circle cx="296" cy="330" r="10" fill="#3A2326"/><path d="M225 395 q28 22 56 0" stroke="#7A3B3F" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${rect(40, 60, 190, 44, "#FFFFFF", 22, 'opacity="0.85"')}${rect(60, 76, 120, 12, "#9E7D7F", 6)}`,
    "brand-film-kopi": `
      <defs><linearGradient id="hills" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2616"/><stop offset="1" stop-color="#0C0705"/></linearGradient></defs>
      ${rect(0, 0, W, 675, "url(#hills)")}<circle cx="880" cy="200" r="90" fill="#E8B77D" opacity="0.85"/>
      <path d="M0 380 C 200 300, 380 340, 560 280 S 900 300, 1200 240 V 675 H 0z" fill="#2B1A0F"/>
      <path d="M0 470 C 260 400, 520 460, 760 400 S 1050 420, 1200 380 V 675 H 0z" fill="#1C110A"/>
      ${[...Array(14)].map((_, i) => `<ellipse cx="${80 + i * 80}" cy="${520 + (i % 3) * 30}" rx="34" ry="22" fill="#3F5A2A" opacity="0.8"/>`).join("")}
      ${[...Array(9)].map((_, i) => `<ellipse cx="${300 + i * 70}" cy="${600 - (i % 2) * 14}" rx="16" ry="11" fill="${p.accent}"/>`).join("")}`,
  };
  const scene = scenes[slug];
  const fw = vertical ? 506 : W, fh = vertical ? 900 : 675;
  const fx = (W - fw) / 2, fy = (H - fh) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${grain}
    <clipPath id="f"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}"/></clipPath></defs>
    ${rect(0, 0, W, H, p.bg)}
    ${vertical ? `<g opacity="0.35" transform="translate(-60,0) scale(1)">${scene}</g><g opacity="0.35" transform="translate(754,0)">${scene}</g>${rect(0, 0, W, H, p.bg, 0, 'opacity="0.55"')}` : ""}
    <g clip-path="url(#f)"><g transform="translate(${fx},${fy})">${scene}</g></g>
    ${vertical ? "" : rect(0, 0, W, fy, "#000") + rect(0, fy + fh, W, fy, "#000")}
    ${text(fx + 28, fy + fh - 30, vertical ? "00:15" : "01:00", 22, "#FFFFFF", 500, 'opacity="0.8" letter-spacing="2"')}
    ${rect(fx + 28, fy + fh - 16, fw - 56, 3, "#FFFFFF", 2, 'opacity="0.3"')}${rect(fx + 28, fy + fh - 16, (fw - 56) * 0.35, 3, "#FFFFFF", 2)}
    <rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
}

// ——— Helpers ———
async function saveWebp(input, file, width) {
  let img = sharp(input);
  if (width) img = img.resize({ width });
  await img.webp({ quality: 78, effort: 6 }).toFile(file);
}

async function blurDataUrl(file) {
  const buf = await sharp(file).resize(16).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  for (const [slug, screens] of Object.entries(webScreens)) {
    const p = palettes[slug];
    const dir = path.join(OUT, slug);
    await mkdir(dir, { recursive: true });
    const bufs = screens.map((fn) => Buffer.from(fn(p)));
    for (const [i, buf] of bufs.entries()) await saveWebp(buf, path.join(dir, `0${i + 1}.webp`), 1600);
    const firstPng = await sharp(bufs[0]).png().toBuffer();
    await saveWebp(await (await webCover(slug, p, firstPng)).png().toBuffer(), path.join(dir, "cover.webp"));
  }

  for (const [slug, screens] of Object.entries(mobileScreens)) {
    const p = palettes[slug];
    const dir = path.join(OUT, slug);
    await mkdir(dir, { recursive: true });
    const bufs = screens.map((fn) => Buffer.from(fn(p)));
    for (const [i, buf] of bufs.entries()) await saveWebp(buf, path.join(dir, `0${i + 1}.webp`), 720);
    const pngs = await Promise.all(bufs.map((b) => sharp(b).png().toBuffer()));
    await saveWebp(await (await mobileCover(slug, p, pngs)).png().toBuffer(), path.join(dir, "cover.webp"));
  }

  for (const slug of ["iklan-sepatu-lari", "brand-film-kopi", "ugc-skincare"]) {
    const dir = path.join(OUT, slug);
    await mkdir(dir, { recursive: true });
    await saveWebp(Buffer.from(videoCover(slug, palettes[slug])), path.join(dir, "cover.webp"));
  }

  // About photo: square WebP; the subdued look is applied in CSS.
  const photoSrc = path.join(ROOT, "docs", "images", "photo profile.jpg");
  await mkdir(path.join(ROOT, "public", "images"), { recursive: true });
  const photoOut = path.join(ROOT, "public", "images", "artha-restu.webp");
  await sharp(photoSrc).resize(960, 960).webp({ quality: 80 }).toFile(photoOut);

  // Blur placeholders for every generated image.
  const blur = {};
  for (const slug of await readdir(OUT)) {
    for (const f of await readdir(path.join(OUT, slug))) {
      const file = path.join(OUT, slug, f);
      blur[`/portfolio/${slug}/${f}`] = await blurDataUrl(file);
      const { size } = await stat(file);
      if (size > 400 * 1024) console.warn(`! ${slug}/${f} is ${Math.round(size / 1024)}KB (> 400KB)`);
    }
  }
  blur["/images/artha-restu.webp"] = await blurDataUrl(photoOut);
  await writeFile(path.join(ROOT, "src", "data", "blur.generated.json"), JSON.stringify(blur, null, 2) + "\n");
  console.log(`Generated ${Object.keys(blur).length} images.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
