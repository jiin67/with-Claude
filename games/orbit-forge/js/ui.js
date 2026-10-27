'use strict';
/* ==========================================================================
   Saves, shop panel, tutorial, ads, input and the main loop.
   ========================================================================== */
const $ = id => document.getElementById(id);
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

/* --------------------------------------------------------------------------
   save (browser storage, plus the portal's account storage when it has one)
   -------------------------------------------------------------------------- */
const SAVE_KEY = 'orbitforge.save.v1';
function loadSave(raw) {
  const f = freshSave();
  try {
    if (raw === undefined) raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return f;
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return f;
    for (const k in f) {
      const fv = f[k], sv = s[k];
      if (sv === undefined || sv === null) continue;
      if (Array.isArray(fv)) { if (Array.isArray(sv)) f[k] = fv.map((x, i) => Number(sv[i]) || 0); }
      else if (fv && typeof fv === 'object') { if (typeof sv === 'object') f[k] = { ...fv, ...sv }; }
      else if (typeof sv === typeof fv) f[k] = sv;
    }
  } catch (e) {}
  return f;
}
let S = loadSave();
const FX = fx0();
function persist() {
  S.saved = Date.now();
  const raw = JSON.stringify(S);
  try { localStorage.setItem(SAVE_KEY, raw); } catch (e) {}
  try { if (PORTAL.store) PORTAL.store.setItem(SAVE_KEY, raw); } catch (e) {}
}
function applySettings() { NOTATION = S.settings.notation; A.setMuted(!S.settings.sound); }
applySettings();

/* --------------------------------------------------------------------------
   toasts and tips
   -------------------------------------------------------------------------- */
function toast(kind, text) {
  const t = el('div', 'toast'); t.append(el('b', null, kind), text);
  const box = $('toasts'); box.appendChild(t);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => t.remove(), 3600);
}
let tipHtml = '';
function tip(html) { if (html === tipHtml) return; tipHtml = html; $('tip').innerHTML = html; $('tip').hidden = !html; }

/* --------------------------------------------------------------------------
   build tab
   -------------------------------------------------------------------------- */
let buyMode = '1';
const bCards = [];
function visibleBuildings() {
  let n = 1;
  for (let i = 0; i < BUILDINGS.length; i++) if (S.b[i] > 0 || (i > 0 && S.b[i - 1] > 0)) n = Math.max(n, i + 1);
  return Math.min(BUILDINGS.length, n + 1);        /* plus one mystery card */
}
let builtShown = -1;
function renderBuild() {
  const list = $('buildList'), n = visibleBuildings();
  builtShown = n; list.innerHTML = ''; bCards.length = 0;
  for (let i = 0; i < n; i++) {
    const mystery = i > 0 && S.b[i - 1] === 0 && S.b[i] === 0;
    const b = el('button', 'bld' + (mystery ? ' mystery' : '')); b.type = 'button';
    const ic = document.createElement('canvas'); ic.width = ic.height = 104; drawIcon(ic, i, mystery);
    const mid = el('div'), name = el('h4', null, mystery ? tr('locked') : bName(i)), sub = el('div', 'sub', mystery ? tr('lockedHint') : bDesc(i));
    mid.append(name, sub);
    const right = el('div', 'right'), count = el('div', 'count', ''), cost = el('div', 'cost'), nTag = el('span', 'n');
    cost.append(el('i', 'gem'), el('span'));
    right.append(count, cost, nTag);
    b.append(ic, mid, right);
    b.onclick = () => buyB(i);
    list.appendChild(b);
    bCards.push({ i, b, sub, count, cost: cost.lastChild, costBox: cost, nTag, mystery });
  }
  updateBuild();
}
function buyCount(i) {
  if (buyMode === 'max') return Math.max(1, bMax(S, i));
  return +buyMode;
}
function updateBuild() {
  if (visibleBuildings() !== builtShown) return renderBuild();
  const o = ops(S, FX);
  for (const c of bCards) {
    const n = buyCount(c.i), cost = bCost(S, c.i, n), can = S.ore >= cost && !c.mystery;
    c.b.classList.toggle('can', can);
    c.cost.textContent = fmt(cost);
    c.nTag.textContent = n > 1 ? '×' + n : '';
    c.count.textContent = S.b[c.i] ? String(S.b[c.i]) : '';
    if (!c.mystery && S.b[c.i]) {
      const p = bProd(S, c.i) * globalMult(S) * (S.boostT > 0 ? BOOST.mult : 1) * (FX.frenzyT > 0 ? COMET.frenzyMult : 1);
      const share = o > 0 ? Math.round(p / o * 100) : 0;
      const txt = tr('produces', fmt(p, true)) + ' · ' + tr('share', share);
      if (c.sub.textContent !== txt) c.sub.textContent = txt;
    }
  }
}
function buyB(i) {
  A.init();
  const n = buyCount(i);
  if (buyBuilding(S, i, n)) { A.buy(); if (tutorial() === 1) S.tutorial = 2; updateBuild(); refreshUps(true); }
  else A.deny();
}
for (const b of document.querySelectorAll('.buyn button')) b.addEventListener('click', () => {
  buyMode = b.dataset.n;
  for (const x of document.querySelectorAll('.buyn button')) x.setAttribute('aria-pressed', String(x === b));
  updateBuild();
});

