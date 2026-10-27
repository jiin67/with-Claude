'use strict';
/* ==========================================================================
   ORBIT FORGE — game data. Every tunable number lives here.
   Names and descriptions are in i18n.js, keyed by id.
   ========================================================================== */

/* Generators. cost grows by COST_GROWTH per unit owned. ring: orbit drawn in render.js */
const BUILDINGS = [
  { id: 'drone',    cost: 15,     prod: 0.2,     color: '#7ef0ff', shape: 'tri' },
  { id: 'drill',    cost: 120,    prod: 1.6,     color: '#5affb4', shape: 'drill' },
  { id: 'magnet',   cost: 1.3e3,  prod: 12,      color: '#ffd27a', shape: 'horseshoe' },
  { id: 'refinery', cost: 1.5e4,  prod: 80,      color: '#ff9c5a', shape: 'square' },
  { id: 'hauler',   cost: 1.8e5,  prod: 520,     color: '#c8a0ff', shape: 'hauler' },
  { id: 'furnace',  cost: 2.2e6,  prod: 3.4e3,   color: '#ff5a7a', shape: 'hex' },
  { id: 'quantum',  cost: 3e7,    prod: 2.2e4,   color: '#9fb4ff', shape: 'diamond' },
  { id: 'siphon',   cost: 4.5e8,  prod: 1.5e5,   color: '#3dd6ff', shape: 'ring' },
  { id: 'harvester',cost: 7e9,    prod: 1.05e6,  color: '#ffe27a', shape: 'star' },
  { id: 'dyson',    cost: 1.2e11, prod: 7.5e6,   color: '#ff7ad8', shape: 'dyson' }
];
const COST_GROWTH = 1.15;

/* building upgrades: each tier doubles that building's output once you own `at` of it */
const TIERS = [
  { at: 1,   price: 8,    mult: 2 },
  { at: 10,  price: 40,   mult: 2 },
  { at: 25,  price: 400,  mult: 2 },
  { at: 50,  price: 6e3,  mult: 2 },
  { at: 100, price: 2e5,  mult: 3 },
  { at: 150, price: 2e7,  mult: 3 },
  { at: 200, price: 2e9,  mult: 4 },
  { at: 250, price: 2e11, mult: 4 },
  { at: 300, price: 2e13, mult: 5 }
];

/* tap upgrades: mult multiplies the base tap; pct adds a share of per-second output to each tap */
const TAP_UPS = [
  { id: 'tap1', cost: 100,   mult: 2 },
  { id: 'tap2', cost: 600,   mult: 2 },
  { id: 'tap3', cost: 8e3,   mult: 2 },
  { id: 'tap4', cost: 1.5e5, pct: .02 },
  { id: 'tap5', cost: 8e6,   pct: .03 },
  { id: 'tap6', cost: 6e8,   pct: .04 },
  { id: 'tap7', cost: 6e10,  pct: .05 }
];

/* fleet-wide upgrades unlock once lifetime ore of this run passes `need` */
const GLOBAL_UPS = [
  { id: 'g1', need: 5e3,   cost: 2.5e4, mult: 1.25 },
  { id: 'g2', need: 2e5,   cost: 1e6,   mult: 1.25 },
  { id: 'g3', need: 1e7,   cost: 5e7,   mult: 1.5 },
  { id: 'g4', need: 5e8,   cost: 2.5e9, mult: 1.5 },
  { id: 'g5', need: 2.5e10, cost: 1.2e11, mult: 2 },
  { id: 'g6', need: 1e12,  cost: 5e12,  mult: 2 },
  { id: 'g7', need: 5e13,  cost: 2.5e14, mult: 2 }
];

/* Collapse (prestige): Dark Matter from ore mined this run. Each unspent-or-spent DM adds DM_BONUS */
const COLLAPSE_MIN = 1e7;
const DM_BONUS = .04;
const dmFor = ore => Math.floor(2 * Math.cbrt(ore / 1e6));

/* relics: bought with Dark Matter, kept forever */
const RELICS = [
  { id: 'kit',     max: 5,  cost: l => 2 + l * 3 },            /* start each run with 10 drones per level */
  { id: 'cache',   max: 5,  cost: l => 3 + l * 4 },            /* offline cap +4h per level */
  { id: 'lens',    max: 10, cost: l => 4 + l * 4 },            /* taps +50% per level */
  { id: 'comet',   max: 5,  cost: l => 5 + l * 5 },            /* comets 15% more often per level */
  { id: 'discount',max: 5,  cost: l => 8 + l * 8 },            /* buildings 3% cheaper per level */
  { id: 'amp',     max: 10, cost: l => 15 + l * 15 }           /* Dark Matter bonus +0.5% per DM per level */
];

/* comets drift across the screen; tapping one gives a random reward */
const COMET = { minGap: 70, maxGap: 140, life: 9, frenzyMult: 5, frenzyT: 20, rushT: 10 };

/* rewarded-ad boost */
const BOOST = { mult: 2, add: 600, cap: 3600 };

/* offline progress: share of normal output earned while away, and default cap in seconds */
const OFFLINE = { rate: .5, cap: 4 * 3600, min: 60 };

/* achievements: each adds ACH_BONUS to all output. test(s) reads the save */
const ACH_BONUS = .02;
const ACHS = [
  { id: 'tap100',   test: s => s.stats.taps >= 100 },
  { id: 'tap2500',  test: s => s.stats.taps >= 2500 },
  { id: 'ore1e4',   test: s => s.stats.oreAll >= 1e4 },
  { id: 'ore1e6',   test: s => s.stats.oreAll >= 1e6 },
  { id: 'ore1e9',   test: s => s.stats.oreAll >= 1e9 },
  { id: 'ore1e12',  test: s => s.stats.oreAll >= 1e12 },
  { id: 'ore1e15',  test: s => s.stats.oreAll >= 1e15 },
  { id: 'b10',      test: s => s.b.reduce((a, n) => a + n, 0) >= 10 },
  { id: 'b100',     test: s => s.b.reduce((a, n) => a + n, 0) >= 100 },
  { id: 'b500',     test: s => s.b.reduce((a, n) => a + n, 0) >= 500 },
  { id: 'allTypes', test: s => s.b.every(n => n > 0) },
  { id: 'drone100', test: s => s.b[0] >= 100 },
  { id: 'dyson1',   test: s => s.b[9] >= 1 },
  { id: 'comet10',  test: s => s.stats.comets >= 10 },
  { id: 'comet50',  test: s => s.stats.comets >= 50 },
  { id: 'collapse1',test: s => s.stats.collapses >= 1 },
  { id: 'collapse5',test: s => s.stats.collapses >= 5 },
  { id: 'dm100',    test: s => s.dmAll >= 100 },
  { id: 'relic',    test: s => Object.values(s.relics).some(l => l > 0) },
  { id: 'away',     test: s => s.stats.bestAway >= 3600 }
];
