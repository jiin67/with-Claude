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
  let h = 2166136261; for (const ch of id) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const pick = (n, k) => ((h >>> k) ^ (h >>> (k + 11))) % n;
  const skin = ['#f6d0b5', '#e9b48f', '#d19a6b', '#b57b4e', '#8d5a36', '#6a3f24', '#f9dccb'][pick(7, 1)];
  const hairC = ['#1b1a1f', '#3a2a22', '#6a3f22', '#a86a2e', '#d9b36a', '#8d93a3', '#b43a3a', '#2b4aa0', '#4d8c57', '#e6e1d6'][pick(10, 4)];
  const bg = ['#ffd3c2', '#cfe0ff', '#cff5e6', '#ead9ff', '#fff0b8', '#ffd0da', '#d7f3ff', '#e8ffd1'][pick(8, 7)];
  const shape = pick(3, 10), hair = pick(9, 13), hat = pick(6, 16) === 0, glasses = pick(4, 19), beard = pick(5, 22), mouth = pick(5, 25), eyes = pick(3, 28), brow = pick(3, 30), extra = pick(5, 12);
  const F = ['<ellipse cx="32" cy="33" rx="15" ry="16"/>', '<ellipse cx="32" cy="33" rx="14" ry="18"/>', '<rect x="17" y="16" width="30" height="34" rx="11"/>'][shape].replace('/>', ` fill="${skin}"/>`);
  const H = [
    `<path d="M15 28c0-13 8-19 17-19s17 6 17 19v5c-5-6-11-8-17-8s-12 2-17 8z" fill="${hairC}"/>`,
    `<path d="M13 31c0-14 9-22 19-22s19 8 19 22v16c-4 0-6-9-6-15-4 3-8 4-13 4s-9-1-13-4c0 6-2 15-6 15z" fill="${hairC}"/>`,
    `<path d="M15 27c1-11 8-17 17-17s16 6 17 17c-4-4-10-6-17-6s-13 2-17 6z" fill="${hairC}"/><path d="M30 9l4-4 2 5z" fill="${hairC}"/>`,
    `<path d="M12 31c0-15 9-24 20-24s20 9 20 24v12l-6-3v-9c-4 3-9 4-14 4s-10-1-14-4v9l-6 3z" fill="${hairC}"/>`,
    `<path d="M15 25c3-10 10-14 17-14s14 4 17 14c-5-2-11-3-17-3s-12 1-17 3z" fill="${hairC}"/><circle cx="21" cy="27" r="5" fill="${hairC}"/><circle cx="43" cy="27" r="5" fill="${hairC}"/>`,
    `<path d="M16 26c0-10 7-16 16-16s16 6 16 16c-3-3-6-4-9-4-2 3-5 4-7 4s-5-1-7-4c-3 0-6 1-9 4z" fill="${hairC}"/>`,
    `<path d="M14 30c0-14 8-21 18-21s18 7 18 21c0 6-2 10-4 12 1-5 0-10-2-14-3 3-7 4-12 4s-9-1-12-4c-2 4-3 9-2 14-2-2-4-6-4-12z" fill="${hairC}"/>`,
    `<path d="M17 24c2-8 8-12 15-12s13 4 15 12c-4-2-9-3-15-3s-11 1-15 3z" fill="${hairC}"/>`,
    ''
  ][hair];
  const HAT = hat ? `<path d="M12 27h40v4H12z" fill="#2a2d3a"/><path d="M18 27c0-10 6-14 14-14s14 4 14 14z" fill="#2a2d3a"/>` : '';
  const E = ['<circle cx="26" cy="35" r="2.2" fill="#23170f"/><circle cx="38" cy="35" r="2.2" fill="#23170f"/>', '<path d="M23 35q3-3 6 0M35 35q3-3 6 0" stroke="#23170f" stroke-width="2" fill="none" stroke-linecap="round"/>', '<rect x="23.5" y="33.5" width="5" height="3" rx="1.5" fill="#23170f"/><rect x="35.5" y="33.5" width="5" height="3" rx="1.5" fill="#23170f"/>'][eyes];
  const B = ['<path d="M22 30l8 1M34 31l8-1" stroke="#3a2a22" stroke-width="2" stroke-linecap="round"/>', '<path d="M22 31l8-1M34 30l8 1" stroke="#3a2a22" stroke-width="2.6" stroke-linecap="round"/>', '<path d="M22 30q4-3 8 0M34 30q4-3 8 0" stroke="#3a2a22" stroke-width="1.8" fill="none" stroke-linecap="round"/>'][brow];
  const M = ['<path d="M26 44q6 4 12 0" stroke="#5a2a1a" stroke-width="2" fill="none" stroke-linecap="round"/>', '<path d="M27 44h10" stroke="#5a2a1a" stroke-width="2" stroke-linecap="round"/>', '<path d="M26 45q6-3 12 0" stroke="#5a2a1a" stroke-width="2" fill="none" stroke-linecap="round"/>', '<path d="M27 43q5 5 10 0z" fill="#5a2a1a"/>', '<path d="M28 44q4 2 8 0" stroke="#5a2a1a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M36 43l2-1" stroke="#5a2a1a" stroke-width="2" stroke-linecap="round"/>'][mouth];
  const G = ['', '<g fill="none" stroke="#1d1b1f" stroke-width="1.6"><circle cx="26" cy="35" r="5"/><circle cx="38" cy="35" r="5"/><path d="M31 35h2"/></g>', '<g fill="none" stroke="#1d1b1f" stroke-width="1.6"><rect x="20.5" y="30.5" width="11" height="8" rx="2"/><rect x="32.5" y="30.5" width="11" height="8" rx="2"/><path d="M31.5 34h1"/></g>', ''][glasses];
  const BD = ['', `<path d="M19 38c2 10 7 13 13 13s11-3 13-13c-3 6-8 8-13 8s-10-2-13-8z" fill="${hairC}"/>`, `<path d="M26 40q6 3 12 0v3q-6 3-12 0z" fill="${hairC}"/>`, '', ''][beard];
  const X = ['', '<circle cx="17.5" cy="38" r="1.6" fill="#f2c94c"/>', '<g fill="#c9775f" opacity=".6"><circle cx="22" cy="40" r="1"/><circle cx="25" cy="41.5" r="1"/><circle cx="40" cy="41.5" r="1"/><circle cx="43" cy="40" r="1"/></g>', '<g fill="#ff9aa2" opacity=".5"><ellipse cx="23" cy="40" rx="3" ry="1.6"/><ellipse cx="41" cy="40" rx="3" ry="1.6"/></g>', `<path d="M44 30l3 7" stroke="${hairC}" stroke-width="2.4" stroke-linecap="round"/>`][extra];
  const coat = ['#3d4a6b', '#4b5b8f', '#5e3b6b', '#2f6b5a', '#7a3b3b', '#6b5a2f'][pick(6, 2)];
  return `<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><path d="M11 64c0-13 9-19 21-19s21 6 21 19z" fill="${coat}"/><path d="M28 46l4 6 4-6" fill="${bg}" opacity=".5"/>${F}${BD}${H}${HAT}${B}${E}${M}${G}${X}</svg>`;
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

