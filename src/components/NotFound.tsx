import { Link } from '@tanstack/react-router';
import { Display } from './Display';

export function NotFound() {
  return (
    <main id='main' className='gutter simple-page'>
      <Display as='h1' lines={['404', 'NOT PRINTED']} baseWidth={90} />
      <p className='lede'>This page never made it onto the press.</p>
      <p>
        <Link className='text-link' to='/'>
          Back to the work
        </Link>
      </p>
    </main>
  );
}
