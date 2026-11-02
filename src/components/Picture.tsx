import type { WorkImage } from '~/content/types';

type Props = {
  image: WorkImage;
  alt: string;
  /** The `sizes` attribute: how wide the image is drawn at each breakpoint. */
  sizes: string;
  /** Above the fold: load right away. */
  priority?: boolean;
  className?: string;
};

/** A responsive image. Width, height, and blur placeholder mean no layout shift. */
export function Picture({ image, alt, sizes, priority = false, className }: Props) {
  const isGif = image.format === 'gif';
  const fallback = image.widths.find((w) => w >= 1600) ?? image.widths.at(-1);
  return (
    <img
      src={isGif ? `${image.path}.gif` : `${image.path}-${fallback}.webp`}
      srcSet={
        isGif
          ? undefined
          : image.widths.map((w) => `${image.path}-${w}.webp ${w}w`).join(', ')
      }
      sizes={isGif ? undefined : sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding='async'
      draggable={false}
      className={className ? `picture ${className}` : 'picture'}
      style={{ backgroundImage: `url(${image.blur})` }}
    />
  );
}
