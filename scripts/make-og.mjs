// Builds the 1200x630 share card in public/media/og-cover.png from a project
// photograph, so link previews look like the site rather than a raw crop.
// Run with: node scripts/make-og.mjs
import sharp from "sharp";
import { statSync } from "node:fs";

const WIDTH = 1200;
const HEIGHT = 630;
const SOURCE = "public/media/project-monolith.jpg";
const TARGET = "public/media/og-cover.png";

const overlay = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#141c2e" stop-opacity="0.18"/>
      <stop offset="52%" stop-color="#141c2e" stop-opacity="0.52"/>
      <stop offset="100%" stop-color="#141c2e" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/>
  <rect x="72" y="72" width="64" height="1" fill="#c8a568"/>
  <text x="72" y="112" fill="#d8bd8c" font-family="Segoe UI, Arial, sans-serif"
        font-size="17" letter-spacing="5">GB SOLUTIONS · BHUBANESWAR</text>
  <text x="72" y="470" fill="#f2eee4" font-family="Georgia, 'Times New Roman', serif"
        font-size="66">Interior architecture</text>
  <text x="72" y="544" fill="#f2eee4" font-family="Georgia, 'Times New Roman', serif"
        font-size="66">and turnkey build.</text>
  <text x="72" y="592" fill="#f2eee4" fill-opacity="0.7"
        font-family="Segoe UI, Arial, sans-serif" font-size="21">
    Rooms drawn for Odisha's light, monsoon and the people inside.
  </text>
</svg>`);

await sharp(SOURCE)
  .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ quality: 92 })
  .toFile(TARGET);

console.log(
  `wrote ${TARGET} (${WIDTH}x${HEIGHT}, ${Math.round(statSync(TARGET).size / 1024)}KB)`
);
