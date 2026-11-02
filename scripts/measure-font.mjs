#!/usr/bin/env node
// Measures the display font's glyph widths along its width axis, so headlines can
// be set flush to their lines on the server with no client-side measuring.
// Run `pnpm measure-font` after changing fonts.display in src/portfolio.config.ts.
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { launchBrowser } from './lib/browser.mjs';
import { portfolio } from '../src/portfolio.config.ts';

const root = resolve(import.meta.dirname, '..');
const font = portfolio.fonts.display;
const min = font.minWidth;
const max = font.maxWidth;
const stops = [0, 0.25, 0.5, 0.75, 1].map((t) => min + (max - min) * t);
const glyphs = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZÑÁÉÍÓÚÜ',
  ...'abcdefghijklmnopqrstuvwxyzñáéíóúü',
  ...'0123456789 .,:;!?¡¿&-–—/+\'"()'
];

const browser = await launchBrowser();
const page = await browser.newPage();
await page.goto(`file://${join(root, 'public/fonts')}/`).catch(() => {});
await page.setContent(`<!doctype html><style>
  @font-face{font-family:M;src:url('file://${join(root, 'public', font.file)}');font-weight:${font.weight};font-stretch:${font.stretch}}
  span{font-family:M;font-size:1000px;font-weight:${font.headlineWeight};font-kerning:none;white-space:pre;position:absolute}
</style><span id=s>A</span>`);
const table = await page.evaluate(
  async ({ glyphs, stops }) => {
    await document.fonts.load('900 100px M');
    await document.fonts.ready;
    const el = document.getElementById('s');
    const out = {};
    for (const g of glyphs) {
      el.textContent = g;
      out[g] = stops.map((w) => {
        el.style.fontStretch = `${w}%`;
        return Math.round(el.getBoundingClientRect().width);
      });
    }
    return out;
  },
  { glyphs, stops }
);
await browser.close();

writeFileSync(
  join(root, 'src/lib/display-metrics.gen.ts'),
  `// Written by scripts/measure-font.mjs. Glyph advances in 1/1000 em at each stop.\nexport const displayMetrics = ${JSON.stringify({ family: font.family, stops, weight: font.headlineWeight, glyphs: table })};\n`
);
console.log(`Measured ${glyphs.length} glyphs of ${font.family} at ${stops.join(', ')}. A: ${table.A}`);
