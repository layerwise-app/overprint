import type { Project } from '../types';
import { images } from './sotano-33-posters.images';

const project: Project = {
  order: 1,
  title: 'Sótano 33 season posters',
  headline: ['SÓTANO 33', 'TWELVE POSTERS'],
  client: 'Sótano 33',
  year: 2025,
  role: 'Design and print production',
  disciplines: ['Poster', 'Print'],
  summary:
    'Twelve Friday nights in a basement in Colonia Doctores, twelve two-ink posters, and one system that a bar manager can brief in a text message.',
  outcome:
    'All twelve nights sold out the 120-person room. By week six the posters were selling at the bar for more than the ticket, which now pays for the next season’s paper.',
  cover: {
    image: images.cover,
    alt: 'Poster for Perro Lunar: a pink moon with pale craters overprinted by the band name in heavy blue capitals.'
  },
  canvas: {
    x: 260,
    y: 250,
    rotation: -6,
    width: 560,
    extras: [
      { image: images.ruidoBlanco, x: 850, y: 650, rotation: 5, width: 270 },
      { image: images.solDeSotano, x: 40, y: 880, rotation: 8, width: 250 }
    ]
  },
  inks: ['pink', 'blue'],
  blocks: [
    {
      type: 'text',
      heading: 'The brief',
      body: [
        'Sótano 33 is a 120-person room at the bottom of a service stair on Doctor Vértiz. It books one band every Friday, and nothing on the street says it exists. The owners asked for a poster each week that would tell people on the Eje Central there was a show, and tell the people who had already been that it was this one.',
        'Everything had to come out of the budget of a door charge of 180 pesos.'
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.seasonWall,
        alt: 'All twelve posters from the season pasted in two rows on a dark blue stairwell wall, each at a slight angle.'
      },
      caption: 'The full season in date order, the way it ran down the service stair by May.'
    },
    {
      type: 'text',
      heading: 'The constraint',
      body: [
        'The shared riso at Taller Tinta Corrida holds two drums, so every sheet gets two inks and one pass. The booking usually firms up on Monday, which left about four hours of design and one afternoon on press for a run of 300.',
        'A new idea every week was never going to happen. It had to be a system, and it had to be one the printer could set up without me if I was sick.'
      ]
    },
    {
      type: 'pair',
      figures: [
        {
          image: images.ruidoBlanco,
          alt: 'Poster for Ruido Blanco: wide blue capitals above tall pink vertical bars arranged like a waveform.'
        },
        {
          image: images.hijasDelSismo,
          alt: 'Poster for Las Hijas del Sismo: pink capitals of three different widths under blue seismograph traces.'
        }
      ],
      caption: 'Noise for Ruido Blanco. A seismograph for Las Hijas del Sismo, whose bassist sent the data from a real tremor.'
    },
    {
      type: 'text',
      heading: 'The decisions',
      body: [
        'One drum carries the type. The band name always fills the sheet, and a variable font with a range of 50 to 150 on the width axis makes it fit: a long name goes tall and narrow, a short one goes flat and wide. That single move meant no band ever got a smaller name because of its spelling.',
        'The other drum carries a drawing of what the band sounds like, made in under an hour from one geometric rule. Bars, rings, stairs, a sun. I stopped trying to illustrate the music and asked each band for one word instead.',
        'A clear band at the top and bottom of every sheet holds the date and address, so those survive any overprint. Plates are allowed to drift on press. Nobody has ever complained, and several people have asked how it was done.'
      ]
    },
    {
      type: 'gallery',
      figures: [
        { image: images.equis, alt: 'Poster for Equis: the word Equis repeated three times at widening widths over a pink and blue diagonal cross.' },
        { image: images.azulejo, alt: 'Poster for Azulejo: pink capitals over a blue tile pattern of quarter circles.' },
        { image: images.solDeSotano, alt: 'Closing night poster: pink capitals above a yellow sun with long stepped rays.' }
      ]
    },
    {
      type: 'quote',
      quote:
        'We stopped printing flyers. People take the poster off the wall, so we print more and let them.',
      source: 'Renata Solís, co-owner, Sótano 33'
    },
    {
      type: 'metrics',
      items: [
        { value: '12', label: 'posters in the season' },
        { value: '300', label: 'copies of each' },
        { value: '2', label: 'inks per sheet' },
        { value: '4 h', label: 'from booking to plates' }
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.programme,
        alt: 'Season programme sheet: the venue name in wide blue capitals above a ruled list of twelve dates and bands, with two pink discs behind.'
      },
      caption: 'The season programme, taped to the door and handed out at the bar.'
    }
  ],
  credits: [
    { role: 'Design', name: 'Juno Reyes' },
    { role: 'Printing', name: 'Taller Tinta Corrida' },
    { role: 'Booking', name: 'Renata Solís' },
    { role: 'Paste-up', name: 'Beto Lara and the door staff' }
  ]
};

export default project;
