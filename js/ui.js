'use strict';
/* ==========================================================================
   Menus, saves, achievements, tutorial, HUD, input and the main loop.
   ========================================================================== */
const $ = id => document.getElementById(id);
const fmtN = n => Math.floor(n).toLocaleString(LANG === 'ko' ? 'ko-KR' : 'en-US');

/* --------------------------------------------------------------------------
   save data (browser storage; the game still works when it is unavailable)
   -------------------------------------------------------------------------- */
const SAVE_KEY = 'stardrift.save.v2';
function freshSave() {
  return { v: 2, dust: 0, totalDust: 0, ships: { scout: true }, ship: 'scout', stage: 0, meta: {}, cleared: {}, best: {},
    ach: {}, seen: {}, clearsBy: {}, tutorialDone: false, settings: { sound: true, shake: true },
    stats: { runs: 0, kills: 0, bosses: 0, time: 0, clears: 0, boom: 0, warders: 0, bestLevel: 0, deaths: 0 } };
}
function loadSave(raw) {
  try {
    if (raw === undefined) raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const s = JSON.parse(raw), f = freshSave();
      if (!s || typeof s !== 'object') return f;
      const out = { ...f };
      for (const k in f) {
        const fv = f[k], sv = s[k];
        if (sv === undefined || sv === null) continue;
        if (fv && typeof fv === 'object') { if (typeof sv === 'object') out[k] = { ...fv, ...sv }; }
        else if (typeof sv === typeof fv) out[k] = sv;
      }
      out.ships.scout = true;
      return out;
    }
  } catch (e) {}
  return freshSave();
}
let SAVE = loadSave();
const SETTINGS = SAVE.settings;
function persist() {
  const raw = JSON.stringify(SAVE);
  try { localStorage.setItem(SAVE_KEY, raw); } catch (e) {}
  try { if (PORTAL.store) PORTAL.store.setItem(SAVE_KEY, raw); } catch (e) {}
}
/* portals with account saves (CrazyGames): their copy wins, so progress follows the player across devices */
PORTAL.ready.then(() => {
  if (!PORTAL.store) return;
  let raw = null;
  try { raw = PORTAL.store.getItem(SAVE_KEY); } catch (e) {}
  if (!raw) { persist(); return; }
  if (G) return;
  SAVE = loadSave(raw); Object.assign(SETTINGS, SAVE.settings); SAVE.settings = SETTINGS;
  A.setMuted(!SETTINGS.sound); $('btnMute').setAttribute('aria-pressed', String(A.muted));
  try { localStorage.setItem(SAVE_KEY, raw); } catch (e) {}
  if (screen === 'title') dustAll();
});
A.muted = !SETTINGS.sound;

function markSeen(k) { if (!SAVE.seen[k]) SAVE.seen[k] = true; }
function earn(n) { SAVE.dust += n; SAVE.totalDust += n; }
function achieve(id) {
  if (SAVE.ach[id]) return;
  const a = ACH.find(x => x.id === id); if (!a) return;
  SAVE.ach[id] = Date.now(); earn(a.reward);
  if (G && G.newAch) G.newAch.push(id);
  toast(tr('achGot'), a.name, `${a.desc} · ${tr('dust')} +${a.reward}`);
  A.ach(); persist();
}
function toast(kind, title, sub) {
  const t = document.createElement('div'); t.className = 'toast';
  const k = document.createElement('div'); k.className = 'k'; k.textContent = kind;
  const b = document.createElement('b'); b.textContent = title;
  const s = document.createElement('span'); s.textContent = sub;
  t.append(k, b, s); const box = $('toasts'); box.appendChild(t);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => t.remove(), 3800);
}

/* --------------------------------------------------------------------------
   screens
   -------------------------------------------------------------------------- */
const SCREENS = ['title', 'prep', 'hangar', 'records', 'settings', 'levelup', 'pause', 'revive', 'over'];
let screen = 'title';
function show(id) { if (id && id !== 'levelup' && id !== 'pause' && id !== 'over') $('toasts').innerHTML = ''; screen = id; for (const s of SCREENS) $(s).hidden = s !== id; $('toasts').hidden = id === 'levelup' || id === 'pause' || id === 'revive'; }
function dustAll() { for (const id of ['dustTitle', 'dustPrep', 'dustHangar']) $(id).textContent = fmtN(SAVE.dust); }
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

function stageUnlocked(i) { return i === 0 || (i === 3 ? !!SAVE.cleared[1] : !!SAVE.cleared[i]); }
function stageLockText(i) { return tr('lockStage', STAGES[i === 3 ? 0 : i - 1].name); }

function goTitle() { G = null; $('hud').hidden = true; hideTip(); A.stopMusic(); dustAll(); show('title'); }

