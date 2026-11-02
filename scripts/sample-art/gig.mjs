// Sótano 33 season: twelve posters from one system. Band name fills the sheet,
// a drawing of the sound overprints it.
import { openPress, rng, img } from './press.mjs';

const W = 1440;
const H = 1920;

const shapes = {
  bars(r) {
    let s = '';
    const n = 46;
    for (let i = 0; i < n; i++) {
      const e = Math.sin(i * 0.31) * 0.3 + Math.sin(i * 0.11 + 2) * 0.3 + r() * 0.5;
      const bh = 180 + Math.abs(e) * 1050;
      const x = (i / n) * W;
      s += `<rect x="${x}" y="${(H - bh) / 2}" width="${(W / n) * 0.62}" height="${bh}" fill="${i % 7 === 0 ? '#000' : i % 3 ? '#000' : '#666'}"/>`;
    }
    return s;
  },
  quake(r) {
    let s = '';
    for (let k = 0; k < 15; k++) {
      const y0 = 130 + k * 120;
      let d = `M0 ${y0}`;
      const hit = 500 + k * 30;
      for (let x = 0; x <= W; x += 8) {
        const env = Math.exp(-Math.pow((x - hit) / (120 + k * 16), 2));
        const a = 3 + env * (46 + k * 6);
        d += ` L${x} ${y0 + (r() - 0.5) * a * 2.2}`;
      }
      s += `<path d="${d}" fill="none" stroke="#000" stroke-width="${4 + (k % 3) * 1.5}" stroke-linejoin="bevel"/>`;
    }
    return s;
  },
  rings() {
    let s = '';
    for (let i = 26; i > 0; i--) {
      s += `<circle cx="${W * 0.5}" cy="${H * 0.52}" r="${i * 46}" fill="${i % 2 ? '#000' : '#fff'}"/>`;
    }
    return s + `<circle cx="${W * 0.5}" cy="${H * 0.52}" r="46" fill="#fff"/>`;
  },
  moon() {
    return `<circle cx="${W * 0.62}" cy="${H * 0.46}" r="600" fill="#000"/>
      <circle cx="${W * 0.46}" cy="${H * 0.36}" r="150" fill="#777"/>
      <circle cx="${W * 0.8}" cy="${H * 0.28}" r="86" fill="#999"/>
      <circle cx="${W * 0.74}" cy="${H * 0.62}" r="210" fill="#555"/>
      <circle cx="${W * 0.4}" cy="${H * 0.6}" r="70" fill="#aaa"/>`;
  },
  stairs() {
    let s = '';
    const steps = 11;
    for (let i = 0; i < steps; i++) {
      const x = (i / steps) * W;
      const y = (i / steps) * H * 0.92;
      s += `<rect x="${x}" y="${y}" width="${W - x}" height="${H / steps + 2}" fill="${i % 2 ? '#000' : '#6a6a6a'}"/>`;
    }
    return s;
  },
  stripes() {
    let s = '';
    for (let i = -12; i < 30; i += 2) {
      s += `<rect x="${i * 110}" y="-400" width="110" height="3000" fill="#000" transform="rotate(24 ${W / 2} ${H / 2})"/>`;
    }
    return s;
  },
  dots() {
    let s = '';
    const n = 15;
    const g = W / n;
    for (let y = 0; y < 21; y++) {
      for (let x = 0; x < n; x++) {
        const d = Math.hypot(x - 7, y - 10);
        const rr = Math.max(4, g * 0.62 * Math.abs(Math.cos(d * 0.55)));
        s += `<circle cx="${x * g + g / 2}" cy="${y * g + g / 2 - 10}" r="${rr}" fill="#000"/>`;
      }
    }
    return s;
  },
  waves() {
    let s = '';
    for (let k = 0; k < 22; k++) {
      let d = `M-20 ${H}`;
      const y0 = 80 + k * 84;
      for (let x = -20; x <= W + 20; x += 16) {
        d += ` L${x} ${y0 + Math.sin(x * 0.006 + k * 0.5) * (40 + k * 7)}`;
      }
      d += ` L${W + 20} ${H} Z`;
      s += `<path d="${d}" fill="${k % 2 ? '#fff' : '#000'}"/>`;
    }
    return s;
  },
  cross() {
    return `<rect x="-400" y="${H / 2 - 190}" width="${W + 800}" height="380" fill="#000" transform="rotate(38 ${W / 2} ${H / 2})"/>
      <rect x="-400" y="${H / 2 - 190}" width="${W + 800}" height="380" fill="#666" transform="rotate(-38 ${W / 2} ${H / 2})"/>`;
  },
  arcs(r) {
    let s = '';
    const g = 240;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 6; x++) {
        const q = Math.floor(r() * 4);
        const px = x * g + (q === 1 || q === 2 ? g : 0);
        const py = y * g + (q >= 2 ? g : 0);
        s += `<path d="M${px} ${py} L${px + (q === 1 || q === 2 ? -g : g)} ${py} A${g} ${g} 0 0 ${q % 2 ? 0 : 1} ${px} ${py + (q >= 2 ? -g : g)} Z" fill="${(x + y) % 3 === 0 ? '#777' : '#000'}"/>`;
      }
    }
    return s;
  },
  spiral() {
    let d = `M${W / 2} ${H / 2}`;
    for (let a = 0; a < 62; a += 0.08) {
      const rr = 8 + a * 16;
      d += ` L${W / 2 + Math.cos(a) * rr} ${H / 2 + Math.sin(a) * rr}`;
    }
    return `<path d="${d}" fill="none" stroke="#000" stroke-width="44"/>`;
  },
  sun() {
    let s = `<circle cx="${W / 2}" cy="${H * 0.56}" r="360" fill="#000"/>`;
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * 360;
      s += `<rect x="${W / 2 - 16}" y="${H * 0.56 - 1400}" width="32" height="960" fill="${i % 2 ? '#000' : '#777'}" transform="rotate(${a} ${W / 2} ${H * 0.56})"/>`;
    }
    return s;
  }
};

