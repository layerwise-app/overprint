import { Link, useRouter } from '@tanstack/react-router';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Display } from './Display';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id='main' className='gutter simple-page'>
      <Display as='h1' lines={['PAPER', 'JAM']} baseWidth={100} />
      <p className='lede'>Something went wrong printing this page.</p>
      <p className='simple-actions'>
        <button type='button' className='text-link' onClick={() => void router.invalidate()}>
          Try again
        </button>
        <Link className='text-link' to='/'>
          Back to the work
        </Link>
      </p>
    </main>
  );
}
