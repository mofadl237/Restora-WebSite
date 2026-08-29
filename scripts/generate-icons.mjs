import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1e3561"/>
      <stop offset="0.5" stop-color="#132044"/>
      <stop offset="1" stop-color="#0a1226"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="120" fill="url(#bg)"/>
  <g fill="none" stroke="#ef6701" stroke-width="48" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 172 132 L 172 416"/>
    <path d="M 172 152 C 282 152 334 212 288 272 C 258 306 222 312 200 312 L 342 414"/>
  </g>
</svg>`;

async function png(size) {
  return sharp(Buffer.from(SVG), { density: 300 }).resize(size, size).png().toBuffer();
}

async function ico() {
  const sizes = [16, 32, 48];
  const imgs = await Promise.all(sizes.map((s) => png(s)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length;
  const entries = sizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(s >= 256 ? 0 : s, 0);
    e.writeUInt8(s >= 256 ? 0 : s, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(imgs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += imgs[i].length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...imgs]);
}

mkdirSync(path.join(root, "app"), { recursive: true });
mkdirSync(path.join(root, "public"), { recursive: true });

writeFileSync(path.join(root, "app", "icon.svg"), SVG);
writeFileSync(path.join(root, "app", "icon.png"), await png(48));
writeFileSync(path.join(root, "app", "apple-icon.png"), await png(180));
writeFileSync(path.join(root, "public", "restora-icon-512.png"), await png(512));
writeFileSync(path.join(root, "app", "favicon.ico"), await ico());

console.log("icons written: app/icon.svg, app/icon.png, app/apple-icon.png, public/restora-icon-512.png, app/favicon.ico");