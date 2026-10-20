'use strict';
/* ==========================================================================
   Rendering: canvas setup, glow sprites, background, world and effects.
   ========================================================================== */
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
let VW = 0, VH = 0, DPR = 1, SC = 1;
/* render quality: 2 full, 1 sharper-but-cheaper (1x pixels, fewer glows), 0 minimal effects */
let QUALITY = 2;
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, QUALITY >= 2 ? 2 : 1);
  VW = innerWidth; VH = innerHeight;
  cv.width = Math.floor(VW * DPR); cv.height = Math.floor(VH * DPR);
  cv.style.width = VW + 'px'; cv.style.height = VH + 'px';
  SC = clamp(Math.min(VW, VH) / 760, .58, 1.15);
  window.__redraw = true;
}
addEventListener('resize', resize); resize();

const glowCache = new Map();
function glow(color, r, a = .55) {
  r = Math.max(4, Math.round(r));
  const k = color + r + a;
  let c = glowCache.get(k);
  if (!c) {
    c = document.createElement('canvas'); c.width = c.height = r * 2;
    const g = c.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r);
    gr.addColorStop(0, hexA(color, a)); gr.addColorStop(.35, hexA(color, a * .45)); gr.addColorStop(1, hexA(color, 0));
    g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2);
    glowCache.set(k, c);
  }
  return c;
}
function drawGlow(color, x, y, r, a) { const s = glow(color, r, a); ctx.drawImage(s, x - s.width / 2, y - s.height / 2); }

/* nebula per stage palette, generated once per stage */
const nebCache = {};
function nebula(cols) {
  const key = cols.join();
  if (nebCache[key]) return nebCache[key];
  const s = 1024, c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d');
  let seed = key.length * 97;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 15; i++) {
    const col = cols[i % cols.length], a = .06 + r() * .1, x = r() * s, y = r() * s, rad = 160 + r() * 240;
    for (const ox of [-s, 0, s]) for (const oy of [-s, 0, s]) {
      const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad);
      gr.addColorStop(0, hexA(col, a)); gr.addColorStop(1, hexA(col, 0));
      g.fillStyle = gr; g.fillRect(x + ox - rad, y + oy - rad, rad * 2, rad * 2);
    }
  }
  return (nebCache[key] = c);
}
const STAR_TILE = 900;
const STARS = [.15, .35, .6].map((f, li) => ({
  f, list: Array.from({ length: 70 - li * 15 }, () => ({ x: rnd(STAR_TILE), y: rnd(STAR_TILE), s: rnd(.6, 1.4) + li * .5, tw: rnd(TAU), c: Math.random() < .18 ? '#ffd9f0' : Math.random() < .3 ? '#bdf6ff' : '#ffffff' }))
}));
let menuNeb = STAGES[0].neb;

function drawBackground(cx, cy) {
  const neb = nebula(G && G.stage ? G.stage.neb : menuNeb);
  const nf = .08, ox = (-(cx * nf * SC) % 1024 + 1024) % 1024, oy = (-(cy * nf * SC) % 1024 + 1024) % 1024;
  for (let x = ox - 1024; x < VW; x += 1024) for (let y = oy - 1024; y < VH; y += 1024) ctx.drawImage(neb, x, y);
  const tt = performance.now() / 1000;
  for (const L of STARS) {
    const sx = (-(cx * L.f * SC) % STAR_TILE + STAR_TILE) % STAR_TILE, sy = (-(cy * L.f * SC) % STAR_TILE + STAR_TILE) % STAR_TILE;
    for (let tx = sx - STAR_TILE; tx < VW; tx += STAR_TILE) for (let ty = sy - STAR_TILE; ty < VH; ty += STAR_TILE) {
      for (const s of L.list) {
        const x = tx + s.x, y = ty + s.y; if (x < -2 || y < -2 || x > VW + 2 || y > VH + 2) continue;
        ctx.globalAlpha = .45 + .4 * Math.sin(tt * 1.7 + s.tw);
        ctx.fillStyle = s.c; ctx.fillRect(x, y, s.s, s.s);
      }
    }
  }
  ctx.globalAlpha = 1;
}

