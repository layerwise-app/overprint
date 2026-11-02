// SE ROTULA: a 28-page field guide to hand-painted signs in Mexico City. Sign
// painters shade letters by hand; here the shade is a second plate.
import { openPress } from './press.mjs';

const W = 1440;
const SPREAD = 1018;

// A sign: blue letters with a yellow shade plate underneath.
function signs(items) {
  const main = [];
  const shade = [];
  for (const s of items) {
    const base = `left:${s.x}px;top:${s.y}px;font-family:${s.font};font-size:${s.size}px;line-height:${s.lh ?? 0.95};letter-spacing:${s.track ?? 0};${s.css ?? ''}`;
    const sh = s.shade ?? 12;
    if (s.box) {
      shade.push(`<div class="abs" style="left:${s.x - 22}px;top:${s.y - 22}px;width:${s.box[0]}px;height:${s.box[1]}px;background:#000"></div>`);
    }
    main.push(`<div class="abs" style="${base};white-space:nowrap">${s.text}</div>`);
    if (!s.box) shade.push(`<div class="abs" style="${base};white-space:nowrap;transform:translate(${sh}px,${sh}px)">${s.text}</div>`);
  }
  return { blue: main.join(''), yellow: shade.join('') };
}

const folio = (l, r) => `<div class="abs mono" style="left:48px;right:48px;bottom:30px;display:flex;justify-content:space-between;font-size:13px;font-weight:600"><span>${l}</span><span>${r}</span></div>
  <div class="abs" style="left:719px;top:0;bottom:0;border-left:1px dashed #000;opacity:.5"></div>`;

const copy = (x, y, w, html, size = 17) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;font-family:Courier;font-size:${size}px;line-height:1.42">${html}</div>`;

const arrows = [
  ['La del mecánico', 'M10 60 H130 M90 20 L130 60 L90 100', 16],
  ['La del taquero', 'M10 90 C50 10 100 10 130 50 M100 20 L133 53 L95 72', 14],
  ['La de la vulca', 'M10 45 H90 V15 L140 60 L90 105 V75 H10 Z', 0],
  ['La de sube por aquí', 'M70 110 V20 M30 58 L70 18 L110 58 M30 90 L70 50 L110 90', 12],
  ['La doblada', 'M15 100 V30 H110 M80 0 L112 30 L80 60', 16],
  ['La de la farmacia', 'M10 60 Q70 -20 130 60 M100 30 L130 62 L92 76', 12],
  ['La de se vende', 'M10 30 H70 L70 10 L130 60 L70 110 L70 90 H10 Z', 0],
  ['La cansada', 'M10 30 C60 40 80 60 120 100 M80 100 H122 V58', 13],
  ['La de allá', 'M5 60 H45 M55 60 H85 M95 60 H130 M100 30 L132 60 L100 90', 12]
];

