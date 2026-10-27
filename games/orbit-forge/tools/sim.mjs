/* Balance simulator: plays the economy with a greedy player and prints milestones.
   node tools/sim.mjs [tapsPerSecond] [minutes] [collapseAtMinute...] */
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const ctx = vm.createContext({ Math, Date, Object, console });
for (const f of ['data.js', 'logic.js']) vm.runInContext(readFileSync(new URL('../js/' + f, import.meta.url), 'utf8').replace(/^const |^function /gm, m => m === 'const ' ? 'var ' : 'function '), ctx);
const [tps = 3, minutes = 90, ...cols] = process.argv.slice(2).map(Number);
const r = vm.runInContext(`(() => {
  const s = freshSave(), fx = fx0(), log = [], seen = new Set();
  const mark = (k, t) => { if (!seen.has(k)) { seen.add(k); log.push([Math.round(t / 6) / 10, k]); } };
  let nextComet = cometGap(s), cols = ${JSON.stringify(cols)}.map(m => m * 60), dt = 1;
  for (let t = 0; t < ${minutes} * 60; t += dt) {
    for (let k = 0; k < ${tps}; k++) tap(s, fx);
    tick(s, fx, dt);
    if ((nextComet -= dt) <= 0) { nextComet = cometGap(s); if (Math.random() < .7) catchComet(s, fx); }
    /* greedy: best payback among buildings and upgrades, buy while affordable */
    for (let guard = 0; guard < 50; guard++) {
      const o0 = ops(s, fx) + ${tps} * tapValue(s, fx);
      let best = null, bestPb = Infinity;
      BUILDINGS.forEach((b, i) => {
        const c = bCost(s, i, 1); s.b[i]++; const gain = ops(s, fx) + ${tps} * tapValue(s, fx) - o0; s.b[i]--;
        const pb = c / Math.max(gain, 1e-9) + c / Math.max(o0, 1e-9); if (pb < bestPb) { bestPb = pb; best = ['b', i, c]; }
      });
      for (const u of shopUpgrades(s)) {
        s.up[u.id] = true; const gain = ops(s, fx) + ${tps} * tapValue(s, fx) - o0; delete s.up[u.id];
        const pb = u.cost / Math.max(gain, 1e-9) + u.cost / Math.max(o0, 1e-9); if (pb < bestPb) { bestPb = pb; best = ['u', u.id, u.cost]; }
      }
      if (!best || s.ore < best[2]) break;
      if (best[0] === 'b') { buyBuilding(s, best[1], 1); mark('first ' + BUILDINGS[best[1]].id, t); } else buyUpgrade(s, best[1]);
    }
    checkAchs(s);
    if (s.runOre >= COLLAPSE_MIN) mark('collapse ready (run ' + (s.stats.collapses + 1) + ')', t);
    if (cols.length && t >= cols[0]) { cols.shift(); const g = collapse(s); log.push([Math.round(t / 6) / 10, 'COLLAPSE +' + g + ' DM (total ' + s.dmAll + ')']);
      /* spend DM on relics, cheapest first */
      for (let k = 0; k < 40; k++) { const r = RELICS.filter(r => (s.relics[r.id] || 0) < r.max).sort((a, b) => a.cost(s.relics[a.id] || 0) - b.cost(s.relics[b.id] || 0))[0]; if (!r || !buyRelic(s, r.id)) break; } }
    if (t % 600 === 0) log.push([t / 60, 'ops ' + ops(s, fx).toExponential(2) + ' ore ' + s.runOre.toExponential(2) + ' b ' + s.b.join(',') + ' dmIfCollapse ' + collapseGain(s)]);
  }
  return log;
})()`, ctx);
for (const [m, k] of r) console.log(String(m).padStart(6) + ' min  ' + k);