export const season = [
  { slug: 'ruido-blanco', lines: ['RUIDO', 'BLANCO'], date: 'VIE 14 FEB', support: 'con Sonido Pirata', shape: 'bars', inks: ['blue', 'pink'], at: 'top', wdth: [128, 118] },
  { slug: 'hijas-del-sismo', lines: ['LAS HIJAS', 'DEL', 'SISMO'], date: 'VIE 21 FEB', support: 'con Coro de Cisternas', shape: 'quake', inks: ['pink', 'blue'], at: 'bottom', wdth: [62, 150, 104] },
  { slug: 'cumbia-subterranea', lines: ['CUMBIA', 'SUBTE-', 'RRÁNEA'], date: 'VIE 28 FEB', support: 'con DJ Tortuga', shape: 'rings', inks: ['blue', 'yellow'], at: 'top', wdth: [92, 92, 92] },
  { slug: 'perro-lunar', lines: ['PERRO', 'LUNAR'], date: 'VIE 7 MAR', support: 'con Las Azoteas', shape: 'moon', inks: ['blue', 'pink'], at: 'bottom', wdth: [132, 124] },
  { slug: 'escalera-de-servicio', lines: ['ESCALERA', 'DE SERVICIO'], date: 'VIE 14 MAR', support: 'con Ana Tlalpan', shape: 'stairs', inks: ['pink', 'yellow'], at: 'top', wdth: [70, 60] },
  { slug: 'tres-focos', lines: ['TRES', 'FOCOS'], date: 'VIE 21 MAR', support: 'con Marimba Fantasma', shape: 'dots', inks: ['pink', 'blue'], at: 'top', wdth: [146, 130] },
  { slug: 'nina-diesel', lines: ['NIÑA', 'DIÉSEL'], date: 'VIE 28 MAR', support: 'con Trío Periférico', shape: 'stripes', inks: ['yellow', 'blue'], at: 'bottom', wdth: [150, 114] },
  { slug: 'lago-seco', lines: ['LAGO', 'SECO'], date: 'VIE 4 ABR', support: 'con Chinampa Dub', shape: 'waves', inks: ['pink', 'blue'], at: 'bottom', wdth: [150, 150] },
  { slug: 'equis', lines: ['EQUIS', 'EQUIS', 'EQUIS'], date: 'VIE 11 ABR', support: 'con Banda Tepito', shape: 'cross', inks: ['blue', 'pink'], at: 'top', wdth: [140, 90, 52] },
  { slug: 'azulejo', lines: ['AZU', 'LEJO'], date: 'VIE 18 ABR', support: 'con Los Talavera', shape: 'arcs', inks: ['pink', 'blue'], at: 'top', wdth: [150, 138] },
  { slug: 'vertigo-azteca', lines: ['VÉRTIGO', 'NORTE'], date: 'VIE 25 ABR', support: 'con Cuatro Caminos', shape: 'spiral', inks: ['blue', 'yellow'], at: 'bottom', wdth: [84, 122] },
  { slug: 'sol-de-sotano', lines: ['SOL DE', 'SÓTANO'], date: 'VIE 2 MAY', support: 'cierre de temporada', shape: 'sun', inks: ['pink', 'yellow'], at: 'top', wdth: [132, 104] }
];

