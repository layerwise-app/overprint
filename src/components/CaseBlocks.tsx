import { useEffect, useRef } from 'react';
import type { Block, Figure } from '~/content/types';
import { Picture } from './Picture';

const HALF = '(min-width: 760px) 50vw, 100vw';
const ROW_ASPECT = 3.4;

/** Splits images into rows no wider than ROW_ASPECT, so none ends up too small. */
export function galleryRows(figures: Figure[]) {
  const rows: Figure[][] = [];
  let total = 0;
  for (const figure of figures) {
    const aspect = figure.image.width / figure.image.height;
    if (rows.length === 0 || total + aspect > ROW_ASPECT) {
      rows.push([]);
      total = 0;
    }
    rows[rows.length - 1].push(figure);
    total += aspect;
  }
  return rows;
}

function Caption({ text }: { text?: string }) {
  return text ? <figcaption className='label block-caption'>{text}</figcaption> : null;
}

/** Plays when on screen, unless the visitor prefers less motion. Controls stay available. */
function LoopingVideo({
  src,
  poster,
  width,
  height
}: {
  src: string;
  poster: Figure;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  const fallback = poster.image.widths.find((w) => w >= 1600) ?? poster.image.widths.at(-1);
  return (
    <video
      ref={ref}
      className='picture'
      src={src}
      poster={`${poster.image.path}-${fallback}.webp`}
      width={width}
      height={height}
      muted
      loop
      playsInline
      controls
      preload='metadata'
      aria-label={poster.alt}
    />
  );
}

export function CaseBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'full':
      return (
        <figure className='block block-full'>
          <Picture image={block.figure.image} alt={block.figure.alt} sizes='100vw' />
          <Caption text={block.caption} />
        </figure>
      );
    case 'pair':
      return (
        <figure className='block block-pair'>
          <div className='block-pair-grid'>
            {block.figures.map((figure) => (
              <Picture key={figure.image.path} image={figure.image} alt={figure.alt} sizes={HALF} />
            ))}
          </div>
          <Caption text={block.caption} />
        </figure>
      );
    case 'gallery': {
      const figures = block.figures.filter((figure): figure is Figure => Boolean(figure));
      return (
        <figure className='block block-gallery'>
          <div className='block-gallery-grid'>
            {galleryRows(figures).map((row, index) => (
              <div key={index} className='block-gallery-row'>
                {row.map((figure) => (
                  <div
                    key={figure.image.path}
                    style={{ flexGrow: figure.image.width / figure.image.height }}
                  >
                    <Picture
                      image={figure.image}
                      alt={figure.alt}
                      sizes={row.length > 2 ? '(min-width: 760px) 33vw, 100vw' : row.length > 1 ? HALF : '100vw'}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Caption text={block.caption} />
        </figure>
      );
    }
    case 'text':
      return (
        <section className='block block-text'>
          <h2 className='block-heading'>{block.heading}</h2>
          <div className='block-body'>
            {block.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </section>
      );
    case 'quote':
      return (
        <figure className='block block-quote'>
          <blockquote>{block.quote}</blockquote>
          <figcaption className='label'>{block.source}</figcaption>
        </figure>
      );
    case 'video':
      return (
        <figure className='block block-video'>
          <LoopingVideo
            src={block.src}
            poster={block.poster}
            width={block.width}
            height={block.height}
          />
          <Caption text={block.caption} />
        </figure>
      );
    case 'metrics':
      return (
        <dl className='block block-metrics'>
          {block.items.map((item) => (
            <div key={item.label}>
              <dd>{item.value}</dd>
              <dt className='label'>{item.label}</dt>
            </div>
          ))}
        </dl>
      );
  }
}
