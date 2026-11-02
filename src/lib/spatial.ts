export type Point = { x: number; y: number };

/** The next piece from `from` in a direction, favoring pieces straight ahead. */
export function nearestInDirection(from: Point, direction: Point, pieces: Point[]) {
  let best = -1;
  let bestScore = Infinity;
  pieces.forEach((piece, index) => {
    const dx = piece.x - from.x;
    const dy = piece.y - from.y;
    const ahead = dx * direction.x + dy * direction.y;
    if (ahead <= 1) return;
    const aside = Math.abs(dx * direction.y) + Math.abs(dy * direction.x);
    const score = ahead + aside * 2.2;
    if (score < bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}
