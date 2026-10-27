'use strict';
/* ==========================================================================
   Canvas: starfield, the asteroid, orbit rings of structures, particles,
   floating numbers and comets. Reads the save (S) and effects (FX) only.
   ========================================================================== */
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
const TAU = Math.PI * 2;
let DPR = 1, W = 0, H = 0;
const field = { x: 0, y: 0, w: 0, h: 0, cx: 0, cy: 0, r: 60 };

function resize() {
  DPR = Math.min(2, window.devicePixelRatio || 1);
  W = innerWidth; H = innerHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  const p = document.getElementById('panel').getBoundingClientRect();
  const side = p.top < 10;            /* panel on the right, else at the bottom */
  field.x = 0; field.y = 0; field.w = side ? p.left : W; field.h = side ? H : p.top;
  const top = 86;                     /* keep the wallet clear */
  field.cx = field.w / 2; field.cy = top + (field.h - top) / 2;
  field.r = Math.max(34, Math.min(field.w, field.h - top) * (side ? .15 : .17));
  makeStars();
}

/* ---- stars ---- */
let stars = [];
function makeStars() {
  stars = [];
  const n = Math.round(W * H / 2600);
  for (let i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .2, a: Math.random() * .7 + .2, tw: Math.random() * TAU });
}

/* ---- the asteroid: a lumpy polygon with craters, regenerated per collapse ---- */
let rock = null;
function makeRock(seed) {
  let x = seed * 9301 + 49297;
  const rnd = () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
  const pts = [], n = 22;
  for (let i = 0; i < n; i++) pts.push(.82 + rnd() * .26);
  for (let k = 0; k < 2; k++) for (let i = 0; i < n; i++) pts[i] = (pts[i] + pts[(i + 1) % n] + pts[(i + n - 1) % n]) / 3;
  const craters = [];
  for (let i = 0; i < 9; i++) { const a = rnd() * TAU, d = rnd() * .6; craters.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: .08 + rnd() * .14 }); }
  const veins = [];
  for (let i = 0; i < 7; i++) { const a = rnd() * TAU, d = .2 + rnd() * .55; veins.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: .03 + rnd() * .04 }); }
  const hues = [[34, 18], [268, 30], [190, 28], [12, 32], [140, 22]];
  rock = { pts, craters, veins, hue: hues[seed % hues.length], rot: 0, squash: 0 };
}

/* ---- particles and floating text ---- */
const parts = [], floats = [], flyers = [], beams = [];
function burst(x, y, n, color, spd = 220) {
  for (let i = 0; i < n && parts.length < 500; i++) {
    const a = Math.random() * TAU, s = (.3 + Math.random() * .7) * spd;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, life: .5 + Math.random() * .4, max: .9, color, r: 1.5 + Math.random() * 2.5 });
  }
}
function floatText(x, y, txt, color, big) { if (floats.length < 40) floats.push({ x, y, txt, color, life: 1, big }); }
/* a gem that flies from (x, y) to the ore counter */
function flyGem(x, y) {
  if (flyers.length > 30) return;
  const t = document.getElementById('ore').getBoundingClientRect();
  flyers.push({ x, y, sx: x, sy: y, tx: t.left - 16, ty: t.top + t.height / 2, t: 0, d: .55 + Math.random() * .25, wob: (Math.random() - .5) * 160 });
}

/* ---- comets ---- */
let comet = null;
function spawnComet() {
  const fromLeft = Math.random() < .5, y0 = field.y + 110 + Math.random() * (field.h - 220);
  const x0 = fromLeft ? -60 : field.w + 60, x1 = fromLeft ? field.w + 60 : -60;
  const y1 = Math.max(field.y + 100, Math.min(field.h - 60, y0 + (Math.random() - .5) * field.h * .6));
  comet = { x: x0, y: y0, x0, y0, x1, y1, t: 0, life: COMET.life, trail: [] };
}
function cometHit(px, py) { return comet && Math.hypot(px - comet.x, py - comet.y) < 42; }

