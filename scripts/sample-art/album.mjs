// Archivo Temblor: four LP reissues for Discos Temblor. Each cover's artwork is
// computed from a recording's own subject and shares one sleeve grid.
import { openPress, img } from './press.mjs';

const S = 1440;

// Canvas field: `fn(x,y)` returns coverage 0..1, drawn at device resolution.
const field = (id, fn, top = 0) => `
  <canvas id="${id}" class="abs" style="left:0;top:${top}px;width:${S}px;height:${S - top}px"></canvas>
  <script>
  (window.__draws = window.__draws || []).push(() => {
    const c = document.getElementById('${id}');
    const dsf = devicePixelRatio; c.width = ${S} * dsf; c.height = ${S - top} * dsf;
    const g = c.getContext('2d'); const im = g.createImageData(c.width, c.height); const d = im.data;
    const fn = ${fn};
    for (let y = 0, i = 0; y < c.height; y++) for (let x = 0; x < c.width; x++, i += 4) {
      const v = 255 * (1 - Math.max(0, Math.min(1, fn(x / dsf, y / dsf))));
      d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
  });
  window.__draw = () => window.__draws.forEach((f) => f());
  </script>`;

const band = (cat, artist) => `
  <div class="abs mono" style="left:44px;right:44px;top:34px;display:flex;justify-content:space-between;font-size:21px;font-weight:600">
    <span>${cat}</span><span>${artist}</span><span>Discos Temblor</span></div>`;

const title = (lines, style = '') =>
  `<div class="abs" style="left:40px;bottom:32px;font-family:Fraunces;font-weight:900;font-size:216px;line-height:.86;letter-spacing:-.03em;font-variation-settings:'opsz' 144,'SOFT' 100,'WONK' 1;${style}">${lines.join('<br>')}</div>`;

export const covers = {
  altiplano: {
    plates: [
      { ink: 'blue', html: field('a', `(x, y) => {
          const f = Math.sin(x * .0042 + 1.2) * 1.5 + Math.cos(y * .0052 - x * .0018) * 1.5 + Math.sin((x + y) * .0088) * .55 + Math.hypot(x - 980, y - 400) * .0052;
          const w = Math.sin(f * 15);
          return Math.max(0, Math.min(1, (w - .02) * 12));
        }`, 96) + band('DT-041', 'Los Hermanos Zárate') + title(['Alti-', 'plano'], 'color:#fff;-webkit-text-stroke:26px #fff;paint-order:stroke;') },
      { ink: 'pink', screen: 'dot', html: `<div class="abs" style="left:640px;top:190px;width:640px;height:640px;border-radius:50%;background:#000"></div>
          ${title(['Alti-', 'plano'], 'color:#000;')}` }
    ]
  },
  agua: {
    plates: [
      { ink: 'yellow', density: 1, band: 0, html: `<div class="abs" style="inset:96px 0 0 0;background:#000"></div>` },
      { ink: 'blue', html: field('b', `(x, y) => {
          const a = Math.hypot(x - 360, y - 330), b = Math.hypot(x - 1090, y - 930);
          const w = Math.sin(a * .062) + Math.sin(b * .062);
          return Math.max(0, Math.min(1, (w + .1) * 7));
        }`, 96) + band('DT-042', 'Marisol Cantú') +
        `<div class="abs" style="left:0;right:0;bottom:0;height:520px;background:#fff"></div>` + title(['Agua que', 'recuerda'], 'font-size:192px;color:#000;') }
    ]
  },
  sonidero: {
    plates: [
      { ink: 'yellow', html: `<div class="abs" style="inset:96px 0 0 0;background:#000"></div>` },
      { ink: 'pink', cell: 18, html: `<svg class="abs" style="inset:0" width="${S}" height="${S}">
          ${Array.from({ length: 72 }, (_, i) => `<path d="M720 760 L${720 + Math.cos((i / 72) * 6.283) * 1400} ${760 + Math.sin((i / 72) * 6.283) * 1400} L${720 + Math.cos(((i + 0.5) / 72) * 6.283) * 1400} ${760 + Math.sin(((i + 0.5) / 72) * 6.283) * 1400} Z" fill="#000"/>`).join('')}
          <circle cx="720" cy="760" r="470" fill="#fff"/>
          ${[440, 380, 320, 260, 200].map((r, i) => `<circle cx="720" cy="760" r="${r}" fill="${i % 2 ? '#fff' : '#000'}"/>`).join('')}
          <circle cx="720" cy="760" r="130" fill="#000"/><circle cx="720" cy="760" r="34" fill="#fff"/>
          <rect width="${S}" height="96" fill="#fff"/></svg>
          ${band('DT-043', 'Sonido Gavilán')}` },
      { ink: 'blue', html: `<div class="abs" style="left:34px;right:34px;bottom:30px"><span data-fit style="font-family:Bowlby;line-height:.9">SONIDERO 79</span></div>` }
    ]
  },
  nocturno: {
    plates: [
      { ink: 'pink', html: `<svg class="abs" style="inset:0" width="${S}" height="${S}"><circle cx="1010" cy="430" r="250" fill="#000"/>
          ${Array.from({ length: 44 }, (_, i) => `<circle cx="${(i * 197) % 1380 + 30}" cy="${870 + ((i * 89) % 150)}" r="${4 + (i % 5) * 3}" fill="#000"/>`).join('')}</svg>` },
      { ink: 'blue', band: 0.03, html: `<div class="abs" style="inset:96px 0 0 0;background:#000"></div>
          <svg class="abs" style="inset:0" width="${S}" height="${S}"><path d="M920 180 a250 250 0 1 0 250 460 a300 300 0 1 1 -250 -460 Z" fill="#fff"/>
          ${Array.from({ length: 16 }, (_, i) => `<rect x="0" y="${900 + i * 34}" width="${S}" height="${3 + i * 1.3}" fill="#fff"/>`).join('')}</svg>
          ${band('DT-044', 'Trío Apizaco')}
          <div class="abs" style="left:40px;top:130px;color:#fff;font-family:Instrument;font-size:236px;line-height:.86;letter-spacing:-.02em">Noc-<br>turno</div>
          <div class="abs" style="left:44px;top:560px;color:#fff;font-family:Instrument;font-size:72px">para Xochimilco</div>` }
    ]
  }
};

