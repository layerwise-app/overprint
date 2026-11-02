// The About page. The bio itself lives in src/portfolio.config.ts.
export const about = {
  /** A PDF in public/. */
  cv: { href: '/juno-reyes-cv.pdf', label: 'Download CV (PDF, 1 page)' },
  services: [
    { name: 'Identity for cultural organizations', note: 'Venues, labels, festivals. Systems built to survive being run by volunteers.' },
    { name: 'Posters and printed matter', note: 'Riso, offset, and screen, with the press check included.' },
    { name: 'Record sleeves', note: 'Sleeve, labels, and inserts, supplied to plant specification.' },
    { name: 'Title sequences and motion identity', note: 'Short loops and show openers, delivered with their source files.' },
    { name: 'Typeface design', note: 'Display and custom lettering, licensed openly when the client allows it.' }
  ],
  clients: [
    'Sótano 33',
    'Discos Temblor',
    'Canal Anillo',
    'Festival Granizo',
    'Taller Tinta Corrida',
    'Museo del Cartel Provisional',
    'Editorial Banqueta',
    'Radio Azotea'
  ],
  experience: [
    { years: '2019–now', title: 'Independent designer', place: 'Mexico City', note: 'Own studio, with a riso shared with Taller Tinta Corrida.' },
    { years: '2016–2019', title: 'Senior designer', place: 'Canal Anillo, Mexico City', note: 'On-air graphics for a public arts channel, including its 2018 rebrand.' },
    { years: '2014–2016', title: 'Designer', place: 'Estudio Barranca, Monterrey', note: 'Books and exhibition graphics for regional museums.' },
    { years: '2013–2014', title: 'Press assistant', place: 'Imprenta Lerma, Toluca', note: 'Ran an offset press and learned why designers get yelled at.' }
  ],
  recognition: [
    { year: '2025', note: 'Bienal Latinoamericana del Cartel Provisional, gold, for the Sótano 33 season.' },
    { year: '2024', note: 'Tezontle selected for the Tipos Latinos open-font showcase.' },
    { year: '2023', note: 'Guest teacher, Taller de Impresión Experimental, Oaxaca.' }
  ],
  education: ['BA Graphic Design, Universidad del Norte de Coahuila (2013)']
};
