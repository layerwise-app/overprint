import { portfolio } from '~/portfolio.config';
import { inkVars } from './inks';

/** @font-face rules and color variables, built from src/portfolio.config.ts. */
export function themeCss() {
  const { display, text, label } = portfolio.fonts;
  const { colors } = portfolio;
  // Pages without a project of their own print headlines in pink and yellow.
  const vars = inkVars(['pink', 'yellow']) as Record<string, string>;
  // Display lines have fixed metrics, so swapping fonts never moves them. Text and
  // labels use `optional`: they are preloaded, and a late font is skipped, not swapped in.
  return `
@font-face{font-family:'${display.family}';src:url('${display.file}') format('woff2');font-weight:${display.weight};font-stretch:${display.stretch};font-display:block}
@font-face{font-family:'${text.family}';src:url('${text.file}') format('woff2');font-weight:${text.weight};font-display:optional}
@font-face{font-family:'${text.family}';src:url('${text.italicFile}') format('woff2');font-weight:${text.weight};font-style:italic;font-display:optional}
@font-face{font-family:'${label.family}';src:url('${label.file}') format('woff2');font-weight:${label.weight};font-stretch:${label.stretch};font-display:optional}
:root{
  --font-display:'${display.family}','Arial Narrow',sans-serif;
  --font-text:'${text.family}',Georgia,serif;
  --font-label:'${label.family}',ui-monospace,monospace;
  --headline-weight:${display.headlineWeight};
  --paper:${colors.paper};
  --pink:${colors.inks.pink};
  --blue:${colors.inks.blue};
  --yellow:${colors.inks.yellow};
  ${Object.entries(vars)
    .map(([key, value]) => `${key}:${value};`)
    .join('')}
  --text:${colors.text};
}`;
}

export const fontPreloads = () => {
  const { display, text, label } = portfolio.fonts;
  return [display.file, text.file, label.file].map((href) => ({
    rel: 'preload',
    as: 'font',
    type: 'font/woff2',
    href,
    crossOrigin: 'anonymous' as const
  }));
};
