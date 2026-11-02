import type { Project } from '../types';
import { images } from './tezontle.images';

const project: Project = {
  order: 6,
  title: 'Tezontle typeface specimen',
  headline: ['TEZONTLE', 'SPECIMEN'],
  client: 'Self-initiated',
  year: 2024,
  role: 'Type design and specimen',
  disciplines: ['Typeface', 'Print'],
  summary:
    'An experimental display typeface drawn from five modules on a 5 × 5 grid, with a porosity axis named after Mexico City’s volcanic stone.',
  outcome:
    'Selected for the Tipos Latinos open-font showcase in 2024. Released under the SIL Open Font License, it has since turned up on two record sleeves and a brewery I’ve never met.',
  cover: {
    image: images.cover,
    alt: 'Specimen poster: the name Tezontle in modular letters stacked over three lines, dark green with yellow pits, above a yellow band with the line A stone that floats.'
  },
  canvas: {
    x: 2400,
    y: 1160,
    rotation: 5,
    width: 520,
    extras: [
      { image: images.construction, x: 1640, y: 1880, rotation: -6, width: 460 },
      { image: images.porosity, x: 2980, y: 1500, rotation: 9, width: 270 }
    ]
  },
  inks: ['blue', 'yellow'],
  blocks: [
    {
      type: 'text',
      heading: 'The brief',
      body: [
        'I gave this one to myself. Tezontle is the red, volcanic stone of the old palaces in the Centro Histórico, so full of air that a fist-sized piece weighs about the same as an orange. The Mexica built with it on the lakebed because it didn’t sink.',
        'I wanted a typeface that could be light in the same way: a heavy letter with holes in it, where you’d choose how many.'
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.glyphs,
        alt: 'Glyph chart: 37 modular capitals and figures in rows, each labelled with its Unicode number.'
      },
      caption: 'The set: capitals, Ñ as its own letter, and figures. There is no lowercase. You don’t write on this stone, you carve it.'
    },
    {
      type: 'text',
      heading: 'The constraint',
      body: [
        'Five modules: one square and four quarter circles, on a 5 × 5 grid, with no optical corrections. That rule has to resolve a K, an R, a Ñ, and an 8 using the same pieces that draw an O. Diagonals are not possible, so they turn into short linked curves. It is ugly in places, and I left those places in.'
      ]
    },
    {
      type: 'pair',
      figures: [
        { image: images.construction, alt: 'Construction sheet: a large R on its grid with the five modules shown beside it.' },
        { image: images.porosity, alt: 'Porosity scale: the word Piedra repeated five times, from solid to heavily pitted.' }
      ],
      caption: 'One R on its grid, and the porosity axis from 000 to 100.'
    },
    {
      type: 'text',
      heading: 'The decisions',
      body: [
        'The axis is called POROS. Each glyph stores a seed for where its pits fall, so an A is always the same stone, however much of it has eroded. At 000 the face is signage. At 100 it only works above 200 points.',
        'The specimen prints the holes on one plate and a solid backing on the other, so the second ink rises up through the letter. That’s the part you can only get in print. I pitched it as the reason to have a printed specimen at all.'
      ]
    },
    {
      type: 'gallery',
      figures: [
        { image: images.inUse, alt: 'Poster on a yellow flood: La piedra que flota in pitted dark green capitals, with a paragraph about tezontle.' },
        { image: images.waterfall, alt: 'Waterfall sheet: five lines of the typeface from large and porous to small and solid.' }
      ],
      caption: 'At scale, and at the sizes where the axis has to give up.'
    },
    {
      type: 'metrics',
      items: [
        { value: '37', label: 'glyphs' },
        { value: '5', label: 'modules' },
        { value: '0–100', label: 'on the POROS axis' },
        { value: 'OFL', label: 'open license' }
      ]
    }
  ],
  credits: [
    { role: 'Type design and specimen', name: 'Juno Reyes' },
    { role: 'Font engineering', name: 'Sara Montiel' },
    { role: 'Printing', name: 'Taller Tinta Corrida' }
  ]
};

export default project;
