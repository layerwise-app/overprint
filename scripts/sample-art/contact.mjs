// Contact sheet for reviewing renders: node contact.mjs <folder> [columns]
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import { OUT } from './press.mjs';
const dir = process.argv[2];
const cols = Number(process.argv[3] ?? 4);
const cell = Number(process.argv[4] ?? 460);
const files = readdirSync(join(OUT, dir)).filter((f) => f.endsWith('.png')).sort();
const thumbs = await Promise.all(files.map((f) => sharp(join(OUT, dir, f)).resize(cell, cell, { fit: 'inside' }).toBuffer({ resolveWithObject: true })));
const rows = Math.ceil(files.length / cols);
const composite = thumbs.map((t, i) => ({ input: t.data, left: (i % cols) * (cell + 12) + 12, top: Math.floor(i / cols) * (cell + 12) + 12 }));
await sharp({ create: { width: cols * (cell + 12) + 12, height: rows * (cell + 12) + 12, channels: 3, background: '#555' } }).composite(composite).jpeg({ quality: 82 }).toFile(join(OUT, `contact-${dir}.jpg`));
console.log(files.join(' '));
