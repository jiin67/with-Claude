'use strict';
/* ==========================================================================
   Simulation: run state, spawning, enemies, bosses, weapons, combat.
   Rendering lives in render.js, menus/saves/input in ui.js.
   ========================================================================== */

const TAU = Math.PI * 2;
const rnd = (a = 1, b) => b === undefined ? Math.random() * a : a + Math.random() * (b - a);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const fmtT = s => { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
function angDiff(a, b) { return ((b - a + Math.PI * 3) % TAU) - Math.PI; }
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1);
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

/* all upgrade cards (weapons first, then passives) */
const ALL_UPS = [
  ...Object.keys(WEAPONS).map(id => ({
    id, cat: 'weapon', name: WEAPONS[id].name, max: WEAPONS[id].max, w: id === 'blaster' ? .7 : 1, isWeapon: true,
    desc: WEAPONS[id].desc,
    apply: l => { W[id] = l; if (id === 'shield' && l === 1) G.shieldOn = true; }
  })),
  ...PASSIVES
];
/* evolution cards are never rolled from the pool; a treasure chest offers them */
const EVO_UPS = EVOLUTIONS.map(v => ({
  id: 'evo_' + v.weapon, evo: v, cat: 'evo', name: v.name, max: 1, isEvo: true,
  desc: () => v.desc,
  apply: () => { G.evo[v.weapon] = true; markSeen('evo:' + v.id); }
}));
const EVO_BY_WEAPON = Object.fromEntries(EVOLUTIONS.map(v => [v.weapon, v]));
const EVO_BY_PASSIVE = Object.fromEntries(EVOLUTIONS.map(v => [v.needs, v]));
const UP_BY_ID = Object.fromEntries([...ALL_UPS, ...EVO_UPS].map(u => [u.id, u]));

/* --------------------------------------------------------------------------
   state
   -------------------------------------------------------------------------- */
let G = null, P, S, W;
let enemies, bullets, ebullets, gems, pickups, parts, texts, fx, missiles, mines, holes, discs, hazards, wings, warders;
let eid = 0;
const cam = { x: 0, y: 0 };

function newGame(stageIdx, shipId, save) {
  const st = STAGES[stageIdx], sh = SHIPS.find(s => s.id === shipId) || SHIPS[0];
  G = {
    stage: st, stageIdx, ship: sh, t: 0, state: 'play', kills: 0, score: 0, bonusDust: 0,
    bosses: [], queue: st.bosses.map(b => ({ ...b })), endlessT: 150, endlessIdx: 0,
    swarmT: 55, spawnT: 0, cleared: false, clearT: 0, rerolls: 2, revives: 0, pending: 0,
    ups: {}, choices: [], shake: 0, flash: 0, hurt: 0, combo: 0, comboT: 0, maxCombo: 0,
    orbitA: 0, laserA: 0, shieldOn: false, shieldT: 0, evo: {}, chests: 0, fromChest: false,
    cd: { chain: 1.2, nova: 2.5, missile: 1.5, rail: .6, mines: .8, sing: 2.5, disc: 1 },
    lastHit: 0, bossKills: 0, elites: 0, boomKills: 0, warderKills: 0, pickT: 0, pickCombo: 0, tutorial: null
  };
  S = { dmg: 1, rate: 1, proj: 1, pierce: 0, speed: sh.speed, magnet: 90, regen: 0, crit: .05, area: 1, cool: 1, dur: 1, armor: 0, xp: 1 };
  P = { x: 0, y: 0, vx: 0, vy: 0, r: 12, hp: sh.hp, maxHp: sh.hp, inv: 0, ang: -Math.PI / 2, level: 1, xp: 0, next: xpNeed(1), fireT: .3, color: sh.color };
  for (const k in sh.mods) S[k] += sh.mods[k];
  for (const m of META) { const l = (save && save.meta[m.id]) || 0; if (l) m.fx(S, l, P, G); }
  P.hp = P.maxHp;
  W = {}; for (const k in WEAPONS) W[k] = 0;
  for (const k in sh.start) { W[k] = sh.start[k]; G.ups[k] = sh.start[k]; }
  if (W.shield) G.shieldOn = true;
  enemies = []; bullets = []; ebullets = []; gems = []; pickups = []; parts = []; texts = []; fx = [];
  missiles = []; mines = []; holes = []; discs = []; hazards = []; wings = []; warders = [];
  cam.x = 0; cam.y = 0;
}
const xpNeed = l => Math.floor(5 + l * 4.2 + Math.pow(l, 1.6));
const weaponCount = () => Object.keys(WEAPONS).filter(k => W[k] > 0).length;
/* evolutions whose weapon is maxed and whose paired passive is owned */
const evoReady = () => EVO_UPS.filter(u => { const v = u.evo; return !G.evo[v.weapon] && W[v.weapon] >= WEAPONS[v.weapon].max && G.ups[v.needs]; });

/* --------------------------------------------------------------------------
   spatial grid
   -------------------------------------------------------------------------- */
const CELL = 80, MAXR = 64;
const grid = new Map();
const gk = (cx, cy) => cx * 100003 + cy;
function buildGrid() {
  grid.clear();
  for (const e of enemies) {
    if (e.dead) continue;
    const k = gk(Math.floor(e.x / CELL), Math.floor(e.y / CELL));
    let a = grid.get(k); if (!a) { a = []; grid.set(k, a); } a.push(e);
  }
}
function forNear(x, y, r, fn) {
  const m = r + MAXR;
  const x0 = Math.floor((x - m) / CELL), x1 = Math.floor((x + m) / CELL), y0 = Math.floor((y - m) / CELL), y1 = Math.floor((y + m) / CELL);
  for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) {
    const a = grid.get(gk(cx, cy)); if (!a) continue;
    for (let i = 0; i < a.length; i++) {
      const e = a[i]; if (e.dead) continue;
      const dx = e.x - x, dy = e.y - y, rr = r + e.r;
      if (dx * dx + dy * dy < rr * rr && fn(e) === true) return true;
    }
  }
  return false;
}
function nearest(x, y, maxD, skip) {
  let b = null, bd = maxD * maxD;
  for (const e of enemies) {
    if (e.dead || (skip && skip.has(e))) continue;
    const dx = e.x - x, dy = e.y - y, d = dx * dx + dy * dy;
    if (d < bd) { bd = d; b = e; }
  }
  return b;
}
/* aim at a boss when it is in range and nothing is right on top of the ship */
function focusBoss(t, range = 560) {
  if (!G.bosses.length) return t;
  let b = null, bd = range;
  for (const x of G.bosses) { const d = Math.hypot(x.x - P.x, x.y - P.y); if (d < bd) { bd = d; b = x; } }
  if (!b || !t || t === b) return t || b;
  return Math.hypot(t.x - P.x, t.y - P.y) > 120 ? b : t;
}

/* --------------------------------------------------------------------------
   spawning
   -------------------------------------------------------------------------- */
