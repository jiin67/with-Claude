#!/usr/bin/env node
/* ==========================================================================
   Packages the game for each place it can be published.

     node tools/build.mjs            all targets
     node tools/build.mjs poki itch  only these

   Output: dist/<target>/ (playable folder) and dist/stardrift-<target>.zip
     web         GitHub Pages / any static host, no ads
     itch        itch.io HTML upload, no ads
     crazygames  CrazyGames SDK v3 (midgame + rewarded ads)
     poki        Poki SDK v2 (commercialBreak + rewardedBreak)

   Fonts are downloaded from Google Fonts into the package (needs curl and
   internet once per build) so the game makes no third-party requests except
   the portal SDK. Without internet the Google Fonts link is kept instead.
   ========================================================================== */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const TARGETS = { web: 'none', itch: 'none', crazygames: 'crazygames', poki: 'poki' };
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Chakra+Petch:wght@500;700&family=Noto+Sans+KR:wght@400;700;900&display=swap';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const want = process.argv.slice(2);
const targets = want.length ? want : Object.keys(TARGETS);
for (const t of targets) if (!TARGETS[t]) { console.error(`unknown target "${t}". Use: ${Object.keys(TARGETS).join(', ')}`); process.exit(1); }

const curl = (url, out) => execFileSync('curl', ['-fsSL', '-A', UA, ...(out ? ['-o', out] : []), url], { encoding: out ? undefined : 'utf8', maxBuffer: 1 << 26 });

/* fetch the font stylesheet and every font file once, into dist/.fonts */
function vendorFonts() {
  const dir = join(DIST, '.fonts');
  if (existsSync(join(dir, 'fonts.css'))) return dir;
  try {
    mkdirSync(join(dir, 'files'), { recursive: true });
    let css = curl(FONT_CSS);
    const urls = [...new Set(css.match(/https:\/\/[^)]+\.woff2/g) || [])];
    urls.forEach((u, i) => {
      curl(u, join(dir, 'files', basename(u)));
      if (i % 40 === 39) console.log(`  fonts ${i + 1}/${urls.length}`);
    });
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
  const out = join(DIST, target), portal = TARGETS[target];
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(ROOT, 'js'), join(out, 'js'), { recursive: true });
  cpSync(join(ROOT, 'style.css'), join(out, 'style.css'));

  let html = page;
  if (fonts) {
    cpSync(join(fonts, 'files'), join(out, 'fonts'), { recursive: true });
    cpSync(join(fonts, 'fonts.css'), join(out, 'fonts.css'));
    html = html.replace(/<link rel="preconnect"[^>]*>\n/g, '')
      .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, '<link rel="stylesheet" href="fonts.css">');
  }
  html = html.replace('<script src="js/data.js"></script>', `<script>window.STARDRIFT_PORTAL = '${portal}';</script>\n<script src="js/data.js"></script>`);
  writeFileSync(join(out, 'index.html'), html);

  const zip = join(DIST, `stardrift-${target}.zip`);
  rmSync(zip, { force: true });
  try {
    execFileSync('zip', ['-qr', zip, '.'], { cwd: out });
  } catch (e) {
    /* Windows without zip: PowerShell can do it */
    execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path '${out}\\*' -DestinationPath '${zip}'`]);
  }
  console.log(`✓ ${target.padEnd(10)} → dist/stardrift-${target}.zip`);
}
