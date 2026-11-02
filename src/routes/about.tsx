import { createFileRoute } from '@tanstack/react-router';
import { Display } from '~/components/Display';
import { about } from '~/content/about';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';
import { personJsonLd } from '~/lib/person';

export const Route = createFileRoute('/about')({
  head: () =>
    seo({
      title: `About, ${portfolio.name}`,
      description: portfolio.bio[0],
      path: '/about',
      jsonLd: personJsonLd()
    }),
  component: AboutPage
});

function AboutPage() {
  const [lede, ...rest] = portfolio.bio;
  return (
    <main id='main' className='about'>
      <div className='gutter page-head'>
        <Display as='h1' lines={['ABOUT', portfolio.name.split(' ')[0].toUpperCase()]} baseWidth={118} maxSize={26} />
      </div>
      <section className='gutter about-bio'>
        <p className='lede lede-large'>{lede}</p>
        <div className='about-bio-rest'>
          {rest.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <a className='cv-link' href={about.cv.href} download>
            {about.cv.label}
          </a>
        </div>
      </section>

      <section className='gutter about-section'>
        <h2 className='label about-label'>Services</h2>
        <ul className='service-list'>
          {about.services.map((service) => (
            <li key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className='about-clients'>
        <div className='gutter'>
          <h2 className='label about-label'>Selected clients</h2>
          <ul>
            {about.clients.map((client) => (
              <li key={client}>
                <Display lines={[client.toUpperCase()]} maxSize={9} decorative />
                <span className='sr-only'>{client}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='gutter about-section'>
        <h2 className='label about-label'>Experience</h2>
        <ol className='experience'>
          {about.experience.map((item) => (
            <li key={item.years}>
              <span className='label'>{item.years}</span>
              <div>
                <h3>{item.title}</h3>
                <p className='experience-place'>{item.place}</p>
                <p>{item.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className='gutter about-section'>
        <h2 className='label about-label'>Recognition</h2>
        <ol className='experience experience-compact'>
          {about.recognition.map((item) => (
            <li key={item.year}>
              <span className='label'>{item.year}</span>
              <p>{item.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