const mins = () => G.t / 60;
/* stage difficulty eases in over the first three minutes so every stage has a fair opening */
const sf = k => 1 + (G.stage[k] - 1) * Math.min(1, mins() / 4);
const late = () => { const x = G.stage.endless ? Math.max(0, mins() - 10) : 0; return 1 + x * .35 + x * x * .05; }; const hpMul = () => { const m = mins(); return sf('hp') * (1 + m * .34 + m * m * .05) * late(); };
function viewR() { return Math.hypot(VW, VH) / 2 / SC; }
function spawnEnemy(type, x, y, opts = {}) {
  const d = ED[type], elite = !!opts.elite;
  const mul = type === 'boss' ? 1 : hpMul();
  const e = {
    id: ++eid, type, x, y, vx: 0, vy: 0, kx: 0, ky: 0, r: d.r * (elite ? 1.35 : 1),
    hp: d.hp * mul * (elite ? 5 : 1), speed: d.speed * (1 + Math.min(.35, mins() * .03)) * (elite ? .9 : 1),
    dmg: d.dmg * sf('dmg') * (1 + mins() * .08) * Math.sqrt(late()), xp: d.xp * (elite ? 6 : 1), shape: d.shape, kb: d.kb || 0,
    color: COL[type], elite, flash: 0, rot: rnd(TAU), t: rnd(2), st: 'chase', stT: rnd(1, 2.5), orbCd: 0, lasCd: 0, dead: false
  };
  e.maxHp = e.hp;
  if (type !== 'boss') markSeen(type);
  if (type === 'orbiter') { e.oa = rnd(TAU); e.dir = Math.random() < .5 ? 1 : -1; }
  enemies.push(e);
  return e;
}
function edgePoint(extra = 60) {
  const a = rnd(TAU), d = viewR() + extra;
  return [P.x + Math.cos(a) * d + P.vx * .6, P.y + Math.sin(a) * d + P.vy * .6];
}
function pickType() {
  const m = mins(), tbl = G.stage.pool.filter(r => m >= r[2]);
  let tot = 0; for (const t of tbl) tot += t[1] * (t[0] === 'drone' ? 1 : 1 + Math.min(1.5, (m - t[2]) * .15));
  let r = rnd(tot);
  for (const t of tbl) { r -= t[1] * (t[0] === 'drone' ? 1 : 1 + Math.min(1.5, (m - t[2]) * .15)); if (r <= 0) return t[0]; }
  return 'drone';
}
function director(dt) {
  if (G.cleared) return;
  const m = mins();
  G.spawnT -= dt;
  const cap = 140 + Math.min(230, m * 26);
  if (G.spawnT <= 0) {
    G.spawnT = Math.max(.1, .85 - m * .075) / sf('rate') * (G.bosses.length ? 1.8 : 1);
    if (enemies.length < cap) {
      const n = 1 + Math.floor(m / 1.4);
      for (let i = 0; i < n; i++) { const [x, y] = edgePoint(); spawnEnemy(pickType(), x, y, { elite: m > 1.8 && Math.random() < .025 }); }
    }
  }
  /* encirclement */
  G.swarmT -= dt;
  if (G.swarmT <= 0) {
    G.swarmT = 50;
    const n = 18 + Math.floor(m * 4), R = viewR() + 40, type = m > 4 ? 'mite' : 'drone';
    for (let i = 0; i < n; i++) { const a = i / n * TAU; spawnEnemy(type, P.x + Math.cos(a) * R, P.y + Math.sin(a) * R); }
    showBanner(tr('bSwarm'), tr('bSwarmS'), 'info', 1.6);
  }
  /* scripted bosses */
  for (const q of G.queue) {
    if (!q.warned && G.t >= q.t - 3.2) {
      q.warned = true; A.siren();
      showBanner(q.final ? tr('bFinal') : tr('bWarn'), tr('bNear', BOSSES[q.id].name), 'warn', 3);
    }
    if (!q.done && G.t >= q.t) {
      q.done = true;
      /* at most two different bosses at once; a third arrival enrages the ones still fighting */
      const kinds = new Set(G.bosses.map(b => b.bid));
      if (!q.final && kinds.size >= 2) enrage(G.bosses);
      else spawnBoss(q.id, q.final, G.stageIdx);
    }
  }
  G.queue = G.queue.filter(q => !q.done);
  /* endless: bosses cycle forever, growing each lap */
  if (G.stage.endless) {
    G.endlessT -= dt;
    if (G.endlessT <= 3.2 && !G.endlessWarned) {
      G.endlessWarned = true; A.siren();
      showBanner(tr('bWarn'), tr('bNear', BOSSES[ENDLESS_ORDER[G.endlessIdx % ENDLESS_ORDER.length]].name), 'warn', 3);
    }
    if (G.endlessT <= 0) {
      G.endlessT = 150; G.endlessWarned = false;
      if (new Set(G.bosses.map(b => b.bid)).size >= 2) enrage(G.bosses);
      else spawnBoss(ENDLESS_ORDER[G.endlessIdx % ENDLESS_ORDER.length], false, Math.floor(G.endlessIdx / ENDLESS_ORDER.length));
      G.endlessIdx++;
    }
  }
}
const ENDLESS_ORDER = ['hive', 'twins', 'crystal', 'storm', 'queen', 'engine'];
function enrage(list) {
  for (const b of list) { if ((b.rage || 0) >= 3) continue; b.rage = (b.rage || 0) + 1; b.speed *= 1.15; b.dmg *= 1.12; }
  A.siren(); showBanner(tr('bRage'), tr('bRageS', list[0].name), 'warn', 2.4);
}
function spawnBoss(id, final, tier) {
  const def = BOSSES[id], [x, y] = edgePoint(-40);
  const lap = G.stage.endless ? tier : 0;
  const hp = def.hp * (.5 + mins() * .16) * Math.pow(G.stage.hp, .7) * (1 + lap * .6);
  const b = spawnEnemy('boss', x, y);
  Object.assign(b, {
    hp, maxHp: hp, r: def.r, speed: def.speed, color: def.color, shape: def.shape, name: def.name, bid: id, final,
    tier: G.stage.endless ? Math.min(3, 1 + lap) : Math.min(3, G.stageIdx), patterns: def.patterns, pi: -1, pt: 1.4, sub: 0, cnt: 0, spin: rnd(TAU),
    dmg: 28 * G.stage.dmg * (1 + mins() * .05) * (1 + lap * .25), born: G.t, kb: 1
  });
  G.bosses.push(b); markSeen('boss:' + id);
  return b;
}

/* --------------------------------------------------------------------------
   combat
   -------------------------------------------------------------------------- */