/* ---- prep ---- */
function goPrep() {
  G = null; $('hud').hidden = true; hideTip(); A.stopMusic();
  if (!stageUnlocked(SAVE.stage)) SAVE.stage = 0;
  if (!SAVE.ships[SAVE.ship]) SAVE.ship = 'scout';
  menuNeb = STAGES[SAVE.stage].neb;
  dustAll(); renderPrep(); show('prep');
}
function renderPrep() {
  const sl = $('stageList'); sl.innerHTML = '';
  STAGES.forEach((st, i) => {
    const open = stageUnlocked(i);
    const b = el('button', 'pick' + (open ? '' : ' locked')); b.type = 'button';
    b.style.setProperty('--c', st.neb[1]); b.setAttribute('aria-pressed', String(SAVE.stage === i)); b.disabled = !open;
    b.append(el('span', 'en', (st.endless ? '∞' : 'STAGE ' + st.id) + ' · ' + st.en), el('h4', null, st.name), el('p', null, open ? st.desc : stageLockText(i)));
    const best = SAVE.best[st.id];
    const meta = el('div', 'meta');
    if (best) { meta.append(tr('best')); const bb = el('b', null, fmtN(best.score)); meta.append(bb, ' · ' + fmtT(best.t)); } else meta.textContent = open ? tr('noRecord') : tr('locked');
    b.appendChild(meta);
    if (SAVE.cleared[st.id]) b.appendChild(el('span', 'tag clear', tr('cleared')));
    else if (!open) b.appendChild(el('span', 'tag', tr('locked')));
    b.onclick = () => { SAVE.stage = i; menuNeb = st.neb; A.click(); renderPrep(); };
    sl.appendChild(b);
  });
  const shl = $('shipList'); shl.innerHTML = '';
  SHIPS.forEach(sh => {
    const own = !!SAVE.ships[sh.id];
    const b = el('button', 'pick' + (own ? '' : ' locked')); b.type = 'button';
    b.style.setProperty('--c', sh.color); b.setAttribute('aria-pressed', String(SAVE.ship === sh.id));
    const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 128; drawPortrait(cv2, 'ship', sh.id);
    b.append(cv2, el('span', 'en', sh.role), el('h4', null, sh.name), el('p', null, sh.desc));
    const st = el('div', 'ship-stats');
    st.append(el('span', null, tr('hp')), el('b', null, String(sh.hp)), el('span', null, tr('speed')), el('b', null, String(sh.speed)));
    b.appendChild(st);
    if (!own) b.appendChild(el('span', 'tag', '◆ ' + fmtN(sh.cost)));
    b.onclick = () => {
      if (!own) { $('prepHint').textContent = tr('shipLocked', sh.name, fmtN(sh.cost)); return; }
      SAVE.ship = sh.id; A.click(); $('prepHint').textContent = ''; renderPrep();
    };
    shl.appendChild(b);
  });
}

/* ---- hangar ---- */
let hangarTab = 'meta';
function goHangar(tab) { if (tab) hangarTab = tab; G = null; $('hud').hidden = true; hideTip(); A.stopMusic(); dustAll(); renderHangar(); show('hangar'); }
function renderHangar() {
  $('tabMeta').setAttribute('aria-selected', String(hangarTab === 'meta'));
  $('tabShips').setAttribute('aria-selected', String(hangarTab === 'ships'));
  $('metaList').hidden = hangarTab !== 'meta'; $('shipShop').hidden = hangarTab !== 'ships';
  dustAll();
  const ml = $('metaList'); ml.innerHTML = '';
  for (const m of META) {
    const l = SAVE.meta[m.id] || 0, row = el('div', 'meta-row');
    const top = el('div', 'top'); top.append(el('h4', null, m.name), el('span', 'lv', `LV ${l} / ${m.max}`));
    const pips = el('div', 'pips'); for (let k = 1; k <= m.max; k++) pips.appendChild(el('i', k <= l ? 'on' : ''));
    row.append(top, pips, el('p', null, m.per + (m.max > 1 ? tr('perLevel') : '')));
    if (l < m.max) {
      const cost = metaCost(m, l), btn = el('button', 'btn gold', `${tr('upgrade')} ◆ ${fmtN(cost)}`);
      btn.disabled = SAVE.dust < cost;
      btn.onclick = () => { if (SAVE.dust < cost) return; SAVE.dust -= cost; SAVE.meta[m.id] = l + 1; A.buy(); checkMetaAch(); persist(); renderHangar(); };
      row.appendChild(btn);
    } else row.appendChild(el('span', 'lv', tr('maxed')));
    ml.appendChild(row);
  }
  const ss = $('shipShop'); ss.innerHTML = '';
  for (const sh of SHIPS) {
    const own = !!SAVE.ships[sh.id], card = el('div', 'pick'); card.style.setProperty('--c', sh.color);
    const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 128; drawPortrait(cv2, 'ship', sh.id);
    card.append(cv2, el('span', 'en', sh.role), el('h4', null, sh.name), el('p', null, sh.desc));
    if (own) card.appendChild(el('span', 'meta', tr('owned')));
    else {
      const btn = el('button', 'btn gold', `${tr('unlock')} ◆ ${fmtN(sh.cost)}`); btn.disabled = SAVE.dust < sh.cost;
      btn.onclick = () => { if (SAVE.dust < sh.cost) return; SAVE.dust -= sh.cost; SAVE.ships[sh.id] = true; A.buy(); if (SHIPS.every(s => SAVE.ships[s.id])) achieve('allships'); persist(); renderHangar(); };
      card.appendChild(btn);
    }
    ss.appendChild(card);
  }
}
function checkMetaAch() { if (META.every(m => (SAVE.meta[m.id] || 0) >= m.max)) achieve('maxmeta'); }

