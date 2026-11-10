/**
 * Turns the scanned hand-inked GB Solutions logo (raw/logo-gbs.jpeg) into
 * transparent ink/paper marks, splitting the bird from the wordmark.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "raw/logo-gbs.jpeg";
const OUT = "public/brand";

const INK = { r: 22, g: 24, b: 22 };
const PAPER = { r: 233, g: 226, b: 211 };

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

/** Map a scanned dark-ink-on-paper image to a solid-colour, alpha-cut mark. */
async function inkify(input, color) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const lum = 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
    const a = Math.pow(clamp((236 - lum) / 186), 0.82);
    const p = i * 4;
    out[p] = color.r;
    out[p + 1] = color.g;
    out[p + 2] = color.b;
    out[p + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width, height, channels: 4 } });
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  const trimmed = await sharp(SRC)
    .trim({ threshold: 14 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const W = trimmed.info.width;
  const H = trimmed.info.height;
  console.log("trimmed size:", W, "x", H);

  const grey = await sharp(trimmed.data)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rows = new Array(H).fill(0);
  const cols = new Array(W).fill(0);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (grey.data[y * W + x] < 210) {
        rows[y]++;
        cols[x]++;
      }
    }
  }

  const bands = [];
  for (let y = 0; y < H; y += 10) {
    bands.push(rows.slice(y, y + 10).reduce((a, b) => a + b, 0));
  }
  console.log("row ink per 10px:", bands.join(" "));

  const threshold = Math.max(1, Math.round(W * 0.002));
  const gaps = [];
  let run = null;
  for (let y = 0; y < H; y++) {
    if (rows[y] <= threshold) {
      if (!run) run = { start: y, end: y };
      else run.end = y;
    } else if (run) {
      if (run.end - run.start + 1 >= 4) gaps.push(run);
      run = null;
    }
  }
  if (run) gaps.push(run);
  console.log("gaps:", gaps.map((g) => `${g.start}-${g.end}`).join(" | "));

  const firstGap = gaps.find((g) => g.end > H * 0.06) ?? {
    start: Math.round(H * 0.38),
  };
  const markBottom = Math.min(H - 1, Math.round(firstGap.start));
  let markTop = 0;
  while (markTop < markBottom && rows[markTop] <= threshold) markTop++;

  let left = 0;
  let right = W - 1;
  while (left < W && cols[left] === 0) left++;
  while (right > 0 && cols[right] === 0) right--;

  const pad = Math.round(Math.min(W, H) * 0.02);
  const markLeft = Math.max(0, left - pad);
  const markTopPad = Math.max(0, markTop - pad);
  const mark = {
    left: markLeft,
    top: markTopPad,
    width: Math.min(W - markLeft, right - left + 1 + pad * 2),
    height: Math.min(H - markTopPad, markBottom - markTop + 1 + pad * 2),
  };
  console.log("mark crop:", mark);

  for (const [suffix, color] of [
    ["ink", INK],
    ["paper", PAPER],
  ]) {
    await (await inkify(trimmed.data, color))
      .extract(mark)
      .resize({ width: 640 })
      .png()
      .toFile(path.join(OUT, `mark-${suffix}.png`));

    await (await inkify(trimmed.data, color))
      .resize({ width: 1400 })
      .png()
      .toFile(path.join(OUT, `logo-${suffix}.png`));
  }

  // A square plaster tile with the bird in ink: legible as a tab icon on both
  // light and dark browser chrome, where a transparent mark would disappear.
  async function tile(size, markWidth) {
    const markPng = await (await inkify(trimmed.data, INK))
      .extract(mark)
      .resize({ width: markWidth, height: markWidth, fit: "inside" })
      .png()
      .toBuffer();
    const meta = await sharp(markPng).metadata();
    return sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 231, g: 226, b: 214, alpha: 1 },
      },
    })
      .composite([
        {
          input: markPng,
          left: Math.round((size - meta.width) / 2),
          top: Math.round((size - meta.height) / 2),
        },
      ])
      .png()
      .toBuffer();
  }

  await fs.writeFile("app/icon.png", await tile(512, 372));
  await fs.writeFile("app/apple-icon.png", await tile(180, 138));

  // favicon.ico carries 16/32/48 PNG entries so Windows pinned tabs and older
  // browsers get the bird instead of the framework's default icon.
  // Smaller sizes need a proportionally larger bird, otherwise the drawn line
  // turns to mush in a browser tab.
  const icoSizes = [
    [16, 15],
    [32, 27],
    [48, 39],
  ];
  const entries = [];
  for (const [size, markWidth] of icoSizes) {
    entries.push({ size, png: await tile(size, markWidth) });
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(16 * entries.length);
  let offset = 6 + directory.length;
  entries.forEach((entry, index) => {
    const at = index * 16;
    directory.writeUInt8(entry.size, at);
    directory.writeUInt8(entry.size, at + 1);
    directory.writeUInt8(0, at + 2);
    directory.writeUInt8(0, at + 3);
    directory.writeUInt16LE(1, at + 4);
    directory.writeUInt16LE(32, at + 6);
    directory.writeUInt32LE(entry.png.length, at + 8);
    directory.writeUInt32LE(offset, at + 12);
    offset += entry.png.length;
  });

  await fs.writeFile(
    "app/favicon.ico",
    Buffer.concat([header, directory, ...entries.map((entry) => entry.png)])
  );

  await fs.writeFile(path.join(OUT, "favicon-256.png"), await tile(256, 186));
  console.log("wrote brand assets, icon.png, apple-icon.png and favicon.ico");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