/* --------------------------------------------------------------------------
   upgrades tab
   -------------------------------------------------------------------------- */
let upSig = '';
const upCards = [];
function refreshUps(force) {
  const ups = shopUpgrades(S), sig = ups.map(u => u.id).join(',');
  if (force || sig !== upSig) {
    upSig = sig; upCards.length = 0;
    const g = $('upList'); g.innerHTML = '';
    for (const u of ups) {
      const color = u.kind === 'tier' ? BUILDINGS[u.bi].color : u.kind === 'tap' ? '#ffc457' : '#4ee6c8';
      const kind = u.kind === 'tier' ? bName(u.bi) : u.kind === 'tap' ? tr('kTap') : tr('kFleet');
      const b = el('button', 'up'); b.type = 'button'; b.style.setProperty('--c', color);
      const cost = el('div', 'cost'); cost.append(el('i', 'gem'), el('span', null, fmt(u.cost)));
      b.append(el('span', 'kind', kind), el('h4', null, upName(u)), el('p', null, upDesc(u)), cost);
      b.onclick = () => {
        A.init();
        if (buyUpgrade(S, u.id)) { A.upgrade(); toast(tr('upBought'), upName(u)); if (tutorial() === 2) finishTutorial(); refreshUps(true); updateBuild(); }
        else A.deny();
      };
      g.appendChild(b); upCards.push({ u, b });
    }
    $('upEmpty').hidden = ups.length > 0;
  }
  let can = 0;
  for (const c of upCards) { const ok = S.ore >= c.u.cost; c.b.classList.toggle('can', ok); if (ok) can++; }
  $('upBadge').hidden = !can; $('upBadge').textContent = can;
}

/* --------------------------------------------------------------------------
   collapse tab
   -------------------------------------------------------------------------- */
function renderCollapse() {
  $('dmOwned').textContent = fmt(S.dm);
  $('dmBonus').textContent = tr('dmBonus', fmt(Math.round((dmMult(S) - 1) * 100)));
  const g = collapseGain(S);
  $('collapseInfo').textContent = g > 0 ? tr('collapseGain', fmt(g)) : tr('collapseNeed', fmt(COLLAPSE_MIN));
  $('btnCollapse').disabled = g <= 0;
  if (g <= 0) $('btnCollapseConfirm').hidden = true;
  const list = $('relicList'); list.innerHTML = '';
  for (const r of RELICS) {
    const l = relic(S, r.id), row = el('div', 'relic'), info = el('div');
    info.append(el('h4', null, NM[r.id][0]), el('p', null, NM[r.id][1]), el('span', 'lv', tr('relicLv', l, r.max)));
    const btn = el('button', 'btn violet', l >= r.max ? tr('maxed') : tr('relicBuy', r.cost(l)));
    btn.disabled = l >= r.max || S.dm < r.cost(l);
    btn.onclick = () => { if (buyRelic(S, r.id)) { A.upgrade(); persist(); renderCollapse(); updateBuild(); } };
    row.append(info, btn); list.appendChild(row);
  }
}
function doCollapse() {
  const g = collapse(S); if (!g) return;
  A.collapse(); PORTAL.happy();
  FX.frenzyT = 0; comet = null;
  makeRock(S.stats.collapses);
  burst(field.cx, field.cy, 160, '#a77bff', 520);
  toast(tr('collapseTitle'), tr('collapsed', fmt(g)));
  persist(); renderBuild(); refreshUps(true); renderCollapse();
  $('btnCollapseConfirm').hidden = true;
  /* a collapse is a natural break: the portal may show an interstitial */
  PORTAL.midgame().then(() => PORTAL.start());
}

