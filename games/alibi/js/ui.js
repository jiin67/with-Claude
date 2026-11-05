'use strict';
/* ==========================================================================
   Screens: title, case list, the case (chat / evidence / suspects), result.
   ========================================================================== */
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const AV = ['#ff6a3d', '#5b8cff', '#3ddc97', '#c66bff', '#ffcf5a', '#ff4d6d'];
const avColor = (c, id) => AV[c.suspects.findIndex(s => s[0] === id) % AV.length];

/* ---- sounds ---- */
const A = {
  c: null, out: null, muted: false,
  init() { if (this.c) { if (this.c.state === 'suspended') this.c.resume(); return; } try { const X = window.AudioContext || window.webkitAudioContext; if (!X) return; this.c = new X(); this.out = this.c.createGain(); this.out.gain.value = this.muted ? 0 : .35; this.out.connect(this.c.destination); } catch (e) { this.c = null; } },
  setMuted(m) { this.muted = m; if (this.out) this.out.gain.setTargetAtTime(m ? 0 : .35, this.c.currentTime, .02); },
  tone(f, d, type = 'sine', v = .3, slide = 1, delay = 0) {
    if (!this.c || this.muted) return;
    const t = this.c.currentTime + delay, o = this.c.createOscillator(), g = this.c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide !== 1) o.frequency.exponentialRampToValueAtTime(f * slide, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + d + .02);
  },
  click() { this.tone(900, .04, 'triangle', .1); },
  ok() { this.tone(660, .12, 'sine', .22); this.tone(990, .18, 'sine', .2, 1, .09); },
  bad() { this.tone(180, .16, 'square', .07, .7); },
  win() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, .3, 'sine', .18, 1, i * .11)); },
  lose() { this.tone(300, .4, 'sawtooth', .08, .5); },
  /* ambient bed: two slow detuned pads through a wandering filter, plus sparse pentatonic plucks */
  m: null,
  musicOn: true,
  startMusic() {
    if (!this.c || this.m || !this.musicOn) return;
    const c = this.c, g = c.createGain(), f = c.createBiquadFilter();
    g.gain.value = 0; f.type = 'lowpass'; f.frequency.value = 500; f.Q.value = .7;
    const pads = [55, 82.41, 110].map((fr, i) => { const o = c.createOscillator(); o.type = i ? 'triangle' : 'sawtooth'; o.frequency.value = fr; o.detune.value = i * 4 - 4; const og = c.createGain(); og.gain.value = i ? .5 : .25; o.connect(og); og.connect(f); o.start(); return o; });
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = .05; lg.gain.value = 260; lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    f.connect(g); g.connect(this.out); g.gain.setTargetAtTime(.07, c.currentTime, 2);
    const scale = [220, 261.6, 293.7, 329.6, 392, 440, 523.3];
    const pluck = () => { if (!this.m) return; if (!this.muted) { const n = scale[(Math.random() * scale.length) | 0], o = c.createOscillator(), pg = c.createGain(), t = c.currentTime; o.type = 'sine'; o.frequency.value = n; pg.gain.setValueAtTime(0, t); pg.gain.linearRampToValueAtTime(.06, t + .02); pg.gain.exponentialRampToValueAtTime(.0001, t + 2.2); o.connect(pg); pg.connect(this.out); o.start(t); o.stop(t + 2.3); } this.m.timer = setTimeout(pluck, 2500 + Math.random() * 4500); };
    this.m = { g, pads, lfo, timer: setTimeout(pluck, 1500) };
  },
  stopMusic() { if (!this.m) return; const m = this.m; this.m = null; clearTimeout(m.timer); m.g.gain.setTargetAtTime(0, this.c.currentTime, .6); setTimeout(() => { m.pads.forEach(o => o.stop()); m.lfo.stop(); }, 2500); },
  setMusic(on) { this.musicOn = on; if (on) this.startMusic(); else this.stopMusic(); }
};
function toast(text, cls) { const t = el('div', 'toast ' + (cls || ''), text); const box = $('toasts'); box.appendChild(t); while (box.children.length > 2) box.firstChild.remove(); setTimeout(() => t.remove(), 2600); }