function warded(e) {
  if (e.type === 'warder' || e.type === 'boss' || !warders.length) return false;
  for (const w of warders) { if (w.dead) continue; const dx = w.x - e.x, dy = w.y - e.y; if (dx * dx + dy * dy < 150 * 150) return true; }
  return false;
}
function hurtEnemy(e, dmg, kx = 0, ky = 0, noCrit, src) {
  if (e.dead) return;
  let crit = false;
  if (!noCrit && Math.random() < S.crit) { dmg *= 2; crit = true; }
  if (warded(e)) dmg *= .5;
  e.hp -= dmg; e.flash = .07;
  const kr = 1 - e.kb; e.kx += kx * kr; e.ky += ky * kr;
  const showNum = e.type === 'boss' ? (e.numT = (e.numT || 0) + 1) % 3 === 0 : crit && texts.length < 18;
  if (showNum) texts.push({ x: e.x + rnd(-6, 6), y: e.y - e.r, v: -46, life: .6, max: .6, txt: Math.round(dmg), crit });
  A.hit();
  if (e.type === 'boss' && BOSSES[e.bid].split && !e.splitDone && e.hp < e.maxHp / 2 && e.hp > 0) splitBoss(e);
  if (e.hp <= 0) killEnemy(e, src);
}
function splitBoss(b) {
  b.splitDone = true; b.maxHp /= 2; b.r *= .78;
  const c = spawnEnemy('boss', b.x + 60, b.y);
  Object.assign(c, { ...b, id: ++eid, x: b.x + 60, y: b.y, hp: b.hp, maxHp: b.maxHp, pi: 1, pt: .8, spin: b.spin + Math.PI, color: '#ff9ccf' });
  b.x -= 60;
  G.bosses.push(c);
  fx.push({ k: 'ring', x: b.x + 30, y: b.y, r0: 20, r1: 220, life: .5, max: .5, color: b.color });
  A.big(); showBanner(tr('bSplit'), tr('bSplitS'), 'warn', 1.8);
}
function burst(x, y, color, n, spd = 160, size = 2.4, life = .5) {
  for (let i = 0; i < n && parts.length < 1400; i++) {
    const a = rnd(TAU), s = rnd(.3, 1) * spd;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(.5, 1) * life, max: life, color, size: rnd(.6, 1.2) * size });
  }
}
function dropGem(x, y, v) {
  if (gems.length > 360) { const g = gems[(Math.random() * gems.length) | 0]; g.v += v; g.tier = g.v >= 20 ? 3 : g.v >= 5 ? 2 : 1; return; }
  gems.push({ x: x + rnd(-6, 6), y: y + rnd(-6, 6), v, tier: v >= 20 ? 3 : v >= 5 ? 2 : 1, vx: rnd(-40, 40), vy: rnd(-40, 40), pull: false, rot: rnd(TAU) });
}
function killEnemy(e, src) {
  if (e.dead) return;
  e.dead = true; G.kills++;
  G.score += Math.round((e.xp * 10) * (1 + G.combo * .02));
  G.combo++; G.comboT = 2.2; if (G.combo > G.maxCombo) G.maxCombo = G.combo;
  if (src === 'boom') G.boomKills++;
  if (e.type === 'warder') G.warderKills++;
  if (e.type === 'boss') return killBoss(e);
  A.kill();
  burst(e.x, e.y, e.color, e.elite ? 40 : 12 + (e.r | 0) / 2, 200, 2.6, .55);
  if (e.r > 15) fx.push({ k: 'ring', x: e.x, y: e.y, r0: e.r * .5, r1: e.r * 2.6, life: .3, max: .3, color: e.color });
  if (e.type === 'splitter') for (let i = 0; i < 3; i++) { const m = spawnEnemy('mite', e.x + rnd(-10, 10), e.y + rnd(-10, 10)); m.kx = rnd(-160, 160); m.ky = rnd(-160, 160); }
  dropGem(e.x, e.y, e.xp * G.stage.xp);
  if (e.elite) { G.elites++; pickups.push({ k: 'chest', x: e.x, y: e.y, t: 0 }); G.shake = Math.max(G.shake, 6); }
  else {
    const r = Math.random();
    if (pickups.length > 40) { /* plenty lying around already */ }
    else if (r < .009) pickups.push({ k: 'heal', x: e.x, y: e.y, t: 0 });
    else if (r < .0135) pickups.push({ k: 'magnet', x: e.x, y: e.y, t: 0 });
  }
}
function killBoss(e) {
  A.big(); G.flash = .7; G.shake = 18; G.bossKills++;
  burst(e.x, e.y, e.color, 140, 420, 4, 1.4); burst(e.x, e.y, '#ffffff', 60, 300, 3, 1);
  fx.push({ k: 'ring', x: e.x, y: e.y, r0: 20, r1: 420, life: .7, max: .7, color: e.color });
  const n = e.splitDone ? 20 : 40;
  for (let i = 0; i < n; i++) dropGem(e.x + rnd(-80, 80), e.y + rnd(-80, 80), 6 + e.tier * 4);
  pickups.push({ k: 'chest', x: e.x - 30, y: e.y, t: 0 }, { k: 'heal', x: e.x, y: e.y + 40, t: 0 });
  if (!e.splitDone || G.bosses.filter(b => b.bid === e.bid && !b.dead).length === 0) pickups.push({ k: 'chest', x: e.x + 30, y: e.y, t: 0 });
  G.score += 5000 * (e.tier + 1);
  G.bosses = G.bosses.filter(b => !b.dead);
  achieve('firstboss');
  if (P.hp <= 15) achieve('clutch');
  if (e.bid === 'twins' && !G.bosses.some(b => b.bid === 'twins') && G.t - e.born <= 60) achieve('twinsfast');
  const sibling = G.bosses.some(b => b.bid === e.bid);
  showBanner(sibling ? tr('bOneLeft') : tr('bDown'), e.name, 'info', 1.8);
  if (e.final && !G.bosses.some(b => b.final)) stageClear();
}
function stageClear() {
  G.cleared = true; G.clearT = 3.2;
  for (const e of enemies) if (!e.dead && e.type !== 'boss') { e.dead = true; burst(e.x, e.y, e.color, 6, 160, 2.4, .5); dropGem(e.x, e.y, e.xp); }
  ebullets.length = 0; hazards.length = 0;
  for (const g of gems) g.pull = true;
  showBanner(tr('bClear'), G.stage.name, 'info', 3);
}
function hurtPlayer(dmg, sx, sy, tag = '?') {
  if (P.inv > 0 || G.state !== 'play' || G.cleared) return;
  G.dmgBy = G.dmgBy || {};
  if (G.shieldOn) {
    G.shieldOn = false; G.shieldT = 0; P.inv = .7; A.shield();
    fx.push({ k: 'ring', x: P.x, y: P.y, r0: 20, r1: 150, life: .35, max: .35, color: COL.player });
    pushAway(150, 420);
    return;
  }
  dmg = Math.max(1, dmg - S.armor);
  G.dmgBy[tag] = (G.dmgBy[tag] || 0) + dmg;
  P.hp -= dmg; P.inv = .55; G.hurt = .45; G.shake = Math.max(G.shake, 9); G.combo = 0; G.lastHit = G.t;
  A.hurt(); burst(P.x, P.y, '#ff3355', 18, 220, 2.6, .5);
  if (sx !== undefined) { const dx = P.x - sx, dy = P.y - sy, d = Math.hypot(dx, dy) || 1; P.vx += dx / d * 260; P.vy += dy / d * 260; }
  if (P.hp <= 0) {
    if (G.revives > 0) { G.revives--; revivePlayer(); }
    else if (PORTAL.rewarded && !G.adRevived && !AUTO) { P.hp = 0; offerRevive(); }
    else { P.hp = 0; endRun(false); }
  }
}
function revivePlayer() {
  P.hp = P.maxHp * .5; P.inv = 2.2; G.flash = .6; pushAway(320, 700);
  ebullets.length = 0;
  fx.push({ k: 'ring', x: P.x, y: P.y, r0: 20, r1: 320, life: .6, max: .6, color: COL.heal, w: 6 });
  showBanner(tr('bRevive'), tr('bReviveS'), 'info', 2); A.level();
}
function pushAway(R, f) {
  for (const e of enemies) { const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy); if (d < R && d > 0) { e.kx += dx / d * f * (1 - e.kb); e.ky += dy / d * f * (1 - e.kb); } }
}

/* --------------------------------------------------------------------------
   weapons
   -------------------------------------------------------------------------- */
function shootBullet(x, y, a, sp, dmg, pierce, kind) {
  bullets.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, dmg, pierce, life: 1.05, hit: [], kind });
}
function fireBlaster(dt) {
  if (!W.blaster) return;
  P.fireT -= dt;
  if (P.fireT > 0) return;
  let t = nearest(P.x, P.y, 640);
  t = focusBoss(t);
  if (!t) { P.fireT = .05; return; }
  P.fireT = 1 / (2.5 * S.rate);
  const base = Math.atan2(t.y - P.y, t.x - P.x);
  P.ang = base;
  const n = S.proj;
  for (let i = 0; i < n; i++) { const a = base + (i - (n - 1) / 2) * .15; shootBullet(P.x + Math.cos(a) * 14, P.y + Math.sin(a) * 14, a, 600, 10 * S.dmg, S.pierce); }
  A.shoot();
}
function orbitInfo() {
  const l = W.orbit, e = G.evo.orbit;
  return { n: e ? 7 : l + 1, R: (64 + l * 7) * S.area * (e ? 1.3 : 1), dmg: (9 + l * 4) * S.dmg * (e ? 1.35 : 1), sz: 10 * Math.sqrt(S.area) * (e ? 1.4 : 1), cd: e ? .3 : .38, color: e ? COL.evo : COL.blade };
}
function updateOrbit(dt) {
  if (!W.orbit) return;
  const o = orbitInfo();
  G.orbitA += dt * (3.1 + W.orbit * .22);
  for (let i = 0; i < o.n; i++) {
    const a = G.orbitA + i / o.n * TAU, bx = P.x + Math.cos(a) * o.R, by = P.y + Math.sin(a) * o.R;
    forNear(bx, by, o.sz, e => {
      if (e.orbCd > 0) return;
      e.orbCd = o.cd;
      hurtEnemy(e, o.dmg, Math.cos(a) * 160, Math.sin(a) * 160);
      burst(bx, by, o.color, 3, 120, 1.8, .25);
    });
  }
}
function updateChain(dt) {
  if (!W.chain) return;
  G.cd.chain -= dt;
  if (G.cd.chain > 0) return;
  const l = W.chain, evo = G.evo.chain, R0 = 460 * S.area, first = focusBoss(nearest(P.x, P.y, R0), R0);
  if (!first) { G.cd.chain = .2; return; }
  G.cd.chain = (2.5 - l * .25) * S.cool * (evo ? .75 : 1);
  const jumps = 2 + l + (evo ? 4 : 0), range = 175 * S.area * (evo ? 1.3 : 1), dmg = (16 + l * 8) * S.dmg * (evo ? 1.3 : 1), color = evo ? COL.evo : COL.bolt;
  const starts = [first];
  if (evo) { const second = nearest(P.x, P.y, R0, new Set([first])); if (second) starts.push(second); }
  for (const start of starts) {
    const seen = new Set(), pts = [[P.x, P.y]];
    let cur = start;
    for (let j = 0; j <= jumps && cur; j++) {
      seen.add(cur); pts.push([cur.x, cur.y]);
      hurtEnemy(cur, dmg);
      burst(cur.x, cur.y, color, 5, 140, 2, .3);
      cur = nearest(cur.x, cur.y, range, seen);
    }
    fx.push({ k: 'bolt', pts: jag(pts), life: .2, max: .2, color });
  }
  A.zap();
}
function jag(pts) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], dx = x1 - x0, dy = y1 - y0, d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
    const seg = Math.max(2, Math.round(d / 26));
    for (let s = 0; s < seg; s++) { const t = s / seg, o = s === 0 ? 0 : rnd(-10, 10); out.push([x0 + dx * t + nx * o, y0 + dy * t + ny * o]); }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