function type(p) {
  const lines = p.lines
    .map(
      (line, i) =>
        `<div style="overflow:visible"><span class="any" data-fit style="font-stretch:${p.wdth[i]}%;line-height:.84;letter-spacing:-.01em">${line}</span></div>`
    )
    .join('');
  const pos = p.at === 'top' ? 'top:150px' : 'bottom:190px';
  return `<div class="abs" style="left:52px;right:52px;${pos}">${lines}</div>`;
}

function slug(p, index) {
  const n = String(index + 1).padStart(2, '0');
  return `
   <div class="abs mono" style="left:52px;right:52px;top:52px;display:flex;justify-content:space-between;font-size:30px;font-weight:700">
     <span>SÓTANO 33</span><span>${p.date}</span><span>21:00</span></div>
   <div class="abs mono" style="left:52px;right:52px;bottom:52px;display:flex;justify-content:space-between;align-items:flex-end;font-size:24px;line-height:1.45;font-weight:500">
     <span>${p.support}<br>Dr. Vértiz 33, sótano, Col. Doctores</span>
     <span style="text-align:right">$180 en puerta<br>Temporada ${n}/12</span></div>`;
}

function poster(p, index) {
  const r = rng(index + 11);
  const drawn = shapes[p.shape](r);
  // Type plate carries the slug too, so everything can be read on one drum.
  const typePlate = `${type(p)}${slug(p, index)}`;
  // The slug bands stay clear of the drawing on every sheet.
  const art = `<svg class="abs" style="inset:0" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${drawn}
    <rect width="${W}" height="108" fill="#fff"/><rect y="${H - 150}" width="${W}" height="150" fill="#fff"/></svg>`;
  return [
    { ink: p.inks[0], html: typePlate, screen: 'dot', angle: 45 },
    { ink: p.inks[1], html: art, screen: 'dot', angle: 15, cell: 20 }
  ];
}

export async function run() {
  const press = await openPress();
  for (const [i, p] of season.entries()) {
    await press.print(`gig/${p.slug}`, { w: W, h: H, plates: poster(p, i), seed: i + 3 });
  }

  // Season wall: all twelve wheatpasted in the stairwell, in date order.
  const r = rng(99);
  const tiles = season
    .map((p, i) => {
      const x = 30 + (i % 6) * 233 + (r() - 0.5) * 8;
      const y = 44 + Math.floor(i / 6) * 322 + (r() - 0.5) * 8;
      const rot = (r() - 0.5) * 2.6;
      return `<img src="${img(`gig/${p.slug}`)}" class="abs" style="left:${x}px;top:${y}px;width:220px;height:293px;transform:rotate(${rot}deg)">`;
    })
    .join('');
  await press.layout('gig/season-wall', {
    w: 1440,
    h: 700,
    html: `<div class="abs" style="inset:0;background:#26396f"></div>${tiles}
      <div class="abs mono" style="left:32px;top:14px;right:32px;display:flex;justify-content:space-between;font-size:11px;font-weight:600;color:#f1ebdd">
       <span>Sótano 33 / Escalera de servicio / Temporada feb–may</span><span>12 noches, 12 carteles, 300 copias cada uno</span></div>`
  });

  // Season programme: the sheet taped to the door.
  const rows = season
    .map((p) => `<div style="display:grid;grid-template-columns:230px 1fr 420px;align-items:baseline;border-top:5px solid #000;padding:15px 0 11px">
       <span class="mono" style="font-size:25px;font-weight:700">${p.date}</span>
       <span class="any" style="font-size:62px;white-space:nowrap;font-stretch:${Math.max(52, Math.min(140, 900 / p.lines.join('').length))}%;line-height:1">${p.lines.join(' ').replace('- ', '').replace('AZU LEJO', 'AZULEJO')}</span>
       <span class="mono" style="font-size:21px;text-align:right">${p.support}</span></div>`)
    .join('');
  await press.print('gig/programme', {
    w: 1440,
    h: 1920,
    seed: 41,
    plates: [
      { ink: 'blue', html: `<div class="abs" style="left:52px;right:52px;top:330px">${rows}</div>
         <div class="abs" style="left:52px;right:52px;top:44px"><span class="any" data-fit style="font-stretch:150%">SÓTANO 33</span></div>
         <div class="abs mono" style="left:52px;right:52px;bottom:48px;font-size:24px;display:flex;justify-content:space-between"><span>Todos los viernes, 21:00</span><span>Dr. Vértiz 33, Col. Doctores</span></div>` },
      { ink: 'pink', screen: 'dot', angle: 15, cell: 20, html: `<div class="abs" style="left:-140px;top:560px;width:1000px;height:1000px;border-radius:50%;background:#000"></div>
         <div class="abs" style="left:800px;top:1160px;width:820px;height:820px;border-radius:50%;background:#8a8a8a"></div>` }
    ]
  });
  await press.close();
}

if (process.argv[1].endsWith('gig.mjs')) await run();
