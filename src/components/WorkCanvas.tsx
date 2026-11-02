import { useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import type { ProjectWithSlug } from '~/content/types';
import { inkVars } from '~/lib/inks';
import { nearestInDirection, type Point } from '~/lib/spatial';
import { portfolio } from '~/portfolio.config';
import { Display } from './Display';
import { Picture } from './Picture';

const WORLD = { width: 3400, height: 2600 };
const START = { x: 170, y: 112 };

// How quickly the view catches up with where it is headed, in milliseconds.
const CATCH_UP = { pan: 55, wheel: 110, key: 190 };
const FRICTION = 340;
// Fastest fling, in pixels per millisecond.
const MAX_SPEED = 3.2;

const DIRECTIONS: Record<string, Point> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }
};

/** Home on a large screen: every project pinned to one big sheet. */
export function WorkCanvas({ projects }: { projects: ProjectWithSlug[] }) {
  const stageRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;

    const root = document.documentElement;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pieces = [...world.querySelectorAll<HTMLAnchorElement>('[data-piece]')];
    const centers = pieces.map((piece) => ({
      x: Number(piece.dataset.cx),
      y: Number(piece.dataset.cy)
    }));

    // World coordinates of the view's top-left corner.
    const now = { ...START };
    const target = { ...START };
    const velocity = { x: 0, y: 0 };
    let catchUp = CATCH_UP.pan;
    let view = { width: stage.clientWidth, height: stage.clientHeight };
    let frame = 0;
    let last = 0;

    const clamp = (p: Point) => {
      p.x = Math.min(WORLD.width - view.width * 0.5, Math.max(-view.width * 0.5, p.x));
      p.y = Math.min(WORLD.height - view.height * 0.5, Math.max(-view.height * 0.5, p.y));
    };

    const paint = () => {
      world.style.transform = `translate3d(${-now.x}px, ${-now.y}px, 0)`;
    };

    const step = (time: number) => {
      const dt = Math.min(48, time - last || 16);
      last = time;
      if (!dragging) {
        target.x += velocity.x * dt;
        target.y += velocity.y * dt;
        const decay = Math.exp(-dt / FRICTION);
        velocity.x *= decay;
        velocity.y *= decay;
        clamp(target);
      }
      const ease = calm.matches ? 1 : 1 - Math.exp(-dt / catchUp);
      now.x += (target.x - now.x) * ease;
      now.y += (target.y - now.y) * ease;
      paint();
      const settled =
        !dragging &&
        Math.abs(target.x - now.x) < 0.2 &&
        Math.abs(target.y - now.y) < 0.2 &&
        Math.hypot(velocity.x, velocity.y) < 0.004;
      if (settled) {
        now.x = Math.round(target.x);
        now.y = Math.round(target.y);
        paint();
        delete root.dataset.panning;
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const wake = () => {
      root.dataset.panning = 'true';
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    };

    // Dragging.
    let dragging = false;
    let moved = false;
    let pointerId = -1;
    let grabX = 0;
    let grabY = 0;
    const trail: { t: number; x: number; y: number }[] = [];

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      moved = false;
      pointerId = event.pointerId;
      grabX = event.clientX + now.x;
      grabY = event.clientY + now.y;
      velocity.x = velocity.y = 0;
      catchUp = CATCH_UP.pan;
      trail.length = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      const x = grabX - event.clientX;
      const y = grabY - event.clientY;
      if (!moved && Math.hypot(x - now.x, y - now.y) < 5) return;
      if (!moved) {
        moved = true;
        stage.setPointerCapture(pointerId);
        stage.classList.add('is-dragging');
      }
      target.x = x;
      target.y = y;
      clamp(target);
      trail.push({ t: event.timeStamp, x: target.x, y: target.y });
      if (trail.length > 6) trail.shift();
      wake();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointerId) return;
      dragging = false;
      stage.classList.remove('is-dragging');
      if (!moved) return;
      const first = trail[0];
      const end = trail[trail.length - 1];
      if (first && end && end.t - first.t > 0 && event.timeStamp - end.t < 80 && !calm.matches) {
        const vx = (end.x - first.x) / (end.t - first.t);
        const vy = (end.y - first.y) / (end.t - first.t);
        const scale = Math.min(1, MAX_SPEED / (Math.hypot(vx, vy) || 1));
        velocity.x = vx * scale;
        velocity.y = vy * scale;
      }
      wake();
    };

    // A drag that ends on a piece must not open it.
    const onClick = (event: MouseEvent) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    };

    // Scrolling. Trackpads send their own inertia; a wheel's steps get smoothed.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? view.height : 1;
      target.x += (event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX) * unit;
      target.y += (event.shiftKey && !event.deltaX ? 0 : event.deltaY) * unit;
      clamp(target);
      catchUp = CATCH_UP.wheel;
      wake();
    };

    // Keyboard: arrows move between pieces, Enter follows the focused link.
    const glideTo = (index: number) => {
      const center = centers[index];
      target.x = center.x - view.width / 2;
      // A little above the middle, clear of the overprinted headline.
      target.y = center.y - view.height * 0.42;
      clamp(target);
      velocity.x = velocity.y = 0;
      catchUp = CATCH_UP.key;
      wake();
    };

    const isVisible = () => stage.offsetParent !== null || getComputedStyle(stage).position === 'fixed' && getComputedStyle(stage).display !== 'none';

    const onKeyDown = (event: KeyboardEvent) => {
      const direction = DIRECTIONS[event.key];
      if (!direction || event.altKey || event.ctrlKey || event.metaKey || !isVisible()) return;
      const active = document.activeElement;
      const inCanvas = active instanceof Element && stage.contains(active);
      if (active && active !== document.body && !inCanvas) return;
      event.preventDefault();
      const current = pieces.indexOf(active as HTMLAnchorElement);
      const from =
        current >= 0
          ? centers[current]
          : { x: now.x + view.width / 2, y: now.y + view.height / 2 };
      // From nothing, any arrow picks the piece nearest the middle of the view.
      let next = current >= 0 ? nearestInDirection(from, direction, centers) : -1;
      if (current < 0) {
        let bestDistance = Infinity;
        centers.forEach((center, index) => {
          const distance = Math.hypot(center.x - from.x, center.y - from.y);
          if (distance < bestDistance) {
            bestDistance = distance;
            next = index;
          }
        });
      }
      if (next >= 0) {
        pieces[next].focus({ preventScroll: true });
        glideTo(next);
      }
    };

    // Tabbing to a piece brings it to the middle too.
    const onFocusIn = (event: FocusEvent) => {
      const index = pieces.indexOf(event.target as HTMLAnchorElement);
      if (index >= 0) glideTo(index);
    };

    const onResize = () => {
      view = { width: stage.clientWidth, height: stage.clientHeight };
      clamp(target);
      wake();
    };

    paint();
    stage.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('click', onClick, { capture: true });
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('focusin', onFocusIn);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    window.addEventListener('overprint:view', onResize);
    stage.dataset.ready = 'true';
    return () => {
      cancelAnimationFrame(frame);
      delete root.dataset.panning;
      stage.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      stage.removeEventListener('click', onClick, { capture: true });
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('overprint:view', onResize);
    };
  }, []);

  return (
    <section
      ref={stageRef}
      className='home-canvas'
      aria-label='Work, pinned to a large sheet. Arrow keys move between pieces and Enter opens one.'
    >
      <div
        ref={worldRef}
        className='world'
        style={{
          width: WORLD.width,
          height: WORLD.height,
          transform: `translate3d(${-START.x}px, ${-START.y}px, 0)`
        }}
      >
        <SheetArtwork />
        {projects.flatMap((project) =>
          (project.canvas.extras ?? []).map((extra, index) => (
            <div
              key={`${project.slug}-${index}`}
              className='piece-extra'
              style={{
                ...inkVars(project.inks),
                left: extra.x,
                top: extra.y,
                width: extra.width,
                transform: `rotate(${extra.rotation}deg)`
              }}
            >
              <Picture image={extra.image} alt='' sizes={`${extra.width}px`} />
            </div>
          ))
        )}
        {projects.map((project, index) => {
          const { canvas, cover } = project;
          const height = (canvas.width * cover.image.height) / cover.image.width;
          return (
            <Link
              key={project.slug}
              to='/work/$slug'
              params={{ slug: project.slug }}
              data-piece=''
              data-cx={Math.round(canvas.x + canvas.width / 2)}
              data-cy={Math.round(canvas.y + height / 2)}
              className='piece'
              draggable={false}
              style={{
                ...inkVars(project.inks),
                left: canvas.x,
                top: canvas.y,
                width: canvas.width,
                transform: `rotate(${canvas.rotation}deg)`
              }}
            >
              <Picture
                image={cover.image}
                alt={cover.alt}
                sizes={`${canvas.width}px`}
                priority={index < 2}
              />
              <span className='piece-tape' aria-hidden='true' />
              <span className='piece-label'>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{project.title}</span>
                <span>{project.year}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className='canvas-headline' aria-hidden='true'>
        <Display lines={[portfolio.name.toUpperCase()]} baseWidth={128} decorative />
      </div>
      <p className='canvas-hint'>
        Drag or scroll to move. Arrow keys jump between pieces, Enter opens one.
      </p>
    </section>
  );
}

/** Everything printed on the sheet itself: big type, floods, and press marks. */
function SheetArtwork() {
  const inner = { x: 60, y: 60, w: WORLD.width - 120, h: WORLD.height - 120 };
  const crops = [
    [inner.x, inner.y],
    [inner.x + inner.w, inner.y],
    [inner.x, inner.y + inner.h],
    [inner.x + inner.w, inner.y + inner.h]
  ];
  return (
    <div className='sheet' aria-hidden='true'>
      <div className='sheet-flood sheet-flood-yellow' />
      <div className='sheet-flood sheet-flood-pink' />
      <span className='sheet-word sheet-word-1'>{portfolio.name.toUpperCase()}</span>
      <span className='sheet-word sheet-word-2'>TRES TINTAS</span>
      <span className='sheet-word sheet-word-3'>CDMX</span>
      <p className='sheet-note sheet-note-1'>{portfolio.bio[0]}</p>
      <svg
        className='sheet-marks'
        width={WORLD.width}
        height={WORLD.height}
        viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}
      >
        {crops.map(([x, y], i) => {
          const sx = x < WORLD.width / 2 ? -1 : 1;
          const sy = y < WORLD.height / 2 ? -1 : 1;
          return (
            <path
              key={i}
              d={`M${x + sx * 12} ${y} h${sx * 44} M${x} ${y + sy * 12} v${sy * 44}`}
              stroke='currentColor'
              strokeWidth='2'
              fill='none'
            />
          );
        })}
        {[
          [WORLD.width / 2, 34],
          [WORLD.width / 2, WORLD.height - 34],
          [34, WORLD.height / 2],
          [WORLD.width - 34, WORLD.height / 2]
        ].map(([x, y], i) => (
          <g key={i} stroke='currentColor' strokeWidth='2' fill='none'>
            <circle cx={x} cy={y} r='13' />
            <path d={`M${x - 22} ${y} h44 M${x} ${y - 22} v44`} />
          </g>
        ))}
      </svg>
      <p className='sheet-slug'>
        Overprint, sheet 01. {portfolio.name}, {portfolio.location}. Rosa
        fluorescente, azul medio, amarillo. Sobre papel periódico.
      </p>
      <div className='sheet-bar'>
        {['pink', 'blue', 'yellow'].map((ink) => (
          <span key={ink} style={{ background: `var(--${ink})` }} />
        ))}
      </div>
    </div>
  );
}