/* ---- records ---- */
let recTab = 'ach';
function goRecords() { renderRecords(); show('records'); }
function renderRecords() {
  for (const [t, id] of [['ach', 'tabAch'], ['codex', 'tabCodex'], ['stats', 'tabStats']]) $(id).setAttribute('aria-selected', String(recTab === t));
  $('achList').hidden = recTab !== 'ach'; $('codexList').hidden = recTab !== 'codex'; $('statsList').hidden = recTab !== 'stats';
  const done = ACH.filter(a => SAVE.ach[a.id]).length;
  $('achCount').textContent = tr('achCount', done, ACH.length);
  const al = $('achList'); al.innerHTML = '';
  for (const a of ACH) {
    const d = el('div', 'ach' + (SAVE.ach[a.id] ? ' done' : ''));
    d.append(el('b', null, a.name), el('span', null, a.desc), el('span', 'r', (SAVE.ach[a.id] ? tr('done') : '') + '◆ ' + a.reward));
    al.appendChild(d);
  }
  const cl = $('codexList'); cl.innerHTML = '';
  cl.appendChild(el('h4', null, tr('enemies')));
  for (const k of Object.keys(ED)) {
    if (k === 'boss') continue;
    const seen = !!SAVE.seen[k], d = el('div', 'ent' + (seen ? '' : ' unseen'));
    const c2 = document.createElement('canvas'); c2.width = c2.height = 112; drawPortrait(c2, 'enemy', k, !seen);
    const t = el('div'); t.append(el('b', null, seen ? ED[k].name : '???'), el('span', null, seen ? ED[k].info : tr('unseen')));
    d.append(c2, t); cl.appendChild(d);
  }
  cl.appendChild(el('h4', null, tr('bosses')));
  for (const k of Object.keys(BOSSES)) {
    const seen = !!SAVE.seen['boss:' + k], d = el('div', 'ent' + (seen ? '' : ' unseen'));
    const c2 = document.createElement('canvas'); c2.width = c2.height = 112; drawPortrait(c2, 'boss', k, !seen);
    const t = el('div'); t.append(el('b', null, seen ? BOSSES[k].name : '???'), el('span', null, seen ? BOSSES[k].info : tr('unseen')));
    d.append(c2, t); cl.appendChild(d);
  }
  cl.appendChild(el('h4', null, tr('evoHead')));
  for (const v of EVOLUTIONS) {
    const seen = !!SAVE.seen['evo:' + v.id], d = el('div', 'ent' + (seen ? '' : ' unseen'));
    const c2 = document.createElement('canvas'); c2.width = c2.height = 112; drawPortrait(c2, 'evo', v.id, !seen);
    const recipe = tr('evoRecipe', WEAPONS[v.weapon].name, UP_BY_ID[v.needs].name);
    const t = el('div'); t.append(el('b', null, seen ? v.name : '???'), el('span', 'recipe', recipe), el('span', null, seen ? v.desc : tr('evoUnseen')));
    d.append(c2, t); cl.appendChild(d);
  }
  const s = SAVE.stats, sl = $('statsList'); sl.innerHTML = '';
  [[tr('stRuns'), fmtN(s.runs)], [tr('stKills'), fmtN(s.kills)], [tr('stBosses'), fmtN(s.bosses)], [tr('stClears'), fmtN(s.clears)],
   [tr('stTime'), fmtT(s.time)], [tr('stLevel'), fmtN(s.bestLevel)], [tr('stDust'), fmtN(SAVE.totalDust)], [tr('stDeaths'), fmtN(s.deaths)]].forEach(([k, v]) => {
    const d = el('div'); d.append(el('span', null, k), el('b', null, v)); sl.appendChild(d);
  });
}

/* ---- settings ---- */
function goSettings() {
  $('optSound').checked = SETTINGS.sound; $('optShake').checked = SETTINGS.shake; $('optTips').checked = !SAVE.tutorialDone; $('optLang').value = LANG;
  $('btnResetConfirm').hidden = true; show('settings');
}

/* --------------------------------------------------------------------------
   run flow
   -------------------------------------------------------------------------- */
function startRun() {
  A.init();
  if (!stageUnlocked(SAVE.stage)) SAVE.stage = 0;
  if (!SAVE.ships[SAVE.ship]) SAVE.ship = 'scout';
  newGame(SAVE.stage, SAVE.ship, SAVE);
  G.newAch = [];
  G.tutorial = !SAVE.tutorialDone && SAVE.stage === 0 ? { step: 0, moved: 0, lx: 0, ly: 0, t: 0 } : null;
  SAVE.stats.runs++; persist();
  show(null); $('hud').hidden = false; $('bossbar').hidden = true; $('banner').hidden = true;
  for (const k in hudCache) delete hudCache[k];
  renderLoadout(); A.startMusic(SAVE.stage); updateHud(); PORTAL.start();
  showBanner(G.stage.name, G.stage.endless ? tr('endureAll') : tr('beatFinal'), 'info', 2.4);
}
function pauseRun() {
  if (!G || G.state !== 'play') return;
  G.state = 'paused'; keys.clear(); joy.on = false; A.stopMusic(); PORTAL.stop();
  $('pauseEyebrow').textContent = G.stage.name + ' · ' + fmtT(G.t);
  $('btnQuitConfirm').hidden = true;
  buildChips($('pauseBuild')); show('pause');
}
function resumeRun() { if (!G || G.state !== 'paused') return; G.state = 'play'; show(null); A.startMusic(); PORTAL.start(); }

/* between runs the portal may show an interstitial; the first run of a session starts straight away */
let launching = false, sessionRuns = 0;
function launch() {
  if (launching) return;
  if (!sessionRuns++ || PORTAL.name === 'none') { startRun(); return; }
  launching = true;
  PORTAL.midgame().then(() => { launching = false; startRun(); });
}

