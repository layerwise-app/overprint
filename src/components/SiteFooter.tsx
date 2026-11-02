import { portfolio } from '~/portfolio.config';

export function SiteFooter() {
  const { display, text, label } = portfolio.fonts;
  return (
    <footer className='site-foot'>
      <p>
        {portfolio.name}, {portfolio.location}
      </p>
      <ul>
        {portfolio.socials.map((social) => (
          <li key={social.url}>
            <a href={social.url} rel='me noreferrer'>
              {social.label}
            </a>
          </li>
        ))}
      </ul>
      <p>
        Three inks on newsprint. Set in {display.family}, {text.family}, and{' '}
        {label.family}.
      </p>
    </footer>
  );
}
