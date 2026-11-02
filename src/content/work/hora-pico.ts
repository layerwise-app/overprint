import type { Project } from '../types';
import { images } from './hora-pico.images';

const project: Project = {
  order: 3,
  title: 'Hora Pico title sequence',
  headline: ['HORA', 'PICO'],
  client: 'Canal Anillo',
  year: 2025,
  role: 'Title design and animation',
  disciplines: ['Motion', 'Title design'],
  summary:
    'An eight-second looping title for a documentary series on Mexico City’s rush hour, drawn as if it had been printed 96 times.',
  outcome:
    'The loop ran before all six episodes and became the channel’s most reused asset of the year: it now plays on the platform screens at Pantitlán during the fare announcements.',
  cover: {
    image: images.cover,
    alt: 'Title frame: the word HORA in huge pink letters of uneven widths, crossed by blue horizontal bars.'
  },
  canvas: {
    x: 1960,
    y: 300,
    rotation: -3,
    width: 780,
    extras: [
      { image: images.flujo, x: 2620, y: 720, rotation: 6, width: 400 },
      { image: images.pico, x: 2060, y: 830, rotation: 3, width: 340 }
    ]
  },
  inks: ['blue', 'pink'],
  blocks: [
    {
      type: 'text',
      heading: 'The brief',
      body: [
        'Lucía Ferrán’s six-part documentary follows one hour, 7:00 to 8:00 in the morning, at six stations. Canal Anillo needed a title that could run on air and sit at the top of the streaming page without becoming wallpaper by the third episode.',
        'Lucía’s note was one line: it should feel like being carried along by people you can’t see.'
      ]
    },
    {
      type: 'video',
      src: '/work/hora-pico/hora-pico.mp4',
      poster: {
        image: images.cover,
        alt: 'First frame of the looping title sequence.'
      },
      width: 1280,
      height: 720,
      caption: 'The full loop: eight seconds, twelve frames per second, silent here.'
    },
    {
      type: 'text',
      heading: 'The constraint',
      body: [
        'The channel’s break format allows eight seconds. The streaming page plays it on a loop with the sound off, so the last frame had to cut cleanly to the first, and it had to make sense from any point somebody happened to look up.',
        'There was no budget for a 3D or compositing pipeline, and one person to do the work in three weeks.'
      ]
    },
    {
      type: 'pair',
      figures: [
        { image: images.flujo, alt: 'Frame: a travelling wave through a grid of blue dots under the pink time 07:44.' },
        { image: images.pico, alt: 'Frame: the word PICO in wide blue capitals above overlapping pink triangular peaks.' }
      ],
      caption: 'The crowd as a wave through a dot grid, and the morning’s passenger count as peaks.'
    },
    {
      type: 'text',
      heading: 'The decisions',
      body: [
        'Four scenes on a hard beat, two seconds each, no easing between them. The hour reads as a timetable rather than a story, and the cuts land with the train doors in the sound design.',
        'I wrote the whole thing as one function of time and rendered each frame as two separate plates, pushed through a press simulation that shifts registration on every frame. At twelve frames per second the image boils the way a flipbook of riso prints would.',
        'The letters of HORA share a fixed line, so as one widens its neighbours narrow. People in a carriage do the same.'
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.storyboard,
        alt: 'Storyboard sheet of twelve small frames with timings and Spanish captions, under the title Hora Pico.'
      },
      caption: 'Storyboard v4. Twelve beats on the eight-second grid.'
    },
    {
      type: 'quote',
      quote: 'I asked for an opener. I got the thing we cut the whole show to.',
      source: 'Lucía Ferrán, director'
    },
    {
      type: 'metrics',
      items: [
        { value: '8 s', label: 'loop length' },
        { value: '96', label: 'frames' },
        { value: '2', label: 'plates per frame' },
        { value: '3', label: 'weeks, start to delivery' }
      ]
    },
    {
      type: 'full',
      figure: {
        image: images.reloj,
        alt: 'Closing frame: a pink clock face sweeping inside blue tick marks, with the name Ferrán at its centre.'
      }
    }
  ],
  credits: [
    { role: 'Director', name: 'Lucía Ferrán' },
    { role: 'Title design and animation', name: 'Juno Reyes' },
    { role: 'Sound', name: 'Maru Quintero' },
    { role: 'Commissioning editor', name: 'Tomás Arriaga, Canal Anillo' }
  ]
};

export default project;
