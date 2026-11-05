'use strict';
/* ==========================================================================
   Screens: title, case list, the case (chat / evidence / suspects), result.
   ========================================================================== */
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const AV = ['#ff6a3d', '#5b8cff', '#3ddc97', '#c66bff', '#ffcf5a', '#ff4d6d'];
const avColor = (c, id) => AV[c.suspects.findIndex(s => s[0] === id) % AV.length];
/* a flat vector face, chosen deterministically from the suspect id so the same person always looks the same */
function faceSVG(id) {
  let h = 7; for (const ch of id) h = (h * 131 + ch.charCodeAt(0)) >>> 0;
  const pick = (n, k) => (h >>> k) % n;
  const skin = ['#f3c9a8', '#e0a884', '#c68a62', '#9c6540', '#6f4529', '#f7d7c4'][pick(6, 2)];
  const hairC = ['#1d1b1f', '#3b2a21', '#6b3f22', '#b5742f', '#d8b26e', '#8a8f9c', '#b23a3a', '#2c4a9a'][pick(8, 5)];
  const bg = ['#ffd3c2', '#cfe0ff', '#cff5e6', '#ead9ff', '#fff0b8', '#ffd0da'][pick(6, 8)];
  const hair = pick(6, 11), glasses = pick(3, 14) === 0, beard = pick(4, 16) === 0 && hair !== 5, mouth = pick(3, 18), brow = pick(2, 20);
  const hairs = [
    `<path d="M14 26c0-12 8-18 18-18s18 6 18 18v6c-6-6-12-8-18-8s-12 2-18 8z" fill="${hairC}"/>`,
    `<path d="M12 30c0-14 9-22 20-22s20 8 20 22v14c-4 0-6-8-6-14-5 2-9 3-14 3s-9-1-14-3c0 6-2 14-6 14z" fill="${hairC}"/>`,
    `<path d="M14 27c1-11 8-17 18-17s17 6 18 17c-4-4-10-6-18-6s-14 2-18 6z" fill="${hairC}"/><rect x="30" y="8" width="4" height="6" rx="2" fill="${hairC}"/>`,
    `<path d="M11 30c0-15 9-24 21-24s21 9 21 24v10l-5-4v-8c-5 3-10 4-16 4s-11-1-16-4v8l-5 4z" fill="${hairC}"/>`,
    `<path d="M14 24c3-10 10-14 18-14s15 4 18 14c-5-2-11-3-18-3s-13 1-18 3z" fill="${hairC}"/><circle cx="20" cy="26" r="5" fill="${hairC}"/><circle cx="44" cy="26" r="5" fill="${hairC}"/>`,
    ``
  ];
  const mouths = ['<path d="M26 44q6 4 12 0" stroke="#5a2a1a" stroke-width="2" fill="none" stroke-linecap="round"/>', '<path d="M27 44h10" stroke="#5a2a1a" stroke-width="2" stroke-linecap="round"/>', '<path d="M26 45q6-3 12 0" stroke="#5a2a1a" stroke-width="2" fill="none" stroke-linecap="round"/>'][mouth];
  const brows = brow ? '<path d="M22 30l8 1M34 31l8-1" stroke="#3a2a22" stroke-width="2" stroke-linecap="round"/>' : '<path d="M22 31l8-1M34 30l8 1" stroke="#3a2a22" stroke-width="2" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><path d="M12 64c0-12 9-18 20-18s20 6 20 18z" fill="${hairC === '#d8b26e' ? '#4b5b8f' : '#3d4a6b'}"/><circle cx="32" cy="32" r="16" fill="${skin}"/>${beard ? `<path d="M18 36c2 10 8 14 14 14s12-4 14-14c-3 6-8 9-14 9s-11-3-14-9z" fill="${hairC}"/>` : ''}${hairs[hair]}${brows}<circle cx="26" cy="35" r="2" fill="#2b1d16"/><circle cx="38" cy="35" r="2" fill="#2b1d16"/>${mouths}${glasses ? '<g fill="none" stroke="#1d1b1f" stroke-width="1.6"><circle cx="26" cy="35" r="5"/><circle cx="38" cy="35" r="5"/><path d="M31 35h2"/></g>' : ''}</svg>`;
}
const face = (e, id) => { e.innerHTML = faceSVG((R ? R.c.id + ':' : '') + id); return e; };

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
  msg() { this.tone(1046, .08, 'sine', .14); this.tone(1318, .1, 'sine', .12, 1, .07); },
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

