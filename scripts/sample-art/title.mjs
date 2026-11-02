// HORA PICO: an 8-second looping title for a documentary series about rush hour.
// One function draws any moment, so the stills and the film are the same artwork.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { openPress, OUT, img } from './press.mjs';

const W = 1440;
const H = 810;
const TAU = Math.PI * 2;

const credit = (a, b) => `<div class="abs mono" style="left:36px;right:36px;bottom:28px;display:flex;justify-content:space-between;font-size:17px;font-weight:600"><span>${a}</span><span>${b}</span></div>`;

function hora(u) {
  const bars = Array.from({ length: 11 }, (_, i) => {
    const speed = 1 + (i % 3);
    const x = (((u * speed + i * 0.17) % 1) * 2 - 1) * W;
    return `<rect x="${x}" y="${i * 74 + 2}" width="${W * (0.7 + (i % 4) * 0.2)}" height="44" fill="${i % 4 === 1 ? '#6c6c6c' : '#000'}"/>`;
  }).join('');
  const letters = 'HORA'.split('').map((l, i) => {
    const w = 100 + 50 * Math.sin(TAU * u * 2 + (i * TAU) / 4);
    return `<span style="font-stretch:${w.toFixed(1)}%">${l}</span>`;
  }).join('');
  return {
    pink: `<div class="abs" style="left:36px;right:36px;top:120px"><span class="any" data-fit>${letters}</span></div>`,
    blue: `<svg class="abs" style="inset:0" width="${W}" height="${H}">${bars}</svg>`
  };
}

function flujo(u) {
  let dots = '';
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 28; x++) {
      const phase = x * 0.34 - y * 0.2 - u * TAU * 2;
      const r = 5 + 19 * Math.pow(0.5 + 0.5 * Math.sin(phase), 2);
      dots += `<circle cx="${x * 52 + 26}" cy="${y * 52 + 26}" r="${r.toFixed(1)}" fill="#000"/>`;
    }
  }
  const minute = 42 + Math.floor(u * 6);
  return {
    pink: `<div class="abs" style="left:36px;right:36px;top:180px"><span class="any" data-fit style="font-stretch:112%">07:${minute}</span></div>`,
    blue: `<svg class="abs" style="inset:0" width="${W}" height="${H}">${dots}</svg>`
  };
}

function pico(u) {
  let peaks = '';
  for (let i = 0; i < 9; i++) {
    const c = (i + 0.5) * (W / 9);
    const h = 180 + 500 * Math.pow(0.5 + 0.5 * Math.sin(TAU * u + i * 0.8), 1.4);
    peaks += `<polygon points="${c - 200},${H} ${c},${H - h} ${c + 200},${H}" fill="${i % 2 ? '#000' : '#777'}"/>`;
  }
  return {
    pink: `<svg class="abs" style="inset:0" width="${W}" height="${H}">${peaks}</svg>`,
    blue: `<div class="abs" style="left:36px;right:36px;top:36px"><span class="any" data-fit style="font-stretch:150%">PICO</span></div>`
  };
}

function reloj(u) {
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 360;
    ticks += `<rect x="${W / 2 - 4}" y="${H / 2 - 390}" width="${i % 5 ? 8 : 16}" height="${i % 5 ? 46 : 96}" fill="#000" transform="rotate(${a} ${W / 2} ${H / 2})"/>`;
  }
  const a = u * TAU * 1.5 - Math.PI / 2;
  const large = (u * 1.5) % 1 > 0.5 ? 1 : 0;
  const end = [W / 2 + Math.cos(a) * 280, H / 2 + Math.sin(a) * 280];
  return {
    pink: `<svg class="abs" style="inset:0" width="${W}" height="${H}"><circle cx="${W / 2}" cy="${H / 2}" r="280" fill="#8d8d8d"/><path d="M${W / 2} ${H / 2} L${W / 2} ${H / 2 - 280} A280 280 0 ${large} 1 ${end[0]} ${end[1]} Z" fill="#000"/></svg>`,
    blue: `<svg class="abs" style="inset:0" width="${W}" height="${H}">${ticks}</svg>
       <div class="abs" style="left:0;right:0;top:${H / 2 - 88}px;text-align:center"><span class="any" style="font-size:112px;font-stretch:${70 + u * 70}%">FERRÁN</span></div>
       <div class="abs mono" style="left:0;right:0;top:${H / 2 + 30}px;text-align:center;font-size:20px;line-height:1.5">una serie documental de<br>Lucía Ferrán</div>`
  };
}

