import { createFileRoute } from '@tanstack/react-router';
import { HomeCollage, HomeList } from '~/components/HomeViews';
import { WorkCanvas } from '~/components/WorkCanvas';
import { projects } from '~/content';
import { site, siteUrl } from '~/lib/site';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';
import { personJsonLd } from '~/lib/person';

export const Route = createFileRoute('/')({
  head: () =>
    seo({
      title: `${portfolio.name}, ${portfolio.role.toLowerCase()}`,
      description: site.description,
      path: '/',
      jsonLd: [
        personJsonLd(),
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: site.name,
          url: siteUrl('/')
        }
      ]
    }),
  component: Home
});

// All three views are in the HTML. CSS picks one before first paint, from the
// screen size, the motion preference, and the visitor's saved choice.
function Home() {
  return (
    <main id='main' className='home'>
      <h1 className='sr-only'>
        {portfolio.name}, {portfolio.role.toLowerCase()} in {portfolio.location}
      </h1>
      <WorkCanvas projects={projects} />
      <HomeList projects={projects} />
      <HomeCollage projects={projects} />
    </main>
  );
}