function updateNova(dt) {
  if (!W.nova) return;
  G.cd.nova -= dt;
  if (G.cd.nova > 0) return;
  const l = W.nova;
  G.cd.nova = (4.3 - l * .4) * S.cool;
  const R = (115 + l * 26) * S.area, dmg = (20 + l * 12) * S.dmg;
  forNear(P.x, P.y, R, e => { const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy) || 1; hurtEnemy(e, dmg, dx / d * 420, dy / d * 420); });
  fx.push({ k: 'ring', x: P.x, y: P.y, r0: 10, r1: R, life: .35, max: .35, color: COL.player, follow: true, w: 5 });
  G.shake = Math.max(G.shake, 3); A.nova();
}
function updateMissiles(dt) {
  if (W.missile) {
    G.cd.missile -= dt;
    if (G.cd.missile <= 0) {
      const l = W.missile, t = focusBoss(nearest(P.x, P.y, 700), 700);
      if (!t) G.cd.missile = .3;
      else {
        const evo = G.evo.missile;
        G.cd.missile = (2.4 - l * .2) * S.cool * (evo ? .7 : 1);
        const n = evo ? 6 : 1 + Math.floor(l / 2), spread = evo ? TAU / n : .7;
        for (let i = 0; i < n; i++) {
          const a = P.ang + Math.PI + (i - (n - 1) / 2) * spread + rnd(-.2, .2);
          missiles.push({ x: P.x, y: P.y, a, sp: 160, tgt: t, life: 3, dmg: (26 + l * 10) * S.dmg, aoe: 58 * S.area * (evo ? 1.5 : 1), trail: 0, color: evo ? COL.evo : COL.missile });
        }
        A.launch();
      }
    }
  }
  for (const m of missiles) {
    if (!m.tgt || m.tgt.dead) m.tgt = nearest(m.x, m.y, 500);
    if (m.tgt) m.a += clamp(angDiff(m.a, Math.atan2(m.tgt.y - m.y, m.tgt.x - m.x)), -5 * dt, 5 * dt);
    m.sp = Math.min(520, m.sp + 700 * dt);
    m.x += Math.cos(m.a) * m.sp * dt; m.y += Math.sin(m.a) * m.sp * dt;
    m.life -= dt; m.trail -= dt;
    if (m.trail <= 0 && parts.length < 1400) { m.trail = .02; parts.push({ x: m.x, y: m.y, vx: rnd(-20, 20), vy: rnd(-20, 20), life: .35, max: .35, color: m.color, size: 2.2 }); }
    if (m.life <= 0 || forNear(m.x, m.y, 6, () => true)) { m.dead = true; explode(m.x, m.y, m.aoe, m.dmg, m.color); }
  }
  missiles = missiles.filter(m => !m.dead);
}
function explode(x, y, R, dmg, color, src) {
  forNear(x, y, R, e => { const dx = e.x - x, dy = e.y - y, d = Math.hypot(dx, dy) || 1; hurtEnemy(e, dmg, dx / d * 200, dy / d * 200, false, src); });
  fx.push({ k: 'ring', x, y, r0: 6, r1: R, life: .28, max: .28, color, w: 4 });
  burst(x, y, color, 14, 220, 2.4, .4);
  A.boom();
}
function updateShield(dt) {
  if (!W.shield || G.shieldOn) return;
  G.shieldT += dt;
  if (G.shieldT >= (13 - W.shield * 2) * S.cool) { G.shieldOn = true; G.shieldT = 0; A.shield(); }
}
function updateRail(dt) {
  if (!W.rail) return;
  G.cd.rail -= dt;
  if (G.cd.rail > 0) return;
  const l = W.rail, t = focusBoss(nearest(P.x, P.y, 700), 700);
  if (!t) { G.cd.rail = .1; return; }
  const evo = G.evo.rail;
  G.cd.rail = (1.55 - l * .13) * S.cool * (evo ? .85 : 1);
  const base = Math.atan2(t.y - P.y, t.x - P.x); P.ang = base;
  const beams = evo ? [-2, -1, 0, 1, 2].map(i => base + i * .12) : l >= 4 ? [base - .09, base + .09] : [base];
  const len = 900, w = 9 * S.area * (evo ? 1.8 : 1), dmg = (30 + l * 14) * S.dmg * (evo ? 1.2 : 1);
  for (const a of beams) {
    const ex = P.x + Math.cos(a) * len, ey = P.y + Math.sin(a) * len;
    for (const e of enemies) {
      if (e.dead) continue;
      if (segDist(e.x, e.y, P.x, P.y, ex, ey) < w + e.r) hurtEnemy(e, dmg, Math.cos(a) * 120, Math.sin(a) * 120);
    }
    fx.push({ k: 'beam', x: P.x, y: P.y, x2: ex, y2: ey, w: w * 1.6, life: .2, max: .2, color: evo ? COL.evo : COL.rail });
  }
  G.shake = Math.max(G.shake, 2); A.rail();
}
function updateMines(dt) {
  if (W.mines) {
    G.cd.mines -= dt;
    const l = W.mines;
    if (G.cd.mines <= 0 && mines.length < 6 + l * 2) {
      G.cd.mines = (1.1 - l * .08) * S.cool;
      mines.push({ x: P.x + rnd(-6, 6), y: P.y + rnd(-6, 6), arm: .5, life: 12 * S.dur, R: (64 + l * 8) * S.area, dmg: (35 + l * 15) * S.dmg, t: rnd(TAU) });
    }
  }
  for (const m of mines) {
    m.arm -= dt; m.life -= dt; m.t += dt;
    if (m.life <= 0) { m.dead = true; continue; }
    if (m.arm <= 0 && forNear(m.x, m.y, 22, () => true)) { m.dead = true; explode(m.x, m.y, m.R, m.dmg, COL.mine); }
  }
  mines = mines.filter(m => !m.dead);
}
function updateSing(dt) {
  if (W.sing) {
    G.cd.sing -= dt;
    if (G.cd.sing <= 0) {
      const t = nearest(P.x, P.y, 480);
      if (!t) G.cd.sing = .4;
      else {
        const l = W.sing, evo = G.evo.sing, R = (90 + l * 14) * S.area * (evo ? 1.4 : 1), life = (2.4 + l * .3) * S.dur;
        G.cd.sing = (8.5 - l * .8) * S.cool * (evo ? .8 : 1);
        const at = [t];
        /* the evolved second hole opens on the nearest enemy outside the first one */
        if (evo) { const far = new Set(enemies.filter(e => Math.hypot(e.x - t.x, e.y - t.y) < R * 1.5)); const t2 = nearest(P.x, P.y, 640, far); if (t2) at.push(t2); }
        for (const h of at) holes.push({ x: h.x, y: h.y, R, life, max: life, dmg: (7 + l * 4) * S.dmg * (evo ? 1.5 : 1), pull: evo ? 260 : 170, evo, tick: 0 });
        A.warp();
      }
    }
  }
  for (const h of holes) {
    h.life -= dt; h.tick -= dt;
    const doTick = h.tick <= 0; if (doTick) h.tick = .25;
    forNear(h.x, h.y, h.R, e => {
      const dx = h.x - e.x, dy = h.y - e.y, d = Math.hypot(dx, dy) || 1, f = (1 - e.kb) * h.pull * dt;
      e.x += dx / d * Math.min(d, f); e.y += dy / d * Math.min(d, f);
      if (doTick) hurtEnemy(e, h.dmg, 0, 0, true);
    });
  }
  holes = holes.filter(h => h.life > 0);
}
function updateWings(dt) {
  const n = [0, 2, 2, 3, 3, 4][W.wing];
  while (wings.length < n) wings.push({ x: P.x, y: P.y, cd: rnd(.5) });
  const l = W.wing;
  wings.forEach((w, i) => {
    const a = G.t * 1.3 + i / n * TAU, tx = P.x + Math.cos(a) * 46, ty = P.y + Math.sin(a) * 46;
    w.x += (tx - w.x) * Math.min(1, dt * 6); w.y += (ty - w.y) * Math.min(1, dt * 6);
    w.cd -= dt;
    if (w.cd <= 0) {
      const t = focusBoss(nearest(w.x, w.y, 520), 520);
      if (!t) { w.cd = .15; return; }
      w.cd = 1.05 - l * .1; w.ang = Math.atan2(t.y - w.y, t.x - w.x);
      shootBullet(w.x, w.y, w.ang, 560, (8 + l * 3) * S.dmg, 0, 'wing');
    }
  });
}
function laserInfo() { const l = W.laser; return { n: [0, 1, 1, 2, 2, 3][l], len: (150 + l * 20) * S.area, dmg: (6 + l * 3) * S.dmg }; }
function updateLaser(dt) {
  if (!W.laser) return;
  const o = laserInfo();
  G.laserA += dt * 1.7;
  forNear(P.x, P.y, o.len, e => {
    if (e.lasCd > 0) return;
    for (let i = 0; i < o.n; i++) {
      const a = G.laserA + i / o.n * TAU;
      if (segDist(e.x, e.y, P.x, P.y, P.x + Math.cos(a) * o.len, P.y + Math.sin(a) * o.len) < 6 + e.r) {
        e.lasCd = .2 / S.dur; hurtEnemy(e, o.dmg, 0, 0); return;
      }
    }
  });
}
function updateDiscs(dt) {
  if (W.disc) {
    G.cd.disc -= dt;
    if (G.cd.disc <= 0) {
      const t = nearest(P.x, P.y, 520);
      if (!t) G.cd.disc = .2;
      else {
        const l = W.disc, evo = G.evo.disc, n = evo ? 4 : 1 + Math.floor(l / 3), base = Math.atan2(t.y - P.y, t.x - P.x);
        G.cd.disc = (1.9 - l * .15) * S.cool * (evo ? .8 : 1);
        for (let i = 0; i < n; i++) {
          const a = evo ? base + i / n * TAU : base + (i - (n - 1) / 2) * .5;
          discs.push({ x: P.x, y: P.y, vx: Math.cos(a) * 520, vy: Math.sin(a) * 520, out: true, travel: 0, max: 300 * S.area * (evo ? 1.4 : 1), dmg: (14 + l * 7) * S.dmg * (evo ? 1.25 : 1), r: 13 * Math.sqrt(S.area) * (evo ? 1.3 : 1), hit: new Set(), spin: 0, color: evo ? COL.evo : COL.disc });
        }
        A.launch();
      }
    }
  }
  for (const d of discs) {
    d.spin += dt * 16;
    if (d.out) {
      d.x += d.vx * dt; d.y += d.vy * dt; d.travel += Math.hypot(d.vx, d.vy) * dt;
      if (d.travel >= d.max) { d.out = false; d.hit.clear(); }
    } else {
      const dx = P.x - d.x, dy = P.y - d.y, dd = Math.hypot(dx, dy) || 1;
      d.x += dx / dd * 600 * dt; d.y += dy / dd * 600 * dt;
      if (dd < 20) d.dead = true;
    }
    forNear(d.x, d.y, d.r, e => { if (d.hit.has(e.id)) return; d.hit.add(e.id); hurtEnemy(e, d.dmg, d.vx * .2, d.vy * .2); });
  }
  discs = discs.filter(d => !d.dead);
}