/* --------------------------------------------------------------------------
   records tab
   -------------------------------------------------------------------------- */
function renderRecords() {
  const st = $('statList'); st.innerHTML = '';
  [[tr('stOre'), fmt(S.stats.oreAll)], [tr('stRun'), fmt(S.runOre)], [tr('stTap'), fmt(tapValue(S, FX))], [tr('stTaps'), fmt(S.stats.taps)],
   [tr('stComets'), fmt(S.stats.comets)], [tr('stCollapses'), fmt(S.stats.collapses)], [tr('dmOwned'), fmt(S.dmAll)], [tr('stPlay'), fmtTime(S.stats.playT)]]
    .forEach(([k, v]) => { const d = el('div'); d.append(el('span', null, k), el('b', null, v)); st.appendChild(d); });
  const n = achCount(S);
  $('achBonus').textContent = tr('achBonus', n, Math.round(n * ACH_BONUS * 100));
  const al = $('achList'); al.innerHTML = '';
  for (const a of ACHS) { const d = el('div', 'ach' + (S.ach[a.id] ? ' done' : '')); d.append(el('b', null, NM.ach[a.id][0]), el('span', null, NM.ach[a.id][1])); al.appendChild(d); }
}

/* --------------------------------------------------------------------------
   tabs
   -------------------------------------------------------------------------- */
let tab = 'Build';
function setTab(t) {
  tab = t;
  for (const k of ['Build', 'Up', 'Collapse', 'Records']) { $('tab' + k).setAttribute('aria-selected', String(k === t)); $('page' + k).hidden = k !== t; }
  if (t === 'Build') updateBuild();
  if (t === 'Up') { refreshUps(true); if (tutorial() === 2) finishTutorial(); }
  if (t === 'Collapse') renderCollapse();
  if (t === 'Records') renderRecords();
}
for (const k of ['Build', 'Up', 'Collapse', 'Records']) $('tab' + k).addEventListener('click', () => { A.init(); setTab(k); });

/* --------------------------------------------------------------------------
   tutorial: 0 tap, 1 buy a drone, 2 open upgrades, 3 done
   -------------------------------------------------------------------------- */
const tutorial = () => S.tutorial;
function finishTutorial() { S.tutorial = 3; tip(''); }
function tutorialTick() {
  const t = S.tutorial;
  if (t === 0) { tip(tr('tut1')); if (S.stats.taps >= 8) S.tutorial = 1; }
  else if (t === 1) { if (S.b[0] > 0) S.tutorial = 2; else tip(S.ore >= BUILDINGS[0].cost ? tr('tut2') : tr('tut1')); }
  else if (t === 2) { if (shopUpgrades(S).length) tip(tr('tut3')); else tip(''); }
  else if (comet && !S.stats.comets) tip(tr('tutComet'));
  else tip('');
}

/* --------------------------------------------------------------------------
   ads: boost and doubled offline earnings
   -------------------------------------------------------------------------- */
function updateBoostBtn() {
  const b = $('btnBoost');
  b.hidden = !PORTAL.rewarded;
  if (b.hidden) return;
  const txt = S.boostT > 0 ? tr('boostOn', fmtTime(S.boostT)) : tr('boost');
  if (b.textContent !== txt) b.textContent = txt;
  b.classList.toggle('on', S.boostT > 0);
  b.title = tr('boostDesc');
  b.disabled = S.boostT > BOOST.cap - BOOST.add;
}
$('btnBoost').addEventListener('click', () => {
  A.init();
  PORTAL.reward().then(ok => {
    PORTAL.start();
    if (!ok) { toast(tr('boost'), tr('adFail')); return; }
    addBoost(S); persist(); updateBoostBtn(); toast(tr('boost'), tr('boostDesc'));
  });
});
function updateEffects() {
  const box = $('effects'), parts_ = [];
  if (FX.frenzyT > 0) parts_.push(['frenzy', '☄ ×' + COMET.frenzyMult + ' · ' + fmtTime(FX.frenzyT)]);
  if (S.boostT > 0) parts_.push(['boost', '▲ ×' + BOOST.mult + ' · ' + fmtTime(S.boostT)]);
  const html = parts_.map(([c, t]) => `<span class="${c}">${t}</span>`).join('');
  if (box.innerHTML !== html) box.innerHTML = html;
}

