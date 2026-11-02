import { describe, expect, it } from 'vitest';
import { contrast, hexToRgb, inkTheme, multiply, rgbToHex } from '~/lib/inks';
import { portfolio, type InkName } from '~/portfolio.config';

const inks = Object.keys(portfolio.colors.inks) as InkName[];
const paper = hexToRgb(portfolio.colors.paper);
const pairs = inks.flatMap((a) => inks.filter((b) => b !== a).map((b) => [a, b] as [InkName, InkName]));

describe('multiply', () => {
  it('overprints like ink: white changes nothing and black stays black', () => {
    expect(multiply([255, 255, 255], [10, 20, 30])).toEqual([10, 20, 30]);
    expect(multiply([0, 0, 0], [200, 200, 200])).toEqual([0, 0, 0]);
  });
  it('turns pink over yellow into the expected orange', () => {
    expect(rgbToHex(multiply(hexToRgb('#ff48b0'), hexToRgb('#ffe800')))).toBe('#ff4200');
  });
});

describe('contrast on every ink pair', () => {
  it.each(pairs)('%s + %s meets the text requirements', (a, b) => {
    const theme = inkTheme([a, b]);
    expect(contrast(theme.text, paper)).toBeGreaterThanOrEqual(7);
    expect(contrast(theme.onFlood, theme.flood)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.onStrong, theme.strong)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.accent, paper)).toBeGreaterThanOrEqual(3);
  });

  it('site text on paper is at least 4.5:1', () => {
    expect(contrast(hexToRgb(portfolio.colors.text), paper)).toBeGreaterThanOrEqual(4.5);
  });
});
