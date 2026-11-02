import { site, siteUrl } from '~/lib/site';
import { portfolio } from '~/portfolio.config';

/** Schema.org data for the site's owner. Used on Home and About. */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolio.name,
    jobTitle: portfolio.role,
    description: portfolio.bio[0],
    url: siteUrl('/'),
    image: siteUrl(site.image),
    address: {
      '@type': 'PostalAddress',
      addressLocality: portfolio.location
    },
    sameAs: portfolio.socials.map((social) => social.url)
  };
}