const scenes = [hora, flujo, pico, reloj];

export function frame(t) {
  const whole = (t % 1) * scenes.length;
  const index = Math.floor(whole);
  const { pink, blue } = scenes[index](whole - index);
  return [
    { ink: 'pink', html: pink, screen: 'dot', angle: 45, cell: 14 },
    {
      ink: 'blue',
      html: blue + credit('HORA PICO', ['Ep. 3, Pantitlán', 'Canal Anillo', 'Temporada 1', 'Ep. 3, Pantitlán'][index]),
      screen: 'dot',
      angle: 15,
      cell: 14
    }
  ];
}

export async function stills(press) {
  const keys = { 'frame-hora': 0.07, 'frame-flujo': 0.37, 'frame-pico': 0.62, 'frame-reloj': 0.86 };
  let seed = 61;
  for (const [name, t] of Object.entries(keys)) {
    await press.print(`title/${name}`, { w: W, h: H, plates: frame(t), seed: seed++ });
  }
  // Storyboard: 12 beats on the eight-second grid.
  const beats = 12;
  const tiny = [];
  mkdirSync(join(OUT, 'title/board'), { recursive: true });
  for (let i = 0; i < beats; i++) {
    const t = (i + 0.4) / beats;
    await press.print(`title/board/b${i}`, { w: W, h: H, plates: frame(t), seed: 70 + i, dsf: 0.5 });
    tiny.push(`<figure class="abs" style="left:${40 + (i % 4) * 342}px;top:${130 + Math.floor(i / 4) * 256}px;width:330px">
       <img src="${img(`title/board/b${i}`)}" style="display:block;width:330px;height:186px">
       <figcaption class="mono" style="font-size:10.5px;line-height:1.45;margin-top:6px;color:#26396f;font-weight:600">${(i * 8 / beats).toFixed(1)}s. ${['Las líneas del metro cruzan', 'HORA respira por letra', 'Corte seco en el compás', 'La multitud entra por oleadas', '07:42 sube por minuto', 'Un minuto, 24 cuadros', 'Las horas pico crecen', 'PICO se queda quieto', 'Las barras se vacían', 'El reloj se llena', 'FERRÁN se ensancha', 'Vuelve al primer cuadro'][i]}</figcaption></figure>`);
  }
  await press.layout('title/storyboard', {
    w: 1440,
    h: 930,
    html: `<div class="abs" style="inset:0;background:#f1ebdd"></div>
      <div class="abs any" style="left:40px;top:28px;font-size:64px;font-stretch:150%;color:#26396f">HORA PICO</div>
      <div class="abs mono" style="right:40px;top:40px;font-size:13px;line-height:1.5;text-align:right;color:#26396f;font-weight:600">Guion gráfico, v4<br>8 s, 12 cuadros por segundo, en bucle</div>
      ${tiny.join('')}`
  });
}

export async function film(press, name = 'title/hora-pico') {
  const fps = 12;
  const total = fps * 8;
  const path = join(OUT, `${name}.mp4`);
  const ffmpeg = spawn('ffmpeg', [
    '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1280x720', '-r', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-r', '24', '-movflags', '+faststart', '-an', path
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < total; i++) {
    const { raw } = await press.printRaw({ w: W, h: H, plates: frame(i / total), seed: 200 + i, dsf: 1280 / 1440, texture: 0.6 });
    if (!ffmpeg.stdin.write(raw)) await new Promise((r) => ffmpeg.stdin.once('drain', r));
    if (i % 24 === 0) console.log(`film frame ${i}/${total}`);
  }
  ffmpeg.stdin.end();
  await new Promise((res, rej) => ffmpeg.on('close', (c) => (c ? rej(new Error(`ffmpeg ${c}`)) : res())));
  console.log(path);
}

export async function run() {
  const press = await openPress();
  await stills(press);
  await film(press);
  await press.close();
}

if (process.argv[1].endsWith('title.mjs')) await run();
