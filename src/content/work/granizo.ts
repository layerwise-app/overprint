import type { Project } from '../types';
import { images } from './granizo.images';

const project: Project = {
  order: 5,
  title: 'Granizo music festival identity',
  headline: ['GRANIZO', 'FESTIVAL'],
  client: 'Festival Granizo',
  year: 2026,
  role: 'Identity, signage, and print',
  disciplines: ['Identity', 'Wayfinding', 'Poster'],
  summary:
    'An identity for a three-day festival held in the rainy season, built on a dot that grows from Friday to Sunday.',
  outcome:
    '31,000 people over three days, and security reported fewer wristband disputes than any year on record. Granizo has kept the system for 2027.',
  cover: {
    image: images.cover,
    alt: 'Festival poster on yellow: the word Granizo across the top in orange, hail dots growing downward, and the dates 12 13 14 June 2026 in dark green.'
  },
  canvas: {
    x: 1400,
    y: 1020,
    rotation: -9,
    width: 560,
    extras: [
      { image: images.wristbands, x: 1000, y: 1800, rotation: 4, width: 520 },
      { image: images.lineup, x: 2000, y: 1400, rotation: 6, width: 300 }
    ]
  },
  inks: ['yellow', 'pink'],
  blocks: [
    {
      type: 'text',
      heading: 'The brief',
      body: [
        'Granizo takes its name from the hail that closed its first edition at Ciudad Deportiva. It is held in June, on purpose, and the organizers wanted an identity that took the weather as a promise, not a risk.',
        'It had to run across posters, a line-up, stage signs, wristbands, and a social calendar, handled by a five-person team and a dozen suppliers.'
      ]
    },
    {
      type: 'pair',
      figures: [
        { image: images.cover, alt: 'Main festival poster with hail dots growing toward the dates at the bottom.' },
        { image: images.lineup, alt: 'Line-up poster: headliners in blue capitals of different widths, smaller acts below, hail along the bottom edge.' }
      ]
    },
    {
      type: 'text',
      heading: 'The constraint',
      body: [
        'Security needed day passes that staff could tell apart at a glance, at night, in rain. Most festival wristbands do this with color, and under stage light most colors disappear. Signs also had to read through a wet poncho hood, from 40 meters, in a crowd with no shared language for the site.'
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.identity,
        alt: 'Identity sheet: the Granizo logotype in orange on yellow, three panels with increasing dot sizes labelled VIE, SÁB, DOM, and small-size tests of the logotype.'
      },
      caption: 'The logotype and the day code. Friday is a drizzle and Sunday is hail.'
    },
    {
      type: 'text',
      heading: 'The decisions',
      body: [
        'One idea runs through everything: the hail dot gets heavier as the weekend goes on. Friday’s dot is barely there and Sunday’s nearly touches its neighbours. Since size survives bad light and color doesn’t, the wristbands became a size code. A guard can read it from across a turnstile.',
        'The logotype is one heavy, wide word, set big enough on every piece to survive being photographed through rain. The stages are named Piedra, Nube, and Rayo, so signs are three big words and an arrow.',
        'Pictograms are drawn from the same dot on a pink disc. I tested them with a group of people who took off their glasses. Two drawings failed, and I redrew them.'
      ]
    },
    {
      type: 'gallery',
      figures: [
        { image: images.wristbands, alt: 'Wristband artwork laid out flat in five strips: three day passes with increasing dot sizes, a full-weekend pass in orange, a staff band in dark green.' },
        { image: images.wayfinding, alt: 'Signage sheet: six pictograms on pink discs, and three stage names with arrows on yellow.' },
        { image: images.social, alt: 'Three square social posts for Friday, Saturday, and Sunday, with hail dots growing in size.' }
      ],
      caption: 'Wristbands, the signage set, and the daily social post.'
    },
    {
      type: 'quote',
      quote: 'First year no one tried to get into Sunday on a Friday band. They can see the difference from the fence.',
      source: 'Dolores Ibarra, head of operations'
    },
    {
      type: 'metrics',
      items: [
        { value: '31,000', label: 'attendees over three days' },
        { value: '3', label: 'dot weights, one per day' },
        { value: '40 m', label: 'sign legibility, tested' },
        { value: '12', label: 'suppliers on one spec sheet' }
      ]
    }
  ],
  credits: [
    { role: 'Identity and print', name: 'Juno Reyes' },
    { role: 'Festival director', name: 'Andrea Peralta' },
    { role: 'Operations', name: 'Dolores Ibarra' },
    { role: 'Sign fabrication', name: 'Lonas Azcapotzalco' }
  ]
};

export default project;
