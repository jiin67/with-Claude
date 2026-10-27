'use strict';
/* ==========================================================================
   Rules of the economy. Pure functions over the save object `s` and the
   short-lived effects object `fx` — no DOM, so tools/sim.mjs can run them.
   ========================================================================== */

function freshSave() {
  return {
    v: 1, ore: 0, runOre: 0, b: BUILDINGS.map(() => 0), up: {},
    dm: 0, dmAll: 0, relics: {}, ach: {}, boostT: 0, saved: Date.now(), runStart: Date.now(),
    stats: { taps: 0, oreAll: 0, comets: 0, collapses: 0, bestAway: 0, playT: 0 },
    settings: { sound: true, notation: 'short' }, tutorial: 0
  };
}
const fx0 = () => ({ frenzyT: 0 });

const relic = (s, id) => s.relics[id] || 0;
const achCount = s => ACHS.reduce((n, a) => n + (s.ach[a.id] ? 1 : 0), 0);

/* ---- buildings ---- */
function costMult(s) { return 1 - .03 * relic(s, 'discount'); }
/* price of the next n units of building i */
function bCost(s, i, n = 1) {
  const g = COST_GROWTH, c0 = BUILDINGS[i].cost * Math.pow(g, s.b[i]) * costMult(s);
  return c0 * (Math.pow(g, n) - 1) / (g - 1);
}
/* how many of building i the current ore can pay for (at least 1 shown even when unaffordable) */
function bMax(s, i) {
  const g = COST_GROWTH, c0 = BUILDINGS[i].cost * Math.pow(g, s.b[i]) * costMult(s);
  return Math.max(0, Math.floor(Math.log(s.ore * (g - 1) / c0 + 1) / Math.log(g)));
}
function tierMult(s, i) {
  let m = 1;
  TIERS.forEach((t, k) => { if (s.up['b' + i + 't' + k]) m *= t.mult; });
  return m;
}
const bProd = (s, i) => s.b[i] * BUILDINGS[i].prod * tierMult(s, i);

/* ---- multipliers ---- */
/* Dark Matter bonus grows a little slower than linear, so late collapses don't run away */
function dmMult(s) { return 1 + Math.pow(s.dmAll, .85) * (DM_BONUS + .005 * relic(s, 'amp')); }
function globalMult(s) {
  let m = dmMult(s) * (1 + ACH_BONUS * achCount(s));
  for (const g of GLOBAL_UPS) if (s.up[g.id]) m *= g.mult;
  return m;
}
/* ore per second; fx adds comet frenzy, boost comes from the save */
function ops(s, fx) {
  let base = 0;
  for (let i = 0; i < BUILDINGS.length; i++) base += bProd(s, i);
  let m = globalMult(s);
  if (s.boostT > 0) m *= BOOST.mult;
  if (fx && fx.frenzyT > 0) m *= COMET.frenzyMult;
  return base * m;
}
function tapValue(s, fx) {
  let m = 1, pct = 0;
  for (const u of TAP_UPS) if (s.up[u.id]) { if (u.mult) m *= u.mult; if (u.pct) pct += u.pct; }
  m *= 1 + .5 * relic(s, 'lens');
  return Math.max(1, m * dmMult(s) + pct * ops(s, fx));
}

/* ---- upgrades: one flat list, filtered to what is visible now ---- */
const UPGRADES = [
  ...BUILDINGS.flatMap((b, i) => TIERS.map((t, k) => ({
    id: 'b' + i + 't' + k, kind: 'tier', bi: i, tier: k, mult: t.mult,
    cost: b.cost * t.price, visible: s => s.b[i] >= t.at
  }))),
  ...TAP_UPS.map((u, k) => ({
    id: u.id, kind: 'tap', tier: k, mult: u.mult, pct: u.pct, cost: u.cost,
    visible: s => (k === 0 || s.up[TAP_UPS[k - 1].id]) && s.runOre >= u.cost / 5
  })),
  ...GLOBAL_UPS.map((g, k) => ({
    id: g.id, kind: 'global', tier: k, mult: g.mult, cost: g.cost, visible: s => s.runOre >= g.need
  }))
];
const UP_BY_ID = Object.fromEntries(UPGRADES.map(u => [u.id, u]));
function shopUpgrades(s) { return UPGRADES.filter(u => !s.up[u.id] && u.visible(s)).sort((a, b) => a.cost - b.cost); }