/* ---- shapes for structures (shared by orbit units and shop icons) ---- */
function drawShape(c, shape, x, y, s, color, ang = 0) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.strokeStyle = color; c.fillStyle = color; c.lineWidth = Math.max(1.2, s * .14); c.lineJoin = 'round';
  c.shadowColor = color; c.shadowBlur = s * .9;
  const poly = (n, r, off = 0) => { c.beginPath(); for (let i = 0; i < n; i++) { const a = off + i / n * TAU; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); };
  switch (shape) {
    case 'tri': poly(3, s, -Math.PI / 2); c.globalAlpha = .35; c.fill(); c.globalAlpha = 1; c.stroke(); break;
    case 'drill': c.beginPath(); c.moveTo(-s * .55, -s * .7); c.lineTo(s * .55, -s * .7); c.lineTo(0, s); c.closePath(); c.globalAlpha = .35; c.fill(); c.globalAlpha = 1; c.stroke();
      c.beginPath(); c.moveTo(-s * .3, -s * .15); c.lineTo(s * .3, -s * .15); c.moveTo(-s * .15, s * .35); c.lineTo(s * .15, s * .35); c.stroke(); break;
    case 'horseshoe': c.beginPath(); c.arc(0, -s * .1, s * .7, Math.PI, 0); c.lineTo(s * .7, s * .8); c.moveTo(-s * .7, -s * .1); c.lineTo(-s * .7, s * .8); c.lineWidth = s * .32; c.stroke(); break;
    case 'square': c.globalAlpha = .3; c.fillRect(-s * .75, -s * .75, s * 1.5, s * 1.5); c.globalAlpha = 1; c.strokeRect(-s * .75, -s * .75, s * 1.5, s * 1.5); c.beginPath(); c.arc(0, 0, s * .32, 0, TAU); c.fill(); break;
    case 'hauler': c.beginPath(); c.moveTo(s, 0); c.lineTo(s * .3, -s * .55); c.lineTo(-s, -s * .55); c.lineTo(-s, s * .55); c.lineTo(s * .3, s * .55); c.closePath(); c.globalAlpha = .3; c.fill(); c.globalAlpha = 1; c.stroke();
      c.fillRect(-s * .7, -s * .25, s * .4, s * .5); c.fillRect(-s * .15, -s * .25, s * .4, s * .5); break;
    case 'hex': poly(6, s); c.globalAlpha = .3; c.fill(); c.globalAlpha = 1; c.stroke(); c.beginPath(); c.arc(0, 0, s * .4, 0, TAU); c.fillStyle = '#fff'; c.globalAlpha = .8; c.fill(); break;
    case 'diamond': poly(4, s); c.globalAlpha = .3; c.fill(); c.globalAlpha = 1; c.stroke(); poly(4, s * .45, Math.PI / 4); c.stroke(); break;
    case 'ring': c.beginPath(); c.arc(0, 0, s * .85, 0, TAU); c.stroke(); c.beginPath(); c.arc(0, 0, s * .35, 0, TAU); c.fill(); c.beginPath(); c.ellipse(0, 0, s * 1.15, s * .38, -.4, 0, TAU); c.lineWidth = s * .1; c.stroke(); break;
    case 'star': c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i / 10 * TAU, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.globalAlpha = .35; c.fill(); c.globalAlpha = 1; c.stroke(); break;
    case 'dyson': c.beginPath(); c.arc(0, 0, s * .45, 0, TAU); c.fillStyle = '#fff3c4'; c.fill(); c.fillStyle = color;
      for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(0, 0, s, s * .32, i * Math.PI / 3, 0, TAU); c.stroke(); } break;
  }
  c.restore();
}
function drawIcon(canvas, i, mystery) {
  const c = canvas.getContext('2d'), s = canvas.width;
  c.clearRect(0, 0, s, s);
  const g = c.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
  g.addColorStop(0, mystery ? 'rgba(80,90,120,.25)' : hexA(BUILDINGS[i].color, .22)); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(0, 0, s, s);
  drawShape(c, BUILDINGS[i].shape, s / 2, s / 2, s * .3, mystery ? '#3a4566' : BUILDINGS[i].color, BUILDINGS[i].shape === 'hauler' ? -Math.PI / 6 : 0);
}
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }

/* ---- orbit geometry ---- */
const TILT = .5;
function ringR(i) {
  const r0 = field.r * 1.55, r1 = Math.min(field.w * .47, (field.h - 90) * .5 / TILT * .96);
  return r0 + (r1 - r0) * i / (BUILDINGS.length - 1);
}
function unitsShown(n) { return n <= 0 ? 0 : Math.min(n, 18, 2 + Math.floor(Math.sqrt(n) * 2)); }

