import type { Project } from '../types';
import { images } from './archivo-temblor.images';

const project: Project = {
  order: 2,
  title: 'Archivo Temblor album covers',
  headline: ['ARCHIVO', 'TEMBLOR'],
  client: 'Discos Temblor',
  year: 2024,
  role: 'Art direction and sleeve design',
  disciplines: ['Record sleeve', 'Art direction'],
  summary:
    'Four reissues from a label whose original artwork was lost in 1985, with covers calculated from something in each recording.',
  outcome:
    'The first pressing of 1,200 of each title sold through in eleven weeks. Discos Temblor has commissioned a second series of four on the same grid.',
  cover: {
    image: images.cover,
    alt: 'Sonidero 79 LP cover: pink rays and concentric speaker rings on yellow, with the title in heavy blue capitals along the bottom.'
  },
  canvas: {
    x: 1120,
    y: 130,
    rotation: 4,
    width: 540,
    extras: [
      { image: images.altiplano, x: 1680, y: 420, rotation: -7, width: 270 },
      { image: images.nocturno, x: 1190, y: 730, rotation: -4, width: 240 }
    ]
  },
  inks: ['pink', 'yellow'],
  blocks: [
    {
      type: 'text',
      heading: 'The brief',
      body: [
        'Discos Temblor pressed regional folk, sonidero, and chamber records in Mexico City from 1971 until its warehouse came down in the 1985 earthquake. The master tapes survived in a relative’s garage in Puebla. The sleeves, the photographs, and the artwork did not.',
        'The label’s new owners asked for four covers that could sit in a record shop today without pretending to be from the seventies, and without inventing a past for bands that never had a picture.'
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.series,
        alt: 'All four LP covers in a two by two grid on a yellow sheet, beside the series title Archivo Temblor in condensed blue capitals.'
      }
    },
    {
      type: 'text',
      heading: 'The constraint',
      body: [
        'The plant in Tlalnepantla prices sleeves by spot color, and two inks was what the budget could carry at 1,200 copies. There was no archive to draw from, and I decided early not to fake one with period lettering.'
      ]
    },
    {
      type: 'pair',
      figures: [
        { image: images.altiplano, alt: 'Altiplano cover: blue contour lines with a pink sun and pink title.' },
        { image: images.agua, alt: 'Agua que recuerda cover: an interference pattern of two wave sources in dark green on yellow, above the title.' }
      ],
      caption: 'Altiplano is drawn from the elevation around Apan, where it was recorded. Agua que recuerda plots the two stereo channels as ripples in a pond.'
    },
    {
      type: 'text',
      heading: 'The decisions',
      body: [
        'If the images could not come from the past, they could come from the recordings. Each cover is a small program with one input from its record: a place, a stereo image, a speaker stack, a time of night. The output goes straight to plate as two separations.',
        'All four share a strip across the top with catalogue number, artist, and label, cut 8 mm from the edge. Filed in a crate, the set reads as one thing, and that strip is all a browsing thumb sees.',
        'I kept the titles as big as the artwork would stand, and knocked the Altiplano title out of the contour lines by hand so that the pink could sit on paper.'
      ]
    },
    {
      type: 'pair',
      figures: [
        { image: images.nocturno, alt: 'Nocturno para Xochimilco cover: a white crescent moon and pink disc on a blue flood, above horizontal water lines.' },
        { image: images.sleeve, alt: 'Altiplano back cover, spine, and two centre labels laid flat, with the tracklist in monospace.' }
      ],
      caption: 'Nocturno para Xochimilco, and the Altiplano back cover and labels as supplied to the plant.'
    },
    {
      type: 'quote',
      quote:
        'No one has asked us what the old covers looked like. They ask who made these.',
      source: 'Inés Barragán, director, Discos Temblor'
    },
    {
      type: 'metrics',
      items: [
        { value: '4', label: 'LPs in series one' },
        { value: '1,200', label: 'copies of each' },
        { value: '11', label: 'weeks to sell through' },
        { value: '0', label: 'photographs used' }
      ]
    }
  ],
  credits: [
    { role: 'Art direction and design', name: 'Juno Reyes' },
    { role: 'Remastering', name: 'Hugo Mendoza, Estudio Tepalcate' },
    { role: 'Liner notes', name: 'Ximena Oropeza' },
    { role: 'Pressing', name: 'Vinilos del Valle' }
  ]
};

export default project;
