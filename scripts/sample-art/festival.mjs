// GRANIZO: identity for a three-day music festival. Hail is the system: a grid of
// dots that grows heavier from Friday to Sunday, and a logotype that falls with it.
import { openPress } from './press.mjs';

const W = 1440;
const H = 1920;

// Hail: dot radius grows downward. Used for everything from posters to wristbands.
const hail = (w, h, cell, { max = 0.5, min = 0.05, power = 1.6, x0 = 0, y0 = 0 } = {}) => {
  let s = '';
  const rows = Math.ceil(h / cell);
  const cols = Math.ceil(w / cell);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const t = Math.pow((y + 0.5) / rows, power);
      const jitter = ((x * 37 + y * 17) % 7) / 7;
      const r = cell * (min + (max - min) * Math.min(1, t * (0.72 + jitter * 0.5)));
      s += `<circle cx="${x0 + x * cell + cell / 2}" cy="${y0 + y * cell + cell / 2}" r="${r.toFixed(1)}" fill="#000"/>`;
    }
  }
  return s;
};

const acts = {
  headline: ['Las Hijas del Sismo', 'Perro Lunar', 'Marisol Cantú'],
  second: ['Sonido Gavilán', 'Niña Diésel', 'Ruido Blanco', 'Chinampa Dub', 'Trío Apizaco'],
  third: ['Marimba Fantasma', 'Coro de Cisternas', 'Ana Tlalpan', 'Las Azoteas', 'DJ Tortuga', 'Banda Tepito', 'Tres Focos', 'Lago Seco', 'Los Talavera', 'Cuatro Caminos', 'Vértigo Norte', 'Sonido Pirata']
};

