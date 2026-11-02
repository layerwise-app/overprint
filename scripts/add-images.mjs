#!/usr/bin/env node
// Prepares images for a case study.
//
//   pnpm add-images <slug> <file-or-folder>... [key=file]...
//
// For each source it writes 800, 1600, and 2880 px WebP files to
// public/work/<slug>/, then records dimensions and a tiny blur placeholder in
// src/content/work/<slug>.images.ts, which the case study imports. A source is
// never enlarged. GIFs are copied untouched. SVGs are rejected. An image named
// `cover` also gets a 1200 × 630 JPG for link previews.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';
import sharp from 'sharp';

export const TARGET_WIDTHS = [800, 1600, 2880];
const ALLOWED = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tif', '.tiff', '.gif']);
const PAPER_FALLBACK = '#f1ebdd';

const root = resolve(process.env.ADD_IMAGES_ROOT ?? process.cwd());

function fail(message) {
  console.error(`add-images: ${message}`);
  process.exit(1);
}

/** cover-photo.PNG → coverPhoto */
function toKey(name) {
  const key = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
  return /^[0-9]/.test(key) ? `image${key}` : key;
}

const toFile = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function expand(args) {
  const sources = [];
  for (const arg of args) {
    const named = /^([A-Za-z][\w-]*)=(.+)$/.exec(arg);
    const path = resolve(named ? named[2] : arg);
    if (!existsSync(path)) fail(`no such file: ${path}`);
    if (statSync(path).isDirectory()) {
      for (const file of readdirSync(path).sort()) {
        if (!file.startsWith('.')) sources.push({ path: join(path, file) });
      }
    } else {
      sources.push({ path, key: named?.[1] });
    }
  }
  for (const source of sources) {
    const ext = extname(source.path).toLowerCase();
    if (ext === '.svg') {
      fail(`SVG is not supported: ${basename(source.path)}. Render it to PNG first, so every image has real dimensions and a srcset.`);
    }
    if (!ALLOWED.has(ext)) fail(`unsupported file type: ${basename(source.path)}`);
    source.key = toKey(source.key ?? basename(source.path, extname(source.path)));
  }
  return sources;
}

function readManifest(file) {
  if (!existsSync(file)) return {};
  const text = readFileSync(file, 'utf8');
  const start = text.indexOf('{', text.indexOf('export const images'));
  const end = text.lastIndexOf('} as const');
  return JSON.parse(text.slice(start, end + 1));
}

async function blurOf(path) {
  const data = await sharp(path, { pages: 1 }).resize(20).webp({ quality: 30 }).toBuffer();
  return `data:image/webp;base64,${data.toString('base64')}`;
}

async function paperColor() {
  try {
    const { portfolio } = await import(join(root, 'src/portfolio.config.ts'));
    return portfolio.colors.paper;
  } catch {
    return PAPER_FALLBACK;
  }
}

async function process1(source, slug, outDir) {
  const meta = await sharp(source.path, { pages: 1 }).metadata();
  const width = meta.autoOrient?.width ?? meta.width;
  const height = meta.autoOrient?.height ?? meta.pageHeight ?? meta.height;
  const file = toFile(source.key);
  const blur = await blurOf(source.path);
  const base = `/work/${slug}/${file}`;

  if (extname(source.path).toLowerCase() === '.gif') {
    copyFileSync(source.path, join(outDir, `${file}.gif`));
    return { path: base, format: 'gif', widths: [width], width, height, blur };
  }

  const widths = TARGET_WIDTHS.filter((w) => w <= width);
  if (widths.length < TARGET_WIDTHS.length && !widths.includes(width)) widths.push(width);
  for (const w of widths) {
    await sharp(source.path)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w > 1600 ? 72 : 76, effort: 5 })
      .toFile(join(outDir, `${file}-${w}.webp`));
  }

  const entry = { path: base, format: 'webp', widths, width, height, blur };
  if (source.key === 'cover') {
    // Share images must be JPG or PNG. Wide covers fill the frame; tall ones sit on paper.
    const wide = width / height >= 1.5;
    await sharp(source.path)
      .rotate()
      .resize(1200, 630, wide ? { fit: 'cover' } : { fit: 'contain', background: await paperColor() })
      .flatten({ background: await paperColor() })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(outDir, 'cover-share.jpg'));
    entry.share = `/work/${slug}/cover-share.jpg`;
  }
  return entry;
}

async function main() {
  const [slug, ...args] = process.argv.slice(2);
  if (!slug || args.length === 0) {
    fail('usage: pnpm add-images <slug> <file-or-folder>... [key=file]...');
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    fail(`slug must be lowercase words joined by hyphens: ${slug}`);
  }
  const sources = expand(args);
  if (sources.length === 0) fail('no images found');

  const outDir = join(root, 'public/work', slug);
  const contentDir = join(root, 'src/content/work');
  mkdirSync(outDir, { recursive: true });
  mkdirSync(contentDir, { recursive: true });
  const manifestFile = join(contentDir, `${slug}.images.ts`);
  const manifest = readManifest(manifestFile);

  for (const source of sources) {
    manifest[source.key] = await process1(source, slug, outDir);
    const m = manifest[source.key];
    console.log(`${source.key}: ${m.width}×${m.height}, ${m.format === 'gif' ? 'GIF copied untouched' : `${m.widths.join(', ')} px`}`);
  }

  writeFileSync(
    manifestFile,
    `// Written by scripts/add-images.mjs. Run it again rather than editing this file.\nexport const images = ${JSON.stringify(manifest, null, 2)} as const;\n`
  );
  console.log(`Wrote ${sources.length} image(s) to public/work/${slug} and src/content/work/${slug}.images.ts`);
}

await main();
