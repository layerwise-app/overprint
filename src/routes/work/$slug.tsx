import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { CaseBlock } from '~/components/CaseBlocks';
import { Display } from '~/components/Display';
import { Picture } from '~/components/Picture';
import { getProject, nextProject, disciplineSlug } from '~/content';
import { inkVars } from '~/lib/inks';
import { siteUrl } from '~/lib/site';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    if (!getProject(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) return seo({ title: 'Not found', noindex: true });
    return seo({
      title: `${project.title}, ${portfolio.name}`,
      description: project.summary,
      path: `/work/${params.slug}`,
      image: project.cover.image.share,
      imageAlt: project.cover.alt,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        url: siteUrl(`/work/${params.slug}`),
        image: project.cover.image.share ? siteUrl(project.cover.image.share) : undefined,
        dateCreated: String(project.year),
        creator: { '@type': 'Person', name: portfolio.name, url: siteUrl('/') }
      }
    });
  },
  component: CaseStudy
});

function CaseStudy() {
  const { slug } = Route.useParams();
  const project = getProject(slug);
  if (!project) return null;
  const next = nextProject(slug);

  return (
    <main id='main' className='case'>
      <header className='case-hero'>
        <span className='case-flood' aria-hidden='true' />
        <div className='gutter'>
          <Display as='h1' lines={project.headline} />
        </div>
      </header>

      <section className='case-intro gutter'>
        <dl className='case-facts'>
          <div>
            <dt className='label'>Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt className='label'>Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className='label'>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className='label'>Disciplines</dt>
            <dd>
              {project.disciplines.map((name, index) => (
                <span key={name}>
                  {index > 0 ? ', ' : ''}
                  <Link
                    className='text-link'
                    to='/work'
                    search={{ discipline: disciplineSlug(name) }}
                  >
                    {name}
                  </Link>
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <div className='case-outcome'>
          <p className='label'>Outcome</p>
          <p className='lede'>{project.outcome}</p>
        </div>
      </section>

      <figure
        className='case-cover'
        data-tall={project.cover.image.height > project.cover.image.width || undefined}
      >
        <Picture
          image={project.cover.image}
          alt={project.cover.alt}
          sizes='(min-width: 760px) 80vw, 100vw'
          priority
        />
      </figure>

      <div className='case-blocks'>
        {project.blocks.map((block, index) => (
          <CaseBlock key={index} block={block} />
        ))}
      </div>

      <section className='case-credits gutter'>
        <h2 className='label'>Credits</h2>
        <dl>
          {project.credits.map((credit) => (
            <div key={credit.role}>
              <dt>{credit.role}</dt>
              <dd>{credit.name}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Link
        to='/work/$slug'
        params={{ slug: next.slug }}
        className='case-next'
        style={inkVars(next.inks)}
      >
        <span className='gutter case-next-inner'>
          <span className='label'>Next project</span>
          <Display as='span' lines={next.headline} decorative />
          <span className='sr-only'>{next.title}</span>
        </span>
      </Link>
    </main>
  );
}