/* ad builds: a rewarded ad can bring the ship back once per run */
function offerRevive() {
  G.state = 'revive'; A.stopMusic(); keys.clear(); joy.on = false; hideTip(); PORTAL.stop(); $('banner').hidden = true;
  $('btnReviveAd').disabled = false; show('revive');
}
function reviveByAd() {
  if (!G || G.state !== 'revive') return;
  $('btnReviveAd').disabled = true;
  PORTAL.reward().then(ok => {
    if (!G || G.state !== 'revive') return;
    if (ok) { G.adRevived = true; G.state = 'play'; show(null); revivePlayer(); A.startMusic(); PORTAL.start(); }
    else { toast(tr('adFail'), '', ''); endRun(false); }
  });
}
let doubleGain = 0;
function doubleByAd() {
  const b = $('btnDouble'); if (!doubleGain || b.disabled) return;
  b.disabled = true;
  PORTAL.reward().then(ok => {
    if (!ok) { b.disabled = false; toast(tr('adFail'), '', ''); return; }
    earn(doubleGain); persist(); dustAll();
    const d = $('overEarn').querySelector('.dust'); if (d) d.textContent = '+' + fmtN(doubleGain * 2);
    toast(tr('doubled'), '+' + fmtN(doubleGain), ''); doubleGain = 0; b.hidden = true;
  });
}

function endRun(win, quit) {
  if (G.state === 'over' || G.state === 'win') return;
  G.state = win ? 'win' : 'over'; A.stopMusic(); keys.clear(); joy.on = false; hideTip(); PORTAL.stop();
  if (win) PORTAL.happy();
  if (!win && !quit) { A.big(); burst(P.x, P.y, P.color, 80, 300, 3, 1.2); G.shake = 14; }
  const st = G.stage;
  if (win) G.score += 10000 * st.id;

  /* stardust */
  const mining = 1 + (SAVE.meta.mining || 0) * .1;
  const parts_ = [[tr('pKills'), Math.floor(G.kills / 8)], [tr('pTime'), Math.floor(G.t / 6)], [tr('pBoss'), G.bossKills * 40]];
  if (win) parts_.push([tr('pClear'), 150 * st.id]);
  if (G.bonusDust) parts_.push([tr('pBounty'), G.bonusDust]);
  const base = parts_.reduce((s, p) => s + p[1], 0), gained = Math.round(base * (quit ? .5 : 1) * mining);
  earn(gained);
  doubleGain = quit ? 0 : gained;
  $('btnDouble').hidden = !(PORTAL.rewarded && doubleGain > 0); $('btnDouble').disabled = false;

  /* records */
  const S_ = SAVE.stats;
  S_.kills += G.kills; S_.bosses += G.bossKills; S_.time += G.t; S_.boom += G.boomKills; S_.warders += G.warderKills;
  S_.bestLevel = Math.max(S_.bestLevel, P.level); if (!win && !quit) S_.deaths++;
  const prev = SAVE.best[st.id], isBest = !prev || G.score > prev.score;
  if (isBest) SAVE.best[st.id] = { score: G.score, t: Math.floor(G.t), level: P.level, kills: G.kills, ship: G.ship.id };
  if (win) {
    S_.clears++;
    const firstClear = !SAVE.cleared[st.id];
    SAVE.cleared[st.id] = true;
    SAVE.clearsBy[G.ship.id] = SAVE.clearsBy[G.ship.id] || {}; SAVE.clearsBy[G.ship.id][st.id] = true;
    achieve('clear' + st.id);
    if (st.id === 2 && !G.ups.hp) achieve('nohp');
    if (SHIPS.every(s => SAVE.clearsBy[s.id] && SAVE.clearsBy[s.id][1])) achieve('veteran');
    if (firstClear && st.id < 3) G.unlockNote = tr('unlockNote', STAGES[st.id].name, st.id === 1);
  }
  if (S_.runs >= 20) achieve('runs20');
  if (S_.boom >= 10) achieve('boom10');
  if (S_.warders >= 50) achieve('warderkill');
  if (SAVE.totalDust >= 5000) achieve('dust5000');
  persist();

  /* results screen */
  $('overTitle').textContent = win ? tr('overWin') : quit ? tr('overQuit') : tr('overLose');
  $('overTitle').className = win ? 'win' : 'lose';
  $('overEyebrow').textContent = (st.endless ? tr('endlessName') : st.name) + ' · ' + G.ship.name + ' · ' + fmtT(G.t);
  $('overSub').textContent = win ? (G.unlockNote || tr('subWin'))
    : quit ? tr('subQuit')
    : G.bosses.length ? tr('subBoss', G.bosses[0].name, BOSSES[G.bosses[0].bid].info)
    : G.t < 90 ? tr('subEarly')
    : tr('subMeta');
  const stt = $('overStats'); stt.innerHTML = '';
  [[tr('rTime'), fmtT(G.t)], [tr('rLevel'), P.level], [tr('rKills'), fmtN(G.kills)], [tr('rScore'), fmtN(G.score)]].forEach(([k, v], i) => {
    const d = el('div'); d.append(el('span', null, k), el('b', null, String(v)));
    if (i === 3 && isBest) d.appendChild(el('span', 'rec', 'NEW BEST'));
    stt.appendChild(d);
  });
  const er = $('overEarn'); er.innerHTML = '';
  er.appendChild(el('span', 'dust', '+' + fmtN(gained)));
  for (const [k, v] of parts_) { const s = el('span'); s.append(k + ' '); s.appendChild(el('b', null, String(v))); er.appendChild(s); }
  if (mining > 1) er.appendChild(el('span', null, tr('mining', mining.toFixed(1))));
  if (quit) er.appendChild(el('span', null, tr('quitHalf')));
  const na = $('overAch'); na.innerHTML = '';
  for (const id of G.newAch) { const a = ACH.find(x => x.id === id); const s = el('span'); s.append(tr('achPrefix')); s.appendChild(el('b', null, a.name)); s.append(' ◆ ' + a.reward); na.appendChild(s); }
  buildChips($('overBuild'));
  $('hud').hidden = true; $('bossbar').hidden = true;
  dustAll();
  setTimeout(() => show('over'), win || quit ? 300 : 900);
}

