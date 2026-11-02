import { createFileRoute, Link } from '@tanstack/react-router';
import { Display } from '~/components/Display';
import { Picture } from '~/components/Picture';
import { disciplines, disciplineSlug, projects } from '~/content';
import { inkVars } from '~/lib/inks';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

type Search = { discipline?: string };

export const Route = createFileRoute('/work/')({
  validateSearch: (search: Record<string, unknown>): Search =>
    typeof search.discipline === 'string' ? { discipline: search.discipline } : {},
  head: () =>
    seo({
      title: `Work, ${portfolio.name}`,
      description: `Selected work by ${portfolio.name}: ${disciplines.join(', ').toLowerCase()}.`,
      path: '/work'
    }),
  component: WorkPage
});

// Two to a row, never lined up. Placement follows order, so any filter still fits.
const LAYOUT = [
  { start: 1, span: 5, drop: 0 },
  { start: 7, span: 6, drop: 7 },
  { start: 1, span: 8, drop: 0 },
  { start: 9, span: 4, drop: 10 },
  { start: 2, span: 5, drop: 0 },
  { start: 8, span: 5, drop: 8 }
];

function WorkPage() {
  const { discipline } = Route.useSearch();
  const shown = discipline
    ? projects.filter((p) => p.disciplines.some((d) => disciplineSlug(d) === discipline))
    : projects;

  return (
    <main id='main'>
      <div className='gutter page-head'>
        <Display as='h1' lines={['WORK']} baseWidth={150} maxSize={32} />
        <nav className='filters' aria-label='Filter by discipline'>
          <Link
            to='/work'
            search={{}}
            aria-current={discipline ? undefined : 'true'}
            className='filter'
          >
            All <span className='label'>{projects.length}</span>
          </Link>
          {disciplines.map((name) => {
            const slug = disciplineSlug(name);
            const count = projects.filter((p) => p.disciplines.includes(name)).length;
            return (
              <Link
                key={slug}
                to='/work'
                search={{ discipline: slug }}
                aria-current={discipline === slug ? 'true' : undefined}
                className='filter'
              >
                {name} <span className='label'>{count}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {shown.length === 0 ? (
        <p className='gutter lede empty-note'>
          Nothing filed under that.{' '}
          <Link className='text-link' to='/work' search={{}}>
            See all the work
          </Link>
          .
        </p>
      ) : (
        <ol className='work-list gutter'>
          {shown.map((project, index) => {
            const slot = LAYOUT[index % LAYOUT.length];
            return (
              <li
                key={project.slug}
                className='work-item'
                style={{
                  ...inkVars(project.inks),
                  gridColumn: `${slot.start} / span ${slot.span}`,
                  '--drop': `${slot.drop}vw`
                } as React.CSSProperties}
              >
                <Link
                  to='/work/$slug'
                  params={{ slug: project.slug }}
                  className='work-link'
                >
                  <span className='work-figure'>
                    <span className='work-flood' aria-hidden='true' />
                    <Picture
                      image={project.cover.image}
                      alt={project.cover.alt}
                      sizes={`(min-width: 760px) ${Math.round((slot.span / 12) * 100)}vw, 100vw`}
                      priority={index === 0}
                    />
                  </span>
                  <span className='work-meta'>
                    <span className='work-title'>{project.title}</span>
                    <span className='label'>
                      {project.client}, {project.year}
                    </span>
                    <span className='work-summary'>{project.summary}</span>
                    <span className='label work-kinds'>
                      {project.disciplines.join(', ')}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