export async function run() {
  const press = await openPress();

  await press.print('festival/poster', {
    w: W,
    h: H,
    seed: 91,
    plates: [
      { ink: 'yellow', band: 0.02, html: `<div class="abs" style="inset:0;background:#000"></div>` },
      { ink: 'pink', html: `<svg class="abs" style="inset:0" width="${W}" height="${H - 600}">${hail(W, H - 600, 72, { max: 0.58, min: 0.03, power: 1.05 })}</svg>
         <div class="abs" style="left:44px;right:44px;top:44px"><span data-fit style="font-family:Unbounded;font-weight:900;letter-spacing:-.045em;line-height:.9">GRANIZO</span></div>` },
      { ink: 'blue', cell: 14, html: `
         <div class="abs" style="left:44px;right:44px;bottom:96px">
           <div><span class="any" data-fit style="font-stretch:150%;line-height:.9">12 13 14</span></div>
           <div style="margin-top:6px"><span class="any" data-fit style="font-stretch:54%;line-height:.86;font-size:10px">JUNIO DE 2026</span></div></div>
         <div class="abs mono" style="left:44px;right:44px;bottom:40px;display:flex;justify-content:space-between;font-size:26px;font-weight:700"><span>Ciudad Deportiva</span><span>Tres días, 20 actos</span><span>Lluvia o sol</span></div>` }
    ]
  });

  const lineup = `
    <div class="abs" style="left:44px;right:44px;top:290px">
      ${acts.headline.map((a, i) => `<div><span class="any" data-fit style="font-stretch:${[58, 138, 96][i]}%;line-height:.92">${a.toUpperCase()}</span></div>`).join('')}
      <div style="margin-top:34px;font-family:Anybody;font-weight:800;font-size:84px;line-height:1.04;font-stretch:72%">${acts.second.join(' / ')}</div>
      <div class="mono" style="margin-top:40px;font-size:37px;line-height:1.5;font-weight:600">${acts.third.join(' · ')}</div>
    </div>`;
  await press.print('festival/lineup', {
    w: W,
    h: H,
    seed: 92,
    plates: [
      { ink: 'yellow', band: 0.02, html: `<div class="abs" style="left:0;right:0;top:0;height:250px;background:#000"></div>
           <svg class="abs" style="left:0;bottom:0" width="${W}" height="480">${hail(W, 480, 60, { max: 0.6, min: 0.06, power: 0.8 })}</svg>` },
      { ink: 'pink', html: `<div class="abs" style="left:44px;right:44px;top:36px"><span data-fit style="font-family:Unbounded;font-weight:900;letter-spacing:-.045em;line-height:.9">GRANIZO</span></div>
           <svg class="abs" style="left:0;bottom:0" width="${W}" height="300">${hail(W, 300, 60, { max: 0.44, min: 0.05, power: 1 })}</svg>` },
      { ink: 'blue', cell: 14, html: lineup + `<div class="abs mono" style="left:44px;right:44px;bottom:40px;display:flex;justify-content:space-between;font-size:26px;font-weight:700"><span>12, 13, 14 junio 2026</span><span>Ciudad Deportiva</span></div>` }
    ]
  });

  // Identity sheet: logotype, weights of hail, and the dot-count day code.
  const days = [['VIE', 1, 0.18], ['SÁB', 2, 0.32], ['DOM', 3, 0.5]];
  await press.print('festival/identity', {
    w: W,
    h: 1018,
    seed: 93,
    plates: [
      { ink: 'yellow', html: `<div class="abs" style="left:0;top:0;width:${W}px;height:400px;background:#000"></div>
         ${days.map((_, i) => `<div class="abs" style="left:${i * 480}px;top:400px;width:480px;height:360px;background:#000;opacity:${[0, 0.34, 0.7][i]}"></div>`).join('')}` },
      { ink: 'pink', html: `<div class="abs" style="left:44px;right:44px;top:78px"><span data-fit style="font-family:Unbounded;font-weight:900;letter-spacing:-.045em;line-height:.9">GRANIZO</span></div>
         <svg class="abs" style="left:0;top:400px" width="${W}" height="360">
           ${days.map(([, , m], i) => hail(480, 360, 40, { x0: i * 480, max: m, min: m * 0.3, power: 0.5 })).join('')}</svg>` },
      { ink: 'blue', cell: 14, html: `
         <div class="abs mono" style="left:44px;right:44px;top:24px;display:flex;justify-content:space-between;font-size:17px;font-weight:600"><span>Marca principal, tinta rosa sobre amarillo</span><span>Reducción mínima 18 mm</span></div>
         ${days.map(([d], i) => `<div class="abs any" style="left:${i * 480 + 40}px;top:640px;font-size:96px;font-stretch:${[60, 100, 150][i]}%">${d}</div>`).join('')}
         <div class="abs" style="left:44px;top:792px;width:620px;font-family:Newsreader;font-size:34px;line-height:1.18">Cada día cae más fuerte. El viernes es llovizna y el domingo es granizo. La gente sabe qué día es por el tamaño del punto.</div>
         <div class="abs" style="left:764px;top:792px;display:flex;gap:28px;align-items:flex-end">
           ${[44, 28, 17, 10].map((s) => `<span style="font-family:Unbounded;font-weight:900;letter-spacing:-.045em;font-size:${s}px">GRANIZO</span>`).join('')}</div>
         <div class="abs mono" style="left:764px;top:900px;width:632px;font-size:15px;line-height:1.55">Unbounded Black, -45 de tracking. Tres tintas de proceso risográfico en impresos; rosa y amarillo planos en pantalla y escenario.</div>` }
    ]
  });

  // Wristbands and lanyards, flat, at the size the supplier needs them.
  const band = (y, day, m, h = 96) => `<svg class="abs" style="left:0;top:${y}px" width="${W}" height="${h}">${hail(W - 300, h, h / 3, { x0: 300, max: m, min: m * 0.7, power: 1 })}</svg>
      <div class="abs" style="left:44px;top:${y + 12}px;font-family:Unbounded;font-weight:900;letter-spacing:-.045em;font-size:${h * 0.5}px;line-height:1.2">${day}</div>`;
  await press.print('festival/wristbands', {
    w: W,
    h: 900,
    seed: 94,
    plates: [
      { ink: 'yellow', band: 0, html: [40, 170, 300, 430, 560].map((y) => `<div class="abs" style="left:0;right:0;top:${y}px;height:96px;background:#000"></div>`).join('') },
      { ink: 'pink', html: band(40, 'VIE', 0.16) + band(170, 'SÁB', 0.3) + band(300, 'DOM', 0.47) + `<div class="abs" style="left:0;right:0;top:430px;height:96px;background:#000"></div><div class="abs" style="left:44px;top:442px;color:#fff;font-family:Unbounded;font-weight:900;letter-spacing:-.045em;font-size:48px">ABONO, 3 DÍAS</div>` },
      { ink: 'blue', cell: 14, html: `<div class="abs" style="left:0;right:0;top:560px;height:96px;background:#000"></div><div class="abs" style="left:44px;top:572px;color:#fff;font-family:Unbounded;font-weight:900;letter-spacing:-.045em;font-size:48px">STAFF</div>
         <div class="abs mono" style="left:44px;top:690px;font-size:18px;line-height:1.6;width:800px">Pulseras de tela 15 × 350 mm, serigrafía a dos tintas, broche de una vez.<br>El día se distingue por el tamaño del punto, también a oscuras y con lluvia.</div>
         <div class="abs any" style="right:44px;top:690px;font-size:150px;font-stretch:54%">PULSERAS</div>` }
    ]
  });

  // Wayfinding: site signs, pictograms built from the hail dot.
  const pict = {
    agua: (x, y) => `<path d="M${x} ${y - 90} C${x + 80} ${y + 10} ${x + 70} ${y + 80} ${x} ${y + 80} C${x - 70} ${y + 80} ${x - 80} ${y + 10} ${x} ${y - 90} Z" fill="#000"/>`,
    banos: (x, y) => `<circle cx="${x - 50}" cy="${y - 60}" r="26" fill="#000"/><rect x="${x - 76}" y="${y - 26}" width="52" height="106" fill="#000"/><circle cx="${x + 50}" cy="${y - 60}" r="26" fill="#000"/><path d="M${x + 50} ${y - 28} L${x + 90} ${y + 80} H${x + 10} Z" fill="#000"/>`,
    salida: (x, y) => `<path d="M${x - 80} ${y} H${x + 40} M${x} ${y - 50} L${x + 60} ${y} L${x} ${y + 50}" fill="none" stroke="#000" stroke-width="26"/><rect x="${x + 70}" y="${y - 88}" width="20" height="176" fill="#000"/>`,
    comida: (x, y) => `<rect x="${x - 70}" y="${y - 80}" width="16" height="160" fill="#000"/><rect x="${x - 96}" y="${y - 80}" width="10" height="70" fill="#000"/><rect x="${x - 38}" y="${y - 80}" width="10" height="70" fill="#000"/><rect x="${x - 96}" y="${y - 24}" width="68" height="16" fill="#000"/><path d="M${x + 44} ${y + 80} V${y - 80} C${x + 100} ${y - 60} ${x + 96} ${y + 10} ${x + 44} ${y + 14}" fill="#000"/>`,
    primeros: (x, y) => `<rect x="${x - 26}" y="${y - 80}" width="52" height="160" fill="#000"/><rect x="${x - 80}" y="${y - 26}" width="160" height="52" fill="#000"/>`,
    escenario: (x, y) => `<circle cx="${x}" cy="${y}" r="80" fill="#000"/><circle cx="${x}" cy="${y}" r="52" fill="#fff"/><circle cx="${x}" cy="${y}" r="26" fill="#000"/>`
  };
  const cells = [['Agua', 'agua'], ['Baños', 'banos'], ['Salida', 'salida'], ['Comida', 'comida'], ['Primeros auxilios', 'primeros'], ['Escenario', 'escenario']];
  await press.print('festival/wayfinding', {
    w: W,
    h: 1018,
    seed: 95,
    plates: [
      { ink: 'pink', html: `<svg class="abs" style="inset:0" width="${W}" height="1018">
          ${cells.map((_, i) => { const x = 170 + (i % 3) * 300; const y = 240 + (i > 2 ? 350 : 0); return `<circle cx="${x}" cy="${y}" r="130" fill="#000"/>`; }).join('')}</svg>` },
      { ink: 'yellow', band: 0, html: `<div class="abs" style="left:960px;top:0;right:0;bottom:0;background:#000"></div>` },
      { ink: 'blue', cell: 14, html: `<svg class="abs" style="inset:0" width="${W}" height="1018">
          ${cells.map(([, k], i) => { const x = 170 + (i % 3) * 300; const y = 240 + (i > 2 ? 350 : 0); return pict[k](x, y); }).join('')}</svg>
          ${cells.map(([l], i) => `<div class="abs mono" style="left:${40 + (i % 3) * 300}px;top:${400 + (i > 2 ? 350 : 0)}px;width:260px;text-align:center;font-size:17px;font-weight:600">${l}</div>`).join('')}
          <div class="abs any" style="left:44px;top:24px;font-size:58px;font-stretch:150%">SEÑALES</div>
          <div class="abs" style="left:992px;top:50px;width:404px"><div style="font-family:Unbounded;font-weight:900;font-size:80px;line-height:1">←</div><div><span class="any" data-fit style="font-stretch:70%;line-height:.9">PIEDRA</span></div><div style="font-family:Unbounded;font-weight:900;font-size:80px;line-height:1;margin-top:26px;text-align:right">→</div><div><span class="any" data-fit style="font-stretch:92%;line-height:.9">NUBE</span></div><div style="font-family:Unbounded;font-weight:900;font-size:80px;line-height:1;margin-top:26px">↑</div><div><span class="any" data-fit style="font-stretch:100%;line-height:.9">RAYO</span></div></div>
          <div class="abs mono" style="left:992px;bottom:42px;width:400px;font-size:16px;line-height:1.55">Tres escenarios con nombre de clima. Señales de 2 m en lona, visibles a 40 m. Los pictogramas se leen sin tipografía, para quien llega sin lentes y bajo la lluvia.</div>
          <div class="abs mono" style="left:44px;bottom:42px;font-size:15px">Sistema de señales, Ciudad Deportiva, junio 2026</div>` }
    ]
  });

  // Social templates: one post a day, the dot growing.
  const squares = ['VIERNES', 'SÁBADO', 'DOMINGO'];
  await press.print('festival/social', {
    w: W,
    h: 500,
    seed: 96,
    plates: [
      { ink: 'yellow', band: 0, html: squares.map((_, i) => `<div class="abs" style="left:${20 + i * 475}px;top:20px;width:455px;height:460px;background:#000"></div>`).join('') },
      { ink: 'pink', html: `<svg class="abs" style="inset:0" width="${W}" height="500">${squares.map((_, i) => hail(455, 460, 46, { x0: 20 + i * 475, y0: 20, max: [0.2, 0.34, 0.52][i], min: [0.05, 0.1, 0.2][i], power: 0.9 })).join('')}</svg>` },
      { ink: 'blue', cell: 14, html: squares.map((d, i) => `<div class="abs" style="left:${40 + i * 475}px;width:415px;top:38px"><span class="any" data-fit style="font-stretch:${[60, 90, 120][i]}%">${d}</span></div><div class="abs mono" style="left:${40 + i * 475}px;top:438px;font-size:15px;font-weight:600">GRANIZO, ${12 + i} junio, puertas 14:00</div>`).join('') }
    ]
  });
  await press.close();
}

if (process.argv[1].endsWith('festival.mjs')) await run();
