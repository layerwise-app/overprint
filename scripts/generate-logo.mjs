#!/usr/bin/env node
// Renders public/logo.svg to public/logo.png and every favicon. Uses a browser
// because the logo relies on real multiply blending.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { launchBrowser } from './lib/browser.mjs';

const pub = resolve(import.meta.dirname, '../public');
const svg = readFileSync(join(pub, 'logo.svg'), 'utf8');
const browser = await launchBrowser();

async function render(size) {
  const context = await browser.newContext({ viewport: { width: size, height: size } });
  const page = await context.newPage();
  await page.setContent(
    `<!doctype html><style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
  );
  const png = await page.screenshot({ type: 'png' });
  await context.close();
  return png;
}

const outputs = {
  'logo.png': 1024,
  'favicon.png': 512,
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512
};
for (const [file, size] of Object.entries(outputs)) {
  writeFileSync(join(pub, file), await sharp(await render(size)).png({ compressionLevel: 9 }).toBuffer());
}

// favicon.ico: PNG entries at 16, 32, and 48 px.
const sizes = [16, 32, 48];
const images = [];
for (const size of sizes) images.push(await sharp(await render(size)).png().toBuffer());
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((size, i) => {
  const at = 6 + i * 16;
  header[at] = size;
  header[at + 1] = size;
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(images[i].length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += images[i].length;
});
writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([header, ...images]));
await browser.close();
console.log('Wrote logo.png and favicons');
