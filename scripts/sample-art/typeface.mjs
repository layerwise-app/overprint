// TEZONTLE: an experimental modular typeface with a porosity axis, named after the
// red volcanic stone of old Mexico City. Every glyph is drawn on a 5 × 5 grid from
// five modules; pits are punched through the top plate so the second ink shows.
import { openPress, rng } from './press.mjs';

const G = {
  A: ['a###b', '#...#', '#####', '#...#', '#...#'],
  B: ['####b', '#...#', '####c', '#...b'.replace('b', '#'), '####c'],
  C: ['a###b', '#....', '#....', '#....', 'd###c'],
  D: ['###b.', '#..d#'.replace('d', '.'), '#...#', '#...#', '####c'],
  E: ['#####', '#....', '####.', '#....', '#####'],
  F: ['#####', '#....', '####.', '#....', '#....'],
  G: ['a###b', '#....', '#..##', '#...#', 'd###c'],
  H: ['#...#', '#...#', '#####', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '#..#.', 'd##c.'],
  K: ['#...#', '#..ac', '###c.', '#..db', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#####'],
  M: ['#b.a#', '#d#c#', '#...#', '#...#', '#...#'],
  N: ['#b..#', '#db.#', '#.#.#', '#.db#', '#..d#'],
  Ñ: ['a###b', '#b..#', '#db.#', '#.db#', '#..d#'],
  O: ['a###b', '#...#', '#...#', '#...#', 'd###c'],
  P: ['####b', '#...#', '####c', '#....', '#....'],
  Q: ['a###b', '#...#', '#...#', '#.db#', 'd##db'],
  R: ['####b', '#...#', '####c', '#.db.', '#..db'],
  S: ['a####', '#....', 'd###b', '....#', '####c'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', 'd###c'],
  V: ['#...#', '#...#', '#...#', 'db.ac', '.d#c.'],
  W: ['#...#', '#...#', '#...#', '#a#b#', '#c.d#'],
  X: ['#...#', 'db.ac', '.d#c.', '.a#b.', 'ac.db'],
  Y: ['#...#', 'db.ac', '.d#c.', '..#..', '..#..'],
  Z: ['#####', '...ac', '..ac.', '.ac..', '#####'],
  0: ['a###b', '#..a#', '#.ac#', '#ac.#', 'd###c'],
  1: ['a##..', '..#..', '..#..', '..#..', '#####'],
  2: ['a###b', '....#', 'a###c', '#....', '#####'],
  3: ['####b', '....#', '.###.', '....#', '####c'],
  4: ['#...#', '#...#', 'd####', '....#', '....#'],
  5: ['#####', '#....', '####b', '....#', '####c'],
  6: ['a###.', '#....', '####b', '#...#', 'd###c'],
  7: ['#####', '...ac', '..ac.', '..#..', '..#..'],
  8: ['a###b', '#...#', '.###.', '#...#', 'd###c'],
  9: ['a###b', '#...#', 'd####', '....#', '.###c'],
  ' ': ['.....', '.....', '.....', '.....', '.....']
};

// One module: square or one of four quarter-round corners.
function cellPath(ch, x, y, s) {
  const e = x + s;
  const f = y + s;
  switch (ch) {
    case '#': return `M${x} ${y}H${e}V${f}H${x}Z`;
    case 'a': return `M${x} ${f}A${s} ${s} 0 0 1 ${e} ${y}V${f}Z`;
    case 'b': return `M${x} ${y}A${s} ${s} 0 0 1 ${e} ${f}H${x}Z`;
    case 'c': return `M${e} ${y}A${s} ${s} 0 0 1 ${x} ${f}V${y}Z`;
    case 'd': return `M${x} ${y}A${s} ${s} 0 0 0 ${e} ${f}V${y}Z`;
    default: return '';
  }
}

function glyph(ch, x, y, s) {
  const rows = G[ch] ?? G[' '];
  let d = '';
  rows.forEach((row, ry) => {
    [...row].forEach((c, rx) => {
      d += cellPath(c, x + rx * s, y + ry * s, s);
    });
  });
  return d;
}

// Pits: seeded per glyph, so an A is always the same stone.
function pits(ch, x, y, s, porosity, seed = 0) {
  if (porosity <= 0) return '';
  const rows = G[ch] ?? G[' '];
  const r = rng(ch.charCodeAt(0) * 13 + seed + 1);
  let out = '';
  rows.forEach((row, ry) => {
    [...row].forEach((c, rx) => {
      const n = c === '#' ? 12 : c === '.' ? 0 : 6;
      for (let i = 0; i < n; i++) {
        const px = rx * s + s * (0.08 + r() * 0.84);
        const py = ry * s + s * (0.08 + r() * 0.84);
        const big = r();
        if (big > porosity * 1.25) continue;
        // Keep pits inside rounded corners.
        const cx = (px - rx * s) / s;
        const cy = (py - ry * s) / s;
        const corner = { a: [1, 1], b: [0, 1], c: [0, 0], d: [1, 0] }[c];
        if (corner && Math.hypot(cx - corner[0], cy - corner[1]) > 0.86) continue;
        const rad = s * (0.025 + 0.135 * porosity * Math.pow(big, 1.4));
        out += `<circle cx="${x + px}" cy="${y + py}" r="${rad.toFixed(1)}" fill="#fff"/>`;
      }
    });
  });
  return out;
}

/** Sets a line of Tezontle. Returns the blue plate (with pits) and the solid backing. */
function line(text, x, y, s, porosity = 0.5, gap = 1) {
  let d = '';
  let holes = '';
  let cx = x;
  for (const ch of text) {
    d += glyph(ch, cx, y, s);
    holes += pits(ch, cx, y, s, porosity);
    cx += s * (5 + gap);
  }
  return { top: `<path d="${d}" fill="#000"/>${holes}`, back: `<path d="${d}" fill="#000"/>` };
}

const svg = (w, h, inner) => `<svg class="abs" style="inset:0" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;

export async function run() {
  const press = await openPress();

  // Cover poster: TEZ / ONT / LE fills the sheet.
  {
    const W = 1440;
    const H = 1920;
    const s = 72;
    const rows = ['TEZ', 'ONT', 'LE'].map((t, i) => line(t, 56, 150 + i * 450, s, 0.72, 0.88));
    await press.print('typeface/cover', {
      w: W,
      h: H,
      seed: 101,
      plates: [
        { ink: 'yellow', band: 0.02, html: svg(W, H, rows.map((r) => r.back).join('')) + `<div class="abs" style="left:0;right:0;top:1500px;bottom:0;background:#000"></div>` },
        { ink: 'blue', html: svg(W, H, rows.map((r) => r.top).join('')) + `
           <div class="abs mono" style="left:56px;right:56px;top:56px;display:flex;justify-content:space-between;font-size:26px;font-weight:600"><span>Espécimen 01</span><span>Tipografía modular</span><span>Juno Reyes, 2024</span></div>
           <div class="abs" style="left:56px;top:1540px;width:1320px;font-family:Fraunces;font-weight:700;font-size:82px;line-height:1.02;font-variation-settings:'opsz' 144,'SOFT' 50">Una piedra que flota. Una letra con aire adentro.</div>
           <div class="abs mono" style="left:56px;right:56px;bottom:50px;display:flex;justify-content:space-between;font-size:22px;font-weight:600"><span>37 glifos</span><span>5 módulos</span><span>Porosidad 0–100</span></div>` }
      ]
    });
  }

  // Glyph chart.
  {
    const W = 1440;
    const H = 1018;
    const chars = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789'.split('');
    const s = 19;
    const cols = 10;
    let top = '';
    let back = '';
    let labels = '';
    chars.forEach((c, i) => {
      const x = 56 + (i % cols) * 134;
      const y = 150 + Math.floor(i / cols) * 196;
      const l = line(c, x, y, s, 0.55);
      top += l.top;
      back += l.back;
      labels += `<div class="abs mono" style="left:${x}px;top:${y + 104}px;font-size:12px;font-weight:600">${c}&nbsp;&nbsp;U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}</div>`;
    });
    await press.print('typeface/glyphs', {
      w: W,
      h: H,
      seed: 102,
      plates: [
        { ink: 'yellow', html: svg(W, H, back) },
        { ink: 'blue', html: svg(W, H, top) + labels + `
          <div class="abs any" style="left:56px;top:34px;font-size:82px;font-stretch:130%">37 GLIFOS</div>
          <div class="abs mono" style="right:56px;top:44px;width:430px;text-align:right;font-size:15px;line-height:1.55">Mayúsculas, Ñ como glifo propio, cifras. Sin minúsculas: la piedra no se escribe, se talla.</div>` }
      ]
    });
  }

  // Porosity scale: one word through the axis.
  {
    const W = 1440;
    const H = 1920;
    const steps = [0, 0.25, 0.5, 0.75, 1];
    const s = 37;
    let top = '';
    let back = '';
    steps.forEach((p, i) => {
      const l = line('PIEDRA', 56, 205 + i * 330, s, p, 0.85);
      top += l.top;
      back += l.back;
    });
    await press.print('typeface/porosity', {
      w: W,
      h: H,
      seed: 103,
      plates: [
        { ink: 'pink', cell: 18, html: svg(W, H, back) },
        { ink: 'blue', html: svg(W, H, top) + steps.map((p, i) => `<div class="abs mono" style="left:56px;top:${158 + i * 330}px;font-size:20px;font-weight:700">Poro ${String(Math.round(p * 100)).padStart(3, '0')}</div>`).join('') + `
           <div class="abs any" style="left:56px;top:40px;font-size:82px;font-stretch:58%">POROSIDAD</div>
           <div class="abs mono" style="left:56px;right:56px;bottom:50px;font-size:17px;line-height:1.55">En 000 es señalética. En 100 solo funciona arriba de 200 pt, y ahí es donde se pone interesante: la segunda tinta sube por los poros.</div>` }
      ]
    });
  }

  // Construction: one letter on its grid with the five modules.
  {
    const W = 1440;
    const H = 1018;
    const s = 150;
    const x0 = 76;
    const y0 = 110;
    const r = line('R', x0, y0, s, 0.5);
    let gridLines = '';
    for (let i = 0; i <= 5; i++) {
      gridLines += `<path d="M${x0 + i * s} ${y0 - 34} V${y0 + 5 * s + 34} M${x0 - 34} ${y0 + i * s} H${x0 + 5 * s + 34}" stroke="#000" stroke-width="2"/>`;
    }
    const modules = ['#', 'a', 'b', 'c', 'd'];
    const modHtml = modules.map((m, i) => `<path d="${cellPath(m, 910 + (i % 5) * 96, 138, 84)}" fill="#000"/>`).join('');
    await press.print('typeface/construction', {
      w: W,
      h: H,
      seed: 104,
      plates: [
        { ink: 'yellow', html: svg(W, H, r.back + modHtml) },
        { ink: 'blue', html: svg(W, H, r.top + gridLines + modHtml) + `
          <div class="abs mono" style="left:910px;top:56px;font-size:20px;font-weight:700;width:460px">Cinco módulos</div>
          <div class="abs" style="left:910px;top:270px;width:470px;font-family:Fraunces;font-weight:600;font-size:40px;line-height:1.1;font-variation-settings:'opsz' 144,'SOFT' 50">Un cuadrado y cuatro cuartos de círculo. Nada más se puede dibujar.</div>
          <div class="abs" style="left:910px;top:490px;width:470px;font-family:Newsreader;font-size:24px;line-height:1.35">La regla obliga a resolver la R, la K y la Ñ con la misma pieza que hace una O. Las diagonales desaparecen; quedan curvas cortas que se enganchan. Cada glifo guarda sus poros en una semilla, así que una A siempre es la misma piedra.</div>
          <div class="abs mono" style="left:910px;bottom:50px;font-size:15px">Retícula 5 × 5, sin ajustes ópticos, a propósito</div>` }
      ]
    });
  }

  // In use: a sentence at scale, on a flood of the second ink.
  {
    const W = 1440;
    const H = 1018;
    const rows = ['LA PIEDRA', 'QUE FLOTA'].map((t, i) => line(t, 56, 100 + i * 262, 24.5, 0.65, 0.8));
    await press.print('typeface/in-use', {
      w: W,
      h: H,
      seed: 105,
      plates: [
        { ink: 'yellow', band: 0.02, html: `<div class="abs" style="inset:0;background:#000"></div>` },
        { ink: 'blue', html: svg(W, H, rows.map((r) => r.top).join('')) + `
          <div class="abs mono" style="left:56px;top:40px;font-size:20px;font-weight:700">Tezontle Poro 065, a 122 pt</div>
          <div class="abs" style="left:56px;top:660px;width:760px;font-family:Newsreader;font-size:30px;line-height:1.3">El tezontle es la piedra roja de los palacios del Centro. Es tan porosa que un trozo del tamaño de un puño pesa como una naranja. Sobre el lago, los mexicas la usaron porque no se hundía.</div>
          <div class="abs mono" style="right:56px;bottom:50px;width:420px;font-size:15px;line-height:1.55;text-align:right">Licencia libre SIL OFL. Se distribuye como variable con un eje, POROS.</div>` }
      ]
    });
  }

  // Waterfall: the glyphs at text sizes, to show where the axis stops working.
  {
    const W = 1440;
    const H = 1018;
    const sizes = [[11.8, 'SOBRE LAGO Y PIEDRA', 0.6], [9.6, 'NIÑO QUE FUE AL LAGO', 0.4], [7.6, 'LAS CALLES DEL CENTRO VIEJO', 0.2], [4.8, 'VEINTE PIEDRAS LLEVADAS AL AGUA POR UN CAMINO', 0.08], [2.9, 'A QUIEN MADRUGA Y TALLA DESDE LAS CINCO LA CIUDAD LE DEBE UNA FACHADA ROJA', 0]];
    let y = 96;
    let top = '';
    let back = '';
    let notes = '';
    sizes.forEach(([s, t, p]) => {
      const l = line(t, 56, y, s, p, 0.9);
      top += l.top;
      back += l.back;
      notes += `<div class="abs mono" style="left:56px;top:${y - 26}px;font-size:13px;font-weight:600">${Math.round(s * 5 * 1.5)} pt, poro ${String(Math.round(p * 100)).padStart(3, '0')}</div>`;
      y += s * 5 + 88;
    });
    await press.print('typeface/waterfall', {
      w: W,
      h: H,
      seed: 106,
      plates: [
        { ink: 'pink', cell: 16, html: svg(W, H, back) },
        { ink: 'blue', html: svg(W, H, top) + notes + `<div class="abs any" style="right:56px;bottom:36px;font-size:66px;font-stretch:150%">CASCADA</div>` }
      ]
    });
  }
  await press.close();
}

if (process.argv[1].endsWith('typeface.mjs')) await run();