/* ---- level up ---- */
function openLevelUp() {
  G.state = 'levelup'; A.level(); rollChoices(); drawCards(); show('levelup'); PORTAL.stop();
  keys.clear(); joy.on = false;
}
function drawCards() {
  const evoOffer = G.choices.some(u => u.isEvo);
  $('luEyebrow').textContent = (G.fromChest ? 'TREASURE' : 'LEVEL ' + P.level) + (G.pending > 1 ? tr('picksLeft', G.pending) : '');
  $('luTitle').textContent = evoOffer ? tr('evoTitle') : G.fromChest ? tr('chestTitle') : tr('pickTitle');
  $('luHint').hidden = !(G.tutorial && G.tutorial.step <= 2);
  $('weaponSlots').textContent = tr('slots', weaponCount(), MAX_WEAPONS);
  const box = $('cards'); box.innerHTML = '';
  G.choices.forEach((u, i) => {
    const cur = G.ups[u.id] || 0, next = cur + 1, [catName, catCol] = CAT[u.cat];
    const b = el('button', 'card'); b.id = 'card' + i; b.type = 'button'; b.style.setProperty('--c', catCol);
    const top = el('div', 'top'); top.append(el('span', 'chip', catName), el('span', 'key', '[' + (i + 1) + ']'));
    const lv = el('div', 'lv', u.isEvo ? tr('evoOf', WEAPONS[u.evo.weapon].name) : u.max > 20 ? tr('instant') : cur === 0 ? (u.isWeapon ? tr('newWeapon') : tr('newUp')) : 'LV ' + cur + ' → ' + next);
    if (u.isEvo) b.classList.add('evo');
    b.append(top, el('h3', null, u.name), lv);
    if (u.max > 1 && u.max <= 20) {
      const pips = el('div', 'pips');
      for (let k = 1; k <= u.max; k++) pips.appendChild(el('i', k <= cur ? 'on' : k === next ? 'new' : ''));
      b.appendChild(pips);
    }
    b.appendChild(el('p', null, u.desc(next)));
    const hint = evoHint(u, next);
    if (hint) b.appendChild(el('p', 'evo-hint', hint));
    b.addEventListener('click', () => pickUpgrade(i));
    box.appendChild(b);
  });
  const rr = $('btnReroll'); rr.textContent = tr('reroll', G.rerolls) + ' '; rr.appendChild(el('kbd', null, 'R'));
  rr.disabled = G.rerolls <= 0;
  setTimeout(() => { const c = $('card0'); if (c && matchMedia('(hover:hover)').matches) c.focus({ preventScroll: true }); }, 30);
}
/* recipe line under a weapon or passive card that is part of an evolution */
function evoHint(u, next) {
  const v = u.isWeapon ? EVO_BY_WEAPON[u.id] : EVO_BY_PASSIVE[u.id];
  if (!v || G.evo[v.weapon]) return '';
  const wName = WEAPONS[v.weapon].name, pName = UP_BY_ID[v.needs].name;
  if (u.isWeapon) {
    if (next < u.max) return '';
    return tr('evoPrefix', v.name) + (G.ups[v.needs] ? tr('evoNext') : tr('evoNeedPassive', pName));
  }
  if (!W[v.weapon]) return '';
  return tr('evoPrefix', v.name) + (W[v.weapon] >= WEAPONS[v.weapon].max ? tr('evoMaxed', wName) : tr('evoNeedWeapon', wName));
}
function pickUpgrade(i) {
  if (!G || G.state !== 'levelup') return;
  const u = G.choices[i]; if (!u) return;
  applyUpgrade(u);
  G.pending--;
  if (G.tutorial && G.tutorial.step === 2) { G.tutorial.step = 3; G.tutorial.t = 0; }
  renderLoadout();
  if (G.pending > 0) { rollChoices(); drawCards(); A.level(); }
  else { G.state = 'play'; show(null); P.inv = Math.max(P.inv, .6); PORTAL.start(); }
}
function reroll() { if (!G || G.state !== 'levelup' || G.rerolls <= 0) return; G.rerolls--; rollChoices(); drawCards(); }

/* --------------------------------------------------------------------------
   HUD, banner, tips
   -------------------------------------------------------------------------- */
