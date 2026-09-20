/**
 * Screenshot the running site at each section, and report console errors.
 *
 * Drives the Edge install that's already on the machine via playwright-core,
 * so there is no browser binary to download. Scrolling has to be done by
 * driving the wheel rather than assigning scrollTop, because Lenis owns the
 * scroll position and would fight a direct write.
 *
 *   node scripts/shoot.mjs [url] [outDir]
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:5173/';
const outDir = process.argv[3] || 'shots';
const SECTIONS = ['home', 'about', 'skills', 'workflow', 'experience', 'projects', 'contact'];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

const problems = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') problems.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));

await page.goto(url, { waitUntil: 'networkidle' });
// Let the preloader finish (~3.6s, and it locks body scroll until it does),
// then the forest's first frames and the font swap settle, before capturing.
await page.waitForTimeout(5200);

for (const id of SECTIONS) {
  const y = await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    return el ? el.getBoundingClientRect().top + window.scrollY : null;
  }, id);

  if (y === null) {
    problems.push(`[missing] no #${id} on the page`);
    continue;
  }

  // Lenis animates toward a target, so nudge it and wait for it to arrive
  // rather than snapping — a snap would screenshot mid-reveal.
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'auto' }), y);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${outDir}/${id}.png` });
  process.stdout.write(`captured ${id}\n`);
}

await browser.close();

if (problems.length) {
  console.log('\n--- console output ---');
  for (const p of [...new Set(problems)]) console.log(p);
} else {
  console.log('\nno console errors or warnings');
}