const SCREENS = ['title', 'list', 'case', 'result'];
let screen = 'title';
function show(id) { screen = id; for (const s of SCREENS) $(s).hidden = s !== id; }

/* ---- title and list ---- */
function renderTitle() { const st = dailyStreak(); $('titleStars').textContent = tr('total', totalStars(), CL.length * 3) + (st ? ' · ' + tr('streak', st) : ''); show('title'); }
function renderList() {
  const box = $('caseList'); box.innerHTML = '';
  /* today's case */
  const key = todayKey(), di = dailyIndex(key), dc = CL[di], dd = S.daily[key], st = dailyStreak();
  const d = el('button', 'daily'); d.type = 'button';
  d.append(el('span', 'badge', tr('daily')), el('b', null, dc.title), el('span', null, dd ? tr('dailyDone', dd.stars, fmtTime(dd.time)) : tr('dailySub')));
  if (st) d.appendChild(el('span', 'streak', tr('streak', st)));
  d.onclick = () => { A.init(); A.click(); openIntro(di, key); };
  box.appendChild(d);
  CL.forEach((c, i) => {
    const open = unlocked(i), b = el('button', 'case-card' + (open ? '' : ' locked')); b.type = 'button';
    const info = el('div'); info.append(el('b', null, c.title), el('span', null, open ? c.place + ' · ' + tr('diff')[c.difficulty - 1] : tr('locked')));
    const st = S.stars[c.id] || 0;
    b.append(el('div', 'no', open ? String(i + 1) : '🔒'), info, el('div', 'st', S.done[c.id] ? '★'.repeat(st) + '☆'.repeat(3 - st) + (S.best[c.id] ? '\n' + fmtTime(S.best[c.id]) : '') : ''));
    b.onclick = () => { A.init(); if (!open) return; A.click(); openIntro(i); };
    box.appendChild(b);
  });
  show('list');
}
function openIntro(i, daily) {
  const c = CL[i];
  $('introDiff').textContent = tr('diff')[c.difficulty - 1] + ' · ' + c.place; $('introTitle').textContent = c.title; $('introBody').textContent = c.intro;
  $('introTut').hidden = S.tutorialSeen; $('introTut').innerHTML = tr('tutorial');
  $('btnIntroGo').textContent = tr('start'); $('btnIntroGo').onclick = () => { $('intro').hidden = true; S.tutorialSeen = true; persist(); beginCase(i, daily); };
  $('intro').hidden = false;
}