const hudCache = {};
function setText(id, v) { if (hudCache[id] !== v) { hudCache[id] = v; $(id).textContent = v; } }
function setW(id, v) { v = Math.round(clamp(v, 0, 1) * 1000) / 10 + '%'; if (hudCache[id] !== v) { hudCache[id] = v; $(id).style.width = v; } }
function updateHud() {
  setText('timer', fmtT(G.t));
  let sub = '';
  if (G.cleared) sub = tr('subCleared');
  else if (G.stage.endless) sub = tr('subNext') + fmtT(G.endlessT);
  else if (G.queue.length) sub = (G.queue[0].final ? tr('subFinal') : tr('subBossIn')) + fmtT(G.queue[0].t - G.t);
  else if (G.bosses.length) sub = tr('subFight');
  setText('subtimer', sub);
  setText('lvl', String(P.level)); setText('kills', fmtN(G.kills));
  setText('hptext', String(Math.ceil(P.hp))); setW('hpfill', P.hp / P.maxHp); setW('xpfill', P.xp / P.next);
  if (G.bosses.length) {
    let hp = 0, mx = 0; const names = new Set();
    for (const b of G.bosses) { hp += Math.max(0, b.hp); mx += b.maxHp; names.add(b.name); }
    setText('bossname', [...names].join(' · ') + (G.bosses.some(b => b.rage) ? '  ·  ' + tr('rage') : ''));
    setW('bossfill', hp / mx); $('bossbar').hidden = false;
  } else $('bossbar').hidden = true;
}
function buildChips(box, weaponsOnly) {
  box.innerHTML = '';
  const add = (name, l, w) => { const s = el('span', w ? 'w' : '', name); s.appendChild(el('b', null, String(l))); box.appendChild(s); };
  for (const k of Object.keys(WEAPONS)) if (W[k]) {
    if (G.evo[k]) { add(EVO_BY_WEAPON[k].name, 'EVO', true); box.lastChild.classList.add('e'); }
    else add(WEAPONS[k].name, k === 'blaster' ? '×' + S.proj : W[k], true);
  }
  if (!weaponsOnly) for (const p of PASSIVES) if (G.ups[p.id] && p.id !== 'multi') add(p.name, G.ups[p.id]);
}
function renderLoadout() { buildChips($('loadout'), true); }
let bannerT = null;
function showBanner(t, sub, cls, dur) {
  if (window.__silent) return;
  const b = $('banner'); b.className = cls; b.textContent = t;
  if (sub) b.appendChild(el('small', null, sub));
  b.hidden = false; clearTimeout(bannerT); bannerT = setTimeout(() => { b.hidden = true; }, dur * 1000);
}
let tipKey = '';
function tip(step, html) { if (tipKey === html) return; tipKey = html; const t = $('tip'); t.innerHTML = '<span class="step">TUTORIAL ' + step + '</span>' + html; t.hidden = false; }
function hideTip() { tipKey = ''; $('tip').hidden = true; }
function tutorialTick(dt) {
  const T = G.tutorial; if (!T) return;
  T.t += dt;
  if (T.step === 0) {
    T.moved += Math.hypot(P.x - T.lx, P.y - T.ly); T.lx = P.x; T.ly = P.y;
    tip('1 / 4', tr('tut1'));
    if (T.moved > 300) { T.step = 1; T.t = 0; }
  } else if (T.step === 1) {
    tip('2 / 4', tr('tut2'));
    if (P.level >= 2 || G.pending) T.step = 2;
  } else if (T.step === 2) {
    hideTip();
  } else if (T.step === 3) {
    tip('4 / 4', tr('tut4'));
    if (T.t > 8) { G.tutorial = null; SAVE.tutorialDone = true; persist(); hideTip(); }
  }
}

/* --------------------------------------------------------------------------
   input
   -------------------------------------------------------------------------- */
const keys = new Set();
const joy = { on: false, id: null, bx: 0, by: 0, x: 0, y: 0 };
let AUTO = null;
/* keyboard: physical key codes, so movement and hotkeys work with the Hangul layout too */
const MOVE_CODES = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
addEventListener('keydown', e => {
  const c = e.code, inRun = G && G.state === 'play';
  if (inRun && (MOVE_CODES.includes(c) || c === 'Space')) e.preventDefault();
  keys.add(c);
  A.init();
  if (c === 'KeyM') { toggleMute(); return; }
  if (inRun) { if (c === 'Escape' || c === 'KeyP') pauseRun(); return; }
  if (G && G.state === 'paused') { if (c === 'Escape' || c === 'KeyP') resumeRun(); return; }
  if (G && G.state === 'levelup') {
    const n = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2 }[c];
    if (n !== undefined) pickUpgrade(n);
    if (c === 'KeyR') reroll();
    return;
  }
  /* Enter on a focused control belongs to that control */
  const onControl = e.target && e.target.closest && e.target.closest('button, input, label');
  if ((c === 'Enter' || c === 'NumpadEnter') && !onControl) {
    if (screen === 'over' || screen === 'prep') { e.preventDefault(); launch(); return; }
    if (screen === 'title') { e.preventDefault(); goPrep(); return; }
  }
  if (c === 'Escape' && ['prep', 'hangar', 'records', 'settings'].includes(screen)) goTitle();
});
addEventListener('keyup', e => keys.delete(e.code));
addEventListener('blur', () => { keys.clear(); joy.on = false; if (G && G.state === 'play') pauseRun(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && G && G.state === 'play') pauseRun(); });
cv.addEventListener('pointerdown', e => {
  A.init();
  if (!G || G.state !== 'play') return;
  joy.on = true; joy.id = e.pointerId; joy.bx = joy.x = e.clientX; joy.by = joy.y = e.clientY;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
});
cv.addEventListener('pointermove', e => { if (joy.on && e.pointerId === joy.id) { joy.x = e.clientX; joy.y = e.clientY; } });
const endJoy = e => { if (e.pointerId === joy.id) joy.on = false; };
cv.addEventListener('pointerup', endJoy); cv.addEventListener('pointercancel', endJoy);
function inputDir() {
  if (AUTO) return AUTO();
  let x = 0, y = 0;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) x--;
  if (keys.has('KeyD') || keys.has('ArrowRight')) x++;
  if (keys.has('KeyW') || keys.has('ArrowUp')) y--;
  if (keys.has('KeyS') || keys.has('ArrowDown')) y++;
  if (joy.on) {
    const dx = joy.x - joy.bx, dy = joy.y - joy.by, d = Math.hypot(dx, dy);
    if (d > 6) { const m = Math.min(1, d / 56); x = dx / d * m; y = dy / d * m; }
  }
  const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
  return [x, y];
}
function toggleMute() {
  A.init(); SETTINGS.sound = A.muted; A.setMuted(!A.muted); persist();
  $('btnMute').setAttribute('aria-pressed', String(A.muted));
}

