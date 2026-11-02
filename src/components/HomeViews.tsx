import { Link } from '@tanstack/react-router';
import type { ProjectWithSlug } from '~/content/types';
import { inkVars } from '~/lib/inks';
import { portfolio } from '~/portfolio.config';
import { Display } from './Display';
import { Picture } from './Picture';
import { SiteFooter } from './SiteFooter';

/** A plain index of every project. The default with reduced motion. */
export function HomeList({ projects }: { projects: ProjectWithSlug[] }) {
  return (
    <section className='home-list' aria-label='Index of work'>
      <div className='gutter'>
        <Display lines={[portfolio.name.toUpperCase()]} baseWidth={128} decorative />
        <p className='lede home-intro'>{portfolio.bio[0]}</p>
        <ol className='index'>
          {projects.map((project, index) => (
            <li key={project.slug} style={inkVars(project.inks)}>
              <Link
                to='/work/$slug'
                params={{ slug: project.slug }}
                className='index-row'
              >
                <span className='label index-number'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className='index-title'>{project.title}</span>
                <span className='label index-client'>{project.client}</span>
                <span className='label index-kind'>
                  {project.disciplines.join(', ')}
                </span>
                <span className='label index-year'>{project.year}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <SiteFooter />
    </section>
  );
}

const COLLAGE = [
  { width: 86, left: 0 },
  { width: 74, left: 26 },
  { width: 94, left: 3 },
  { width: 66, left: 6 },
  { width: 82, left: 18 },
  { width: 76, left: 0 }
];

/** Home on a phone: a collage that scrolls like any other page. */
export function HomeCollage({ projects }: { projects: ProjectWithSlug[] }) {
  return (
    <section className='home-collage' aria-label='Work'>
      <div className='gutter collage-head'>
        <Display lines={portfolio.name.toUpperCase().split(' ')} baseWidth={96} decorative />
        <p className='lede'>
          {portfolio.role} in {portfolio.location}.
        </p>
      </div>
      <ol className='collage'>
        {projects.map((project, index) => {
          const slot = COLLAGE[index % COLLAGE.length];
          const extra = project.canvas.extras?.[0];
          return (
            <li key={project.slug} className='collage-item' style={inkVars(project.inks)}>
              {extra ? (
                <div
                  className='collage-extra'
                  style={{
                    [index % 2 ? 'left' : 'right']: '-6%',
                    transform: `rotate(${extra.rotation * 0.9}deg)`
                  }}
                >
                  <Picture image={extra.image} alt='' sizes='45vw' />
                </div>
              ) : null}
              <Link
                to='/work/$slug'
                params={{ slug: project.slug }}
                className='collage-link'
                style={{
                  width: `${slot.width}%`,
                  marginLeft: `${slot.left}%`
                }}
              >
                <span
                  className='collage-figure'
                  style={{ transform: `rotate(${project.canvas.rotation * 0.5}deg)` }}
                >
                  <Picture
                    image={project.cover.image}
                    alt={project.cover.alt}
                    sizes={`${slot.width}vw`}
                    priority={index === 0}
                  />
                </span>
                <span className='collage-caption'>
                  <span className='label'>
                    {String(index + 1).padStart(2, '0')}, {project.year}
                  </span>
                  <span className='collage-title'>{project.title}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <SiteFooter />
    </section>
  );
}
