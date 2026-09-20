/**
 * Scroll-sweep a section and capture frames through it.
 *
 * Section screenshots only ever show the moment a section arrives, which is
 * useless for checking a pin or a scrub — those only do anything once you're
 * inside them. This walks the page down in steps and captures each one.
 *
 *   node scripts/sweep.mjs <url> <outDir> <startPx> <stepPx> <frames>
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const [, , url = 'http://localhost:5173/', outDir = 'sweep', start = '0', step = '600', frames = '8'] =
  process.argv;

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(url, { waitUntil: 'networkidle' });
// The preloader holds the page (and body scroll) for ~3.6s; wait it out.
await page.waitForTimeout(5200);

for (let i = 0; i < Number(frames); i++) {
  const y = Number(start) + i * Number(step);
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'auto' }), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${outDir}/${String(i).padStart(2, '0')}-y${y}.png` });
  process.stdout.write(`frame ${i} at y=${y}\n`);
}

// Total document height tells us whether a pin actually added scroll distance.
const height = await page.evaluate(() => document.documentElement.scrollHeight);
console.log(`document height: ${height}px`);
if (errors.length) console.log('page errors:', errors.join(' | '));

await browser.close();