/* --------------------------------------------------------------------------
   wiring
   -------------------------------------------------------------------------- */
const on = (id, f) => { $(id).addEventListener('click', () => { A.init(); f(); }); };
on('btnPlay', goPrep); on('btnHangar', () => goHangar()); on('btnRecords', goRecords); on('btnSettings', goSettings);
on('btnLaunch', launch); on('btnPrepBack', goTitle);
on('btnHangarBack', goTitle); on('tabMeta', () => { hangarTab = 'meta'; renderHangar(); }); on('tabShips', () => { hangarTab = 'ships'; renderHangar(); });
on('btnRecordsBack', goTitle);
on('tabAch', () => { recTab = 'ach'; renderRecords(); }); on('tabCodex', () => { recTab = 'codex'; renderRecords(); }); on('tabStats', () => { recTab = 'stats'; renderRecords(); });
on('btnSettingsBack', goTitle);
$('optSound').addEventListener('change', e => { SETTINGS.sound = e.target.checked; A.setMuted(!SETTINGS.sound); $('btnMute').setAttribute('aria-pressed', String(A.muted)); persist(); });
$('optShake').addEventListener('change', e => { SETTINGS.shake = e.target.checked; persist(); });
$('optLang').addEventListener('change', e => setLang(e.target.value));
$('optTips').addEventListener('change', e => { SAVE.tutorialDone = !e.target.checked; persist(); });
on('btnReset', () => { $('btnResetConfirm').hidden = false; });
on('btnResetConfirm', () => { SAVE = freshSave(); Object.assign(SETTINGS, SAVE.settings); SAVE.settings = SETTINGS; persist(); A.setMuted(!SETTINGS.sound); $('btnMute').setAttribute('aria-pressed', String(A.muted)); toast(tr('resetT'), tr('resetB'), tr('resetS')); goTitle(); });
on('btnReroll', reroll);
on('btnResume', resumeRun);
on('btnQuit', () => { $('btnQuitConfirm').hidden = false; });
on('btnQuitConfirm', () => { if (!G || G.state !== 'paused') return; $('btnQuitConfirm').hidden = true; endRun(false, true); });
on('btnPause', pauseRun);
on('btnMute', toggleMute);
on('btnAgain', launch); on('btnToPrep', goPrep); on('btnToHangar', () => goHangar('meta'));
$('btnMute').setAttribute('aria-pressed', String(A.muted));
on('btnReviveAd', reviveByAd); on('btnReviveNo', () => { if (G && G.state === 'revive') endRun(false); });
on('btnDouble', doubleByAd);
applyStaticText();
if (SUPPORT_URL && !PORTAL.rewarded && PORTAL.name === 'none') { $('lnkSupport').href = SUPPORT_URL; $('lnkSupport').hidden = false; }
/* silence the game while a portal ad plays */
PORTAL.onAd = playing => { A.setMuted(playing || !SETTINGS.sound); };
PORTAL.loaded();
dustAll();

/* --------------------------------------------------------------------------
   loop
   -------------------------------------------------------------------------- */
let last = performance.now(), last0 = last, ema = 16, slowT = 0, frozenDrawn = false;
/* drop render quality when frames run long, so busy late-game screens stay smooth */
function adaptQuality(renderMs, frameMs) {
  if (!G || G.state !== 'play' || frameMs > 200) return;
  ema = ema * .95 + Math.max(renderMs, frameMs) * .05;
  slowT = ema > 21 ? slowT + frameMs / 1000 : 0;
  if (slowT > 2 && QUALITY > 0) { QUALITY--; slowT = 0; ema = 16; resize(); }
}
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (G && G.state === 'play') { update(dt); if (G) { tutorialTick(dt); updateHud(); } }
  const t0 = performance.now();
  /* a frozen run (level-up, pause, results) only needs one more frame drawn */
  const frozen = G && G.state !== 'play';
  if (!frozen || !frozenDrawn || window.__redraw) { render(dt); window.__redraw = false; }
  frozenDrawn = frozen;
  adaptQuality(performance.now() - t0, now - last0); last0 = now;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* --------------------------------------------------------------------------
   test hook: lets an automated run play the game headlessly
   -------------------------------------------------------------------------- */
