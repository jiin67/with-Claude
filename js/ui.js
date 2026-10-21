'use strict';
/* ==========================================================================
   Menus, saves, achievements, tutorial, HUD, input and the main loop.
   ========================================================================== */
const $ = id => document.getElementById(id);
const fmtN = n => Math.floor(n).toLocaleString('ko-KR');

/* --------------------------------------------------------------------------
   save data (browser storage; the game still works when it is unavailable)
   -------------------------------------------------------------------------- */
const SAVE_KEY = 'stardrift.save.v2';
function freshSave() {
  return { v: 2, dust: 0, totalDust: 0, ships: { scout: true }, ship: 'scout', stage: 0, meta: {}, cleared: {}, best: {},
    ach: {}, seen: {}, clearsBy: {}, tutorialDone: false, settings: { sound: true, shake: true },
    stats: { runs: 0, kills: 0, bosses: 0, time: 0, clears: 0, boom: 0, warders: 0, bestLevel: 0, deaths: 0 } };
}
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
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
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE)); } catch (e) {} }
A.muted = !SETTINGS.sound;

function markSeen(k) { if (!SAVE.seen[k]) SAVE.seen[k] = true; }
function earn(n) { SAVE.dust += n; SAVE.totalDust += n; }
function achieve(id) {
  if (SAVE.ach[id]) return;
  const a = ACH.find(x => x.id === id); if (!a) return;
  SAVE.ach[id] = Date.now(); earn(a.reward);
  if (G && G.newAch) G.newAch.push(id);
  toast('업적 달성', a.name, `${a.desc} · 별가루 +${a.reward}`);
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
const IN_RUN = ['levelup', 'pause', 'revive'];
let screen = 'title';
function show(id) { if (id && !IN_RUN.includes(id) && id !== 'over') $('toasts').innerHTML = ''; screen = id; for (const s of SCREENS) $(s).hidden = s !== id; $('toasts').hidden = IN_RUN.includes(id); }
function dustAll() { for (const id of ['dustTitle', 'dustPrep', 'dustHangar']) $(id).textContent = fmtN(SAVE.dust); }
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }

function stageUnlocked(i) { return i === 0 || (i === 3 ? !!SAVE.cleared[1] : !!SAVE.cleared[i]); }
function stageLockText(i) { return i === 3 ? '잔해 지대 클리어 시 열림' : STAGES[i - 1].name + ' 클리어 시 열림'; }