/* --------------------------------------------------------------------------
   enemies
   -------------------------------------------------------------------------- */
function ebullet(x, y, a, sp, dmg, r = 6, opts) {
  if (ebullets.length >= 600) return;
  const b = { x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r, dmg, life: 7 };
  if (opts) Object.assign(b, opts);
  ebullets.push(b);
}
function updateEnemy(e, dt) {
  const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
  let tx = ux * e.speed, ty = uy * e.speed, steer = 4;
  e.t += dt; e.stT -= dt;
  switch (e.type) {
    case 'boss': return updateBoss(e, dt, d, ux, uy);
    case 'dasher':
      if (e.st === 'chase' && d < 320 && e.stT <= 0) { e.st = 'wind'; e.stT = .6; e.aim = Math.atan2(dy, dx); }
      else if (e.st === 'wind') { tx = ty = 0; steer = 10; if (e.stT <= 0) { e.st = 'dash'; e.stT = .42; } }
      else if (e.st === 'dash') { tx = Math.cos(e.aim) * 470; ty = Math.sin(e.aim) * 470; steer = 14; if (e.stT <= 0) { e.st = 'chase'; e.stT = 1.1; } }
      break;
    case 'spitter':
      if (d < 230) { tx = -ux * e.speed; ty = -uy * e.speed; }
      else if (d < 320) { tx = -uy * e.speed; ty = ux * e.speed; }
      if (e.stT <= 0 && d < 520) { e.stT = rnd(2.2, 3); ebullet(e.x, e.y, Math.atan2(dy, dx), 200, e.dmg); }
      break;
    case 'sniper':
      if (e.st === 'aim') {
        tx = ty = 0; steer = 8;
        if (e.stT > .3) e.aim = Math.atan2(dy, dx);
        if (e.stT <= 0) { e.st = 'chase'; e.stT = rnd(3.2, 4.4); ebullet(e.x, e.y, e.aim, 470, e.dmg, 5, { snipe: true }); }
      } else {
        if (d < 360) { tx = -ux * e.speed; ty = -uy * e.speed; } else if (d < 470) { tx = -uy * e.speed * .6; ty = ux * e.speed * .6; }
        if (e.stT <= 0 && d < 640) { e.st = 'aim'; e.stT = 1.0; e.aim = Math.atan2(dy, dx); }
      }
      break;
    case 'bomber':
      if (e.st === 'fuse') {
        tx = ty = 0; steer = 6;
        if (e.stT <= 0) {
          e.dead = true;
          const R = 95;
          if (d < R + P.r) hurtPlayer(e.dmg, e.x, e.y, 'bomber');
          forNear(e.x, e.y, R, o => { if (o !== e) hurtEnemy(o, 80 * hpMul(), (o.x - e.x) * 3, (o.y - e.y) * 3, true, 'boom'); });
          fx.push({ k: 'ring', x: e.x, y: e.y, r0: 10, r1: R, life: .35, max: .35, color: COL.bomber, w: 6 });
          burst(e.x, e.y, COL.bomber, 30, 260, 3, .6); A.boom(); G.shake = Math.max(G.shake, 6);
          return;
        }
      } else if (d < 78) { e.st = 'fuse'; e.stT = .8; }
      break;
    case 'warder':
      if (d < 200) { tx = -uy * e.speed; ty = ux * e.speed; }
      break;
    case 'phaser':
      if (e.st === 'chase' && e.stT <= 0 && d < 700) {
        const a = rnd(TAU), r = rnd(150, 220);
        e.st = 'blink'; e.stT = .55; e.bx = P.x + Math.cos(a) * r; e.by = P.y + Math.sin(a) * r;
      } else if (e.st === 'blink') {
        tx = ty = 0;
        if (e.stT <= 0) {
          burst(e.x, e.y, COL.phaser, 10, 140, 2, .3);
          e.x = e.bx; e.y = e.by; e.vx = e.vy = 0; e.st = 'chase'; e.stT = rnd(2.8, 3.8);
          burst(e.x, e.y, COL.phaser, 10, 140, 2, .3);
        }
      }
      break;
    case 'brood':
      if (e.stT <= 0) {
        e.stT = 4; e.spawned = (e.spawned || 0) + 2;
        if (e.spawned <= 16 && enemies.length < 380) for (let i = 0; i < 2; i++) { const m = spawnEnemy('mite', e.x + rnd(-20, 20), e.y + rnd(-20, 20)); m.kx = rnd(-120, 120); m.ky = rnd(-120, 120); }
      }
      break;
    case 'orbiter': {
      e.oa += dt * .8 * e.dir;
      const gx = P.x + Math.cos(e.oa) * 250, gy = P.y + Math.sin(e.oa) * 250, ddx = gx - e.x, ddy = gy - e.y, dd = Math.hypot(ddx, ddy) || 1;
      const sp = Math.min(e.speed * 1.4, dd * 3);
      tx = ddx / dd * sp; ty = ddy / dd * sp; steer = 3;
      if (e.stT <= 0 && d < 420) { e.stT = rnd(2.4, 3); const a = Math.atan2(dy, dx); for (let i = -1; i <= 1; i++) ebullet(e.x, e.y, a + i * .22, 200, e.dmg); }
      break;
    }
  }
  e.vx += (tx - e.vx) * Math.min(1, dt * steer);
  e.vy += (ty - e.vy) * Math.min(1, dt * steer);
  e.x += (e.vx + e.kx) * dt; e.y += (e.vy + e.ky) * dt;
  const kd = Math.exp(-7 * dt); e.kx *= kd; e.ky *= kd;
  e.rot += dt * (e.type === 'drone' || e.type === 'mite' ? 0 : 1.2);
  if (e.flash > 0) e.flash -= dt;
  if (e.orbCd > 0) e.orbCd -= dt;
  if (e.lasCd > 0) e.lasCd -= dt;
  if (d > viewR() * 2.4) { const [x, y] = edgePoint(); e.x = x; e.y = y; }
}