const isWide = () => matchMedia('(min-width:760px) and (min-aspect-ratio:1/1)').matches;
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
  const chat = $('paneChat'), coachEl = $('coach'); chat.innerHTML = ''; chat.appendChild(coachEl);   /* the guide lives in the pane; keep it across re-renders */
  const brief = el('div', 'brief' + (S.coachDone ? ' closed' : '')); brief.append(el('b', null, tr('diff')[c.difficulty - 1] + ' · ' + c.place), c.intro); brief.onclick = () => brief.classList.toggle('closed'); chat.appendChild(brief);
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
  if (box.parentElement !== $('paneChat')) $('paneChat').prepend(box);
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
  if (coach === 2) { const row = document.querySelector(`.msg[data-k="${firstLie}"]`); if (row) { row.classList.add('pulse'); row.scrollIntoView({ block: 'center' }); } }
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
  const rf = $('resFace'); rf.hidden = false; rf.innerHTML = faceSVG(R.c.id + ':' + R.c.culprit); rf.dataset.stamp = tr('confessed'); $('resName').textContent = nameOf(R.c, R.c.culprit) + ' · ' + (R.c.suspects.find(s => s[0] === R.c.culprit) || [])[2];
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
  $('resBadge').textContent = tr('failed'); $('resTitle').textContent = R.c.title; $('resStars').innerHTML = ''; $('resFace').hidden = true; $('resName').textContent = ''; $('resBody').textContent = tr('failedSub'); $('resMeta').innerHTML = ''; $('btnResShare').hidden = true;
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
