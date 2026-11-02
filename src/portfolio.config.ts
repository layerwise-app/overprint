// The site owner's details. Change anything here and every page follows.
// Colors and fonts are read by scripts too, so keep this file free of imports.

export const portfolio = {
  name: 'Juno Reyes',
  role: 'Graphic and motion designer',
  location: 'Mexico City',
  /** For search results and link previews. Under 160 characters. */
  description:
    'Graphic and motion designer in Mexico City. Posters, record sleeves, identities, and title sequences, mostly in two inks.',
  /** Shown on About. The first paragraph is also the site description. */
  bio: [
    'Juno Reyes designs posters, records, identities, and title sequences from a shared studio above a print shop in Colonia Obrera.',
    'Most of the work starts on a risograph, because a machine with two drums and a bad memory makes better decisions than a blank artboard. Juno limits every project to two inks, then spends the budget on the idea and the paper.',
    'Before going independent in 2019, Juno spent six years in cultural print and broadcast graphics in Mexico City and Monterrey. Commissions come mostly from venues, labels, and festivals that have more to say than money to say it with.'
  ],
  /** Where contact form messages are emailed. Empty saves them to the database only. */
  ownerEmail: '',
  /** Replace these sample profiles with real ones. */
  socials: [
    { label: 'Instagram', handle: '@overprint.sample', url: 'https://www.instagram.com/overprint.sample' },
    { label: 'Are.na', handle: 'overprint-sample', url: 'https://www.are.na/overprint-sample' },
    { label: 'Vimeo', handle: 'overprintsample', url: 'https://vimeo.com/overprintsample' }
  ],
  /** Inks overprint with multiply, so choose colors you could really print. */
  colors: {
    paper: '#f1ebdd',
    inks: {
      pink: '#ff48b0',
      blue: '#3255a4',
      yellow: '#ffe800'
    },
    /** Text outside case studies: blue printed twice. */
    text: '#0a1c69'
  },
  /**
   * Self-hosted variable fonts in public/fonts. After changing `display`, run
   * `pnpm measure-font` so headlines still fit their lines.
   */
  fonts: {
    display: {
      family: 'Anybody',
      file: '/fonts/anybody.woff2',
      weight: '100 900',
      stretch: '50% 150%',
      minWidth: 50,
      maxWidth: 150,
      headlineWeight: 800
    },
    text: {
      family: 'Newsreader',
      file: '/fonts/newsreader.woff2',
      italicFile: '/fonts/newsreader-italic.woff2',
      weight: '200 800'
    },
    label: {
      family: 'Martian Mono',
      file: '/fonts/martian-mono.woff2',
      weight: '100 800',
      stretch: '75% 112.5%'
    }
  }
};

export type InkName = keyof typeof portfolio.colors.inks;
