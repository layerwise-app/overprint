/** The Powered by Layerwise badge. The site is always on light paper, so it uses the light badge. */
export function PoweredBy({ className }: { className?: string }) {
  return (
    <a
      href='https://layerwise.app'
      target='_blank'
      rel='noopener'
      className={className ? `powered-by ${className}` : 'powered-by'}
      draggable={false}
    >
      <img
        src='https://layerwise.app/powered-by.png'
        alt='Powered by Layerwise'
        width={174}
        height={28}
        loading='lazy'
        decoding='async'
        draggable={false}
      />
    </a>
  );
}
