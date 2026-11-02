# Overprint

A portfolio template that behaves like a risograph. Newsprint, three inks that
overprint with multiply, plates slightly out of register, and huge type that
changes width under the pointer. Sample owner: Juno Reyes, a fictional designer
in Mexico City.

Everything you change lives in three places:

| What                                                         | Where                       |
| ------------------------------------------------------------ | --------------------------- |
| Name, role, bio, social links, fonts, colors, `ownerEmail`   | `src/portfolio.config.ts`   |
| Each case study                                              | `src/content/work/<slug>.ts` |
| Services, clients, experience, CV                            | `src/content/about.ts`      |

Contact form messages are saved to the `contact_messages` table, which you can
read on the Layerwise Database page. To have them emailed too, set `ownerEmail`
in `src/portfolio.config.ts`.

## Add a project

1. Put your images in any folder, and name the main one `cover`. PNG, JPG, WebP,
   AVIF, TIFF, and GIF all work. SVG is rejected: render it to PNG first.

2. Pick a slug, which becomes the URL, and run:

   ```bash
   pnpm add-images my-project path/to/images
   ```

   This writes 800, 1600, and 2880 px WebP files to `public/work/my-project/`,
   never enlarging a source, and copies GIFs untouched. It records dimensions and
   blur placeholders in `src/content/work/my-project.images.ts`, and makes a
   1200 × 630 share image from the cover. Each file name becomes a key:
   `studio-wall.png` is `images.studioWall`. Use `name=path/to/file.png` to choose
   a different key, and run the command again whenever you have more images.

3. Create `src/content/work/my-project.ts`:

   ```ts
   import type { Project } from '../types';
   import { images } from './my-project.images';

   const project: Project = {
     order: 7, // Position on every list. Lower comes first.
     title: 'My project title',
     headline: ['MY', 'PROJECT'], // Display lines. Uppercase sets best.
     client: 'Client name',
     year: 2026,
     role: 'Design',
     disciplines: ['Poster'], // The filters on /work come from these.
     summary: 'One sentence for lists and link previews, under 160 characters.',
     outcome: 'What happened as a result.',
     cover: { image: images.cover, alt: 'What the cover shows.' },
     canvas: { x: 1000, y: 2050, rotation: -4, width: 480 }, // Home canvas placement.
     inks: ['pink', 'blue'], // These two color the whole case study.
     blocks: [
       { type: 'text', heading: 'The brief', body: ['First paragraph.'] },
       { type: 'full', figure: { image: images.cover, alt: 'Description.' } }
     ],
     credits: [{ role: 'Design', name: 'Your name' }]
   };

   export default project;
   ```

That's all. The project now appears on Home and Work, in the sitemap, and at
`/work/my-project`, with its cover as the share image.

**Blocks:** `full`, `pair` (two images), `gallery` (up to four), `text`, `quote`,
`video`, and `metrics`. `src/content/types.ts` documents each one, and the sample
projects use them all. For `video`, put an MP4 in the project's public folder.

**Canvas:** the sheet is 3400 × 2600 px. `x` and `y` are the piece's top-left
corner. `canvas.extras` pins more images nearby. Use `pnpm run check-types` to
catch mistakes like a misspelled image key.

## Replace the sample work

1. Delete each sample project you don't want: its `src/content/work/<slug>.ts`,
   its `src/content/work/<slug>.images.ts`, and its `public/work/<slug>/` folder.
2. Add your own projects as described above.
3. Update `src/portfolio.config.ts` and `src/content/about.ts`, replacing the
   sample social links, and replace `public/juno-reyes-cv.pdf` with your CV.
4. Headlines and form copy follow your name. Change what's left by hand: the words
   `TRES TINTAS` and `CDMX` and the slug line in `SheetArtwork`, in
   `src/components/WorkCanvas.tsx`, and the invitation in `src/routes/contact.tsx`.
5. Replace `public/og-image.jpg` with a 1200 × 630 image of your own.

`scripts/sample-art/` holds the code that drew the sample images. You can delete it
once they're gone.

## Change the fonts and colors

**Colors:** edit `colors` in `src/portfolio.config.ts`. Each project picks its two
inks by name, and page text is derived from them, always at 4.5:1 or better. If you
rename an ink, update the `inks` in each project and the ones used in
`src/styles/app.css`. Run `pnpm test` afterwards to check contrast on every pair.

**Fonts:** put a variable WOFF2 file in `public/fonts/` and edit `fonts` in
`src/portfolio.config.ts`. For the display font, set `minWidth` and `maxWidth` to
its width axis, then run:

```bash
pnpm measure-font
```

This measures every glyph so headlines still set flush on the server. Pick a font
with a wide range on the `wdth` axis. With little range, headlines lose their
pointer response and wood-type fit.

## Fonts in this template

All are self-hosted from `public/fonts/` under the SIL Open Font License 1.1.

| Font                                                         | Used for             |
| ------------------------------------------------------------ | -------------------- |
| [Anybody](https://github.com/Etcetera-Type-Co/Anybody)       | Display, width 50–150 |
| [Newsreader](https://github.com/productiontype/Newsreader)   | Text                 |
| [Martian Mono](https://github.com/evilmartians/mono)         | Labels               |

The sample artwork, not the site, also uses these OFL fonts, kept in
`scripts/sample-art/fonts/`: Fraunces, Big Shoulders Display, Unbounded, Bricolage
Grotesque, Archivo, Bowlby One, Instrument Serif, Alfa Slab One, Yellowtail,
Courier Prime, and Chango. Tezontle, used in one sample project, is drawn in code.

## Commands

```bash
pnpm add-images <slug> <files>   # Prepare images for a case study
pnpm measure-font                # Re-measure the display font
pnpm generate-logo               # Render public/logo.svg to logo.png and the favicons
pnpm run check-types             # Type check
pnpm run lint                    # Lint
pnpm test                        # Unit tests, including content checks
pnpm run build                   # Production build
pnpm run db:generate --name x    # Generate a migration after editing src/db/schema.ts
pnpm run db:migrate              # Apply migrations to the local database
```

The render scripts in `scripts/` need Chromium: `pnpm exec playwright install chromium`.

## How it's built

TanStack Start on Cloudflare Workers, server-rendered, with D1 and Drizzle for
contact messages, and `env.EMAIL` for notifications. The home canvas moves only by
CSS `transform`, with no WebGL and no repainting while panning. All three home views
are in the HTML, and CSS picks one before first paint from the screen width, the
motion preference, and the visitor's saved choice.
