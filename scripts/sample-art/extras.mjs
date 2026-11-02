// Everything else that is drawn rather than typed: grain tile, site share image, CV.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { openPress, rng } from './press.mjs';
import { launchBrowser } from '../lib/browser.mjs';

const pub = resolve(dirname(fileURLToPath(import.meta.url)), '../../public');

export async function grain() {
  const s = 256;
  const r = rng(5);
  const a = Buffer.alloc(s * s * 2);
  for (let i = 0; i < s * s; i++) {
    const v = r();
    // Sparse dark specks and paper fibres, as an alpha map. No blending needed.
    a[i * 2] = v > 0.5 ? 20 : 255;
    a[i * 2 + 1] = v > 0.5 ? Math.floor((v - 0.5) * 15) : Math.floor(v * 7);
  }
  await sharp(a, { raw: { width: s, height: s, channels: 2 } }).png({ palette: false, compressionLevel: 9 }).toFile(join(pub, 'grain.png'));
}

export async function share(press) {
  const path = await press.print('misc/og', {
    w: 1200,
    h: 630,
    dsf: 2,
    seed: 121,
    plates: [
      { ink: 'pink', cell: 12, html: `<div class="abs" style="left:36px;right:36px;top:92px"><span class="any" data-fit style="font-stretch:120%">JUNO</span></div>` },
      { ink: 'yellow', band: 0, html: `<div class="abs" style="left:560px;top:150px;width:760px;height:760px;border-radius:50%;background:#000"></div>` },
      { ink: 'blue', cell: 12, html: `<div class="abs" style="left:36px;right:36px;top:346px"><span class="any" data-fit style="font-stretch:96%">REYES</span></div>
        <div class="abs mono" style="left:36px;right:36px;top:38px;display:flex;justify-content:space-between;font-size:20px;font-weight:700"><span>Graphic and motion design</span><span>Mexico City</span></div>` }
    ]
  });
  await sharp(path).resize(1200, 630).jpeg({ quality: 84, mozjpeg: true }).toFile(join(pub, 'og-image.jpg'));
}

export async function cv() {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  const { about } = await import('../../src/content/about.ts');
  const { portfolio } = await import('../../src/portfolio.config.ts');
  const fonts = `file://${join(pub, 'fonts')}`;
  const tmp = join(dirname(fileURLToPath(import.meta.url)), 'out/.tmp/cv.html');
  mkdirSync(dirname(tmp), { recursive: true });
  writeFileSync(tmp, `<!doctype html><meta charset=utf-8><style>
    @font-face{font-family:Anybody;src:url(${fonts}/anybody.woff2);font-weight:100 900;font-stretch:50% 150%}
    @font-face{font-family:Newsreader;src:url(${fonts}/newsreader.woff2);font-weight:200 800}
    @font-face{font-family:Martian;src:url(${fonts}/martian-mono.woff2);font-weight:100 800;font-stretch:75% 112.5%}
    @page{size:A4;margin:0}*{box-sizing:border-box;margin:0}
    body{width:210mm;height:297mm;padding:12mm 13mm;background:#f1ebdd;color:#0a1c69;font-family:Newsreader;font-size:10.4pt;line-height:1.36;position:relative;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    h1{font:900 66pt/.84 Anybody;font-stretch:150%;letter-spacing:-.01em;mix-blend-mode:multiply}
    h1 span{display:block}h1 .b{font-stretch:88%;color:#ff48b0}
    h2{font:700 7.2pt/1.3 Martian;letter-spacing:.02em;margin:0 0 2.4mm;padding-top:1.8mm;border-top:.6mm solid #0a1c69}
    .m{font:500 7.4pt/1.5 Martian}
    .g{display:grid;grid-template-columns:1fr 1.7fr;gap:7mm;margin-top:6mm}
    .row{display:grid;grid-template-columns:22mm 1fr;gap:3mm;margin-bottom:2.2mm}
    ul{list-style:none;padding:0}
    .y{position:absolute;right:-22mm;top:-22mm;width:82mm;height:82mm;border-radius:50%;background:#ffe800;z-index:-1}
  </style><div class=y></div>
  <h1><span>JUNO</span><span class=b>REYES</span></h1>
  <div class=m style="margin-top:5mm;display:flex;justify-content:space-between"><span>${portfolio.role}</span><span>${portfolio.location}</span><span>${portfolio.socials[0].label}: ${portfolio.socials[0].handle}</span></div>
  <p style="font-size:13pt;line-height:1.24;margin-top:5mm;max-width:158mm">${portfolio.bio[0]}</p>
  <div class=g>
    <div>
      <h2>Services</h2><ul>${about.services.map((s) => `<li>${s.name}</li>`).join('')}</ul>
      <h2 style="margin-top:5mm">Selected clients</h2><ul>${about.clients.map((c) => `<li>${c}</li>`).join('')}</ul>
      <h2 style="margin-top:5mm">Education</h2><ul>${about.education.map((c) => `<li>${c}</li>`).join('')}</ul>
    </div>
    <div>
      <h2>Experience</h2>${about.experience.map((e) => `<div class=row><span class=m>${e.years}</span><span><b>${e.title}, ${e.place}.</b> ${e.note}</span></div>`).join('')}
      <h2 style="margin-top:4mm">Recognition</h2>${about.recognition.map((e) => `<div class=row><span class=m>${e.year}</span><span>${e.note}</span></div>`).join('')}
    </div>
  </div>`);
  await page.goto(`file://${tmp}`);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: join(pub, 'juno-reyes-cv.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
}

if (process.argv[1].endsWith('extras.mjs')) {
  await grain();
  const press = await openPress();
  await share(press);
  await press.close();
  await cv();
}