/* --------------------------------------------------------------------------
   bosses
   -------------------------------------------------------------------------- */
const PAT_LEN = { radial: 3.4, spiral: 3.4, fan: 3.2, summon: 2, charge: 3.2, crossfire: 3.4, ringwave: 3.4, gapring: 3.6, shardrain: 3.2,
  stomp: 3, doublespiral: 3.6, strikes: 3.6, gravity: 3.6, blink: 3, voidzones: 3.4, homing: 3, summonphase: 2, lasers: 4.8, walls: 4, missiles: 3 };
function hazard(k, x, y, r, warn, extra) { hazards.push(Object.assign({ k, x, y, r, warn, max: warn, life: 0, tick: 0 }, extra || {})); }
function updateBoss(b, dt, d, ux, uy) {
  const tier = b.tier, sp = b.speed, haste = 1 + (b.rage || 0) * .3;
  if (b.final && !b.rage && G.t - b.born > 100) { b.rage = 1; b.speed *= 1.15; showBanner(tr('bRage'), b.name, 'warn', 2); A.siren(); }
  if (!b.lock) {
    let tx, ty;
    if (d > 300) { tx = ux * sp; ty = uy * sp; } else { tx = (-uy * .9 + ux * .2) * sp; ty = (ux * .9 + uy * .2) * sp; }
    b.vx += (tx - b.vx) * Math.min(1, dt * 2); b.vy += (ty - b.vy) * Math.min(1, dt * 2);
  } else { b.vx *= .85; b.vy *= .85; }
  b.x += (b.vx + b.kx) * dt; b.y += (b.vy + b.ky) * dt; b.kx *= .9; b.ky *= .9;
  b.rot += dt * .6;
  if (b.flash > 0) b.flash -= dt;
  if (b.orbCd > 0) b.orbCd -= dt;
  if (b.lasCd > 0) b.lasCd -= dt;
  if (b.fade > 0) b.fade -= dt;
  b.pt -= dt * haste; b.sub -= dt * haste;
  if (b.pt <= 0) {
    b.pi = (b.pi + 1) % b.patterns.length; b.pat = b.patterns[b.pi];
    b.pt = PAT_LEN[b.pat] || 3.4; b.sub = 0; b.cnt = 0; b.lock = false; b.windT = b.dashT = 0; b.beams = null;
  }
  const fn = BOSS_PATTERNS[b.pat]; if (fn) fn(b, dt * haste, tier, Math.atan2(P.y - b.y, P.x - b.x), d);
  if (d > viewR() * 2.2) { const [x, y] = edgePoint(-60); b.x = x; b.y = y; }
}
const BOSS_PATTERNS = {
  radial(b, dt, tier) {
    if (b.sub <= 0 && b.cnt < 3) { b.sub = .9; b.cnt++; const n = 16 + tier * 5, off = rnd(TAU); for (let i = 0; i < n; i++) ebullet(b.x, b.y, off + i / n * TAU, 165 + tier * 12, b.dmg * .45, 7); }
  },
  spiral(b, dt, tier) {
    if (b.sub <= 0 && b.pt > .8) { b.sub = .085 - tier * .01; b.spin += .38; const arms = 2 + Math.min(tier, 2); for (let i = 0; i < arms; i++) ebullet(b.x, b.y, b.spin + i / arms * TAU, 175, b.dmg * .4, 6); }
  },
  fan(b, dt, tier, toP) {
    if (b.sub <= 0 && b.cnt < 4) { b.sub = .65; b.cnt++; const n = 5 + tier * 2; for (let i = 0; i < n; i++) ebullet(b.x, b.y, toP + (i - (n - 1) / 2) * .13, 235, b.dmg * .45, 6); }
  },
  summon(b, dt, tier) {
    if (b.cnt < 1) {
      b.cnt = 1; const n = 6 + tier * 3;
      for (let i = 0; i < n; i++) { const a = i / n * TAU; spawnEnemy(tier > 0 && i % 3 === 0 ? 'dasher' : 'drone', b.x + Math.cos(a) * 70, b.y + Math.sin(a) * 70); }
      fx.push({ k: 'ring', x: b.x, y: b.y, r0: 20, r1: 120, life: .4, max: .4, color: b.color });
    }
  },
  charge(b, dt, tier, toP) {
    if (b.sub <= 0 && b.cnt < 3) { b.cnt++; b.sub = 1; b.aim = toP; b.windT = .45; b.lock = true; A.charge(); }
    if (b.windT > 0) { b.windT -= dt; if (b.windT <= 0) b.dashT = .4; }
    else if (b.dashT > 0) { b.dashT -= dt; b.x += Math.cos(b.aim) * 560 * dt; b.y += Math.sin(b.aim) * 560 * dt; burst(b.x, b.y, b.color, 2, 80, 3, .4); }
  },
  crossfire(b, dt, tier, toP) {
    /* rapid aimed streams from both flanks */
    if (b.sub <= 0 && b.cnt < 24 + tier * 6) {
      b.sub = .07; b.cnt++;
      const side = b.cnt % 2 ? 1 : -1, ox = Math.cos(toP + Math.PI / 2) * 30 * side, oy = Math.sin(toP + Math.PI / 2) * 30 * side;
      ebullet(b.x + ox, b.y + oy, toP + side * .05, 260, b.dmg * .4, 5);
    }
  },
  ringwave(b, dt, tier) {
    if (b.sub <= 0 && b.cnt < 4) { b.sub = .75; b.cnt++; const n = 28 + tier * 4, off = b.cnt * .11; for (let i = 0; i < n; i++) ebullet(b.x, b.y, off + i / n * TAU, 120, b.dmg * .4, 6); }
  },
  gapring(b, dt, tier) {
    b.lock = true;
    if (b.sub <= 0 && b.cnt < 3) {
      b.sub = 1.05; b.cnt++;
      const n = 40, gap = 5 - Math.min(tier, 2), gapAt = Math.floor(rnd(n));
      for (let i = 0; i < n; i++) { const k = (i - gapAt + n) % n; if (k < gap) continue; ebullet(b.x, b.y, i / n * TAU, 145 + tier * 10, b.dmg * .45, 7); }
    }
  },
  shardrain(b, dt, tier) {
    if (b.sub <= 0 && b.cnt < 2) {
      b.sub = 1.4; b.cnt++;
      const n = 5 + tier;
      hazard('shard', P.x + P.vx * .5, P.y + P.vy * .5, 46, 1, { dmg: b.dmg * .6, color: b.color });
      for (let i = 1; i < n; i++) { const a = rnd(TAU), r = rnd(90, 260); hazard('shard', P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 46, 1 + rnd(.3), { dmg: b.dmg * .6, color: b.color }); }
    }
  },
  stomp(b, dt, tier) {
    b.lock = true;
    if (b.sub <= 0 && b.cnt < 2) {
      if (!b.windT) { b.windT = .6; A.charge(); }
      b.windT -= dt;
      if (b.windT <= 0) {
        b.windT = 0; b.sub = 1.1; b.cnt++;
        const n = 52 + tier * 6; for (let i = 0; i < n; i++) ebullet(b.x, b.y, i / n * TAU + b.cnt * .06, 105, b.dmg * .45, 6);
        fx.push({ k: 'ring', x: b.x, y: b.y, r0: b.r, r1: b.r * 3, life: .4, max: .4, color: b.color, w: 6 }); G.shake = Math.max(G.shake, 8); A.boom();
      }
    }
  },
  doublespiral(b, dt, tier) {
    if (b.sub <= 0 && b.pt > .6) {
      b.sub = .1 - tier * .01; b.spin += .29;
      for (let i = 0; i < 3; i++) { ebullet(b.x, b.y, b.spin + i / 3 * TAU, 165, b.dmg * .4, 6); ebullet(b.x, b.y, -b.spin * 1.1 + i / 3 * TAU, 140, b.dmg * .4, 6); }
    }
  },
  strikes(b, dt, tier) {
    if (b.sub <= 0 && b.cnt < 6 + tier * 2) { b.sub = .38; b.cnt++; hazard('strike', P.x + P.vx * .6 + rnd(-30, 30), P.y + P.vy * .6 + rnd(-30, 30), 50, .95, { dmg: b.dmg * .55, color: '#bfe0ff' }); }
  },
  gravity(b, dt, tier) {
    const dx = b.x - P.x, dy = b.y - P.y, d = Math.hypot(dx, dy) || 1, f = (95 + tier * 15) * dt;
    if (d > b.r + 30) { P.x += dx / d * f; P.y += dy / d * f; }
    if (b.sub <= 0) { b.sub = .55; const n = 10 + tier * 2, off = rnd(TAU); for (let i = 0; i < n; i++) ebullet(b.x, b.y, off + i / n * TAU, 120, b.dmg * .4, 6); }
    if (Math.random() < .5) parts.push({ x: b.x + dx / d * -rnd(80, 300), y: b.y + dy / d * -rnd(80, 300), vx: dx / d * 260, vy: dy / d * 260, life: .5, max: .5, color: b.color, size: 2 });
  },
  blink(b, dt, tier) {
    if (b.sub <= 0 && b.cnt < 2) {
      b.cnt++; b.sub = 1.4;
      burst(b.x, b.y, b.color, 30, 200, 3, .5);
      const a = rnd(TAU); b.x = P.x + Math.cos(a) * 260; b.y = P.y + Math.sin(a) * 260; b.vx = b.vy = 0; b.fade = .4;
      const n = 20 + tier * 4; for (let i = 0; i < n; i++) ebullet(b.x, b.y, i / n * TAU, 150, b.dmg * .4, 6);
      A.warp();
    }
  },
  voidzones(b, dt, tier) {
    if (b.cnt < 1) {
      b.cnt = 1;
      const n = 4 + tier;
      hazard('zone', P.x, P.y, 72, 1.1, { dmg: b.dmg * .3, dur: 3.5, color: '#9b3dff' });
      for (let i = 1; i < n; i++) { const a = i / n * TAU + rnd(.4), r = rnd(120, 220); hazard('zone', P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 72, 1.1, { dmg: b.dmg * .3, dur: 3.5, color: '#9b3dff' }); }
    }
  },
  homing(b, dt, tier, toP) {
    if (b.sub <= 0 && b.cnt < 6 + tier * 2) { b.sub = .35; b.cnt++; ebullet(b.x, b.y, toP + rnd(-1.2, 1.2), 140, b.dmg * .5, 8, { homing: 1.6, life: 5 }); }
  },
  summonphase(b, dt, tier) {
    if (b.cnt < 1) {
      b.cnt = 1;
      for (let i = 0; i < 4 + tier; i++) { const a = rnd(TAU); spawnEnemy('phaser', b.x + Math.cos(a) * 90, b.y + Math.sin(a) * 90); }
      for (let i = 0; i < 2; i++) { const a = rnd(TAU); spawnEnemy('orbiter', b.x + Math.cos(a) * 90, b.y + Math.sin(a) * 90); }
      fx.push({ k: 'ring', x: b.x, y: b.y, r0: 20, r1: 140, life: .4, max: .4, color: b.color });
    }
  },
  lasers(b, dt, tier) {
    b.lock = true;
    if (!b.beams) { const n = 2 + Math.min(tier, 2), off = rnd(TAU); b.beams = Array.from({ length: n }, (_, i) => off + i / n * TAU); b.beamWarn = 1.1; b.beamDir = Math.random() < .5 ? 1 : -1; A.charge(); }
    if (b.beamWarn > 0) { b.beamWarn -= dt; return; }
    if (b.pt < .4) return;
    const len = 900;
    for (let i = 0; i < b.beams.length; i++) {
      b.beams[i] += dt * .55 * b.beamDir;
      const a = b.beams[i];
      if (segDist(P.x, P.y, b.x, b.y, b.x + Math.cos(a) * len, b.y + Math.sin(a) * len) < 12 + P.r - 4) hurtPlayer(b.dmg * .55, undefined, undefined, 'laser');
    }
  },
  walls(b, dt, tier, toP) {
    if (b.sub <= 0 && b.cnt < 3) {
      b.sub = 1.25; b.cnt++;
      const nx = Math.cos(toP + Math.PI / 2), ny = Math.sin(toP + Math.PI / 2), gapC = rnd(-200, 200), gapW = 110 - tier * 10;
      for (let s = -420; s <= 420; s += 24) { if (Math.abs(s - gapC) < gapW / 2) continue; ebullet(b.x + nx * s, b.y + ny * s, toP, 150, b.dmg * .45, 7); }
    }
  },
  missiles(b, dt, tier, toP) {
    if (b.sub <= 0 && b.cnt < 3) { b.sub = .8; b.cnt++; for (let i = 0; i < 3 + tier; i++) ebullet(b.x, b.y, toP + Math.PI + rnd(-1.3, 1.3), 200, b.dmg * .5, 7, { homing: 2.6, life: 3.6, missile: true }); A.launch(); }
  }
};
function updateHazards(dt) {
  for (const h of hazards) {
    if (h.warn > 0) {
      h.warn -= dt;
      if (h.warn <= 0) {
        const inside = Math.hypot(P.x - h.x, P.y - h.y) < h.r + P.r - 4;
        if (h.k === 'strike') { if (inside) hurtPlayer(h.dmg, undefined, undefined, 'strike'); burst(h.x, h.y, h.color, 24, 260, 3, .4); fx.push({ k: 'bolt', pts: jag([[h.x + rnd(-40, 40), h.y - 420], [h.x, h.y]]), life: .25, max: .25, color: '#dfefff' }); A.zap(); h.dead = true; }
        else if (h.k === 'shard') { if (inside) hurtPlayer(h.dmg, undefined, undefined, 'shard'); for (let i = 0; i < 8; i++) ebullet(h.x, h.y, i / 8 * TAU + rnd(.3), 150, h.dmg * .6, 5); burst(h.x, h.y, h.color, 16, 200, 3, .4); h.dead = true; }
        else if (h.k === 'zone') { h.life = h.dur; }
      }
    } else if (h.k === 'zone') {
      h.life -= dt; h.tick -= dt;
      if (h.tick <= 0 && Math.hypot(P.x - h.x, P.y - h.y) < h.r + P.r - 4) { h.tick = .5; hurtPlayer(h.dmg, undefined, undefined, 'zone'); }
      if (h.life <= 0) h.dead = true;
    }
  }
  hazards = hazards.filter(h => !h.dead);
}
function separate() {
  for (const a of grid.values()) {
    const n = Math.min(a.length, 14);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const p = a[i], q = a[j], dx = q.x - p.x, dy = q.y - p.y, rr = p.r + q.r, d2 = dx * dx + dy * dy;
      if (d2 < rr * rr && d2 > .01) {
        const d = Math.sqrt(d2), push = (rr - d) * .5, nx = dx / d, ny = dy / d;
        const pb = p.type === 'boss', qb = q.type === 'boss';
        if (pb && qb) continue;
        const wp = pb ? 0 : qb ? 2 : 1, wq = qb ? 0 : pb ? 2 : 1;
        p.x -= nx * push * wp; p.y -= ny * push * wp; q.x += nx * push * wq; q.y += ny * push * wq;
      }
    }
  }
}