export async function run() {
  const press = await openPress();

  const coverSigns = signs([
    { x: 60, y: 160, font: 'Chango', size: 330, text: 'SE', shade: 22 },
    { x: 60, y: 460, font: 'Chango', size: 290, text: 'ROTU', shade: 22 },
    { x: 60, y: 730, font: 'Chango', size: 330, text: 'LA', shade: 22 },
    { x: 660, y: 830, font: 'Yellowtail', size: 150, text: 'y se pinta', shade: 8 }
  ]);
  await press.print('zine/cover', {
    w: W,
    h: 2036,
    seed: 81,
    plates: [
      { ink: 'yellow', html: coverSigns.yellow + `<div class="abs" style="left:0;right:0;top:1140px;bottom:0;background:#000"></div>` },
      { ink: 'blue', html: coverSigns.blue + `
         <div class="abs mono" style="left:60px;right:60px;top:60px;display:flex;justify-content:space-between;font-size:24px;font-weight:600"><span>Núm. 3</span><span>Invierno</span><span>$120</span></div>
         <svg class="abs" style="left:0;top:1140px" width="${W}" height="896">
           ${Array.from({ length: 7 }, (_, r) => Array.from({ length: 6 }, (_, c) => {
             const a = arrows[(r * 2 + c) % arrows.length];
             return `<g transform="translate(${c * 240 + 40},${r * 124 + 26}) scale(1.15)"><path d="${a[1]}" fill="${a[2] ? 'none' : '#000'}" stroke="#000" stroke-width="${a[2] || 4}"/></g>`;
           }).join('')).join('')}
         </svg>
         <div class="abs" style="left:60px;top:1040px;width:1320px;font-family:Courier;font-weight:700;font-size:32px;line-height:1.2">Guía de campo de los letreros pintados a mano de la Ciudad de México</div>` }
    ]
  });

  const anatomy = signs([{ x: 70, y: 200, font: 'AlfaSlab', size: 172, text: 'TACOS', shade: 22 }]);
  await press.print('zine/spread-sombra', {
    w: W,
    h: SPREAD,
    seed: 82,
    plates: [
      { ink: 'yellow', html: anatomy.yellow + `<div class="abs" style="left:760px;top:70px;width:620px;height:620px;background:#000;border-radius:50%"></div>` },
      { ink: 'blue', html: anatomy.blue + folio('Se rotula 3', 'Anatomía de la sombra / 12–13') + `
         <div class="abs any" style="left:70px;top:60px;font-size:74px;font-stretch:66%">LA SOMBRA</div>
         <svg class="abs" style="inset:0" width="${W}" height="${SPREAD}">
           <g stroke="#000" stroke-width="3" fill="none"><path d="M180 400 V490 H120"/><path d="M380 400 V620 H300"/><path d="M620 400 V620 H520"/></g>
         </svg>
         ${copy(70, 505, 200, '<b>A.</b> Siempre abajo y a la derecha. La luz, en un letrero, viene de la izquierda.', 16)}
         ${copy(190, 640, 240, '<b>B.</b> Dos dedos de ancho. Más, y se come el contraluz de la letra.', 16)}
         ${copy(450, 640, 230, '<b>C.</b> Un color más barato. La sombra nunca gasta la mejor pintura.', 16)}
         <div class="abs" style="left:800px;top:180px;width:540px;font-family:Fraunces;font-weight:800;font-size:60px;line-height:1.02;font-variation-settings:'opsz' 144,'SOFT' 100">“La sombra es lo que hace que se vea desde el otro lado del Eje.”</div>
         <div class="abs mono" style="left:800px;top:720px;width:540px;font-size:16px;line-height:1.6">Don Beto Gómez, rotulista, 41 años en Tacubaya. Le pintó el letrero a medio mercado de San Juan.</div>` }
    ]
  });

  const arrowCells = arrows.map((a, i) => {
    const x = 70 + (i % 3) * 215;
    const y = 180 + Math.floor(i / 3) * 256;
    return `<g transform="translate(${x},${y})"><path d="${a[1]}" fill="${a[2] ? 'none' : '#000'}" stroke="#000" stroke-width="${a[2] || 5}"/></g>
      <text x="${x}" y="${y + 160}" font-family="Courier" font-size="15">${i + 1}. ${a[0]}</text>`;
  }).join('');
  await press.print('zine/spread-flechas', {
    w: W,
    h: SPREAD,
    seed: 83,
    plates: [
      { ink: 'yellow', html: `<svg class="abs" style="inset:0" width="${W}" height="${SPREAD}">
          ${arrows.map((a, i) => { const x = 70 + (i % 3) * 215 + 9; const y = 180 + Math.floor(i / 3) * 256 + 9; return `<g transform="translate(${x},${y})"><path d="${a[1]}" fill="${a[2] ? 'none' : '#000'}" stroke="#000" stroke-width="${a[2] || 5}"/></g>`; }).join('')}</svg>
          <div class="abs" style="left:720px;top:0;right:0;bottom:0;background:#000"></div>` },
      { ink: 'blue', html: `<svg class="abs" style="inset:0" width="${W}" height="${SPREAD}">${arrowCells}</svg>` + folio('Se rotula 3', 'Catálogo de flechas / 18–19') + `
         <div class="abs any" style="left:70px;top:60px;font-size:74px;font-stretch:136%">FLECHAS</div>
         <svg class="abs" style="left:770px;top:130px" width="620" height="620"><g transform="scale(4.1)"><path d="M10 45 H90 V15 L140 60 L90 105 V75 H10 Z" fill="#000"/></g></svg>
         <div class="abs" style="left:770px;top:690px;width:600px;font-family:Fraunces;font-weight:800;font-size:46px;line-height:1.04;font-variation-settings:'opsz' 144,'SOFT' 100">Nadie enseña a pintar flechas. Se copian del vecino.</div>` }
    ]
  });

  const wall = signs([
    { x: 70, y: 90, font: 'Bowlby', size: 138, text: 'HAY PAN', shade: 14 },
    { x: 70, y: 262, font: 'Yellowtail', size: 118, text: 'Aguas frescas', shade: 8 },
    { x: 70, y: 450, font: 'AlfaSlab', size: 62, text: 'SE HACEN LLAVES', shade: 7 },
    { x: 70, y: 580, font: 'Chango', size: 98, text: 'JUGOS', shade: 11 },
    { x: 415, y: 590, font: 'Yellowtail', size: 78, text: 'y licuados', shade: 6 },
    { x: 70, y: 740, font: 'BigShoulders', size: 140, text: 'REFACCIONES', shade: 11, css: 'font-weight:900' },
    { x: 780, y: 90, font: 'Fraunces', size: 150, text: 'Mariscos', shade: 12, css: "font-weight:900;font-variation-settings:'opsz' 144,'WONK' 1" },
    { x: 780, y: 262, font: 'Chango', size: 88, text: 'El Güero', shade: 9 },
    { x: 780, y: 420, font: 'AlfaSlab', size: 230, text: '$35', shade: 22 },
    { x: 1180, y: 480, font: 'Courier', size: 58, lh: 1, text: 'la<br>orden', shade: 5, css: 'font-weight:700' },
    { x: 780, y: 690, font: 'Bowlby', size: 92, text: 'NO FIAMOS', shade: 10 },
    { x: 780, y: 810, font: 'Yellowtail', size: 92, text: 'ni mañana', shade: 6 }
  ]);
  await press.print('zine/spread-letreros', {
    w: W,
    h: SPREAD,
    seed: 84,
    plates: [
      { ink: 'yellow', html: wall.yellow },
      { ink: 'blue', html: wall.blue + folio('Se rotula 3', 'Trece letreros, tal como están / 6–7') }
    ]
  });

  // Field map: the walk down Eje Central, sign by sign.
  const stops = ['Tacos Don Fer', 'Vulcanizadora La Fe', 'Jugos Mary', 'Cerrajería 24h', 'Panadería El Sol', 'Refacciones Lerma', 'Mariscos El Güero', 'Farmacia Popular', 'Lonchería Lupita', 'Zapatería Azteca', 'Papelería Marga', 'Salón Rosy', 'Tortas Neza'];
  await press.print('zine/spread-mapa', {
    w: W,
    h: SPREAD,
    seed: 85,
    plates: [
      { ink: 'yellow', html: `<div class="abs" style="left:0;top:0;width:720px;bottom:0;background:#000"></div>` },
      { ink: 'blue', html: folio('Se rotula 3', 'Un recorrido a pie, 4.2 km / 24–25') + `
         <svg class="abs" style="left:0;top:0" width="720" height="${SPREAD}">
           ${Array.from({ length: 9 }, (_, i) => `<path d="M${-40 + i * 100} 0 L${60 + i * 100} ${SPREAD}" stroke="#000" stroke-width="3"/>`).join('')}
           ${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 90 + 18} L720 ${i * 72 + 70}" stroke="#000" stroke-width="3"/>`).join('')}
           <path d="M330 -10 L402 ${SPREAD + 10}" stroke="#000" stroke-width="36"/>
           ${stops.map((_, i) => { const y = 60 + i * 66; const x = 336 + (y / SPREAD) * 72 + (i % 2 ? -46 : 46); return `<circle cx="${x}" cy="${y}" r="24" fill="#000"/><text x="${x}" y="${y + 6}" text-anchor="middle" fill="#fff" font-family="Martian" font-weight="700" font-size="17">${i + 1}</text>`; }).join('')}
         </svg>
         <div class="abs any" style="left:770px;top:60px;font-size:96px;font-stretch:54%;line-height:.86">EJE CENTRAL,<br>DE NORTE A SUR</div>
         <div class="abs" style="left:770px;top:260px;width:600px;column-count:2;column-gap:28px;font-family:Courier;font-size:17px;line-height:1.75">${stops.map((s, i) => `<div><b>${i + 1}</b> ${s}</div>`).join('')}</div>
         ${copy(770, 720, 600, 'Salir antes de las once: a mediodía, el sol ya no pega en la acera poniente y los letreros se apagan. Llevar cambio. Preguntar antes de fotografiar, y si es posible, comprar algo.', 20)}` }
    ]
  });

  // Back cover and colophon.
  await press.print('zine/colofon', {
    w: W,
    h: SPREAD,
    seed: 86,
    plates: [
      { ink: 'yellow', html: `<div class="abs" style="left:720px;top:0;right:0;bottom:0;background:#000"></div>
          <div class="abs" style="left:70px;top:90px;font-family:Bowlby;font-size:128px;line-height:.92;transform:translate(12px,12px)">GRACIAS<br>POR<br>LEER</div>` },
      { ink: 'blue', html: `<div class="abs" style="left:70px;top:90px;font-family:Bowlby;font-size:128px;line-height:.92">GRACIAS<br>POR<br>LEER</div>
         <div class="abs" style="left:790px;top:90px;width:560px;font-family:Courier;font-size:21px;line-height:1.5">
           <b>Se rotula, núm. 3.</b><br>Edición de 200. Impreso en risografía a dos tintas, amarillo y azul medio, sobre bond cultural de 90 g.<br><br>
           Investigación y fotografía de campo: Paco Medrano.<br>Entrevistas: Ximena Oropeza.<br>Diseño: Juno Reyes.<br><br>
           Compuesto en las letras de quien pintó cada letrero. Ninguna es de nadie. Todas son de la calle.</div>
         <div class="abs mono" style="left:790px;bottom:60px;font-size:15px;line-height:1.6">Taller Tinta Corrida, Col. Obrera, CDMX</div>` }
    ]
  });
  await press.close();
}

if (process.argv[1].endsWith('zine.mjs')) await run();