function goTitle() { Ads.gameplay(false); G = null; $('hud').hidden = true; hideTip(); A.stopMusic(); dustAll(); show('title'); }

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
    if (best) { meta.append('최고 '); const bb = el('b', null, fmtN(best.score)); meta.append(bb, ' · ' + fmtT(best.t)); } else meta.textContent = open ? '기록 없음' : '잠김';
    b.appendChild(meta);
    if (SAVE.cleared[st.id]) b.appendChild(el('span', 'tag clear', '클리어'));
    else if (!open) b.appendChild(el('span', 'tag', '잠김'));
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
    st.append(el('span', null, '내구도'), el('b', null, String(sh.hp)), el('span', null, '속도'), el('b', null, String(sh.speed)));
    b.appendChild(st);
    if (!own) b.appendChild(el('span', 'tag', '◆ ' + fmtN(sh.cost)));
    b.onclick = () => {
      if (!own) { $('prepHint').textContent = `${sh.name}은(는) 격납고에서 별가루 ${fmtN(sh.cost)}로 해금할 수 있습니다.`; return; }
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
    row.append(top, pips, el('p', null, m.per + (m.max > 1 ? ' (단계마다)' : '')));
    if (l < m.max) {
      const cost = metaCost(m, l), btn = el('button', 'btn gold', `강화 ◆ ${fmtN(cost)}`);
      btn.disabled = SAVE.dust < cost;
      btn.onclick = () => { if (SAVE.dust < cost) return; SAVE.dust -= cost; SAVE.meta[m.id] = l + 1; A.buy(); checkMetaAch(); persist(); renderHangar(); };
      row.appendChild(btn);
    } else row.appendChild(el('span', 'lv', '최대 단계'));
    ml.appendChild(row);
  }
  const ss = $('shipShop'); ss.innerHTML = '';
  for (const sh of SHIPS) {
    const own = !!SAVE.ships[sh.id], card = el('div', 'pick'); card.style.setProperty('--c', sh.color);
    const cv2 = document.createElement('canvas'); cv2.width = cv2.height = 128; drawPortrait(cv2, 'ship', sh.id);
    card.append(cv2, el('span', 'en', sh.role), el('h4', null, sh.name), el('p', null, sh.desc));
    if (own) card.appendChild(el('span', 'meta', '보유 중'));
    else {
      const btn = el('button', 'btn gold', `해금 ◆ ${fmtN(sh.cost)}`); btn.disabled = SAVE.dust < sh.cost;
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
  $('achCount').textContent = `업적 ${done} / ${ACH.length}`;
  const al = $('achList'); al.innerHTML = '';
  for (const a of ACH) {
    const d = el('div', 'ach' + (SAVE.ach[a.id] ? ' done' : ''));
    d.append(el('b', null, a.name), el('span', null, a.desc), el('span', 'r', (SAVE.ach[a.id] ? '달성 · ' : '') + '◆ ' + a.reward));
    al.appendChild(d);
  }
  const cl = $('codexList'); cl.innerHTML = '';
  cl.appendChild(el('h4', null, '적'));
  for (const k of Object.keys(ED)) {
    if (k === 'boss') continue;
    const seen = !!SAVE.seen[k], d = el('div', 'ent' + (seen ? '' : ' unseen'));
    const c2 = document.createElement('canvas'); c2.width = c2.height = 112; drawPortrait(c2, 'enemy', k, !seen);
    const t = el('div'); t.append(el('b', null, seen ? ED[k].name : '???'), el('span', null, seen ? ED[k].info : '아직 만나지 못했다.'));
    d.append(c2, t); cl.appendChild(d);
  }
  cl.appendChild(el('h4', null, '보스'));
  for (const k of Object.keys(BOSSES)) {
    const seen = !!SAVE.seen['boss:' + k], d = el('div', 'ent' + (seen ? '' : ' unseen'));
    const c2 = document.createElement('canvas'); c2.width = c2.height = 112; drawPortrait(c2, 'boss', k, !seen);
    const t = el('div'); t.append(el('b', null, seen ? BOSSES[k].name : '???'), el('span', null, seen ? BOSSES[k].info : '아직 만나지 못했다.'));
    d.append(c2, t); cl.appendChild(d);
  }
  cl.appendChild(el('h4', null, '무기 진화'));
  for (const v of EVOLUTIONS) {
    const seen = !!SAVE.seen['evo:' + v.id], d = el('div', 'ent' + (seen ? '' : ' unseen'));
    const c2 = document.createElement('canvas'); c2.width = c2.height = 112; drawPortrait(c2, 'evo', v.id, !seen);
    const recipe = WEAPONS[v.weapon].name + ' 최대 + ' + UP_BY_ID[v.needs].name;
    const t = el('div'); t.append(el('b', null, seen ? v.name : '???'), el('span', 'recipe', recipe), el('span', null, seen ? v.desc : '보물 상자에서 진화시키면 기록된다.'));
    d.append(c2, t); cl.appendChild(d);
  }
  const s = SAVE.stats, sl = $('statsList'); sl.innerHTML = '';
  [['출격', fmtN(s.runs)], ['총 처치', fmtN(s.kills)], ['보스 격파', fmtN(s.bosses)], ['클리어', fmtN(s.clears)],
   ['총 비행 시간', fmtT(s.time)], ['최고 레벨', fmtN(s.bestLevel)], ['누적 별가루', fmtN(SAVE.totalDust)], ['격추', fmtN(s.deaths)]].forEach(([k, v]) => {
    const d = el('div'); d.append(el('span', null, k), el('b', null, v)); sl.appendChild(d);
  });
}

/* ---- settings ---- */
function goSettings() {
  $('optSound').checked = SETTINGS.sound; $('optShake').checked = SETTINGS.shake; $('optTips').checked = !SAVE.tutorialDone;
  $('btnResetConfirm').hidden = true; show('settings');
}

/* --------------------------------------------------------------------------
   run flow
   -------------------------------------------------------------------------- */
let runsThisSession = 0;
/* from the second run of a visit on, a midgame ad may play first; the portal rate-limits it */
function startRun() {
  if (Ads.busy) return;
  A.init();
  if (runsThisSession > 0) Ads.midgame(beginRun); else beginRun();
}
function beginRun() {
  A.init(); runsThisSession++;
  if (!stageUnlocked(SAVE.stage)) SAVE.stage = 0;
  if (!SAVE.ships[SAVE.ship]) SAVE.ship = 'scout';
  newGame(SAVE.stage, SAVE.ship, SAVE);
  G.newAch = [];
  G.tutorial = !SAVE.tutorialDone && SAVE.stage === 0 ? { step: 0, moved: 0, lx: 0, ly: 0, t: 0 } : null;
  SAVE.stats.runs++; persist();
  show(null); $('hud').hidden = false; $('bossbar').hidden = true; $('banner').hidden = true;
  for (const k in hudCache) delete hudCache[k];
  renderLoadout(); A.startMusic(SAVE.stage); updateHud(); Ads.gameplay(true);
  showBanner(G.stage.name, G.stage.endless ? '끝까지 버텨라' : '최종 보스를 쓰러뜨리면 클리어', 'info', 2.4);
}
function pauseRun() {
  if (!G || G.state !== 'play') return;
  G.state = 'paused'; keys.clear(); joy.on = false; A.stopMusic(); Ads.gameplay(false);
  $('pauseEyebrow').textContent = G.stage.name + ' · ' + fmtT(G.t);
  $('btnQuitConfirm').hidden = true;
  buildChips($('pauseBuild')); show('pause');
}
function resumeRun() { if (!G || G.state !== 'paused') return; G.state = 'play'; show(null); A.startMusic(); Ads.gameplay(true); }

/* ---- rewarded revive: offered once per run after the hangar's own revive is spent ---- */
function offerRevive() {
  if (!Ads.ready || AUTO || G.adReviveOffered) return false;
  G.adReviveOffered = true; G.state = 'revive'; keys.clear(); joy.on = false; A.stopMusic(); hideTip(); Ads.gameplay(false);
  $('reviveHint').textContent = ''; $('btnReviveAd').disabled = false;
  show('revive');
  return true;
}
function watchRevive() {
  if (!G || G.state !== 'revive' || Ads.busy) return;
  $('btnReviveAd').disabled = true; $('reviveHint').textContent = '';
  Ads.rewarded(() => {
    if (!G || G.state !== 'revive') return;
    G.state = 'play'; show(null); reviveShip('긴급 수리 완료'); A.startMusic(); Ads.gameplay(true);
  }, () => {
    $('btnReviveAd').disabled = false;
    $('reviveHint').textContent = '광고를 불러오지 못했습니다. 다시 시도하거나 귀환하세요.';
  });
}
function declineRevive() { if (G && G.state === 'revive' && !Ads.busy) endRun(false); }

function endRun(win, quit) {
  if (G.state === 'over' || G.state === 'win') return;
  G.state = win ? 'win' : 'over'; A.stopMusic(); keys.clear(); joy.on = false; hideTip(); Ads.gameplay(false);
  if (win) Ads.happy();
  if (!win && !quit) { A.big(); burst(P.x, P.y, P.color, 80, 300, 3, 1.2); G.shake = 14; }
  const st = G.stage;
  if (win) G.score += 10000 * st.id;

  /* stardust */
  const mining = 1 + (SAVE.meta.mining || 0) * .1;
  const parts_ = [['처치', Math.floor(G.kills / 8)], ['생존', Math.floor(G.t / 6)], ['보스', G.bossKills * 40]];
  if (win) parts_.push(['클리어', 150 * st.id]);
  if (G.bonusDust) parts_.push(['현상금', G.bonusDust]);
  const base = parts_.reduce((s, p) => s + p[1], 0), gained = Math.round(base * (quit ? .5 : 1) * mining);
  earn(gained); G.gained = gained;

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
    if (firstClear && st.id < 3) G.unlockNote = STAGES[st.id].name + (st.id === 1 ? ' · 무한 공허' : '') + ' 항로가 열렸습니다.';
  }
  if (S_.runs >= 20) achieve('runs20');
  if (S_.boom >= 10) achieve('boom10');
  if (S_.warders >= 50) achieve('warderkill');
  if (SAVE.totalDust >= 5000) achieve('dust5000');
  persist();

  /* results screen */
  $('overTitle').textContent = win ? '스테이지 클리어' : quit ? '귀환' : '격추됨';
  $('overTitle').className = win ? 'win' : 'lose';
  $('overEyebrow').textContent = (st.endless ? '무한 공허' : st.name) + ' · ' + G.ship.name + ' · ' + fmtT(G.t);
  $('overSub').textContent = win ? (G.unlockNote || '항로를 돌파했다. 별가루로 기체를 정비하자.')
    : quit ? '작전을 중단했다. 별가루는 절반만 회수된다.'
    : G.bosses.length ? G.bosses[0].name + '에게 당했다. ' + BOSSES[G.bosses[0].bid].info
    : G.t < 90 ? '초반이 가장 어렵다. 결정을 모으며 계속 움직이자.'
    : '격납고의 영구 강화로 기체를 튼튼하게 만들어 다시 도전하자.';
  const stt = $('overStats'); stt.innerHTML = '';
  [['생존 시간', fmtT(G.t)], ['레벨', P.level], ['처치', fmtN(G.kills)], ['점수', fmtN(G.score)]].forEach(([k, v], i) => {
    const d = el('div'); d.append(el('span', null, k), el('b', null, String(v)));
    if (i === 3 && isBest) d.appendChild(el('span', 'rec', 'NEW BEST'));
    stt.appendChild(d);
  });
  const er = $('overEarn'); er.innerHTML = '';
  er.appendChild(el('span', 'dust', '+' + fmtN(gained)));
  for (const [k, v] of parts_) { const s = el('span'); s.append(k + ' '); s.appendChild(el('b', null, String(v))); er.appendChild(s); }
  if (mining > 1) er.appendChild(el('span', null, `채굴 계약 ×${mining.toFixed(1)}`));
  if (quit) er.appendChild(el('span', null, '중단 ×0.5'));
  const na = $('overAch'); na.innerHTML = '';
  for (const id of G.newAch) { const a = ACH.find(x => x.id === id); const s = el('span'); s.append('업적 '); s.appendChild(el('b', null, a.name)); s.append(' ◆ ' + a.reward); na.appendChild(s); }
  buildChips($('overBuild'));
  /* rewarded: watch an ad to collect this run's stardust a second time */
  $('adDustRow').hidden = !(Ads.ready && !quit && gained > 0);
  $('btnDoubleDust').disabled = false; $('btnDoubleDust').textContent = '광고 보고 별가루 +' + fmtN(gained) + ' 더 받기'; $('adDustHint').textContent = '';
  $('hud').hidden = true; $('bossbar').hidden = true;
  dustAll();
  setTimeout(() => show('over'), win || quit ? 300 : 900);
}