/* --------------------------------------------------------------------------
   main step
   -------------------------------------------------------------------------- */
function update(dt) {
  G.t += dt; G.pickT -= dt;

  /* player */
  const [ix, iy] = inputDir();
  const ax = ix * S.speed, ay = iy * S.speed;
  P.vx += (ax - P.vx) * Math.min(1, dt * 12); P.vy += (ay - P.vy) * Math.min(1, dt * 12);
  P.x += P.vx * dt; P.y += P.vy * dt;
  if (P.inv > 0) P.inv -= dt;
  if (S.regen && P.hp < P.maxHp) P.hp = Math.min(P.maxHp, P.hp + S.regen * dt);
  if (Math.hypot(P.vx, P.vy) > 40 && parts.length < 1400 && Math.random() < .7) {
    const a = Math.atan2(P.vy, P.vx) + Math.PI;
    parts.push({ x: P.x + Math.cos(a) * 10, y: P.y + Math.sin(a) * 10, vx: Math.cos(a + rnd(-.4, .4)) * 90, vy: Math.sin(a + rnd(-.4, .4)) * 90, life: .32, max: .32, color: P.color, size: 2 });
  }
  if (G.comboT > 0) { G.comboT -= dt; if (G.comboT <= 0) G.combo = 0; }

  director(dt);
  warders = enemies.filter(e => e.type === 'warder' && !e.dead);
  for (const e of enemies) if (!e.dead) updateEnemy(e, dt);
  buildGrid(); separate();

  fireBlaster(dt); updateOrbit(dt); updateChain(dt); updateNova(dt); updateMissiles(dt); updateShield(dt);
  updateRail(dt); updateMines(dt); updateSing(dt); updateWings(dt); updateLaser(dt); updateDiscs(dt);
  updateHazards(dt);

  for (const b of bullets) {
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    if (b.life <= 0) { b.dead = true; continue; }
    forNear(b.x, b.y, 4, e => {
      if (b.hit.includes(e.id)) return;
      b.hit.push(e.id);
      hurtEnemy(e, b.dmg, b.vx * .14, b.vy * .14);
      if (b.pierce-- <= 0) { b.dead = true; burst(b.x, b.y, COL.pbullet, 3, 90, 1.6, .2); return true; }
    });
  }
  bullets = bullets.filter(b => !b.dead);

  forNear(P.x, P.y, P.r - 2, e => { if (!(e.fade > 0)) { hurtPlayer(e.dmg, e.x, e.y, e.type); return true; } });
  for (const b of ebullets) {
    if (b.homing) { const a = Math.atan2(b.vy, b.vx), sp = Math.hypot(b.vx, b.vy), na = a + clamp(angDiff(a, Math.atan2(P.y - b.y, P.x - b.x)), -b.homing * dt, b.homing * dt); b.vx = Math.cos(na) * sp; b.vy = Math.sin(na) * sp; }
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    const dx = b.x - P.x, dy = b.y - P.y, rr = b.r + P.r - 4;
    if (dx * dx + dy * dy < rr * rr && P.inv <= 0) { b.life = 0; hurtPlayer(b.dmg, undefined, undefined, b.snipe ? 'snipe' : b.missile ? 'bmissile' : b.homing ? 'homing' : 'bullet'); }
  }
  ebullets = ebullets.filter(b => b.life > 0);
  enemies = enemies.filter(e => !e.dead);
  if (G.bosses.length) G.bosses = G.bosses.filter(b => !b.dead);

  /* gems & pickups */
  const mag = S.magnet, mag2 = mag * mag;
  for (const g of gems) {
    const dx = P.x - g.x, dy = P.y - g.y, d2 = dx * dx + dy * dy;
    if (d2 < mag2) g.pull = true;
    if (g.pull) { const d = Math.sqrt(d2) || 1, s = 520 + (g.boost || 0); g.vx += (dx / d * s - g.vx) * Math.min(1, dt * 7); g.vy += (dy / d * s - g.vy) * Math.min(1, dt * 7); }
    else { g.vx *= .92; g.vy *= .92; }
    g.x += g.vx * dt; g.y += g.vy * dt; g.rot += dt * 2;
    if (d2 < (P.r + 10) * (P.r + 10)) { g.got = true; gainXp(g.v); }
  }
  gems = gems.filter(g => !g.got);
  for (const p of pickups) {
    p.t += dt;
    const dx = P.x - p.x, dy = P.y - p.y, d = Math.hypot(dx, dy) || 1;
    if (d < mag * .8 || G.cleared) { p.x += dx / d * 360 * dt; p.y += dy / d * 360 * dt; }
    if (d < P.r + 14) {
      p.got = true;
      if (p.k === 'heal') { P.hp = Math.min(P.maxHp, P.hp + 30); A.heal(); texts.push({ x: P.x, y: P.y - 24, v: -40, life: 1, max: 1, txt: '+30', heal: true }); }
      if (p.k === 'magnet') { for (const g of gems) { g.pull = true; g.boost = 400; } A.heal(); }
      if (p.k === 'chest') { G.pending++; G.chests++; A.level(); burst(p.x, p.y, COL.chest, 30, 220, 3, .7); }
    }
  }
  pickups = pickups.filter(p => !p.got);

  for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .95; p.vy *= .95; p.life -= dt; }
  parts = parts.filter(p => p.life > 0);
  for (const t of texts) { t.y += t.v * dt; t.v *= .93; t.life -= dt; }
  texts = texts.filter(t => t.life > 0);
  for (const f of fx) { f.life -= dt; if (f.follow) { f.x = P.x; f.y = P.y; } }
  fx = fx.filter(f => f.life > 0);
  G.shake *= Math.exp(-10 * dt); G.flash = Math.max(0, G.flash - dt * 1.6); G.hurt = Math.max(0, G.hurt - dt * 1.8);

  runAchievements();
  if (G.cleared) { G.clearT -= dt; if (G.clearT <= 0 && G.pending === 0) { endRun(true); return; } }
  if (G.pending > 0 && G.state === 'play') openLevelUp();
}
function gainXp(v) {
  v *= S.xp;
  P.xp += v; G.score += Math.round(v * 2);
  G.pickCombo = G.pickT > 0 ? G.pickCombo + 1 : 0; G.pickT = .4; A.pick(G.pickCombo);
  while (P.xp >= P.next) { P.xp -= P.next; P.level++; P.next = xpNeed(P.level); G.pending++; }
}
function runAchievements() {
  if (G.kills >= 1000) achieve('kills1000');
  if (G.kills >= 3000) achieve('kills3000');
  if (P.level >= 30) achieve('lv30');
  if (G.maxCombo >= 300) achieve('combo300');
  if (G.elites >= 10) achieve('elites10');
  if (G.t - G.lastHit >= 120) achieve('untouch');
  if (G.stage.endless && G.t >= 600) achieve('endless10');
  if (G.stage.endless && G.t >= 1200) achieve('endless20');
}

