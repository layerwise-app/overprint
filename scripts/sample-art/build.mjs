// Sends the finished sample art through scripts/add-images.mjs. Run after any
// `node scripts/sample-art/<project>.mjs`.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { OUT } from './press.mjs';

const sets = {
  'sotano-33-posters': {
    cover: 'gig/perro-lunar', ruidoBlanco: 'gig/ruido-blanco', hijasDelSismo: 'gig/hijas-del-sismo',
    equis: 'gig/equis', azulejo: 'gig/azulejo', seasonWall: 'gig/season-wall', programme: 'gig/programme', solDeSotano: 'gig/sol-de-sotano'
  },
  'archivo-temblor': {
    cover: 'album/sonidero', altiplano: 'album/altiplano', agua: 'album/agua', nocturno: 'album/nocturno',
    sleeve: 'album/altiplano-sleeve', series: 'album/series'
  },
  'hora-pico': {
    cover: 'title/frame-hora', flujo: 'title/frame-flujo', pico: 'title/frame-pico', reloj: 'title/frame-reloj', storyboard: 'title/storyboard'
  },
  'se-rotula': {
    cover: 'zine/cover', sombra: 'zine/spread-sombra', flechas: 'zine/spread-flechas', letreros: 'zine/spread-letreros',
    mapa: 'zine/spread-mapa', colofon: 'zine/colofon'
  },
  granizo: {
    cover: 'festival/poster', lineup: 'festival/lineup', identity: 'festival/identity', wristbands: 'festival/wristbands',
    wayfinding: 'festival/wayfinding', social: 'festival/social'
  },
  tezontle: {
    cover: 'typeface/cover', glyphs: 'typeface/glyphs', porosity: 'typeface/porosity', construction: 'typeface/construction',
    inUse: 'typeface/in-use', waterfall: 'typeface/waterfall'
  }
};

const script = resolve(import.meta.dirname, '../add-images.mjs');
for (const [slug, map] of Object.entries(sets)) {
  const args = Object.entries(map).map(([key, name]) => `${key}=${join(OUT, `${name}.png`)}`);
  execFileSync('node', [script, slug, ...args], { stdio: 'inherit' });
}
mkdirSync(resolve(import.meta.dirname, '../../public/work/hora-pico'), { recursive: true });
copyFileSync(join(OUT, 'title/hora-pico.mp4'), resolve(import.meta.dirname, '../../public/work/hora-pico/hora-pico.mp4'));
