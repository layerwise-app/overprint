import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { disciplineSlug, disciplines, getProject, nextProject, projects } from '~/content';
import type { Block, WorkImage } from '~/content/types';
import { nearestInDirection } from '~/lib/spatial';
import { portfolio } from '~/portfolio.config';

const pub = (path: string) => resolve(import.meta.dirname, '../public', `.${path}`);

function blockImages(block: Block): WorkImage[] {
  switch (block.type) {
    case 'full':
      return [block.figure.image];
    case 'pair':
      return block.figures.map((f) => f.image);
    case 'gallery':
      return block.figures.flatMap((f) => (f ? [f.image] : []));
    case 'video':
      return [block.poster.image];
    default:
      return [];
  }
}

// The bar for the bundled sample work. Owners' own projects only have to be valid.
const SAMPLES = ['sotano-33-posters', 'archivo-temblor', 'hora-pico', 'se-rotula', 'granizo', 'tezontle'];
const samples = projects.filter((p) => SAMPLES.includes(p.slug));
const allSamples = samples.length === SAMPLES.length;
const distinctImages = (p: (typeof projects)[number]) =>
  new Set([p.cover.image.path, ...p.blocks.flatMap(blockImages).map((i) => i.path)]);

describe.runIf(samples.length > 0).each(samples.map((p) => [p.slug, p] as const))(
  'sample project %s',
  (_slug, project) => {
    it('has at least five distinct images', () => {
      expect(distinctImages(project).size).toBeGreaterThanOrEqual(5);
    });
    it('tells the whole story', () => {
      for (const heading of ['The brief', 'The constraint', 'The decisions']) {
        expect(project.blocks.some((b) => b.type === 'text' && b.heading === heading), heading).toBe(true);
      }
    });
    it('has a title that fits a search result', () => {
      expect(`${project.title}, ${portfolio.name}`.length).toBeLessThanOrEqual(62);
    });
  }
);

describe('every project', () => {
  it.each(projects.map((p) => [p.slug, p] as const))('%s is valid', (_slug, project) => {
    expect(project.summary.length, 'summary fits a search result').toBeLessThanOrEqual(160);
    expect(project.inks[0]).not.toBe(project.inks[1]);
    expect(project.cover.image.share, 'the cover needs the key `cover`').toBeTruthy();
    expect(existsSync(pub(project.cover.image.share!))).toBe(true);
    expect(project.credits.length).toBeGreaterThan(0);
    for (const image of [project.cover.image, ...project.blocks.flatMap(blockImages)]) {
      expect(image.width).toBeGreaterThan(0);
      expect(image.blur.startsWith('data:image/webp')).toBe(true);
      if (image.format === 'gif') {
        expect(existsSync(pub(`${image.path}.gif`)), `${image.path}.gif`).toBe(true);
      } else {
        for (const width of image.widths) {
          expect(existsSync(pub(`${image.path}-${width}.webp`)), `${image.path}-${width}`).toBe(true);
        }
      }
    }
    for (const block of project.blocks) {
      if (block.type === 'gallery') expect(block.figures.length).toBeLessThanOrEqual(4);
      if (block.type === 'video') expect(existsSync(pub(block.src))).toBe(true);
    }
  });

  it.runIf(allSamples)('uses every block type across the samples', () => {
    const used = new Set(samples.flatMap((p) => p.blocks.map((b) => b.type)));
    expect([...used].sort()).toEqual(['full', 'gallery', 'metrics', 'pair', 'quote', 'text', 'video']);
  });

  it('keeps pieces on the canvas', () => {
    for (const { canvas } of projects) {
      expect(canvas.x).toBeGreaterThanOrEqual(0);
      expect(canvas.x + canvas.width).toBeLessThanOrEqual(3400);
      expect(canvas.y).toBeGreaterThanOrEqual(0);
      expect(canvas.y).toBeLessThan(2600);
      expect(Math.abs(canvas.rotation)).toBeLessThanOrEqual(14);
    }
  });

  it('finds projects and wraps around at the end', () => {
    expect(getProject('nope')).toBeUndefined();
    expect(nextProject(projects[projects.length - 1].slug).slug).toBe(projects[0].slug);
  });

  it('makes URL-safe discipline slugs', () => {
    for (const name of disciplines) expect(disciplineSlug(name)).toMatch(/^[a-z0-9-]+$/);
  });
});

describe('arrow key navigation', () => {
  const pieces = [
    { x: 0, y: 0 },
    { x: 500, y: 20 },
    { x: 20, y: 500 },
    { x: 900, y: 900 }
  ];

  it('moves to the piece straight ahead', () => {
    expect(nearestInDirection(pieces[0], { x: 1, y: 0 }, pieces)).toBe(1);
    expect(nearestInDirection(pieces[0], { x: 0, y: 1 }, pieces)).toBe(2);
  });

  it('stays put when nothing lies that way', () => {
    expect(nearestInDirection(pieces[0], { x: -1, y: 0 }, pieces)).toBe(-1);
  });
});