/* ---- the case ---- */
let tab = 'chat', sel = null;
function beginCase(i, daily) {
  startCase(i, daily); tab = 'chat'; sel = null;
  coach = !S.coachDone && i === 0 ? 0 : -1;
  A.startMusic();
  $('caseTitle').textContent = R.c.title; $('casePlace').textContent = R.c.place;
  renderCase(); show('case'); PORTAL.start();
}
function setTab(t) { tab = t; for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === t)); $('paneChat').hidden = t !== 'chat'; $('paneEvidence').hidden = t !== 'evidence'; $('paneSuspects').hidden = t !== 'suspects'; if (coach === 0 && t === 'evidence') coach = 1; if (coach === 1 && t === 'chat') coach = 2; renderCoach(); }
for (const b of document.querySelectorAll('.tabs button')) b.addEventListener('click', () => { A.click(); setTab(b.dataset.tab); });
function renderMeters() {
  $('lieMeter').textContent = tr('lies', R.found.size, lieCount(R.c));
  const sm = $('strikeMeter'); sm.innerHTML = ''; sm.append(tr('strikes') + ' ');
  for (let k = 0; k < MAX_STRIKES; k++) sm.appendChild(k < R.strikes ? el('b', null, '✕') : el('span', null, '·'));
  $('btnAccuse').disabled = !allLiesFound();
  $('timeMeter').textContent = fmtTime(elapsed());
}
setInterval(() => { if (R && R.state === 'play' && screen === 'case') $('timeMeter').textContent = fmtTime(elapsed()); }, 1000);
function renderCase() {
  const c = R.c;
  const chat = $('paneChat'); chat.innerHTML = '';
  c.chat.forEach((m, k) => {
    const row = el('button', 'msg' + (R.found.has(k) ? ' lie' : '') + (sel === k ? ' sel' : '')); row.type = 'button'; row.dataset.k = k;
    const av = el('div', 'av', nameOf(c, m.s)[0]); av.style.background = avColor(c, m.s);
    const b = el('div', 'b'), who = el('div', 'who', nameOf(c, m.s)); who.appendChild(el('span', null, m.t));
    b.append(who, el('div', 'bub', m.m));
    if (R.found.has(k)) b.appendChild(el('div', 'why', m.lie));
    row.append(av, b);
    row.onclick = () => { A.init(); if (R.state !== 'play' || R.found.has(k)) return; A.click(); sel = k; openMarkSheet(k); };
    chat.appendChild(row);
  });
  const ev = $('paneEvidence'); ev.innerHTML = '';
  for (const [ic, t] of c.facts) { const f = el('div', 'fact'); f.append(el('div', 'ic', ic), el('div', null, t)); ev.appendChild(f); }
  const su = $('paneSuspects'); su.innerHTML = '';
  for (const [id, name, role] of c.suspects) {
    const s = el('div', 'sus'), av = el('div', 'av', name[0]); av.style.background = avColor(c, id);
    const info = el('div'); info.append(el('b', null, name), el('span', null, role));
    const n = c.chat.filter((m, k) => m.s === id && R.found.has(k)).length;
    if (n) info.appendChild(el('div', 'lies', tr('foundLie') + ' × ' + n));
    /* everything this person claimed, so claims can be checked one by one */
    const ul = el('ul', 'claims'), mine = c.chat.map((m, k) => ({ m, k })).filter(x => x.m.s === id);
    if (!mine.length) ul.appendChild(el('li', null, tr('noClaims')));
    for (const { m, k } of mine) ul.appendChild(el('li', R.found.has(k) ? 'lie' : '', m.t + ' · ' + m.m));
    info.appendChild(ul);
    s.append(av, info); su.appendChild(s);
  }
  setTab(tab); renderMeters();
}
/* the guide for the very first case: five steps, each pointing at the next thing to press */
let coach = -1;
function renderCoach() {
  for (const e of document.querySelectorAll('.pulse')) e.classList.remove('pulse');
  const box = $('coach');
  if (coach < 0 || !R || R.state !== 'play') { box.hidden = true; return; }
  const steps = tr('coach'), c = R.c, firstLie = c.chat.findIndex(m => m.lie);
  if (coach === 2 && R.found.has(firstLie)) coach = 3;
  if (coach === 3 && allLiesFound()) coach = 4;
  if (coach === 4 && R.state !== 'play') coach = -1;
  const st = steps[coach];
  $('coachText').innerHTML = typeof st === 'function' ? st(nameOf(c, c.chat[firstLie].s)) : st;
  box.hidden = false;
  if (coach === 0) document.querySelector('.tabs button[data-tab=evidence]').classList.add('pulse');
  if (coach === 1) document.querySelector('.tabs button[data-tab=chat]').classList.add('pulse');
  if (coach === 2) { const row = document.querySelector(`.msg[data-k="${firstLie}"]`); if (row) row.classList.add('pulse'); }
  if (coach === 4) $('btnAccuse').classList.add('pulse');
}
function openMarkSheet(k) {
  const m = R.c.chat[k], card = $('sheetCard'); card.innerHTML = '';
  card.append(el('h3', null, nameOf(R.c, m.s) + ' · ' + m.t), el('div', 'quote', m.m));
  const yes = el('button', 'btn primary', tr('markLie')), no = el('button', 'btn ghost', tr('close'));
  yes.onclick = () => { closeSheet(); doMark(k); }; no.onclick = () => { sel = null; closeSheet(); renderCase(); };
  card.append(yes, no); $('sheet').hidden = false;
}
function closeSheet() { $('sheet').hidden = true; }
$('sheet').addEventListener('click', e => { if (e.target === $('sheet')) { sel = null; closeSheet(); renderCase(); } });
function doMark(k) {
  const r = mark(k); sel = null;
  if (r === 'lie') { A.ok(); renderCase(); const row = document.querySelector(`.msg[data-k="${k}"]`); if (row) { row.classList.add('just'); setTimeout(() => row.classList.remove('just'), 900); } if (allLiesFound() && coach < 0) setTimeout(() => toast(tr('accuse') + ' →'), 600); }
  else if (r === 'strike') {
    A.bad(); toast(tr('notLie'), 'bad'); renderCase();
    const row = document.querySelector(`.msg[data-k="${k}"]`); if (row) row.classList.add('wrong');
    if (R.state === 'failed') setTimeout(showFailed, 700);
  }
}
$('btnAccuse').addEventListener('click', () => {
  if (!allLiesFound() || R.state !== 'play') return; A.click();
  const card = $('sheetCard'); card.innerHTML = ''; card.appendChild(el('h3', null, tr('accuseWho')));
  for (const [id, name, role] of R.c.suspects) {
    const p = el('button', 'pick'); p.type = 'button';
    const av = el('div', 'av', name[0]); av.style.background = avColor(R.c, id);
    const info = el('div'); info.append(el('b', null, name), el('span', null, role)); p.append(av, info);
    p.onclick = () => { closeSheet(); const stars = accuse(id); if (stars) showSolved(stars); else { A.bad(); toast(tr('wrongAccuse'), 'bad'); renderMeters(); if (R.state === 'failed') setTimeout(showFailed, 700); } };
    card.appendChild(p);
  }
  const no = el('button', 'btn ghost', tr('close')); no.onclick = closeSheet; card.appendChild(no);
  $('sheet').hidden = false;
});