/* ---- actions ---- */
function earn(s, n) { s.ore += n; s.runOre += n; s.stats.oreAll += n; }
function buyBuilding(s, i, n) {
  if (n <= 0) return false;
  const c = bCost(s, i, n);
  if (s.ore < c) return false;
  s.ore -= c; s.b[i] += n; return true;
}
function buyUpgrade(s, id) {
  const u = UP_BY_ID[id];
  if (!u || s.up[id] || !u.visible(s) || s.ore < u.cost) return false;
  s.ore -= u.cost; s.up[id] = true; return true;
}
function tap(s, fx) { const v = tapValue(s, fx); earn(s, v); s.stats.taps++; return v; }
function tick(s, fx, dt) {
  earn(s, ops(s, fx) * dt);
  if (s.boostT > 0) s.boostT = Math.max(0, s.boostT - dt);
  if (fx.frenzyT > 0) fx.frenzyT = Math.max(0, fx.frenzyT - dt);
  s.stats.playT += dt;
}

/* ---- comets ---- */
function cometGap(s) { return (COMET.minGap + Math.random() * (COMET.maxGap - COMET.minGap)) / (1 + .15 * relic(s, 'comet')); }
/* returns { kind, amount } */
function catchComet(s, fx) {
  s.stats.comets++;
  if (Math.random() < .45 && ops(s) > 0) { fx.frenzyT = COMET.frenzyT; return { kind: 'frenzy' }; }
  const o = ops(s, fx), amount = Math.max(tapValue(s, fx) * 40, o * 60, Math.min(o * 600, s.ore * .1));
  earn(s, amount); return { kind: 'lump', amount };
}

/* ---- boost (rewarded ad) ---- */
function addBoost(s) { s.boostT = Math.min(BOOST.cap, s.boostT + BOOST.add); }

/* ---- offline ---- */
function offlineCap(s) { return OFFLINE.cap + 4 * 3600 * relic(s, 'cache'); }
/* seconds away -> { secs, amount } (amount 0 when too short) */
function offlineGain(s, secs) {
  if (!(secs >= OFFLINE.min)) return { secs: 0, amount: 0 };
  const t = Math.min(secs, offlineCap(s));
  const saveBoost = s.boostT; s.boostT = 0;
  const amount = ops(s) * t * OFFLINE.rate;
  s.boostT = saveBoost;
  return { secs: t, amount };
}

/* ---- collapse (prestige) ---- */
const collapseGain = s => s.runOre >= COLLAPSE_MIN ? dmFor(s.runOre) : 0;
function collapse(s) {
  const g = collapseGain(s); if (g <= 0) return 0;
  s.dm += g; s.dmAll += g; s.stats.collapses++;
  s.ore = 0; s.runOre = 0; s.up = {}; s.b = BUILDINGS.map(() => 0); s.runStart = Date.now();
  s.b[0] = 10 * relic(s, 'kit');
  return g;
}
function buyRelic(s, id) {
  const r = RELICS.find(x => x.id === id); if (!r) return false;
  const l = relic(s, id); if (l >= r.max) return false;
  const c = r.cost(l); if (s.dm < c) return false;
  s.dm -= c; s.relics[id] = l + 1; return true;
}

/* ---- achievements: returns ids newly earned ---- */
function checkAchs(s) {
  const out = [];
  for (const a of ACHS) if (!s.ach[a.id] && a.test(s)) { s.ach[a.id] = Date.now(); out.push(a.id); }
  return out;
}