/* ---- main draw ---- */
let time = 0, beamT = 0;
function render(dt) {
  time += dt;
  const c = ctx;
  c.setTransform(DPR, 0, 0, DPR, 0, 0);
  /* background */
  const bg = c.createRadialGradient(field.cx, field.cy, 10, field.cx, field.cy, Math.max(W, H) * .8);
  const frenzy = FX.frenzyT > 0;
  bg.addColorStop(0, frenzy ? '#2a1a08' : '#121b36'); bg.addColorStop(.5, '#080c1c'); bg.addColorStop(1, '#04050c');
  c.fillStyle = bg; c.fillRect(0, 0, W, H);
  for (const s of stars) { c.globalAlpha = s.a * (.65 + .35 * Math.sin(time * 1.3 + s.tw)); c.fillStyle = '#cfe0ff'; c.fillRect(s.x, s.y, s.r, s.r); }
  c.globalAlpha = 1;

  const cx = field.cx, cy = field.cy;
  /* rings: back half, then asteroid, then front half */
  const units = [];
  for (let i = 0; i < BUILDINGS.length; i++) {
    const n = S.b[i]; if (!n) continue;
    const R = ringR(i), b = BUILDINGS[i], k = unitsShown(n), spd = .5 / Math.sqrt(1 + i) * (S.boostT > 0 ? 1.6 : 1) * (frenzy ? 2 : 1);
    c.strokeStyle = hexA(b.color, .13); c.lineWidth = 1;
    c.beginPath(); c.ellipse(cx, cy, R, R * TILT, 0, 0, TAU); c.stroke();
    for (let j = 0; j < k; j++) {
      const a = time * spd + j / k * TAU + i * 1.7;
      units.push({ i, a, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * TILT, z: Math.sin(a) });
    }
  }
  units.sort((p, q) => p.z - q.z);
  const size = Math.max(5, field.r * .11);
  for (const u of units) if (u.z < 0) drawUnit(c, u, size);
  drawRock(c, cx, cy, dt);
  for (const u of units) if (u.z >= 0) drawUnit(c, u, size);

  /* mining beams from a random unit to the rock */
  beamT -= dt;
  if (units.length && beamT <= 0) {
    beamT = Math.max(.05, .5 / Math.sqrt(units.length)) * (frenzy ? .4 : 1);
    const u = units[(Math.random() * units.length) | 0];
    beams.push({ x: u.x, y: u.y, color: BUILDINGS[u.i].color, life: .28 });
  }
  for (let i = beams.length - 1; i >= 0; i--) {
    const b = beams[i]; b.life -= dt; if (b.life <= 0) { beams.splice(i, 1); continue; }
    const dx = cx - b.x, dy = cy - b.y, d = Math.hypot(dx, dy), ex = cx - dx / d * field.r * .85, ey = cy - dy / d * field.r * .85;
    c.globalAlpha = b.life / .28 * .7; c.strokeStyle = b.color; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(ex, ey); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(ex, ey, 2.2, 0, TAU); c.fill();
  }
  c.globalAlpha = 1;

  /* comet */
  if (comet) {
    comet.t += dt;
    const p = comet.t / comet.life;
    if (p >= 1) comet = null;
    else {
      comet.x = comet.x0 + (comet.x1 - comet.x0) * p; comet.y = comet.y0 + (comet.y1 - comet.y0) * p + Math.sin(p * Math.PI * 2) * 30;
      comet.trail.unshift({ x: comet.x, y: comet.y }); if (comet.trail.length > 26) comet.trail.pop();
      for (let i = 1; i < comet.trail.length; i++) {
        const a = comet.trail[i - 1], b = comet.trail[i];
        c.strokeStyle = `rgba(160,230,255,${(1 - i / comet.trail.length) * .7})`; c.lineWidth = (1 - i / comet.trail.length) * 12;
        c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      }
      const pulse = 1 + Math.sin(time * 8) * .12;
      const g = c.createRadialGradient(comet.x, comet.y, 1, comet.x, comet.y, 26 * pulse);
      g.addColorStop(0, '#ffffff'); g.addColorStop(.3, 'rgba(140,230,255,.9)'); g.addColorStop(1, 'rgba(140,230,255,0)');
      c.fillStyle = g; c.beginPath(); c.arc(comet.x, comet.y, 26 * pulse, 0, TAU); c.fill();
    }
  }

  /* particles */
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; p.vx *= .98;
    c.globalAlpha = Math.min(1, p.life / p.max * 1.6); c.fillStyle = p.color;
    c.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
  }
  c.globalAlpha = 1;
  for (let i = flyers.length - 1; i >= 0; i--) {
    const f = flyers[i]; f.t += dt / f.d; if (f.t >= 1) { flyers.splice(i, 1); continue; }
    const e = f.t * f.t, mx = (f.sx + f.tx) / 2 + f.wob, my = Math.min(f.sy, f.ty) - 60;
    const x = (1 - e) * (1 - e) * f.sx + 2 * (1 - e) * e * mx + e * e * f.tx, y = (1 - e) * (1 - e) * f.sy + 2 * (1 - e) * e * my + e * e * f.ty;
    c.save(); c.translate(x, y); c.rotate(Math.PI / 4); c.fillStyle = '#ffc457'; c.shadowColor = '#ffc457'; c.shadowBlur = 8; c.fillRect(-4, -4, 8, 8); c.restore();
  }
  c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = floats.length - 1; i >= 0; i--) {
    const f = floats[i]; f.life -= dt * .9; if (f.life <= 0) { floats.splice(i, 1); continue; }
    f.y -= dt * 50;
    c.globalAlpha = Math.min(1, f.life * 2.5); c.fillStyle = f.color;
    c.font = `700 ${f.big ? 24 : 17}px "Chakra Petch", ui-monospace, monospace`;
    c.fillText(f.txt, f.x, f.y);
  }
  c.globalAlpha = 1;
}
function drawUnit(c, u, size) {
  const b = BUILDINGS[u.i], sc = 1 + u.z * .18;
  c.globalAlpha = .55 + (u.z + 1) * .225;
  drawShape(c, b.shape, u.x, u.y, size * sc, b.color, u.a + Math.PI / 2);
  c.globalAlpha = 1;
}
function drawRock(c, cx, cy, dt) {
  const R = field.r;
  rock.rot += dt * .05; rock.squash = Math.max(0, rock.squash - dt * 5);
  const sq = 1 + rock.squash * .07, [h, sat] = rock.hue;
  /* glow */
  const glow = c.createRadialGradient(cx, cy, R * .6, cx, cy, R * 1.9);
  glow.addColorStop(0, `hsla(${h},80%,60%,.22)`); glow.addColorStop(1, 'hsla(0,0%,0%,0)');
  c.fillStyle = glow; c.beginPath(); c.arc(cx, cy, R * 1.9, 0, TAU); c.fill();
  c.save(); c.translate(cx, cy); c.scale(sq, 2 - sq); c.rotate(rock.rot);
  const n = rock.pts.length;
  c.beginPath();
  for (let i = 0; i < n; i++) { const a = i / n * TAU, r = rock.pts[i] * R; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  c.closePath();
  const g = c.createRadialGradient(-R * .35, -R * .4, R * .1, 0, 0, R * 1.1);
  g.addColorStop(0, `hsl(${h},${sat}%,62%)`); g.addColorStop(.55, `hsl(${h},${sat}%,34%)`); g.addColorStop(1, `hsl(${h},${sat}%,14%)`);
  c.fillStyle = g; c.fill();
  c.strokeStyle = `hsla(${h},70%,75%,.35)`; c.lineWidth = 2; c.stroke();
  c.save(); c.clip();
  for (const k of rock.craters) {
    c.fillStyle = 'rgba(0,0,0,.22)'; c.beginPath(); c.arc(k.x * R, k.y * R, k.r * R, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 1.5; c.beginPath(); c.arc(k.x * R - 1, k.y * R - 1, k.r * R, Math.PI * .9, Math.PI * 1.9); c.stroke();
  }
  for (const v of rock.veins) {
    c.fillStyle = '#ffc457'; c.shadowColor = '#ffc457'; c.shadowBlur = 10;
    c.beginPath(); c.arc(v.x * R, v.y * R, v.r * R * (1 + Math.sin(time * 2 + v.x * 9) * .2), 0, TAU); c.fill();
  }
  c.restore(); c.restore();
}
function rockHit(px, py) { return Math.hypot(px - field.cx, py - field.cy) < field.r * 1.15; }
