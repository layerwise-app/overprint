import { describe, expect, it } from 'vitest';
import { fitLines, lineLength, solveWidth } from '~/lib/fit';
import { projects } from '~/content';

describe('fitLines', () => {
  it('sets every line flush to the container', () => {
    for (const line of fitLines(['SE', 'ROTULA', 'TWELVE POSTERS'])) {
      expect((lineLength(line.text, line.width) * line.size)).toBeCloseTo(100, 1);
    }
  });

  it('stays on the width axis', () => {
    for (const project of projects) {
      for (const line of fitLines(project.headline)) {
        expect(line.width).toBeGreaterThanOrEqual(50);
        expect(line.width).toBeLessThanOrEqual(150);
      }
    }
  });

  it('gives short words a wider setting than long ones at a shared size', () => {
    const [long, short] = fitLines(['TWELVE POSTERS', 'SÓTANO 33']);
    expect(short.width).toBeGreaterThan(long.width);
    expect(short.size).toBeCloseTo(long.size, 1);
  });

  it('solves width to the requested length', () => {
    expect(lineLength('HOLA', solveWidth('HOLA', 3))).toBeCloseTo(3, 2);
  });
});
