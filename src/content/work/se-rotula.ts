import type { Project } from '../types';
import { images } from './se-rotula.images';

const project: Project = {
  order: 4,
  title: 'Se Rotula, a zine on hand-painted signs',
  headline: ['SE', 'ROTULA'],
  client: 'Editorial Banqueta',
  year: 2023,
  role: 'Design, type, and printing supervision',
  disciplines: ['Editorial', 'Print'],
  summary:
    'A 28-page field guide to the hand-painted signs of Mexico City, in which the sign painters’ own shade becomes the second ink.',
  outcome:
    'The edition of 200 sold out at Feria Tinta in one weekend. Two of the painters interviewed have since been commissioned for new work, and issue 4 is in production.',
  cover: {
    image: images.cover,
    alt: 'Zine cover: Se Rotula in heavy blue letters with a yellow drop shade, above a yellow panel filled with rows of painted arrows.'
  },
  canvas: {
    x: 480,
    y: 1300,
    rotation: 7,
    width: 460,
    extras: [
      { image: images.flechas, x: 980, y: 1400, rotation: -5, width: 390 },
      { image: images.letreros, x: 40, y: 1700, rotation: -9, width: 400 }
    ]
  },
  inks: ['yellow', 'blue'],
  blocks: [
    {
      type: 'text',
      heading: 'The brief',
      body: [
        'Editorial Banqueta publishes small guides to things that are about to disappear. Issue 3 is about rótulos: the painted signs on taquerías, tire shops, and pharmacies, which are being replaced by printed vinyl at a rate its editors had started to count.',
        'The zine had to work on the street, in a back pocket, as a guide for walking the Eje Central. It also had to do right by painters who have spent forty years not being credited.'
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.letreros,
        alt: 'Spread of thirteen signs reset in different styles, such as Hay Pan, Aguas frescas, Jugos, and Mariscos, each with a yellow shade.'
      },
      caption: 'Pages 6 and 7. Thirteen signs, set exactly as they are spelled on the wall.'
    },
    {
      type: 'text',
      heading: 'The constraint',
      body: [
        'Two inks, a run of 200, and 28 A5 pages from folded A4 on bond that the riso wouldn’t jam on. It had to retail at 120 pesos and still pay the two painters we interviewed.',
        'Reproducing the signs in color photographs was out. A photo of a sign also tells you nothing about how it was made.'
      ]
    },
    {
      type: 'pair',
      figures: [
        { image: images.sombra, alt: 'Spread on the anatomy of a sign shade: the word Tacos with lettered callouts, beside a quote on a yellow disc.' },
        { image: images.flechas, alt: 'Spread cataloguing nine painted arrows with nicknames, opposite a very large arrow on a yellow page.' }
      ],
      caption: 'Pages 12 to 13, on the shade, and 18 to 19, a catalogue of arrows by what the trade calls them.'
    },
    {
      type: 'text',
      heading: 'The decisions',
      body: [
        'Sign painters build a letter in two passes: the body in the expensive color, then a shade in a cheap one, down and to the right. That is already a two-plate process, so I printed it that way. Blue carries the letter, yellow carries the shade, and the misregistration of the machine does the wobble a brush would do.',
        'I set no text in a font that imitates brush lettering unless a painter told us it was close. Body copy is Courier, the voice of a quote written on an invoice pad.',
        'Pages run in walking order. If you go down the Eje from north to south, the book turns with you.'
      ]
    },
    {
      type: 'gallery',
      figures: [
        { image: images.mapa, alt: 'Spread with a street map on yellow marking thirteen stops down the Eje Central, with a numbered list.' },
        { image: images.colofon, alt: 'Back pages: Gracias por leer in heavy letters, and a colophon on a yellow panel.' }
      ]
    },
    {
      type: 'quote',
      quote: 'The shade is what makes it visible from the other side of the Eje.',
      source: 'Beto Gómez, sign painter, 41 years in Tacubaya'
    },
    {
      type: 'metrics',
      items: [
        { value: '28', label: 'pages' },
        { value: '200', label: 'copies' },
        { value: '13', label: 'signs on the walk' },
        { value: '4.2 km', label: 'of Eje Central' }
      ]
    }
  ],
  credits: [
    { role: 'Design', name: 'Juno Reyes' },
    { role: 'Field research', name: 'Paco Medrano' },
    { role: 'Interviews', name: 'Ximena Oropeza' },
    { role: 'Printing', name: 'Taller Tinta Corrida' }
  ]
};

export default project;