function shapePath(shape, r, t, c = ctx) {
  c.beginPath();
  switch (shape) {
    case 'diamond': c.moveTo(r, 0); c.lineTo(0, r * .72); c.lineTo(-r, 0); c.lineTo(0, -r * .72); c.closePath(); break;
    case 'tri': c.moveTo(r * 1.1, 0); c.lineTo(-r * .8, r * .8); c.lineTo(-r * .4, 0); c.lineTo(-r * .8, -r * .8); c.closePath(); break;
    case 'hex': for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); break;
    case 'ring': c.arc(0, 0, r, 0, TAU); c.moveTo(r * .45, 0); c.arc(0, 0, r * .45, 0, TAU); break;
    case 'square': c.rect(-r * .8, -r * .8, r * 1.6, r * 1.6); break;
    case 'needle': c.moveTo(r * 1.5, 0); c.lineTo(0, r * .45); c.lineTo(-r * .9, 0); c.lineTo(0, -r * .45); c.closePath(); break;
    case 'mine': for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? r * .7 : r * 1.05; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); break;
    case 'cross': { const w = r * .38; c.moveTo(-w, -r); c.lineTo(w, -r); c.lineTo(w, -w); c.lineTo(r, -w); c.lineTo(r, w); c.lineTo(w, w); c.lineTo(w, r); c.lineTo(-w, r); c.lineTo(-w, w); c.lineTo(-r, w); c.lineTo(-r, -w); c.lineTo(-w, -w); c.closePath(); break; }
    case 'phase': c.moveTo(r, 0); c.lineTo(0, r); c.lineTo(-r, 0); c.lineTo(0, -r); c.closePath(); c.moveTo(r * .45, 0); c.lineTo(0, r * .45); c.lineTo(-r * .45, 0); c.lineTo(0, -r * .45); c.closePath(); break;
    case 'blob': for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, rr = r * (1 + .1 * Math.sin(t * 4 + i * 1.7)); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); break;
    case 'chevron': c.moveTo(r, 0); c.lineTo(-r * .7, r * .9); c.lineTo(-r * .2, 0); c.lineTo(-r * .7, -r * .9); c.closePath(); break;
    case 'boss': for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = i % 2 ? r * .62 : r * (1 + .06 * Math.sin(t * 6 + i)); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); break;
    case 'twin': c.arc(0, 0, r, 0, TAU); c.moveTo(r * .55 + r * .2, 0); c.arc(r * .2, 0, r * .55, 0, TAU); break;
    case 'crystal': for (let i = 0; i < 6; i++) { const a = i / 6 * TAU, rr = i % 2 ? r * .7 : r * 1.1; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.moveTo(0, -r * 1.1); c.lineTo(0, r * 1.1); break;
    case 'eye': c.ellipse(0, 0, r, r * .62, 0, 0, TAU); c.moveTo(r * .35, 0); c.arc(0, 0, r * .35, 0, TAU); break;
    case 'queen': for (let i = 0; i < 10; i++) { const a = i / 10 * TAU - Math.PI / 2, rr = i % 2 ? r * .5 : r * 1.05; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); break;
    case 'engine': for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + Math.PI / 8; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.rect(-r * .35, -r * .35, r * .7, r * .7); break;
  }
}
function shipPath(r, c = ctx) { c.beginPath(); c.moveTo(r * 1.33, 0); c.lineTo(-r * .83, r * .92); c.lineTo(-r * .42, 0); c.lineTo(-r * .83, -r * .92); c.closePath(); }