const isWide = () => matchMedia('(min-width:900px) and (min-aspect-ratio:1/1)').matches;
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
  d.onclick = () => { A.init(); A.click(); beginCase(di, key); };
  box.appendChild(d);
  CL.forEach((c, i) => {
    const open = unlocked(i), b = el('button', 'case-card' + (open ? '' : ' locked')); b.type = 'button';
    const info = el('div'); info.append(el('b', null, c.title), el('span', null, open ? c.place + ' · ' + tr('diff')[c.difficulty - 1] : tr('locked')));
    const st = S.stars[c.id] || 0;
    b.append(el('div', 'no', open ? String(i + 1) : '🔒'), info, el('div', 'st', S.done[c.id] ? '★'.repeat(st) + '☆'.repeat(3 - st) + (S.best[c.id] ? '\n' + fmtTime(S.best[c.id]) : '') : ''));
    b.onclick = () => { A.init(); if (!open) return; A.click(); beginCase(i); };
    box.appendChild(b);
  });
  show('list');
}
/* kept for callers: the brief now lives at the top of the chat, so this just starts the case */
function openIntro(i, daily) { beginCase(i, daily); }

/* ---- the case ---- */
let tab = 'chat', sel = null;
function beginCase(i, daily) {
  startCase(i, daily); tab = 'chat'; sel = null;
  coach = !S.coachDone && i === 0 ? (isWide() ? 2 : 0) : -1;
  S.tutorialSeen = true;
  A.startMusic();
  $('caseTitle').textContent = R.c.title; $('casePlace').textContent = R.c.place;
  renderCase(); show('case'); PORTAL.start();
}
function setTab(t) { tab = t; const w = isWide(); for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === t)); $('paneChat').hidden = !w && t !== 'chat'; $('paneEvidence').hidden = !w && t !== 'evidence'; $('paneSuspects').hidden = !w && t !== 'suspects'; if (coach === 0 && t === 'evidence') coach = 1; if (coach === 1 && t === 'chat') coach = 2; if (w && coach >= 0 && coach < 2) coach = 2; renderCoach(); }
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
  const brief = el('div', 'brief'); brief.append(el('b', null, tr('diff')[c.difficulty - 1] + ' · ' + c.place), c.intro); chat.appendChild(brief);
  c.chat.forEach((m, k) => {
    const row = el('button', 'msg' + (R.found.has(k) ? ' lie' : '') + (sel === k ? ' sel' : '')); row.type = 'button'; row.dataset.k = k;
    const av = face(el('div', 'av'), m.s);
    const b = el('div', 'b'), who = el('div', 'who', nameOf(c, m.s)); who.appendChild(el('span', null, m.t));
    b.append(who, el('div', 'bub', m.m));
    if (R.found.has(k)) b.appendChild(el('div', 'why', m.lie));
    row.append(av, b);
    row.onclick = () => { A.init(); if (R.state !== 'play' || R.found.has(k)) return; A.click(); sel = k; openMarkSheet(k); };
    chat.appendChild(row);
  });
  const ev = $('factList'); ev.innerHTML = '';
  for (const [ic, t] of c.facts) { const f = el('div', 'fact'); f.append(el('div', 'ic', ic), el('div', null, t)); ev.appendChild(f); }
  const su = $('susList'); su.innerHTML = '';
  for (const [id, name, role] of c.suspects) {
    const s = el('div', 'sus'), av = face(el('div', 'av'), id);
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
  yes.onclick = () => openEvidenceSheet(k); no.onclick = () => { sel = null; closeSheet(); renderCase(); };
  card.append(yes, no); $('sheet').hidden = false;
}
/* second step: which fact does the message contradict? */
function openEvidenceSheet(k) {
  const m = R.c.chat[k], card = $('sheetCard'); card.innerHTML = '';
  card.append(el('h3', null, tr('pickEv')), el('div', 'quote', m.m));
  const list = el('div', 'list'), guide = coach === 2 && m.lie ? evOf(m)[0] : -1;
  R.c.facts.forEach(([ic, t], i) => {
    const b = el('button', 'evpick' + (i === guide ? ' pulse' : '')); b.type = 'button'; b.append(el('span', 'ic', ic), el('span', null, t));
    b.onclick = () => { closeSheet(); doMark(k, i); };
    list.appendChild(b);
  });
  const no = el('button', 'btn ghost', tr('back')); no.onclick = () => openMarkSheet(k);
  card.append(list, no); $('sheet').hidden = false;
}
function closeSheet() { $('sheet').hidden = true; }
$('sheet').addEventListener('click', e => { if (e.target === $('sheet')) { sel = null; closeSheet(); renderCase(); } });
function doMark(k, ev) {
  const r = mark(k, ev); sel = null;
  if (r === 'lie') { A.ok(); renderCase(); const row = document.querySelector(`.msg[data-k="${k}"]`); if (row) { row.classList.add('just'); setTimeout(() => row.classList.remove('just'), 900); } if (allLiesFound() && coach < 0) setTimeout(() => toast(tr('accuse') + ' →'), 600); }
  else if (r === 'strike' || r === 'wrongEv') {
    A.bad(); toast(tr(r === 'wrongEv' ? 'wrongEv' : 'notLie'), 'bad'); renderCase();
    const row = document.querySelector(`.msg[data-k="${k}"]`); if (row) row.classList.add('wrong');
    if (R.state === 'failed') setTimeout(showFailed, 700);
  }
}
$('btnAccuse').addEventListener('click', () => {
  if (!allLiesFound() || R.state !== 'play') return; A.click();
  const card = $('sheetCard'); card.innerHTML = ''; card.appendChild(el('h3', null, tr('accuseWho')));
  for (const [id, name, role] of R.c.suspects) {
    const p = el('button', 'pick'); p.type = 'button';
    const av = face(el('div', 'av'), id);
    const info = el('div'); info.append(el('b', null, name), el('span', null, role)); p.append(av, info);
    p.onclick = () => { closeSheet(); const stars = accuse(id); if (stars) playOutro(id, stars); else { A.bad(); toast(tr('wrongAccuse'), 'bad'); renderMeters(); if (R.state === 'failed') setTimeout(showFailed, 700); } };
    card.appendChild(p);
  }
  const no = el('button', 'btn ghost', tr('close')); no.onclick = closeSheet; card.appendChild(no);
  $('sheet').hidden = false;
});

