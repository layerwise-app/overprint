// A small software risograph. Each plate is drawn in HTML/SVG/canvas as black on
// white, captured in Chromium, then "printed": grays become a screen, ink density
// wobbles, pinholes appear, plates slip out of register, and everything multiplies
// onto newsprint. All sample art in public/work goes through here.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { launchBrowser } from '../lib/browser.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const OUT = join(here, 'out');
const FONTS = join(here, 'fonts');
const SITE_FONTS = resolve(here, '../../public/fonts');

export const INK = {
  pink: [255, 72, 176],
  blue: [50, 85, 164],
  yellow: [255, 232, 0]
};
export const PAPER = [241, 235, 221];

const face = (family, file, extra = '') =>
  `@font-face{font-family:'${family}';src:url('file://${file}') format('woff2');font-weight:100 900;${extra}}`;

const BASE_CSS = [
  face('Anybody', `${SITE_FONTS}/anybody.woff2`, 'font-stretch:50% 150%;'),
  face('Martian', `${SITE_FONTS}/martian-mono.woff2`, 'font-stretch:75% 112.5%;'),
  face('Newsreader', `${SITE_FONTS}/newsreader.woff2`),
  face('NewsreaderI', `${SITE_FONTS}/newsreader-italic.woff2`),
  face('Fraunces', `${FONTS}/fraunces.woff2`),
  face('BigShoulders', `${FONTS}/big-shoulders.woff2`),
  face('Unbounded', `${FONTS}/unbounded.woff2`),
  face('Bricolage', `${FONTS}/bricolage.woff2`, 'font-stretch:75% 100%;'),
  face('Archivo', `${FONTS}/archivo.woff2`, 'font-stretch:62% 125%;'),
  face('Bowlby', `${FONTS}/bowlby-one.woff2`),
  face('Instrument', `${FONTS}/instrument-serif.woff2`),
  face('AlfaSlab', `${FONTS}/alfa-slab.woff2`),
  face('Yellowtail', `${FONTS}/yellowtail.woff2`),
  face('Courier', `${FONTS}/courier-prime.woff2`),
  face('Chango', `${FONTS}/chango.woff2`),
  `*{box-sizing:border-box;margin:0;padding:0}
   html,body{background:#fff;color:#000;overflow:hidden;width:100%;height:100%;
     font-family:'Archivo',sans-serif;-webkit-font-smoothing:antialiased}
   .abs{position:absolute}
   .any{font-family:'Anybody';font-weight:900;line-height:.8}
   .mono{font-family:'Martian';font-weight:500;letter-spacing:.01em}
   [data-fit]{display:block;white-space:nowrap;width:max-content;transform-origin:0 0}`
].join('\n');

// Runs in the page: sizes every [data-fit] line to fill its parent's width.
const FIT_SCRIPT = `
<script>
window.__ready = document.fonts.ready.then(async () => {
  await Promise.all([...document.fonts].map((f) => f.load('10px "' + f.family + '"').catch(() => {})));
  for (const el of document.querySelectorAll('[data-fit]')) {
    const target = Number(el.dataset.fit) || el.parentElement.clientWidth;
    el.style.fontSize = '100px';
    el.style.fontSize = (100 * target) / el.getBoundingClientRect().width + 'px';
  }
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  if (window.__draw) await window.__draw();
});
</script>`;

function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lowNoise(w, h, step, rand) {
  const gw = Math.ceil(w / step) + 2;
  const gh = Math.ceil(h / step) + 2;
  const grid = new Float32Array(gw * gh);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const fy = y / step;
    const iy = Math.floor(fy);
    const ty = fy - iy;
    const sy = ty * ty * (3 - 2 * ty);
    for (let x = 0; x < w; x++) {
      const fx = x / step;
      const ix = Math.floor(fx);
      const tx = fx - ix;
      const sx = tx * tx * (3 - 2 * tx);
      const a = grid[iy * gw + ix];
      const b = grid[iy * gw + ix + 1];
      const c = grid[(iy + 1) * gw + ix];
      const d = grid[(iy + 1) * gw + ix + 1];
      out[y * w + x] = (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
    }
  }
  return out;
}

// Threshold function for a halftone: returns 0..1 for a pixel.
function makeScreen({ screen = 'dot', angle = 45, cell = 16 }, rand) {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const k = (Math.PI * 2) / cell;
  if (screen === 'line') {
    return (x, y) => 0.5 + 0.5 * Math.cos((x * cos + y * sin) * k);
  }
  if (screen === 'grain') {
    return () => rand();
  }
  return (x, y) => {
    const u = (x * cos + y * sin) * k;
    const v = (-x * sin + y * cos) * k;
    return 0.5 + 0.25 * (Math.cos(u) + Math.cos(v));
  };
}