/* --------------------------------------------------------------------------
   level-up choices
   -------------------------------------------------------------------------- */
function rollChoices() {
  /* a chest offers every evolution that is ready; with none ready it waits until the
     ordinary level-ups are spent, since one of them may complete a recipe */
  const ready = G.chests > 0 ? evoReady() : [];
  G.fromChest = G.chests > 0 && (ready.length > 0 || G.pending <= G.chests);
  const evos = G.fromChest ? ready.slice(0, 3) : [];
  const full = weaponCount() >= MAX_WEAPONS;
  const pool = ALL_UPS.filter(u => {
    const l = G.ups[u.id] || 0;
    if (l >= u.max) return false;
    if (u.isWeapon && !l && full) return false;
    if (u.needs && !W[u.needs]) return false;
    return true;
  });
  const weight = u => (u.w || 1) * (u.isWeapon && !G.ups[u.id] ? (P.level < 8 ? 1.8 : 1.1) : 1) * (u.isWeapon && G.ups[u.id] ? 1.25 : 1);
  const out = evos;
  while (out.length < 3 && pool.length) {
    let tot = 0; for (const u of pool) tot += weight(u);
    let r = rnd(tot), i = 0;
    for (; i < pool.length - 1; i++) { r -= weight(pool[i]); if (r <= 0) break; }
    out.push(pool.splice(i, 1)[0]);
  }
  for (const f of FILLERS) if (out.length < 3) out.push(f);
  G.choices = out;
}
function applyUpgrade(u) {
  const l = (G.ups[u.id] || 0) + 1;
  if (u.max <= 20) G.ups[u.id] = l;
  u.apply(l);
  if (G.fromChest) { G.chests--; G.fromChest = false; }
  if (u.isWeapon && l >= u.max && u.max > 1) achieve('maxweapon');
  if (weaponCount() >= 6) achieve('sixguns');
}