/* the payoff: the detective names the culprit in the chat, the room reacts, the culprit cracks */
function playOutro(id, stars) {
  const c = R.c, lines = (OUTRO[LANG] && OUTRO[LANG][c.id]) || [], chat = $('paneChat');
  $('coach').hidden = true; $('btnAccuse').disabled = true; $('btnAccuse').classList.remove('pulse');
  if (!isWide()) setTab('chat');
  const add = (who, text, cls) => {
    const row = el('div', 'msg ' + cls), av = who === 'me' ? el('div', 'av', '🔎') : face(el('div', 'av'), who);
    const b = el('div', 'b'), w = el('div', 'who', who === 'me' ? tr('me') : nameOf(c, who));
    b.append(w, el('div', 'bub', text)); row.append(av, b); chat.appendChild(row); chat.scrollTop = chat.scrollHeight; return row;
  };
  add('me', tr('accuseLine', nameOf(c, id)), 'me'); A.ok();
  let i = 0;
  const step = () => {
    if (i >= lines.length) { setTimeout(() => showSolved(stars), 900); return; }
    const l = lines[i++], last = i === lines.length, confess = l.s === c.culprit && i >= lines.length - 1;
    const ty = add(l.s, '…', 'typing');
    setTimeout(() => { ty.remove(); add(l.s, l.m, l.s === c.culprit ? (confess ? 'confess' : 'accused') : ''); A.msg ? A.msg() : A.click(); if (last) A.win(); step(); }, 500 + Math.min(1500, l.m.length * 22));
  };
  setTimeout(step, 600);
}

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
  $('btnResNext').onclick = () => { A.click(); if (R.daily) PORTAL.midgame().then(renderList); else if (last) { toast(tr('allDoneSub')); renderList(); } else PORTAL.midgame().then(() => beginCase(R.i + 1)); };
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
addEventListener('keydown', e => { if (e.key === 'Escape') { $('settings').hidden = true; if (!$('hintModal').hidden) closeHint(); closeSheet(); } });
addEventListener('resize', () => { if (screen === 'case') setTab(tab); });

/* ---- clock, start ---- */
function clock() { const d = new Date(); $('clock').textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); }
clock(); setInterval(clock, 15000);
document.title = tr('title');
for (const e of document.querySelectorAll('[data-i18n]')) e.textContent = tr(e.dataset.i18n);
A.setMuted(!S.settings.sound); A.musicOn = S.settings.music !== false;
PORTAL.onAd = p => { A.setMuted(p || !S.settings.sound); };
/* a new player is inside case 1 with no clicks; a returning player lands on the case files */
function boot() { if (!S.tutorialSeen && !Object.keys(S.done).length) beginCase(0); else renderList(); }
PORTAL.ready.then(() => {
  if (PORTAL.store) { let raw = null; try { raw = PORTAL.store.getItem(SAVE_KEY); } catch (e) {} if (raw) { const s2 = loadSave(raw); if (Object.keys(s2.done).length >= Object.keys(S.done).length) S = s2; } persist(); }
  /* the portal knows the player's country better than the browser does; follow it unless the player chose a language */
  try { const chosen = localStorage.getItem(LANG_KEY), want = PORTAL.country === 'KR' ? 'ko' : PORTAL.country ? 'en' : null; if (!chosen && want && want !== LANG && !sessionStorage.getItem('alibi.langflip')) { sessionStorage.setItem('alibi.langflip', '1'); setLang(want); return; } } catch (e) {}
  A.setMuted(!S.settings.sound); if (screen === 'title') boot(); PORTAL.loaded();
});
renderTitle();
window.__al = { get S() { return S; }, get R() { return R; }, beginCase, renderList };