/** Prints plates onto paper. Plates are raw grayscale buffers of w × h pixels. */
export function compose({ w, h, plates, seed = 7, paper = PAPER, density = 1, texture = 1 }) {
  const rand = mulberry(seed * 2654435761);
  const out = new Float32Array(w * h * 3);
  // Newsprint: warm base with faint fibres.
  const mottled = lowNoise(w, h, 90, rand);
  for (let i = 0; i < w * h; i++) {
    const n = (rand() - 0.5) * 5 * texture + (mottled[i] - 0.5) * 5 * texture;
    out[i * 3] = paper[0] + n;
    out[i * 3 + 1] = paper[1] + n;
    out[i * 3 + 2] = paper[2] + n;
  }
  plates.forEach((plate, index) => {
    const ink = INK[plate.ink] ?? plate.ink;
    const [ox, oy] = plate.offset ?? [
      Math.round((rand() - 0.5) * 9),
      Math.round((rand() - 0.5) * 9)
    ];
    const threshold = makeScreen(plate, rand);
    const wobble = lowNoise(w, h, 220, mulberry(seed + index * 97));
    const band = plate.band ?? 0.05;
    const phase = rand() * 6;
    const fill = plate.density ?? density;
    for (let y = 0; y < h; y++) {
      const sy = y - oy;
      if (sy < 0 || sy >= h) continue;
      const roller = 1 - band * (0.5 + 0.5 * Math.sin(y / (h / 5.3) + phase));
      for (let x = 0; x < w; x++) {
        const sx = x - ox;
        if (sx < 0 || sx >= w) continue;
        const c = 1 - plate.data[sy * w + sx] / 255;
        if (c < 0.004) continue;
        let d;
        if (c > 0.985) {
          d = 1;
        } else {
          const t = threshold(x, y) * 0.96 + 0.02;
          d = (c - t) / 0.1 + 0.5;
          d = d < 0 ? 0 : d > 1 ? 1 : d;
        }
        if (d === 0) continue;
        // Density: rollers and low-frequency wobble, then pinholes in the solid.
        let density2 = fill * roller * (0.91 + 0.09 * wobble[y * w + x]);
        const r = rand();
        density2 *= 0.93 + 0.07 * r;
        if (r > 0.9965 * (texture > 0 ? 1 : 2)) density2 *= 0.45;
        const cover = d * density2;
        const i = (y * w + x) * 3;
        out[i] *= 1 - cover * (1 - ink[0] / 255);
        out[i + 1] *= 1 - cover * (1 - ink[1] / 255);
        out[i + 2] *= 1 - cover * (1 - ink[2] / 255);
      }
    }
  });
  const bytes = Buffer.alloc(w * h * 3);
  for (let i = 0; i < bytes.length; i++) {
    const v = out[i];
    bytes[i] = v < 0 ? 0 : v > 255 ? 255 : v;
  }
  return bytes;
}

export async function openPress({ scale = 2 } = {}) {
  const browser = await launchBrowser();
  const tmp = join(OUT, '.tmp');
  mkdirSync(tmp, { recursive: true });
  let counter = 0;
  const contexts = new Map();

  async function pageFor(w, h, dsf) {
    const key = `${w}x${h}@${dsf}`;
    if (!contexts.has(key)) {
      const context = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: dsf
      });
      contexts.set(key, await context.newPage());
    }
    return contexts.get(key);
  }

  async function capture(html, w, h, dsf, css = '') {
    const page = await pageFor(w, h, dsf);
    const file = join(tmp, `plate-${counter++ % 8}.html`);
    writeFileSync(
      file,
      `<!doctype html><meta charset=utf-8><style>${BASE_CSS}${css}</style><body>${html}${FIT_SCRIPT}</body>`
    );
    await page.goto(`file://${file}`);
    await page.evaluate(() => window.__ready);
    return page.screenshot({ type: 'png' });
  }

  async function plateBuffer(plate, w, h, dsf, css) {
    const png = await capture(plate.html, w, h, dsf, css);
    const { data } = await sharp(png).greyscale().raw().toBuffer({ resolveWithObject: true });
    return data;
  }

  return {
    capture,
    /** Prints plates and returns raw RGB, for video frames. */
    async printRaw({ w, h, plates, seed, css, dsf = scale, ...rest }) {
      const pw = Math.round(w * dsf);
      const ph = Math.round(h * dsf);
      const data = [];
      for (const plate of plates) data.push(await plateBuffer(plate, w, h, dsf, css));
      return {
        pw,
        ph,
        raw: compose({
          w: pw,
          h: ph,
          seed,
          ...rest,
          plates: plates.map((plate, i) => ({ ...plate, data: data[i] }))
        })
      };
    },
    /** Prints plates to scripts/sample-art/out/<name>.png. */
    async print(name, { w, h, plates, seed = 7, css, dsf = scale, ...rest }) {
      const started = Date.now();
      const { raw, pw, ph } = await this.printRaw({ w, h, plates, seed, css, dsf, ...rest });
      const path = join(OUT, `${name}.png`);
      mkdirSync(dirname(path), { recursive: true });
      await sharp(raw, { raw: { width: pw, height: ph, channels: 3 } })
        .png({ compressionLevel: 3 })
        .toFile(path);
      console.log(`${name}.png ${pw}×${ph} ${Date.now() - started}ms`);
      return path;
    },
    /** Lays finished prints out in full colour, on paper, with a light grain. */
    async layout(name, { w, h, html, css, dsf = scale }) {
      const png = await capture(html, w, h, dsf, css);
      const path = join(OUT, `${name}.png`);
      mkdirSync(dirname(path), { recursive: true });
      await sharp(png).flatten({ background: { r: 241, g: 235, b: 221 } }).png({ compressionLevel: 3 }).toFile(path);
      console.log(`${name}.png layout`);
      return path;
    },
    async close() {
      await browser.close();
    }
  };
}

export function rng(seed) {
  return mulberry(seed * 2654435761);
}

export const img = (name) => `file://${join(OUT, `${name}.png`)}`;
