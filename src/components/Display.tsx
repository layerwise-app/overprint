import { useEffect, useMemo, useRef } from 'react';
import { fitLines } from '~/lib/fit';

type Props = {
  lines: string[];
  /** Headlines are real headings where the page needs one; decorative type is hidden. */
  as?: 'h1' | 'h2' | 'p' | 'span';
  /** Width-axis value of the longest line. */
  baseWidth?: number;
  /** Largest font size, as a percentage of the container's width. */
  maxSize?: number;
  className?: string;
  /** Skip the accessible text when the same words already appear nearby. */
  decorative?: boolean;
};

const AMPLITUDE = 80;
const AXIS_MIN = 50;
const AXIS_MAX = 150;

/**
 * Huge display type on two misregistered plates. Every line is set flush on the
 * server. On a pointer device, letters near the pointer widen and the others narrow
 * to pay for it, so the line keeps its length and nothing around it moves.
 */
export function Display({
  lines,
  as: Tag = 'p',
  baseWidth,
  maxSize,
  className,
  decorative = false
}: Props) {
  const fitted = useMemo(
    () => fitLines(lines, baseWidth, maxSize),
    [lines, baseWidth, maxSize]
  );
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    );
    if (!media.matches) return;

    const plates = [...root.querySelectorAll<HTMLElement>('[data-plate]')];
    const plateLines = plates.map((plate) => [
      ...plate.querySelectorAll<HTMLElement>('[data-line]')
    ]);
    const lineData = plateLines[0].map((line, l) => ({
      base: Number(line.dataset.line),
      chars: [...line.querySelectorAll<HTMLElement>('[data-c]')].map((el, c) => ({
        els: plateLines.map((pl) => pl[l].querySelectorAll<HTMLElement>('[data-c]')[c]),
        x: 0,
        y: 0,
        now: Number(line.dataset.line)
      }))
    }));

    let px = -9999;
    let py = -9999;
    let frame = 0;
    let measured = false;
    let radius = 200;
    let bounds = { left: 0, right: 0, top: 0, bottom: 0 };

    const measure = () => {
      const box = root.getBoundingClientRect();
      radius = Math.max(120, box.width * 0.14);
      bounds = {
        left: box.left - radius,
        right: box.right + radius,
        top: box.top - radius,
        bottom: box.bottom + radius
      };
      for (const line of lineData) {
        for (const char of line.chars) {
          const rect = char.els[0].getBoundingClientRect();
          char.x = rect.left + rect.width / 2;
          char.y = rect.top + rect.height / 2;
        }
      }
      measured = true;
    };

    const tick = () => {
      frame = 0;
      // Canvas panning moves the page under the pointer. Hold still until it stops.
      if (document.documentElement.dataset.panning) {
        measured = false;
        return;
      }
      if (!measured) measure();
      const near =
        px > bounds.left && px < bounds.right && py > bounds.top && py < bounds.bottom;
      let moving = false;
      for (const line of lineData) {
        const pull = line.chars.map((char) => {
          if (!near) return 0;
          const dx = (char.x - px) / radius;
          const dy = (char.y - py) / (radius * 1.1);
          return Math.exp(-(dx * dx + dy * dy) * 1.5);
        });
        const mean = pull.reduce((a, b) => a + b, 0) / (pull.length || 1);
        line.chars.forEach((char, i) => {
          const target = Math.min(
            AXIS_MAX,
            Math.max(AXIS_MIN, line.base + AMPLITUDE * (pull[i] - mean) * 1.6)
          );
          const next = char.now + (target - char.now) * 0.2;
          if (Math.abs(next - char.now) > 0.04) {
            char.now = next;
            for (const el of char.els) el.style.fontStretch = `${next.toFixed(1)}%`;
            moving = true;
          }
        });
      }
      if (moving) frame = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      px = event.clientX;
      py = event.clientY;
      schedule();
    };
    const onLeave = () => {
      px = py = -9999;
      schedule();
    };
    const invalidate = () => {
      measured = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', invalidate, { passive: true, capture: true });
    window.addEventListener('resize', invalidate, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', invalidate, { capture: true });
      window.removeEventListener('resize', invalidate);
    };
  }, [fitted]);

  const plate = (name: 'a' | 'b') => (
    <span className={`display-plate display-plate-${name}`} data-plate={name}>
      {fitted.map((line, l) => (
        <span
          key={l}
          className='display-line'
          data-line={line.width.toFixed(1)}
          style={{
            fontSize: `${line.size.toFixed(3)}cqw`,
            fontStretch: `${line.width.toFixed(1)}%`
          }}
        >
          {[...line.text].map((char, c) => (
            <span key={c} data-c={char}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );

  return (
    <Tag
      ref={ref as never}
      className={className ? `display ${className}` : 'display'}
      aria-hidden={decorative || undefined}
    >
      {decorative ? null : <span className='sr-only'>{lines.join(' ')}</span>}
      <span aria-hidden='true' className='display-plates'>
        {plate('a')}
        {plate('b')}
      </span>
    </Tag>
  );
}
