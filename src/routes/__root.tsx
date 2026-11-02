/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useMatches
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type * as React from 'react';
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary';
import { NotFound } from '~/components/NotFound';
import { SiteFooter } from '~/components/SiteFooter';
import { SiteHeader } from '~/components/SiteHeader';
import { VIEW_BOOT_SCRIPT } from '~/components/ViewSwitch';
import { getProject } from '~/content';
import { inkVars } from '~/lib/inks';
import { site } from '~/lib/site';
import { fontPreloads, themeCss } from '~/lib/theme';
import { portfolio } from '~/portfolio.config';
import { seo } from '~/utils/seo';
import '~/styles/app.css';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  // Site-wide defaults; each page's `seo()` overrides tags with the same name.
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: portfolio.colors.paper },
      ...(site.googleSiteVerification
        ? [
            {
              name: 'google-site-verification',
              content: site.googleSiteVerification
            }
          ]
        : []),
      ...seo({ title: site.name, description: site.description }).meta
    ],
    links: [
      ...fontPreloads(),
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' }
    ],
    scripts: [{ children: VIEW_BOOT_SCRIPT }]
  }),
  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),
  notFoundComponent: () => <NotFound />,
  component: RootComponent
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // A case study's two inks color everything on the page, header and footer included.
  const slug = useMatches({
    select: (matches) =>
      (matches.find((match) => match.routeId === '/work/$slug')?.params as
        | { slug?: string }
        | undefined)?.slug
  });
  const project = slug ? getProject(slug) : undefined;
  const isHome = useMatches({
    select: (matches) => matches.some((match) => match.routeId === '/')
  });
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        <HeadContent />
        <noscript>
          <style>{`.home-canvas{display:none!important}.home-list{display:block!important}.home-collage{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <div className='site' style={project ? inkVars(project.inks) : undefined}>
          <SiteHeader />
          {children}
          {isHome ? null : <SiteFooter />}
        </div>
        <Scripts />
      </body>
    </html>
  );
}