const tracks = [
  'Cuesta de Tepeyac', 'El camión de las seis', 'Lluvia sobre Texcoco', 'Maguey (primera toma)', 'Canción del agrimensor',
  'Sierra sin nombre', 'Polvo y clarinete', 'Las antenas de Toluca', 'Maguey (segunda toma)', 'Regreso'
];

export async function run() {
  const press = await openPress();
  for (const [name, c] of Object.entries(covers)) {
    await press.print(`album/${name}`, { w: S, h: S, plates: c.plates, seed: name.length * 7 });
  }
  // Back cover, spine, and both centre labels, flat as they go to the plant.
  const tracksHtml = tracks
    .map((t, i) => `<div style="display:flex;justify-content:space-between;border-top:2px solid #000;padding:9px 0 7px;font-size:17px" class="mono"><span>${i < 5 ? 'A' : 'B'}${i < 5 ? i + 1 : i - 4}&nbsp;&nbsp;${t}</span><span>${2 + ((i * 7) % 5)}:${String((i * 23 + 11) % 60).padStart(2, '0')}</span></div>`)
    .join('');
  const label = (x, y, side) => `<div class="abs" style="left:${x}px;top:${y}px;width:440px;height:440px;border-radius:50%;background:#000"></div>
     <div class="abs" style="left:${x + 196}px;top:${y + 196}px;width:48px;height:48px;border-radius:50%;background:#fff"></div>
     <div class="abs mono" style="left:${x}px;top:${y + 90}px;width:440px;text-align:center;color:#fff;font-size:15px;line-height:1.4">Discos Temblor DT-041<br>Lado ${side}</div>
     <div class="abs" style="left:${x}px;top:${y + 270}px;width:440px;text-align:center;color:#fff;font-family:Fraunces;font-weight:900;font-size:42px">Altiplano</div>`;
  await press.print('album/altiplano-sleeve', {
    w: 1440,
    h: 810,
    seed: 51,
    plates: [
      { ink: 'blue', html: `<div class="abs" style="left:36px;top:36px;width:640px;height:738px;border:3px solid #000;padding:30px">
            <div style="font-family:Fraunces;font-weight:900;font-size:92px;line-height:.9;letter-spacing:-.02em;font-variation-settings:'opsz' 144,'SOFT' 100,'WONK' 1">Altiplano</div>
            <div class="mono" style="font-size:16px;margin:12px 0 26px">Los Hermanos Zárate, 1974. Remasterizado de la cinta original, 2025.</div>
            ${tracksHtml}
            <div class="mono" style="position:absolute;left:30px;right:30px;bottom:26px;font-size:12px;line-height:1.55">Grabado en dos tardes en Apan, Hidalgo. Portada calculada a partir de las curvas de nivel del lugar. Diseño: Juno Reyes. Impreso a dos tintas.</div></div>
          <div class="abs mono" style="left:708px;top:36px;width:46px;height:738px;border:3px solid #000;writing-mode:vertical-rl;display:flex;align-items:center;justify-content:space-between;padding:18px 0;font-size:15px"><span>DT-041</span><span>Los Hermanos Zárate</span><span>Altiplano</span></div>
          ${label(830, 36, 'A')}` },
      { ink: 'pink', cell: 16, html: `${label(830 + 90, 340, 'B')}` }
    ]
  });
  // The whole series on one sheet, as the record shop gets it.
  await press.layout('album/series', {
    w: 1440,
    h: 1000,
    html: `<div class="abs" style="inset:0;background:#FFE800"></div>
      ${Object.keys(covers)
        .map((n, i) => `<img src="${img(`album/${n}`)}" class="abs" style="left:${i % 2 ? 950 : 470}px;top:${i < 2 ? 20 : 510}px;width:470px;height:470px">`)
        .join('')}
      <div class="abs any" style="left:36px;top:30px;font-size:96px;font-stretch:58%;line-height:.86;color:#26396f">ARCHIVO<br>TEMBLOR</div>
      <div class="abs mono" style="left:36px;bottom:36px;width:360px;font-size:15px;line-height:1.6;color:#26396f;font-weight:600">Serie 01, DT-041 a DT-044. Cuatro discos, un corte de 8 mm arriba, dos tintas por manga.</div>`
  });
  await press.close();
}

if (process.argv[1].endsWith('album.mjs')) await run();
