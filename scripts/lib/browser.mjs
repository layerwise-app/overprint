// Starts headless Chromium for the render scripts. Uses Playwright's own browser
// when it is installed, then any cached build, then the system Chrome.
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

function cachedChromium() {
  const cache = join(homedir(), 'Library/Caches/ms-playwright');
  if (!existsSync(cache)) return undefined;
  const builds = readdirSync(cache)
    .filter((name) => /^chromium_headless_shell-\d+$/.test(name))
    .sort()
    .reverse();
  for (const build of builds) {
    const path = join(
      cache,
      build,
      'chrome-headless-shell-mac-arm64/chrome-headless-shell'
    );
    if (existsSync(path)) return path;
  }
  return undefined;
}

export async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch {
    const executablePath = cachedChromium();
    if (executablePath) return chromium.launch({ executablePath });
    return chromium.launch({ channel: 'chrome' });
  }
}