function autopilotDir() {
  let fx_ = 0, fy_ = 0;
  for (const e of enemies) {
    const dx = P.x - e.x, dy = P.y - e.y, d2 = dx * dx + dy * dy + 1, R = e.type === 'boss' ? 320 : 150 + e.r;
    if (d2 < R * R) { const d = Math.sqrt(d2), w = (e.type === 'boss' ? 4 : e.type === 'bomber' ? 2.5 : 1) / d; fx_ += dx / d * w * 60; fy_ += dy / d * w * 60; }
  }
  for (const b of ebullets) { const dx = P.x - b.x, dy = P.y - b.y, d2 = dx * dx + dy * dy + 1; if (d2 < 110 * 110) { const d = Math.sqrt(d2); fx_ += dx / d * 120 / d; fy_ += dy / d * 120 / d; } }
  for (const h of hazards) { const dx = P.x - h.x, dy = P.y - h.y, d = Math.hypot(dx, dy) + 1; if (d < h.r + 70) { fx_ += dx / d * 3; fy_ += dy / d * 3; } }
  for (const b of G.bosses) if (b.beams) for (const a of b.beams) {
    const ex = b.x + Math.cos(a) * 900, ey = b.y + Math.sin(a) * 900, dd = segDist(P.x, P.y, b.x, b.y, ex, ey);
    if (dd < 90) { const nx = -Math.sin(a), ny = Math.cos(a), side = Math.sign((P.x - b.x) * nx + (P.y - b.y) * ny) || 1; fx_ += nx * side * 3; fy_ += ny * side * 3; }
  }
  for (const e of enemies) if (e.type === 'sniper' && e.st === 'aim') {
    const ex = e.x + Math.cos(e.aim) * 900, ey = e.y + Math.sin(e.aim) * 900, dd = segDist(P.x, P.y, e.x, e.y, ex, ey);
    if (dd < 40) { const nx = -Math.sin(e.aim), ny = Math.cos(e.aim), side = Math.sign((P.x - e.x) * nx + (P.y - e.y) * ny) || 1; fx_ += nx * side * 2; fy_ += ny * side * 2; }
  }
  let g = null, gs = 0;
  for (const q of gems) { const d = Math.hypot(q.x - P.x, q.y - P.y) + 30, s = q.v / d; if (s > gs) { gs = s; g = q; } }
  for (const q of pickups) { const d = Math.hypot(q.x - P.x, q.y - P.y) + 30; if (8 / d > gs) { gs = 8 / d; g = q; } }
  let x = fx_, y = fy_;
  if (g) { const d = Math.hypot(g.x - P.x, g.y - P.y) || 1; x += (g.x - P.x) / d * .9; y += (g.y - P.y) / d * .9; }
  x += Math.cos(G.t * .7) * .2; y += Math.sin(G.t * .5) * .2;
  const m = Math.hypot(x, y) || 1; return [x / m, y / m];
}
/* a reasonable player's priorities, used by the balance simulator */
function smartPick() {
  const score = u => {
    const l = G.ups[u.id] || 0;
    if (u.isEvo) return 20;
    if (u.isWeapon) return l ? 6 + l : (weaponCount() < 5 ? 5 : 2);
    return { dmg: 5, area: 4, cool: 4, multi: 4.5, rate: 4, hp: 3.5, crit: 3, pierce: 3, regen: 3, magnet: 2.5, speed: 2.5, armor: 3, growth: 2, dur: 2 }[u.id] || 1;
  };
  let bi = 0, bs = -1;
  G.choices.forEach((u, i) => { const s = score(u) + Math.random() * 2; if (s > bs) { bs = s; bi = i; } });
  return bi;
}
window.__stardrift = {
  smart: true,
  batch(stage, ships, n, seconds, meta) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const ship = ships[i % ships.length];
      this.setMeta(meta); this.start(stage, ship); this.autopilot(true);
      const r = this.sim(seconds);
      const top = Object.entries(G.dmgBy || {}).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k, v]) => k + ':' + Math.round(v)).join(',');
      out.push({ ship, state: G.state, t: Math.round(G.t), lv: P.level, bosses: G.bossKills, evo: Object.keys(G.evo).join('+'), top });
    }
    return out;
  },
  get G() { return G; }, get P() { return P; }, get W() { return W; }, get S() { return S; }, get save() { return SAVE; },
  get counts() { return { enemies: enemies.length, bullets: bullets.length, ebullets: ebullets.length, gems: gems.length, parts: parts.length, hazards: hazards.length }; },
  start(stage, ship) { if (stage !== undefined) { SAVE.stage = stage; for (let i = 1; i <= Math.max(stage, 1); i++) SAVE.cleared[i] = SAVE.cleared[i] || stage > 0; } if (ship) { SAVE.ship = ship; SAVE.ships[ship] = true; } SAVE.tutorialDone = true; startRun(); },
  autopilot(on) { AUTO = on ? autopilotDir : null; },
  sim(seconds, step = 1 / 60) {
    const n = Math.round(seconds / step);
    for (let i = 0; i < n; i++) {
      while (G.state === 'levelup') pickUpgrade(this.smart ? smartPick() : Math.floor(Math.random() * 3));
      if (G.state !== 'play') break;
      update(step);
    }
    return { t: G.t, state: G.state, level: P.level, hp: P.hp, kills: G.kills, enemies: enemies.length, bosses: G.bossKills, cleared: G.cleared };
  },
  pick: i => pickUpgrade(i),
  end: win => endRun(!!win),
  unlockAll() { for (const s of SHIPS) SAVE.ships[s.id] = true; for (const s of STAGES) SAVE.cleared[s.id] = true; SAVE.dust = 99999; persist(); },
  setMeta(l) { for (const m of META) SAVE.meta[m.id] = Math.min(m.max, l); },
  wipe() { SAVE = freshSave(); SAVE.settings = SETTINGS; persist(); }
};
