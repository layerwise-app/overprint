import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const script = resolve(import.meta.dirname, '../scripts/add-images.mjs');
const root = mkdtempSync(join(tmpdir(), 'add-images-'));
const run = (...args: string[]) =>
  spawnSync('node', [script, ...args], {
    env: { ...process.env, ADD_IMAGES_ROOT: root },
    encoding: 'utf8'
  });
const manifest = (slug: string) =>
  JSON.parse(
    /export const images = ([\s\S]*) as const;/.exec(
      readFileSync(join(root, `src/content/work/${slug}.images.ts`), 'utf8')
    )![1]
  );

beforeAll(async () => {
  const solid = { width: 3000, height: 2000, channels: 3 as const, background: '#ff48b0' };
  await sharp({ create: solid }).png().toFile(join(root, 'cover.png'));
  await sharp({ create: { ...solid, width: 1000, height: 1000 } }).png().toFile(join(root, 'small.png'));
  await sharp({ create: { ...solid, width: 300, height: 200 } }).gif().toFile(join(root, 'loop.gif'));
  writeFileSync(join(root, 'logo.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
});

afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('scripts/add-images', () => {
  it('writes three WebP sizes, dimensions, and a blur placeholder', async () => {
    const result = run('demo', join(root, 'cover.png'));
    expect(result.status).toBe(0);
    for (const width of [800, 1600, 2880]) {
      const file = join(root, `public/work/demo/cover-${width}.webp`);
      expect((await sharp(file).metadata()).width).toBe(width);
    }
    const { cover } = manifest('demo');
    expect(cover).toMatchObject({ width: 3000, height: 2000, widths: [800, 1600, 2880], format: 'webp' });
    expect(cover.blur).toMatch(/^data:image\/webp;base64,/);
    expect(cover.blur.length).toBeLessThan(1000);
  });

  it('makes a 1200 × 630 JPG from the cover', async () => {
    const meta = await sharp(join(root, 'public/work/demo/cover-share.jpg')).metadata();
    expect([meta.format, meta.width, meta.height]).toEqual(['jpeg', 1200, 630]);
  });

  it('never enlarges a small source', () => {
    run('demo', join(root, 'small.png'));
    expect(manifest('demo').small.widths).toEqual([800, 1000]);
    expect(existsSync(join(root, 'public/work/demo/small-2880.webp'))).toBe(false);
  });

  it('keeps earlier images when run again', () => {
    expect(Object.keys(manifest('demo'))).toEqual(['cover', 'small']);
  });

  it('copies GIFs untouched', () => {
    expect(run('demo', join(root, 'loop.gif')).status).toBe(0);
    const copy = join(root, 'public/work/demo/loop.gif');
    expect(readFileSync(copy).equals(readFileSync(join(root, 'loop.gif')))).toBe(true);
    expect(manifest('demo').loop).toMatchObject({ format: 'gif', width: 300, height: 200 });
  });

  it('rejects SVG and writes nothing', () => {
    const result = run('svg-case', join(root, 'cover.png'), join(root, 'logo.svg'));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('SVG is not supported');
    expect(existsSync(join(root, 'public/work/svg-case'))).toBe(false);
  });

  it('accepts a key=file name and rejects a bad slug', () => {
    expect(run('demo', `hero-shot=${join(root, 'small.png')}`).status).toBe(0);
    expect(manifest('demo').heroShot.path).toBe('/work/demo/hero-shot');
    expect(run('Bad Slug', join(root, 'small.png')).status).toBe(1);
  });
});