function doubleDust() {
  if (!G || G.dustDoubled || Ads.busy) return;
  $('btnDoubleDust').disabled = true; $('adDustHint').textContent = '';
  Ads.rewarded(() => {
    if (!G || G.dustDoubled) return;
    G.dustDoubled = true; earn(G.gained);
    if (SAVE.totalDust >= 5000) achieve('dust5000');
    persist(); dustAll();
    const s = el('span'); s.append('광고 보너스 '); s.appendChild(el('b', null, '+' + fmtN(G.gained))); $('overEarn').appendChild(s);
    $('adDustRow').hidden = true;
  }, () => {
    $('btnDoubleDust').disabled = false;
    $('adDustHint').textContent = '광고를 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.';
  });
}

/* ---- level up ---- */
function openLevelUp() {
  G.state = 'levelup'; A.level(); rollChoices(); drawCards(); show('levelup'); Ads.gameplay(false);
  keys.clear(); joy.on = false;
}
function drawCards() {
  const evoOffer = G.choices.some(u => u.isEvo);
  $('luEyebrow').textContent = (G.fromChest ? 'TREASURE' : 'LEVEL ' + P.level) + (G.pending > 1 ? '  ·  선택 ' + G.pending + '회 남음' : '');
  $('luTitle').textContent = evoOffer ? '무기가 진화합니다' : G.fromChest ? '보물 상자' : '강화를 고르세요';
  $('luHint').hidden = !(G.tutorial && G.tutorial.step <= 2);
  $('weaponSlots').textContent = `무기 ${weaponCount()} / ${MAX_WEAPONS}`;
  const box = $('cards'); box.innerHTML = '';
  G.choices.forEach((u, i) => {
    const cur = G.ups[u.id] || 0, next = cur + 1, [catName, catCol] = CAT[u.cat];
    const b = el('button', 'card'); b.id = 'card' + i; b.type = 'button'; b.style.setProperty('--c', catCol);
    const top = el('div', 'top'); top.append(el('span', 'chip', catName), el('span', 'key', '[' + (i + 1) + ']'));
    const lv = el('div', 'lv', u.isEvo ? WEAPONS[u.evo.weapon].name + ' 진화' : u.max > 20 ? '즉시 효과' : cur === 0 ? (u.isWeapon ? '새 무기' : '새 강화') : 'LV ' + cur + ' → ' + next);
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
  const rr = $('btnReroll'); rr.textContent = '다시 뽑기 (' + G.rerolls + '회)'; rr.appendChild(el('kbd', null, 'R'));
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
    return '진화 ' + v.name + ' · ' + (G.ups[v.needs] ? '다음 보물 상자에서 진화' : pName + '을(를) 얻으면 보물 상자에서 진화');
  }
  if (!W[v.weapon]) return '';
  return '진화 ' + v.name + ' · ' + wName + (W[v.weapon] >= WEAPONS[v.weapon].max ? ' 최대 레벨, 다음 보물 상자에서 진화' : '을(를) 최대 레벨로 올리면 보물 상자에서 진화');
}
function pickUpgrade(i) {
  if (!G || G.state !== 'levelup') return;
  const u = G.choices[i]; if (!u) return;
  applyUpgrade(u);
  G.pending--;
  if (G.tutorial && G.tutorial.step === 2) { G.tutorial.step = 3; G.tutorial.t = 0; }
  renderLoadout();
  if (G.pending > 0) { rollChoices(); drawCards(); A.level(); }
  else { G.state = 'play'; show(null); P.inv = Math.max(P.inv, .6); Ads.gameplay(true); }
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
  if (G.cleared) sub = '항로 돌파';
  else if (G.stage.endless) sub = '다음 보스까지 ' + fmtT(G.endlessT);
  else if (G.queue.length) sub = (G.queue[0].final ? '최종 보스까지 ' : '보스까지 ') + fmtT(G.queue[0].t - G.t);
  else if (G.bosses.length) sub = '보스를 쓰러뜨려라';
  setText('subtimer', sub);
  setText('lvl', String(P.level)); setText('kills', fmtN(G.kills));
  setText('hptext', String(Math.ceil(P.hp))); setW('hpfill', P.hp / P.maxHp); setW('xpfill', P.xp / P.next);
  if (G.bosses.length) {
    let hp = 0, mx = 0; const names = new Set();
    for (const b of G.bosses) { hp += Math.max(0, b.hp); mx += b.maxHp; names.add(b.name); }
    setText('bossname', [...names].join(' · ') + (G.bosses.some(b => b.rage) ? '  ·  광폭' : ''));
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
    tip('1 / 4', '<b>WASD</b>·방향키, 또는 화면을 <b>드래그</b>해서 움직이세요');
    if (T.moved > 300) { T.step = 1; T.t = 0; }
  } else if (T.step === 1) {
    tip('2 / 4', '무기는 자동으로 쏩니다. 적이 남긴 <b>금색 결정</b>을 모으세요');
    if (P.level >= 2 || G.pending) T.step = 2;
  } else if (T.step === 2) {
    hideTip();
  } else if (T.step === 3) {
    tip('4 / 4', '시간이 되면 <b>보스</b>가 옵니다. 화면 가장자리 화살표가 위치를 알려줘요.<br>정해진 시간에 오는 <b>최종 보스</b>를 쓰러뜨리면 클리어!');
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
  if (G && G.state === 'revive') return;
  if (G && G.state === 'levelup') {
    const n = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2 }[c];
    if (n !== undefined) pickUpgrade(n);
    if (c === 'KeyR') reroll();
    return;
  }
  /* Enter on a focused control belongs to that control */
  const onControl = e.target && e.target.closest && e.target.closest('button, input, label');
  if ((c === 'Enter' || c === 'NumpadEnter') && !onControl) {
    if (screen === 'over' || screen === 'prep') { e.preventDefault(); startRun(); return; }
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
on('btnLaunch', startRun); on('btnPrepBack', goTitle);
on('btnHangarBack', goTitle); on('tabMeta', () => { hangarTab = 'meta'; renderHangar(); }); on('tabShips', () => { hangarTab = 'ships'; renderHangar(); });
on('btnRecordsBack', goTitle);
on('tabAch', () => { recTab = 'ach'; renderRecords(); }); on('tabCodex', () => { recTab = 'codex'; renderRecords(); }); on('tabStats', () => { recTab = 'stats'; renderRecords(); });
on('btnSettingsBack', goTitle);
$('optSound').addEventListener('change', e => { SETTINGS.sound = e.target.checked; A.setMuted(!SETTINGS.sound); $('btnMute').setAttribute('aria-pressed', String(A.muted)); persist(); });
$('optShake').addEventListener('change', e => { SETTINGS.shake = e.target.checked; persist(); });
$('optTips').addEventListener('change', e => { SAVE.tutorialDone = !e.target.checked; persist(); });
on('btnReset', () => { $('btnResetConfirm').hidden = false; });
on('btnResetConfirm', () => { SAVE = freshSave(); Object.assign(SETTINGS, SAVE.settings); SAVE.settings = SETTINGS; persist(); A.setMuted(!SETTINGS.sound); $('btnMute').setAttribute('aria-pressed', String(A.muted)); toast('초기화', '저장 데이터를 지웠습니다', '처음부터 시작합니다'); goTitle(); });
on('btnReroll', reroll);
on('btnResume', resumeRun);
on('btnQuit', () => { $('btnQuitConfirm').hidden = false; });
on('btnQuitConfirm', () => { if (!G || G.state !== 'paused') return; $('btnQuitConfirm').hidden = true; endRun(false, true); });
on('btnPause', pauseRun);
on('btnMute', toggleMute);
on('btnReviveAd', watchRevive); on('btnReviveNo', declineRevive); on('btnDoubleDust', doubleDust);
on('btnAgain', startRun); on('btnToPrep', goPrep); on('btnToHangar', () => goHangar('meta'));
$('btnMute').setAttribute('aria-pressed', String(A.muted));
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
  start(stage, ship) { if (stage !== undefined) { SAVE.stage = stage; for (let i = 1; i <= Math.max(stage, 1); i++) SAVE.cleared[i] = SAVE.cleared[i] || stage > 0; } if (ship) { SAVE.ship = ship; SAVE.ships[ship] = true; } SAVE.tutorialDone = true; beginRun(); },
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
