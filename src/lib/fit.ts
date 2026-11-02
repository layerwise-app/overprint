import { displayMetrics } from './display-metrics.gen';

const { stops, glyphs } = displayMetrics as {
  stops: number[];
  glyphs: Record<string, number[]>;
};

const MIN = stops[0];
const MAX = stops[stops.length - 1];
const FALLBACK = glyphs.N;

function advanceAt(table: number[], width: number) {
  const span = (MAX - MIN) / (stops.length - 1);
  const position = Math.min(stops.length - 1.0001, Math.max(0, (width - MIN) / span));
  const low = Math.floor(position);
  return table[low] + (table[low + 1] - table[low]) * (position - low);
}

/** Line length in em at a given width-axis value. */
export function lineLength(text: string, width: number) {
  let total = 0;
  for (const char of text) total += advanceAt(glyphs[char] ?? FALLBACK, width);
  return total / 1000;
}

/** The width-axis value that makes a line `em` long, clamped to the axis. */
export function solveWidth(text: string, em: number) {
  let low = MIN;
  let high = MAX;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    if (lineLength(text, mid) < em) low = mid;
    else high = mid;
  }
  return (low + high) / 2;
}

export type FittedLine = {
  text: string;
  /** Font size as a percentage of the container's width. */
  size: number;
  /** Width-axis value. */
  width: number;
};

/**
 * Sets every line flush to the container, wood-type style. All lines share a size
 * where they can, and the width axis takes up the difference: short words go wide,
 * long words go narrow. A line too short even at full width gets a larger size.
 */
export function fitLines(lines: string[], baseWidth = 78, maxSize = 34): FittedLine[] {
  const longest = lines.reduce(
    (a, b) => (lineLength(b, baseWidth) > lineLength(a, baseWidth) ? b : a),
    lines[0] ?? ''
  );
  const shared = Math.min(maxSize, 100 / lineLength(longest, baseWidth));
  return lines.map((text) => {
    const width = solveWidth(text, 100 / shared);
    return { text, width, size: 100 / lineLength(text, width) };
  });
}