/* ---- results ---- */
function showSolved(stars) {
  A.win(); PORTAL.happy(); PORTAL.stop();
  if (coach >= 0) { S.coachDone = true; persist(); } coach = -1; $('coach').hidden = true;
  $('resBadge').textContent = tr('solved'); $('resTitle').textContent = R.c.title;
  const st = $('resStars'); st.innerHTML = ''; for (let k = 0; k < 3; k++) st.appendChild(el('span', k < stars ? '' : 'off', '★'));
  $('resBody').textContent = R.c.solve;
  const meta = $('resMeta'); meta.innerHTML = '';
  meta.append(el('span', null, tr('time') + ' ' + fmtTime(R.time)), el('span', null, tr('strikes') + ' ' + R.strikes), el('span', null, tr('hint') + ' ' + R.hints));
  if (R.daily) meta.appendChild(el('span', null, tr('daily')));
  $('btnResShare').hidden = false;
  const last = R.i >= CL.length - 1;
  $('btnResNext').textContent = R.daily ? tr('toList') : last ? tr('allDone') : tr('next');
  $('btnResNext').onclick = () => { A.click(); if (R.daily) PORTAL.midgame().then(renderList); else if (last) { toast(tr('allDoneSub')); renderList(); } else PORTAL.midgame().then(() => openIntro(R.i + 1)); };
  show('result');
}
function showFailed() {
  A.lose(); PORTAL.stop(); $('coach').hidden = true;
  $('resBadge').textContent = tr('failed'); $('resTitle').textContent = R.c.title; $('resStars').innerHTML = ''; $('resBody').textContent = tr('failedSub'); $('resMeta').innerHTML = ''; $('btnResShare').hidden = true;
  $('btnResNext').textContent = tr('retry'); $('btnResNext').onclick = () => { A.click(); const d = R.daily; PORTAL.midgame().then(() => beginCase(R.i, d)); };
  show('result');
}
$('btnResList').addEventListener('click', () => { A.click(); renderList(); });
$('btnResShare').addEventListener('click', () => {
  const t = tr('shareCase', R.c.title, S.stars[R.c.id] || 1, fmtTime(R.time));
  try { navigator.clipboard.writeText(t).then(() => toast(tr('copied'), 'ok'), () => toast(t)); } catch (e) { toast(t); }
});

