import type { InkName } from '~/portfolio.config';

/** One entry in a generated `<slug>.images.ts`. Written by scripts/add-images.mjs. */
export type WorkImage = {
  readonly path: string;
  readonly format: string;
  readonly widths: readonly number[];
  readonly width: number;
  readonly height: number;
  readonly blur: string;
  /** 1200 × 630 JPG for link previews. Only on the image named `cover`. */
  readonly share?: string;
};

export type Figure = {
  image: WorkImage;
  /** What the image shows, for people who can't see it. */
  alt: string;
};

export type Block =
  /** Runs edge to edge. */
  | { type: 'full'; figure: Figure; caption?: string }
  | { type: 'pair'; figures: [Figure, Figure]; caption?: string }
  /** Up to four images. Types enforce the limit. */
  | {
      type: 'gallery';
      figures: [Figure, Figure?, Figure?, Figure?];
      caption?: string;
    }
  /** A heading and one or more paragraphs: the brief, the constraint, the decisions. */
  | { type: 'text'; heading: string; body: string[] }
  | { type: 'quote'; quote: string; source: string }
  /** MP4 in the project's public folder. Loops silently where motion is allowed. */
  | {
      type: 'video';
      src: string;
      poster: Figure;
      width: number;
      height: number;
      caption?: string;
    }
  | { type: 'metrics'; items: { value: string; label: string }[] };

export type CanvasPlacement = {
  /** Left edge on the home canvas, in pixels, from 0 to 3000. */
  x: number;
  /** Top edge on the home canvas, in pixels, from 0 to 2200. */
  y: number;
  /** Degrees. Keep it between about -14 and 14. */
  rotation: number;
  /** Width on the canvas in pixels. */
  width: number;
};

export type Project = {
  /** Order on every list. Lower comes first. */
  order: number;
  title: string;
  /** The display headline, split into lines. Uppercase sets best. */
  headline: string[];
  client: string;
  year: number;
  role: string;
  disciplines: string[];
  /** One sentence for lists, search results, and link previews. Under 160 characters. */
  summary: string;
  /** The result, in a sentence or two. */
  outcome: string;
  cover: Figure;
  canvas: CanvasPlacement & {
    /** Further pieces pinned near the cover. Placed relative to the canvas. */
    extras?: (CanvasPlacement & { image: WorkImage })[];
  };
  /** Two inks. They color the whole case study page. */
  inks: [InkName, InkName];
  blocks: Block[];
  credits: { role: string; name: string }[];
};

export type ProjectWithSlug = Project & { slug: string };
