import { Link, useRouterState } from '@tanstack/react-router';
import { portfolio } from '~/portfolio.config';
import { ViewSwitch } from './ViewSwitch';

const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <header className='site-head'>
      <a href='#main' className='skip-link'>
        Skip to content
      </a>
      <Link to='/' className='site-name'>
        {portfolio.name}
      </Link>
      <span className='site-role'>
        {portfolio.role}, {portfolio.location}
      </span>
      {pathname === '/' ? <ViewSwitch /> : null}
      <nav aria-label='Main' className='site-nav'>
        {LINKS.map((link) => (
          <Link key={link.to} to={link.to} activeProps={{ 'aria-current': 'page' }}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
