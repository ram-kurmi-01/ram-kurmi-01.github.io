/**
 * Shrink the source images into web-sized WebP (and AVIF where it pays).
 *
 * Img/ holds camera-and-screenshot originals — rohit.png alone is 2.9 MB for
 * something that renders at ~400px. Originals stay put as the archive; this
 * writes optimised copies into Img/opt/ which is what the app imports.
 *
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = 'Img';
const OUT = join(SRC, 'opt');

/** Widest each image ever renders, times two for retina. */
const WIDTHS = {
  'rohit.png': 900,
  'aboutpic.jpg': 900,
  'CardMatching.png': 1400,
  'practicRealWebsite.png': 1400,
  'passwordGenerator.png': 1400,
  'library.jpg': 1400,
  'coming.png': 800,
};

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f));
let before = 0;
let after = 0;

for (const file of files) {
  const srcPath = join(SRC, file);
  const { name } = parse(file);
  const width = WIDTHS[file] ?? 1200;
  const original = statSync(srcPath).size;
  before += original;

  const img = sharp(srcPath).resize({ width, withoutEnlargement: true });
  const meta = await sharp(srcPath).metadata();

  // Alpha has to survive — the portrait is a cutout that composites onto the
  // forest, so flattening it onto white would be worse than not shrinking it.
  const webpPath = join(OUT, `${name}.webp`);
  await img.clone().webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(webpPath);
  const webpSize = statSync(webpPath).size;
  after += webpSize;

  console.log(
    `${file.padEnd(26)} ${String(meta.width).padStart(5)}px -> ${String(width).padStart(4)}px   ` +
      `${kb(original).padStart(8)} -> ${kb(webpSize).padStart(8)}  (${Math.round((1 - webpSize / original) * 100)}% smaller)`
  );
}

console.log(`\ntotal ${kb(before)} -> ${kb(after)}`);
