import { portfolio, type InkName } from '~/portfolio.config';

export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as Rgb;
}

export function rgbToHex(rgb: Rgb) {
  return `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
}

/** Two inks printed on top of each other. */
export function multiply(a: Rgb, b: Rgb): Rgb {
  return [(a[0] * b[0]) / 255, (a[1] * b[1]) / 255, (a[2] * b[2]) / 255];
}

function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: Rgb, b: Rgb) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

/** Prints a color again until it reads on `ground`: multiply first, then darken. */
function deepen(color: Rgb, ground: Rgb, target: number) {
  let current = color;
  let hits = 0;
  while (contrast(current, ground) < target && hits < 3) {
    current = multiply(current, color);
    hits++;
  }
  while (contrast(current, ground) < target) {
    current = [current[0] * 0.92, current[1] * 0.92, current[2] * 0.92];
  }
  return current;
}

/** The best text color on a flood of ink, always at least 4.5:1. */
function textOn(ground: Rgb, preferred: Rgb, paper: Rgb) {
  if (contrast(paper, ground) >= 4.5) return paper;
  return deepen(preferred, ground, 4.5);
}

const paperRgb = () => hexToRgb(portfolio.colors.paper);

export function inkRgb(name: InkName) {
  return hexToRgb(portfolio.colors.inks[name]);
}

export type InkTheme = {
  /** The paler ink, used for floods. */
  flood: Rgb;
  /** The darker ink, used for type and rules. */
  strong: Rgb;
  /** Both inks overprinted. */
  overprint: Rgb;
  /** Text on paper, at least 7:1. */
  text: Rgb;
  /** Text on the flood, at least 4.5:1. */
  onFlood: Rgb;
  /** Text on a flood of the strong ink, at least 4.5:1. */
  onStrong: Rgb;
  /** Large type and rules on paper, at least 3:1. */
  accent: Rgb;
};

export function inkTheme([first, second]: [InkName, InkName]): InkTheme {
  const a = inkRgb(first);
  const b = inkRgb(second);
  const paper = paperRgb();
  const [flood, strong] = luminance(a) >= luminance(b) ? [a, b] : [b, a];
  const overprint = multiply(flood, strong);
  // Strong enough on its own? Print it twice for text. Otherwise use the overprint.
  const base = contrast(strong, paper) >= 3 ? strong : overprint;
  const text = deepen(base, paper, 7);
  return {
    flood,
    strong,
    overprint,
    text,
    onFlood: textOn(flood, text, paper),
    onStrong: textOn(strong, text, paper),
    accent: deepen(base, paper, 3)
  };
}

/** Custom properties for a case study. Spread onto a style attribute. */
export function inkVars(inks: [InkName, InkName]) {
  const theme = inkTheme(inks);
  return {
    '--ink-a': portfolio.colors.inks[inks[0]],
    '--ink-b': portfolio.colors.inks[inks[1]],
    '--flood': rgbToHex(theme.flood),
    '--strong': rgbToHex(theme.strong),
    '--overprint': rgbToHex(theme.overprint),
    '--text': rgbToHex(theme.text),
    '--on-flood': rgbToHex(theme.onFlood),
    '--on-strong': rgbToHex(theme.onStrong),
    '--accent': rgbToHex(theme.accent)
  } as React.CSSProperties;
}
