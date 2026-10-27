#!/usr/bin/env node
/* ==========================================================================
   Packages ORBIT FORGE for each place it can be published.

     node games/orbit-forge/build.mjs            all targets
     node games/orbit-forge/build.mjs crazygames only this one

   Output: games/orbit-forge/dist/<target>/ and dist/orbitforge-<target>.zip
     web / itch  no ads · crazygames  CrazyGames SDK v3 · poki  Poki SDK v2
   The Chakra Petch font is downloaded into the package (needs curl and
   internet); without internet the Google Fonts link is kept.
   ========================================================================== */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const TARGETS = { web: 'none', itch: 'none', crazygames: 'crazygames', poki: 'poki' };
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&display=swap';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const want = process.argv.slice(2);
const targets = want.length ? want : Object.keys(TARGETS);
for (const t of targets) if (!TARGETS[t]) { console.error(`unknown target "${t}". Use: ${Object.keys(TARGETS).join(', ')}`); process.exit(1); }

const curl = (url, out) => execFileSync('curl', ['-fsSL', '-A', UA, ...(out ? ['-o', out] : []), url], { encoding: out ? undefined : 'utf8' });
function vendorFonts() {
  const dir = join(DIST, '.fonts');
  if (existsSync(join(dir, 'fonts.css'))) return dir;
  try {
    mkdirSync(join(dir, 'files'), { recursive: true });
    let css = curl(FONT_CSS);
    const urls = [...new Set(css.match(/https:\/\/[^)]+\.woff2/g) || [])];
    for (const u of urls) curl(u, join(dir, 'files', basename(u)));
    for (const u of urls) css = css.split(u).join('fonts/' + basename(u));
    writeFileSync(join(dir, 'fonts.css'), css);
    return dir;
  } catch (e) {
    console.warn('! could not download fonts, keeping the Google Fonts link:', e.message.split('\n')[0]);
    rmSync(dir, { recursive: true, force: true });
    return null;
  }
}

const fonts = vendorFonts();
const page = readFileSync(join(ROOT, 'index.html'), 'utf8');
for (const target of targets) {
  const out = join(DIST, target);
  rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
  cpSync(join(ROOT, 'js'), join(out, 'js'), { recursive: true });
  cpSync(join(ROOT, 'style.css'), join(out, 'style.css'));
  let html = page;
  if (fonts) {
    cpSync(join(fonts, 'files'), join(out, 'fonts'), { recursive: true });
    cpSync(join(fonts, 'fonts.css'), join(out, 'fonts.css'));
    html = html.replace(/<link rel="preconnect"[^>]*>\n/g, '')
      .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts.css">');
  }
  html = html.replace('<script src="js/data.js"></script>', `<script>window.GAME_PORTAL = '${TARGETS[target]}';</script>\n<script src="js/data.js"></script>`);
  writeFileSync(join(out, 'index.html'), html);
  const zip = join(DIST, `orbitforge-${target}.zip`);
  rmSync(zip, { force: true });
  try { execFileSync('zip', ['-qr', zip, '.'], { cwd: out }); }
  catch (e) { execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${out}\\*' -DestinationPath '${zip}'`]); }
  console.log(`✓ ${target.padEnd(10)} → games/orbit-forge/dist/orbitforge-${target}.zip`);
}