function render(dt) {
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = '#070614'; ctx.fillRect(0, 0, VW, VH);
  let cx, cy;
  const inRun = G && G.state !== 'menu';
  if (inRun) {
    cam.x += (P.x - cam.x) * Math.min(1, dt * 8); cam.y += (P.y - cam.y) * Math.min(1, dt * 8);
    cx = cam.x; cy = cam.y;
  } else { idleT += dt; cx = idleT * 30; cy = idleT * 12; }
  drawBackground(cx, cy);
  if (!inRun) return;

  const sh = REDUCED || !SETTINGS.shake ? 0 : G.shake, shx = rnd(-sh, sh), shy = rnd(-sh, sh);
  ctx.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * (VW / 2 - cx * SC + shx), DPR * (VH / 2 - cy * SC + shy));
  const hw = VW / 2 / SC + 80, hh = VH / 2 / SC + 80;
  const vis = (x, y) => x > cx - hw && x < cx + hw && y > cy - hh && y < cy + hh;
  const now = performance.now() / 1000;

  /* grid */
  ctx.strokeStyle = `rgba(${G.stage.grid},.07)`; ctx.lineWidth = 1; ctx.beginPath();
  const gs = 160;
  for (let x = Math.floor((cx - hw) / gs) * gs; x < cx + hw; x += gs) { ctx.moveTo(x, cy - hh); ctx.lineTo(x, cy + hh); }
  for (let y = Math.floor((cy - hh) / gs) * gs; y < cy + hh; y += gs) { ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y); }
  ctx.stroke();

  /* singularities (under everything) */
  for (const h of holes) {
    const k = Math.min(1, (h.max - h.life) * 4) * Math.min(1, h.life * 3);
    const gr = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.R);
    gr.addColorStop(0, `rgba(0,0,0,${.9 * k})`); gr.addColorStop(.35, `rgba(60,20,120,${.5 * k})`); gr.addColorStop(1, 'rgba(120,60,255,0)');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(h.x, h.y, h.R, 0, TAU); ctx.fill();
    ctx.strokeStyle = hexA(COL.sing, .6 * k); ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(h.x, h.y, h.R * (.3 + .22 * i), now * (2 + i) + i, now * (2 + i) + i + 2.2); ctx.stroke(); }
  }
  /* hazards */
  for (const h of hazards) {
    if (h.warn > 0) {
      const k = 1 - h.warn / h.max;
      ctx.fillStyle = hexA(h.color, .08 + .14 * k); ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, TAU); ctx.fill();
      ctx.strokeStyle = hexA(h.color, .5 + .4 * Math.sin(now * 20)); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(h.x, h.y, h.r * k, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, TAU); ctx.stroke();
    } else if (h.k === 'zone') {
      ctx.fillStyle = hexA(h.color, .3 + .08 * Math.sin(now * 8)); ctx.beginPath(); ctx.arc(h.x, h.y, h.r, 0, TAU); ctx.fill();
      ctx.strokeStyle = hexA(h.color, .9); ctx.lineWidth = 2.5; ctx.stroke();
    }
  }
  /* mines */
  for (const m of mines) {
    if (!vis(m.x, m.y)) continue;
    const on = m.arm <= 0, blink = on && Math.sin(m.t * 8) > 0;
    ctx.strokeStyle = hexA(COL.mine, on ? .9 : .4); ctx.fillStyle = blink ? COL.mine : hexA(COL.mine, .2); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(m.x, m.y, 6, 0, TAU); ctx.fill(); ctx.stroke();
    if (m.life < 2 && Math.sin(m.t * 20) > 0) continue;
    ctx.strokeStyle = hexA(COL.mine, .12); ctx.beginPath(); ctx.arc(m.x, m.y, m.R, 0, TAU); ctx.stroke();
  }

  /* glow pass */
  ctx.globalCompositeOperation = 'lighter';
  if (QUALITY > 0) for (const g of gems) if (vis(g.x, g.y)) drawGlow(COL['xp' + g.tier], g.x, g.y, 12 + g.tier * 4, .5);
  for (const p of pickups) if (vis(p.x, p.y)) drawGlow(COL[p.k], p.x, p.y, 34, .6);
  const lite = QUALITY < 2 || enemies.length > 220;
  for (const e of enemies) if (vis(e.x, e.y) && !(e.fade > 0) && !(lite && e.r < 14 && !e.elite)) drawGlow(e.elite ? COL.elite : e.color, e.x, e.y, e.r * 2.6, e.type === 'boss' ? .55 : .42);
  for (const b of ebullets) if (vis(b.x, b.y)) drawGlow(b.snipe ? COL.sniper : b.missile ? '#ff5577' : COL.ebullet, b.x, b.y, b.r * 3.2, .7);
  for (const b of bullets) drawGlow(b.kind === 'wing' ? COL.wing : P.color, b.x, b.y, 14, .6);
  for (const m of missiles) drawGlow(COL.missile, m.x, m.y, 18, .7);
  for (const d of discs) drawGlow(COL.disc, d.x, d.y, d.r * 2.6, .6);
  for (const w of wings) drawGlow(COL.wing, w.x, w.y, 22, .5);
  drawGlow(P.color, P.x, P.y, 46, .45);
  ctx.globalCompositeOperation = 'source-over';

  /* gems */
  for (const g of gems) {
    if (!vis(g.x, g.y)) continue;
    const r = 3 + g.tier * 1.6;
    ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.rot);
    ctx.fillStyle = COL['xp' + g.tier];
    ctx.beginPath(); ctx.moveTo(0, -r * 1.3); ctx.lineTo(r, 0); ctx.lineTo(0, r * 1.3); ctx.lineTo(-r, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  /* pickups */
  for (const p of pickups) {
    if (!vis(p.x, p.y)) continue;
    const bob = Math.sin(p.t * 4) * 3;
    ctx.save(); ctx.translate(p.x, p.y + bob);
    ctx.lineWidth = 2.5; ctx.strokeStyle = COL[p.k]; ctx.fillStyle = hexA(COL[p.k], .18);
    if (p.k === 'heal') { ctx.beginPath(); ctx.rect(-4, -11, 8, 22); ctx.rect(-11, -4, 22, 8); ctx.fill(); ctx.stroke(); }
    else if (p.k === 'magnet') { ctx.beginPath(); ctx.arc(0, 0, 11, Math.PI, 0); ctx.lineTo(11, 9); ctx.moveTo(-11, 9); ctx.lineTo(-11, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill(); ctx.stroke(); }
    else { ctx.rotate(p.t); ctx.beginPath(); ctx.rect(-11, -11, 22, 22); ctx.fill(); ctx.stroke(); ctx.rotate(-p.t * 2); ctx.beginPath(); ctx.rect(-6, -6, 12, 12); ctx.stroke(); }
    ctx.restore();
  }

  /* telegraphs */
  ctx.lineCap = 'butt';
  for (const e of enemies) {
    if (!vis(e.x, e.y)) continue;
    if (e.type === 'dasher' && e.st === 'wind') {
      ctx.strokeStyle = hexA(COL.dasher, .25 + .5 * (1 - e.stT / .6)); ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.aim) * 200, e.y + Math.sin(e.aim) * 200); ctx.stroke(); ctx.setLineDash([]);
    } else if (e.type === 'sniper' && e.st === 'aim') {
      const k = 1 - e.stT / 1, locked = e.stT < .3, L = locked ? 900 : 260 + 400 * k;
      ctx.strokeStyle = hexA(COL.sniper, locked ? .75 : .08 + .2 * k); ctx.lineWidth = locked ? 2.5 : 1;
      ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(e.aim) * L, e.y + Math.sin(e.aim) * L); ctx.stroke();
    } else if (e.type === 'phaser' && e.st === 'blink') {
      ctx.strokeStyle = hexA(COL.phaser, .4 + .5 * Math.sin(now * 30)); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(e.bx, e.by, 14, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(e.bx - 8, e.by); ctx.lineTo(e.bx + 8, e.by); ctx.moveTo(e.bx, e.by - 8); ctx.lineTo(e.bx, e.by + 8); ctx.stroke();
    } else if (e.type === 'warder') {
      ctx.strokeStyle = hexA(COL.warder, .18); ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.arc(e.x, e.y, 150, now * .5, now * .5 + TAU); ctx.stroke(); ctx.setLineDash([]);
    } else if (e.type === 'bomber' && e.st === 'fuse') {
      ctx.fillStyle = hexA(COL.bomber, .1 + .15 * (1 - e.stT / .8)); ctx.beginPath(); ctx.arc(e.x, e.y, 95, 0, TAU); ctx.fill();
      ctx.strokeStyle = hexA(COL.bomber, .6); ctx.lineWidth = 1.5; ctx.stroke();
    }
  }
  for (const b of G.bosses) {
    if (b.windT > 0 && b.pat === 'charge') {
      ctx.strokeStyle = hexA(b.color, .18); ctx.lineWidth = b.r * 1.2;
      ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x + Math.cos(b.aim) * 230, b.y + Math.sin(b.aim) * 230); ctx.stroke();
    }
    if (b.beams) {
      for (const a of b.beams) {
        const ex = b.x + Math.cos(a) * 900, ey = b.y + Math.sin(a) * 900;
        if (b.beamWarn > 0) {
          ctx.strokeStyle = hexA(b.color, .25 + .35 * Math.sin(now * 24)); ctx.lineWidth = 2; ctx.setLineDash([12, 10]);
          ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
        } else if (b.pt >= .4) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = hexA(b.color, .35); ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.strokeStyle = '#ffe9ef'; ctx.lineWidth = 6; ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
  }

  /* enemies */
  for (const e of enemies) {
    if (!vis(e.x, e.y)) continue;
    if (e.fade > 0) ctx.globalAlpha = .3;
    ctx.save(); ctx.translate(e.x, e.y);
    const faceVel = e.type === 'drone' || e.type === 'mite' || e.type === 'dasher' || e.type === 'orbiter';
    let rot = faceVel ? Math.atan2(e.vy, e.vx) : e.rot;
    if ((e.type === 'dasher' && e.st === 'wind') || e.type === 'sniper') rot = e.aim !== undefined ? e.aim : Math.atan2(P.y - e.y, P.x - e.x);
    ctx.rotate(rot);
    shapePath(e.shape, e.r, now);
    const blink = e.type === 'bomber' && e.st === 'fuse' && Math.sin(now * 40) > 0;
    const c = e.flash > 0 || blink ? '#ffffff' : e.color;
    ctx.fillStyle = e.flash > 0 || blink ? '#ffffff' : hexA(e.color, e.type === 'boss' ? .35 : .22); ctx.fill('evenodd');
    ctx.lineWidth = e.type === 'boss' ? 3.5 : 2; ctx.strokeStyle = c; ctx.stroke();
    if (e.elite) { ctx.strokeStyle = COL.elite; ctx.lineWidth = 1.5; shapePath(e.shape, e.r + 5, now); ctx.stroke(); }
    if (e.type === 'boss') { ctx.rotate(-e.rot * 2.2); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; shapePath('hex', e.r * .4, now); ctx.stroke(); }
    ctx.restore();
    ctx.globalAlpha = 1;
    if ((e.elite || e.type === 'brute' || e.type === 'brood' || e.type === 'warder') && e.hp < e.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(e.x - e.r, e.y + e.r + 6, e.r * 2, 3);
      ctx.fillStyle = e.elite ? COL.elite : e.color; ctx.fillRect(e.x - e.r, e.y + e.r + 6, e.r * 2 * Math.max(0, e.hp / e.maxHp), 3);
    }
  }
  /* enemy bullets */
  ctx.fillStyle = '#fff4fa';
  for (const b of ebullets) { if (!vis(b.x, b.y)) continue; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * .55, 0, TAU); ctx.fill(); }
  ctx.lineWidth = 2;
  for (const b of ebullets) {
    if (!vis(b.x, b.y)) continue;
    ctx.strokeStyle = b.snipe ? COL.sniper : b.missile ? '#ff5577' : COL.ebullet;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, TAU); ctx.stroke();
    if (b.snipe) { ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .05, b.y - b.vy * .05); ctx.stroke(); }
  }
  /* player bullets */
  ctx.lineCap = 'round'; ctx.lineWidth = 3;
  ctx.strokeStyle = COL.pbullet; ctx.beginPath();
  for (const b of bullets) if (b.kind !== 'wing') { ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .022, b.y - b.vy * .022); }
  ctx.stroke();
  ctx.strokeStyle = COL.wing; ctx.lineWidth = 2.4; ctx.beginPath();
  for (const b of bullets) if (b.kind === 'wing') { ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * .016, b.y - b.vy * .016); }
  ctx.stroke();
  for (const m of missiles) {
    ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.a);
    ctx.fillStyle = COL.missile; ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-5, 4); ctx.lineTo(-5, -4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  for (const d of discs) {
    ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.spin);
    ctx.strokeStyle = COL.disc; ctx.lineWidth = 2.5; ctx.fillStyle = hexA(COL.disc, .25);
    ctx.beginPath(); for (let i = 0; i < 3; i++) { const a = i / 3 * TAU; ctx.moveTo(0, 0); ctx.arc(0, 0, d.r, a, a + 1.2); ctx.closePath(); } ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  /* laser */
  if (W.laser) {
    const o = laserInfo();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < o.n; i++) {
      const a = G.laserA + i / o.n * TAU, ex = P.x + Math.cos(a) * o.len, ey = P.y + Math.sin(a) * o.len;
      ctx.strokeStyle = hexA(COL.laser, .25); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = hexA(COL.laser, .95); ctx.lineWidth = 2.5; ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  /* orbit blades */
  if (W.orbit) {
    const o = orbitInfo();
    ctx.strokeStyle = hexA(COL.blade, .12); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(P.x, P.y, o.R, 0, TAU); ctx.stroke();
    for (let i = 0; i < o.n; i++) {
      const a = G.orbitA + i / o.n * TAU, bx = P.x + Math.cos(a) * o.R, by = P.y + Math.sin(a) * o.R;
      ctx.globalCompositeOperation = 'lighter'; drawGlow(COL.blade, bx, by, o.sz * 2.6, .55); ctx.globalCompositeOperation = 'source-over';
      ctx.save(); ctx.translate(bx, by); ctx.rotate(a + Math.PI / 2);
      ctx.fillStyle = '#e8fdff'; ctx.beginPath(); ctx.moveTo(o.sz * 1.3, 0); ctx.lineTo(0, o.sz * .38); ctx.lineTo(-o.sz * 1.3, 0); ctx.lineTo(0, -o.sz * .38); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }
  /* wingmen */
  for (const w of wings) {
    ctx.save(); ctx.translate(w.x, w.y); ctx.rotate(w.ang || 0);
    ctx.fillStyle = '#1a0d1e'; ctx.strokeStyle = COL.wing; ctx.lineWidth = 1.8; shipPath(7); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  /* player */
  if (!(P.inv > 0 && Math.floor(now * 20) % 2)) {
    ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(P.ang);
    const fl = 6 + Math.random() * 6 * Math.min(1, Math.hypot(P.vx, P.vy) / 120);
    ctx.fillStyle = '#ffd27a'; ctx.beginPath(); ctx.moveTo(-9, -4); ctx.lineTo(-9 - fl, 0); ctx.lineTo(-9, 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#0d1a2e'; ctx.strokeStyle = P.color; ctx.lineWidth = 2.4; ctx.lineJoin = 'round';
    shipPath(12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(4, 0, 2.6, 0, TAU); ctx.fill();
    ctx.restore();
  }
  if (G.shieldOn) {
    ctx.strokeStyle = hexA(COL.player, .55 + .2 * Math.sin(now * 5)); ctx.lineWidth = 2;
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + now * .8; ctx.lineTo(P.x + Math.cos(a) * 24, P.y + Math.sin(a) * 24); } ctx.closePath(); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(P.x - 16, P.y + 22, 32, 3);
  ctx.fillStyle = P.hp / P.maxHp < .3 ? '#ff3355' : COL.heal; ctx.fillRect(P.x - 16, P.y + 22, 32 * P.hp / P.maxHp, 3);

  /* fx */
  ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  for (const f of fx) {
    const k = 1 - f.life / f.max;
    if (f.k === 'ring') {
      ctx.strokeStyle = hexA(f.color, (1 - k) * .9); ctx.lineWidth = (f.w || 3) * (1 - k) + 1;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r0 + (f.r1 - f.r0) * (1 - Math.pow(1 - k, 3)), 0, TAU); ctx.stroke();
    } else if (f.k === 'bolt') {
      for (const [w, a] of [[7, .25], [2.2, 1]]) {
        ctx.strokeStyle = hexA(f.color, a * (1 - k)); ctx.lineWidth = w; ctx.beginPath();
        f.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      }
    } else if (f.k === 'beam') {
      ctx.strokeStyle = hexA(f.color, .35 * (1 - k)); ctx.lineWidth = f.w * 2.4 * (1 - k * .5); ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke();
      ctx.strokeStyle = hexA('#ffffff', 1 - k); ctx.lineWidth = Math.max(1, f.w * .5 * (1 - k)); ctx.stroke();
    }
  }
  const pStep = QUALITY === 0 ? 2 : 1;
  for (let i = 0; i < parts.length; i += pStep) {
    const p = parts[i];
    if (!vis(p.x, p.y)) continue;
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = p.color; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const t of texts) {
    ctx.globalAlpha = Math.min(1, t.life / t.max * 2);
    ctx.font = (t.crit ? '700 17px ' : '600 12px ') + '"Chakra Petch", ui-monospace, monospace';
    ctx.fillStyle = t.heal ? COL.heal : t.crit ? COL.xp1 : '#f1eeff';
    ctx.fillText(t.txt, t.x, t.y);
  }
  ctx.globalAlpha = 1;

  /* screen space */
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  for (const b of G.bosses) {
    const sx = VW / 2 + (b.x - cx) * SC, sy = VH / 2 + (b.y - cy) * SC;
    if (sx < 0 || sy < 0 || sx > VW || sy > VH) {
      const a = Math.atan2(sy - VH / 2, sx - VW / 2), ex = clamp(sx, 30, VW - 30), ey = clamp(sy, 120, VH - 70);
      ctx.save(); ctx.translate(ex, ey); ctx.rotate(a); ctx.fillStyle = b.color;
      ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-8, 9); ctx.lineTo(-8, -9); ctx.closePath(); ctx.fill(); ctx.restore();
    }
  }
  if (joy.on) {
    ctx.strokeStyle = 'rgba(126,240,255,.35)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(joy.bx, joy.by, 56, 0, TAU); ctx.stroke();
    const dx = joy.x - joy.bx, dy = joy.y - joy.by, d = Math.hypot(dx, dy), m = Math.min(d, 56);
    ctx.fillStyle = 'rgba(126,240,255,.4)'; ctx.beginPath(); ctx.arc(joy.bx + (d ? dx / d * m : 0), joy.by + (d ? dy / d * m : 0), 20, 0, TAU); ctx.fill();
  }
  if (G.hurt > 0 || P.hp / P.maxHp < .25) {
    const a = Math.max(G.hurt, P.hp / P.maxHp < .25 ? .18 + .08 * Math.sin(now * 6) : 0);
    const gr = ctx.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * .3, VW / 2, VH / 2, Math.max(VW, VH) * .75);
    gr.addColorStop(0, 'rgba(255,40,80,0)'); gr.addColorStop(1, `rgba(255,40,80,${a})`);
    ctx.fillStyle = gr; ctx.fillRect(0, 0, VW, VH);
  }
  if (G.flash > 0) { ctx.fillStyle = `rgba(255,240,250,${G.flash * .6})`; ctx.fillRect(0, 0, VW, VH); }
}
let idleT = 0;

/* small ship / enemy portraits for menus */
function drawPortrait(canvas, kind, id, unseen) {
  const c = canvas.getContext('2d'), s = canvas.width;
  c.clearRect(0, 0, s, s);
  c.save(); c.translate(s / 2, s / 2);
  const color = unseen ? '#3a3560' : kind === 'ship' ? SHIPS.find(x => x.id === id).color : kind === 'boss' ? BOSSES[id].color : COL[id];
  const gs = glow(color, s * .45, .5);
  c.globalCompositeOperation = 'lighter'; c.drawImage(gs, -gs.width / 2, -gs.height / 2); c.globalCompositeOperation = 'source-over';
  c.lineWidth = s / 28; c.strokeStyle = color; c.fillStyle = hexA(color, .22); c.lineJoin = 'round';
  if (kind === 'ship') { c.rotate(-Math.PI / 2); shipPath(s * .26, c); c.fillStyle = '#0d1a2e'; c.fill(); c.stroke(); }
  else { shapePath(kind === 'boss' ? BOSSES[id].shape : ED[id].shape, kind === 'boss' ? s * .3 : s * .26, 0, c); c.fill('evenodd'); c.stroke(); }
  c.restore();
}