/* ---- hints ---- */
$('btnHint').addEventListener('click', () => {
  A.init(); if (!R || R.state !== 'play') return;
  $('hintText').textContent = ''; const b = $('btnHintTake'); b.hidden = false; b.disabled = false; b.textContent = PORTAL.rewarded ? tr('hintAd') : tr('hintFree');
  $('hintModal').hidden = false; PORTAL.stop();
});
$('btnHintTake').addEventListener('click', () => {
  const b = $('btnHintTake'); b.disabled = true;
  const give = () => { $('hintText').textContent = hintText(); b.hidden = true; };
  if (!PORTAL.rewarded) { give(); return; }
  PORTAL.reward().then(ok => { if (ok) give(); else { toast(tr('adFail'), 'bad'); b.disabled = false; } });
});
const closeHint = () => { $('hintModal').hidden = true; if (screen === 'case') PORTAL.start(); };
$('btnHintClose').addEventListener('click', closeHint);
$('hintModal').addEventListener('click', e => { if (e.target === $('hintModal')) closeHint(); });

/* ---- navigation and settings ---- */
$('btnStart').addEventListener('click', () => { A.init(); A.click(); renderList(); });
$('btnListBack').addEventListener('click', () => { A.click(); renderTitle(); });
$('btnCaseBack').addEventListener('click', () => { A.click(); PORTAL.stop(); $('coach').hidden = true; renderList(); });
function openSettings() { A.init(); $('optSound').checked = S.settings.sound; $('optMusic').checked = S.settings.music !== false; $('optLang').value = LANG; $('btnResetConfirm').hidden = true; $('settings').hidden = false; }
$('btnTitleSettings').addEventListener('click', openSettings); $('btnListSettings').addEventListener('click', openSettings);
$('btnSettingsClose').addEventListener('click', () => { $('settings').hidden = true; });
$('settings').addEventListener('click', e => { if (e.target === $('settings')) $('settings').hidden = true; });
$('optSound').addEventListener('change', e => { S.settings.sound = e.target.checked; A.setMuted(!S.settings.sound); persist(); });
$('optMusic').addEventListener('change', e => { S.settings.music = e.target.checked; A.setMusic(S.settings.music); persist(); });
$('optLang').addEventListener('change', e => { persist(); setLang(e.target.value); });
$('btnReset').addEventListener('click', () => { $('btnResetConfirm').hidden = false; });
$('btnResetConfirm').addEventListener('click', () => { const st = S.settings; S = freshSave(); S.settings = st; persist(); $('settings').hidden = true; renderTitle(); });
addEventListener('keydown', e => { if (e.key === 'Escape') { $('settings').hidden = true; $('intro').hidden = true; if (!$('hintModal').hidden) closeHint(); closeSheet(); } });

/* ---- clock, start ---- */
function clock() { const d = new Date(); $('clock').textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); }
clock(); setInterval(clock, 15000);
document.title = tr('title');
for (const e of document.querySelectorAll('[data-i18n]')) e.textContent = tr(e.dataset.i18n);
A.setMuted(!S.settings.sound); A.musicOn = S.settings.music !== false;
PORTAL.onAd = p => { A.setMuted(p || !S.settings.sound); };
PORTAL.ready.then(() => {
  if (PORTAL.store) { let raw = null; try { raw = PORTAL.store.getItem(SAVE_KEY); } catch (e) {} if (raw) { const s2 = loadSave(raw); if (Object.keys(s2.done).length >= Object.keys(S.done).length) S = s2; } persist(); }
  A.setMuted(!S.settings.sound); renderTitle(); PORTAL.loaded();
});
renderTitle();
window.__al = { get S() { return S; }, get R() { return R; }, beginCase, renderList };