/* offline earnings: shown on load and when returning to a hidden tab */
let pendingAway = null;
function offerAway(secs) {
  const g = offlineGain(S, secs);
  if (g.amount <= 0) return false;
  S.stats.bestAway = Math.max(S.stats.bestAway, secs);
  pendingAway = g;
  $('awayText').textContent = tr('away', fmtTime(g.secs));
  $('awayGain').textContent = fmt(g.amount);
  $('btnCollect2').hidden = !PORTAL.rewarded; $('btnCollect2').disabled = false;
  $('welcome').hidden = false; PORTAL.stop();
  return true;
}
function collectAway(mult) {
  if (!pendingAway) return;
  const amt = pendingAway.amount * mult; pendingAway = null;
  earn(S, amt); $('welcome').hidden = true; PORTAL.start();
  burst(field.cx, field.cy, 60, '#ffc457', 380);
  for (let i = 0; i < 12; i++) flyGem(field.cx + (Math.random() - .5) * 80, field.cy + (Math.random() - .5) * 80);
  floatText(field.cx, field.cy - field.r - 20, '+' + fmt(amt), '#ffc457', true);
  A.upgrade(); persist(); updateBuild(); refreshUps();
}
$('btnCollect').addEventListener('click', () => { A.init(); collectAway(1); });
$('btnCollect2').addEventListener('click', () => {
  A.init(); $('btnCollect2').disabled = true;
  PORTAL.reward().then(ok => { if (ok) collectAway(2); else { $('btnCollect2').disabled = false; toast(tr('collect2'), tr('adFail')); } });
});

/* --------------------------------------------------------------------------
   settings
   -------------------------------------------------------------------------- */
$('btnSettings').addEventListener('click', () => {
  A.init();
  $('optSound').checked = S.settings.sound; $('optNotation').value = S.settings.notation; $('optLang').value = LANG;
  $('btnResetConfirm').hidden = true; $('settings').hidden = false;
});
$('btnSettingsClose').addEventListener('click', () => { $('settings').hidden = true; });
$('settings').addEventListener('click', e => { if (e.target === $('settings')) $('settings').hidden = true; });
$('optSound').addEventListener('change', e => { S.settings.sound = e.target.checked; applySettings(); persist(); });
$('optNotation').addEventListener('change', e => { S.settings.notation = e.target.value; applySettings(); persist(); renderBuild(); refreshUps(true); });
$('optLang').addEventListener('change', e => { persist(); setLang(e.target.value); });
$('btnReset').addEventListener('click', () => { $('btnResetConfirm').hidden = false; });
$('btnResetConfirm').addEventListener('click', () => {
  const settings = S.settings; S = freshSave(); S.settings = settings; persist();
  makeRock(0); renderBuild(); refreshUps(true); setTab('Build'); $('settings').hidden = true;
});
$('btnCollapse').addEventListener('click', () => { if (collapseGain(S) > 0) $('btnCollapseConfirm').hidden = false; });
$('btnCollapseConfirm').addEventListener('click', doCollapse);

/* --------------------------------------------------------------------------
   input: tap the rock or the comet
   -------------------------------------------------------------------------- */
function doTap(x, y) {
  const v = tap(S, FX);
  rock.squash = 1; A.tap();
  burst(x, y, 7, '#ffd98a', 200);
  floatText(x + (Math.random() - .5) * 20, y - 16, '+' + fmt(v, true), '#ffe2a0');
  if (Math.random() < .5) flyGem(x, y);
}
cv.addEventListener('pointerdown', e => {
  A.init();
  if (!$('welcome').hidden || !$('settings').hidden) return;
  const x = e.clientX, y = e.clientY;
  if (cometHit(x, y)) {
    const r = catchComet(S, FX);
    A.comet(); burst(comet.x, comet.y, 50, '#bdf0ff', 360);
    if (r.kind === 'frenzy') { floatText(comet.x, comet.y, tr('frenzy'), '#ffe7a8', true); toast('☄', tr('frenzy')); }
    else { floatText(comet.x, comet.y, '+' + fmt(r.amount), '#bdf0ff', true); toast('☄', tr('lump', fmt(r.amount))); for (let i = 0; i < 8; i++) flyGem(comet.x, comet.y); }
    comet = null; return;
  }
  if (rockHit(x, y)) doTap(x, y);
});
addEventListener('keydown', e => {
  if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); if (!e.repeat && $('welcome').hidden && $('settings').hidden) { A.init(); doTap(field.cx + (Math.random() - .5) * field.r, field.cy + (Math.random() - .5) * field.r); } }
  if (e.code === 'Escape') $('settings').hidden = true;
});

/* --------------------------------------------------------------------------
   loop
   -------------------------------------------------------------------------- */
let last = performance.now(), slow = 0, saveT = 10, cometT = 25, hiddenAt = 0;
function frame(now) {
  let dt = (now - last) / 1000; last = now;
  if (dt > 1) dt = 1;                         /* long gaps are handled as offline time */
  if ($('welcome').hidden) {
    tick(S, FX, dt);
    if (!comet && (cometT -= dt) <= 0) { spawnComet(); cometT = cometGap(S); }
  }
  render(dt);
  if ((slow -= dt) <= 0) {
    slow = .2;
    $('ore').textContent = fmt(S.ore);
    $('ops').textContent = fmt(ops(S, FX), true);
    $('ops').parentElement.classList.toggle('hot', FX.frenzyT > 0 || S.boostT > 0);
    if (tab === 'Build') updateBuild();
    refreshUps();
    if (tab === 'Collapse') { const g = collapseGain(S); if ($('btnCollapse').disabled !== (g <= 0)) renderCollapse(); }
    updateBoostBtn(); updateEffects(); tutorialTick();
    for (const id of checkAchs(S)) { A.ach(); toast(tr('achGot'), NM.ach[id][0]); if (tab === 'Records') renderRecords(); }
  }
  if ((saveT -= dt) <= 0) { saveT = 10; persist(); }
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { hiddenAt = Date.now(); persist(); PORTAL.stop(); return; }
  const away = hiddenAt ? (Date.now() - hiddenAt) / 1000 : 0; hiddenAt = 0;
  last = performance.now();
  if (!offerAway(away) && away > 1) tick(S, FX, Math.min(away, OFFLINE.min));
  if ($('welcome').hidden) PORTAL.start();
});
addEventListener('pagehide', persist);
addEventListener('resize', resize);

/* --------------------------------------------------------------------------
   start
   -------------------------------------------------------------------------- */
applyStaticText();
resize();
makeRock(S.stats.collapses);
renderBuild(); refreshUps(true);
PORTAL.onAd = playing => { A.setMuted(playing || !S.settings.sound); };
PORTAL.ready.then(() => {
  /* the portal's account copy wins when present, so progress follows the player */
  if (PORTAL.store) {
    let raw = null; try { raw = PORTAL.store.getItem(SAVE_KEY); } catch (e) {}
    if (raw) {
      const s2 = loadSave(raw);
      if (s2.stats.oreAll >= S.stats.oreAll) { S = s2; applySettings(); makeRock(S.stats.collapses); renderBuild(); refreshUps(true); }
    }
  }
  /* measure time away before the next save overwrites the timestamp */
  const away = (Date.now() - S.saved) / 1000;
  if (PORTAL.store) persist();
  updateBoostBtn();
  offerAway(away);
  if ($('welcome').hidden) PORTAL.start();
  PORTAL.loaded();
});
requestAnimationFrame(frame);

/* test hook for the automated checks */
window.__of = { get S() { return S; }, FX, set: s => { S = s; renderBuild(); refreshUps(true); }, spawnComet: () => spawnComet(), get comet() { return comet; }, persist };
