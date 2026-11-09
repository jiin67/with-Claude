'use strict';
/* ==========================================================================
   Screens: title, case list, the case (chat / evidence / suspects), result.
   ========================================================================== */
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const AV = ['#ff6a3d', '#5b8cff', '#3ddc97', '#c66bff', '#ffcf5a', '#ff4d6d'];
const avColor = (c, id) => AV[c.suspects.findIndex(s => s[0] === id) % AV.length];
/* A flat vector face, chosen deterministically from the suspect id so the
   same person always looks the same. `g` is the gender hint from the
   suspect's data ('f' / 'm' / 'n'): it gates beards, long hair, earrings
   and brow/mouth styling, so a woman never grows a moustache by chance.
   Everything else (skin, hair colour, glasses, coat) still comes from the
   id hash, so the face stays stable across the chat, the suspects tab,
   the case photo and the result screen. */
function faceSVG(id, g) {
  g = g === 'f' || g === 'm' ? g : 'n';
  let h = 2166136261; for (const ch of id) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const pick = (n, k) => ((h >>> k) ^ (h >>> (k + 11))) % n;
  const skin = ['#f6d0b5', '#e9b48f', '#d19a6b', '#b57b4e', '#8d5a36', '#6a3f24', '#f9dccb'][pick(7, 1)];
  const hairC = ['#1b1a1f', '#3a2a22', '#6a3f22', '#a86a2e', '#d9b36a', '#8d93a3', '#b43a3a', '#2b4aa0', '#4d8c57', '#e6e1d6'][pick(10, 4)];
  const bg = ['#ffd3c2', '#cfe0ff', '#cff5e6', '#ead9ff', '#fff0b8', '#ffd0da', '#d7f3ff', '#e8ffd1'][pick(8, 7)];
  /* face shape: women and neutral faces stay round/oval, men may be square */
  const shapes = ['<ellipse cx="32" cy="33" rx="15" ry="16"/>', '<ellipse cx="32" cy="33" rx="14" ry="18"/>', '<rect x="17" y="16" width="30" height="34" rx="11"/>'];
  const F = shapes[g === 'm' ? pick(3, 10) : pick(2, 10)].replace('/>', ` fill="${skin}"/>`);
  /* ears, neck and a soft shadow under the chin, so the head sits on the body */
  const EARS = `<circle cx="17" cy="35" r="2.6" fill="${skin}"/><circle cx="47" cy="35" r="2.6" fill="${skin}"/>`;
  const NECK = `<rect x="28.5" y="44" width="7" height="7" fill="${skin}"/><ellipse cx="32" cy="47.5" rx="7" ry="2" fill="#3a1e0e" opacity="0.08"/>`;
  /* hair: long styles and buns only for 'f', short crops only for 'm' */
  const HF = [
    `<path d="M14 34c0-16 8-24 18-24s18 8 18 24v14c-1.5 1.5-4 1.5-5 0V30c-3 3-8 4-13 4s-10-1-13-4v18c-1 1.5-3.5 1.5-5 0z" fill="${hairC}"/>`,
    `<path d="M14 33c0-15 8-23 18-23s18 8 18 23v12c-1.5 2-4 2-5 .5-1-4-1-8-2-11-3 3-7 4-11 4s-8-1-11-4c-1 3-1 7-2 11-1 1.5-3.5 1.5-5-.5z" fill="${hairC}"/>`,
    `<path d="M14 32c0-14 8-22 18-22s18 8 18 22v9c-1.5 2-4.5 2-6 .5V30c-3 3-7 4-12 4s-9-1-12-4v11.5c-1.5 1.5-4.5 1.5-6-.5z" fill="${hairC}"/>`,
    `<path d="M15 28c0-13 8-19 17-19s17 6 17 19c-4-5-10-7-17-7s-13 2-17 7z" fill="${hairC}"/><circle cx="32" cy="9" r="6" fill="${hairC}"/>`,
    `<path d="M15 28c0-13 8-19 17-19s17 6 17 19c-4-5-10-7-17-7s-13 2-17 7z" fill="${hairC}"/><path d="M46 22c6 2 8 8 6 16-1 4-4 5-5 2 1-6 0-12-3-15z" fill="${hairC}"/>`,
    `<path d="M15 28c0-12 8-18 17-18s17 6 17 18c-4-5-10-7-17-7s-13 2-17 7z" fill="${hairC}"/>`
  ];
  const HM = [
    `<path d="M15 29c0-13 8-20 17-20s17 7 17 20c-4-6-10-8-17-8s-13 2-17 8z" fill="${hairC}"/>`,
    `<path d="M14 30c0-14 8-21 18-21s18 7 18 21v2c-6-4-12-6-18-6s-12 2-18 6z" fill="${hairC}"/>`,
    `<path d="M16 26c0-10 7-15 16-15s16 5 16 15c-4-3-9-4-16-4s-12 1-16 4z" fill="${hairC}"/>`,
    `<path d="M15 28c0-12 7-19 17-19s17 7 17 19c-2-2-4-3-6-2-1-2-3-3-5-2-1-1-3-1-5 0-2-1-4 0-5 2-2-1-4 0-6 2-2-1-4-0-7 2z" fill="${hairC}"/>`,
    `<path d="M15 30l3-8 3 5 4-9 4 6 3-7 4 8 3-4 4 7 3-5 2 8c-5-4-11-6-17-6s-12 2-16 5z" fill="${hairC}"/>`,
    `<path d="M15 28c0-12 8-19 17-19s17 7 17 19c-6-4-11-6-17-6s-11 2-17 6z" fill="${hairC}"/>`
  ];
  const HN = [
    `<path d="M14 31c0-14 8-21 18-21s18 7 18 21v8c-1.5 2-4 2-5 .5V30c-3 3-8 4-13 4s-10-1-13-4v9.5c-1 1.5-3.5 1.5-5-.5z" fill="${hairC}"/>`,
    `<path d="M14 32c0-14 8-22 18-22s18 8 18 22v9c-1.5 2-4.5 2-6 .5V30c-3 3-7 4-12 4s-9-1-12-4v11.5c-1.5 1.5-4.5 1.5-6-.5z" fill="${hairC}"/>`,
    `<path d="M15 29c0-13 8-20 17-20s17 7 17 20c-4-6-10-8-17-8s-13 2-17 8z" fill="${hairC}"/>`,
    `<path d="M15 28c0-12 7-19 17-19s17 7 17 19c-2-2-4-3-6-2-1-2-3-3-5-2-1-1-3-1-5 0-2-1-4 0-5 2-2-1-4 0-6 2-2-1-4-0-7 2z" fill="${hairC}"/>`,
    `<path d="M14 30c0-14 8-21 18-21s18 7 18 21v2c-6-4-12-6-18-6s-12 2-18 6z" fill="${hairC}"/>`
  ];
  const H = (g === 'f' ? HF : g === 'm' ? HM : HN)[pick(g === 'n' ? 5 : 6, 13)];
  const hat = pick(6, 16) === 0;
  const HAT = hat ? `<path d="M12 27h40v4H12z" fill="#2a2d3a"/><path d="M18 27c0-10 6-14 14-14s14 4 14 14z" fill="#2a2d3a"/>` : '';
  /* eyes: round eyes get a white highlight so they look alive */
  const E = ['<circle cx="26" cy="35" r="2.2" fill="#23170f"/><circle cx="38" cy="35" r="2.2" fill="#23170f"/><circle cx="25.2" cy="34.2" r="0.8" fill="#fff"/><circle cx="37.2" cy="34.2" r="0.8" fill="#fff"/>', '<path d="M23 35q3-3 6 0M35 35q3-3 6 0" stroke="#23170f" stroke-width="2" fill="none" stroke-linecap="round"/>', '<rect x="23.5" y="33.5" width="5" height="3" rx="1.5" fill="#23170f"/><rect x="35.5" y="33.5" width="5" height="3" rx="1.5" fill="#23170f"/>'][pick(3, 28)];
  /* brows: thin and arched for 'f', straight and heavier for 'm' */
  const bw = g === 'f' ? 1.6 : g === 'm' ? 2.6 : 2;
  const B = [`<path d="M22 30q4-2.5 8 0M34 30q4-2.5 8 0" stroke="#3a2a22" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`, `<path d="M22 30l8 1M34 31l8-1" stroke="#3a2a22" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`, `<path d="M22 31l8-1M34 30l8 1" stroke="#3a2a22" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`][pick(3, 30)];
  const mc = g === 'f' ? '#8e3b2f' : '#5a2a1a';
  const M = [`<path d="M26 44q6 4 12 0" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/>`, `<path d="M27 44h10" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/>`, `<path d="M26 45q6-3 12 0" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/>`, `<path d="M27 43q5 5 10 0z" fill="${mc}"/>`, `<path d="M28 44q4 2 8 0" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M36 43l2-1" stroke="${mc}" stroke-width="2" stroke-linecap="round"/>`][pick(5, 25)];
  const glasses = pick(4, 19);
  const G = ['', '<g fill="none" stroke="#1d1b1f" stroke-width="1.6"><circle cx="26" cy="35" r="5"/><circle cx="38" cy="35" r="5"/><path d="M31 35h2"/></g>', '<g fill="none" stroke="#1d1b1f" stroke-width="1.6"><rect x="20.5" y="30.5" width="11" height="8" rx="2"/><rect x="32.5" y="30.5" width="11" height="8" rx="2"/><path d="M31.5 34h1"/></g>', ''][glasses];
  /* beards: men only — women and neutral faces never get one */
  const BD = g !== 'm' ? '' : ['', `<path d="M19 38c2 10 7 13 13 13s11-3 13-13c-3 6-8 8-13 8s-10-2-13-8z" fill="${hairC}"/>`, `<path d="M26 40q6 3 12 0v3q-6 3-12 0z" fill="${hairC}"/>`, `<path d="M27 41q5 3 10 0v4q-5 3-10 0z" fill="${hairC}"/>`, ''][pick(5, 22)];
  /* small extras: earrings and blush only for 'f', a mole for 'm'/'n' */
  const XF = ['', '<circle cx="15.5" cy="39" r="1.5" fill="#f2c94c"/><circle cx="48.5" cy="39" r="1.5" fill="#f2c94c"/>', '<g fill="#ff9aa2" opacity=".5"><ellipse cx="23" cy="40" rx="3" ry="1.6"/><ellipse cx="41" cy="40" rx="3" ry="1.6"/></g>', '<g fill="#c9775f" opacity=".6"><circle cx="22" cy="40" r="1"/><circle cx="25" cy="41.5" r="1"/><circle cx="40" cy="41.5" r="1"/><circle cx="43" cy="40" r="1"/></g>', `<path d="M44 30l3 7" stroke="${hairC}" stroke-width="2.4" stroke-linecap="round"/>`];
  const XM = ['', '<circle cx="40" cy="42" r="1.1" fill="#4a2c1a"/>', '<g fill="#c9775f" opacity=".6"><circle cx="22" cy="40" r="1"/><circle cx="25" cy="41.5" r="1"/><circle cx="40" cy="41.5" r="1"/><circle cx="43" cy="40" r="1"/></g>', `<path d="M44 30l3 7" stroke="${hairC}" stroke-width="2.4" stroke-linecap="round"/>`, ''];
  const XN = ['', '<g fill="#c9775f" opacity=".6"><circle cx="22" cy="40" r="1"/><circle cx="25" cy="41.5" r="1"/><circle cx="40" cy="41.5" r="1"/><circle cx="43" cy="40" r="1"/></g>', '<g fill="#ff9aa2" opacity=".5"><ellipse cx="23" cy="40" rx="3" ry="1.6"/><ellipse cx="41" cy="40" rx="3" ry="1.6"/></g>', '<circle cx="40" cy="42" r="1.1" fill="#4a2c1a"/>', `<path d="M44 30l3 7" stroke="${hairC}" stroke-width="2.4" stroke-linecap="round"/>`];
  const X = (g === 'f' ? XF : g === 'm' ? XM : XN)[pick(5, 12)];
  const coat = ['#3d4a6b', '#4b5b8f', '#5e3b6b', '#2f6b5a', '#7a3b3b', '#6b5a2f'][pick(6, 2)];
  return `<svg viewBox="0 0 64 64"><rect width="64" height="64" fill="${bg}"/><path d="M11 64c0-13 9-19 21-19s21 6 21 19z" fill="${coat}"/><path d="M28 46l4 6 4-6" fill="${bg}" opacity=".5"/>${F}${EARS}${NECK}${BD}${H}${HAT}${B}${E}${M}${G}${X}</svg>`;
}
/* the gender hint for a suspect of a case ('f' / 'm' / 'n', default 'n') */
const genderOf = (c, id) => ((c && c.suspects.find(s => s[0] === id)) || [])[3] || 'n';
/* painted portraits (js/art.js) replace the vector face when the case has
   them. The mood follows the case: 'nervous' once one of this person's lies
   is found, 'confess' for the culprit after a solve. Missing moods fall back
   calm → vector face, so a half-finished art set still works. Images load
   only when a case is on screen, never at boot. */
const ART_OK = typeof ART !== 'undefined';
function portraitSrc(c, id, mood) {
  const moods = ART_OK && c && ART.p[c.id + ':' + id]; if (!moods) return null;
  const m = moods.includes(mood) ? mood : moods.includes('calm') ? 'calm' : moods[0];
  return 'assets/p/' + c.id + '-' + id + '-' + m + '.webp';
}
function moodOf(c, id) {
  if (!R || R.c !== c) return 'calm';
  if (R.state === 'solved' && id === c.culprit) return 'confess';
  return c.chat.some((m, k) => m.s === id && R.found.has(k)) ? 'nervous' : 'calm';
}
function faceHTML(c, id, mood) {
  const src = portraitSrc(c, id, mood || moodOf(c, id));
  return src ? `<img class="portrait" src="${src}" alt="" decoding="async" draggable="false">` : faceSVG(c.id + ':' + id, genderOf(c, id));
}
const face = (e, id, mood) => { e.innerHTML = R ? faceHTML(R.c, id, mood) : faceSVG(id, 'n'); return e; };

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
/* one toast at a time: a new toast replaces the one still showing, so two
   toasts never stack and cover the suspect cards below the message list.
   pointer-events:none (see #toasts) means a toast can never block a tap
   on the button underneath it. */
function toast(text, cls) { const t = el('div', 'toast ' + (cls || ''), text); const box = $('toasts'); box.innerHTML = ''; box.appendChild(t); setTimeout(() => t.remove(), 2600); }

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
let tab = 'chat', sel = null, recoverAnnounced = false, recoverUsedAnnounced = false;
function beginCase(i, daily) {
  startCase(i, daily); tab = 'chat'; sel = null; recoverAnnounced = false; recoverUsedAnnounced = false;
  coach = !S.coachDone && i === 0 ? (isWide() ? 2 : 0) : -1;
  S.tutorialSeen = true;
  A.startMusic();
  $('caseTitle').textContent = R.c.title; $('casePlace').textContent = R.c.place;
  renderCase(); show('case'); PORTAL.start();
  /* a fresh case always starts at the top of the chat: the outro of the
     previous case scrolled the chat pane to the bottom, and that offset
     survives the result screen — a pane keeps its scrollTop while its
     screen is hidden, and re-rendering while hidden does not clamp it —
     so "next case" used to open on the first chat message with the brief
     scrolled out of view. Resume-after-failure does not come through
     here (it re-renders in place and keeps the reading position), and
     neither does tab switching, so only a fresh entry resets the panes.
     The reset runs after show(): while the screen is hidden the panes
     have no layout and a scrollTop assignment would not stick. */
  for (const id of ['paneChat', 'paneEvidence', 'paneSuspects']) { const p = $(id); if (p) p.scrollTop = 0; }
}
function setTab(t) { tab = t; const w = isWide(); for (const b of document.querySelectorAll('.tabs button')) b.setAttribute('aria-selected', String(b.dataset.tab === t)); $('paneChat').hidden = !w && t !== 'chat'; $('paneEvidence').hidden = !w && t !== 'evidence'; $('paneSuspects').hidden = !w && t !== 'suspects'; if (coach === 0 && t === 'evidence') coach = 1; if (coach === 1 && t === 'chat') coach = 2; if (w && coach >= 0 && coach < 2) coach = 2; renderCoach(); }
for (const b of document.querySelectorAll('.tabs button')) b.addEventListener('click', () => { A.click(); setTab(b.dataset.tab); });
function renderMeters() {
  $('lieMeter').textContent = tr('lies', R.found.size, lieCount(R.c));
  const sm = $('strikeMeter'); sm.innerHTML = ''; sm.append(tr('strikes') + ' ');
  for (let k = 0; k < MAX_STRIKES; k++) sm.appendChild(k < R.strikes ? el('b', null, '✕') : el('span', null, '·'));
  $('btnAccuse').disabled = !allLiesFound();
  /* strike recovery: shown from 1 strike up, once per case, in every
     build — it used to need 2 banked strikes, so a single wrong pick cost
     ★3 with no way back. The old code also required PORTAL.rewarded, so
     ad-free builds never saw the button at all. Rewarded builds pay with
     an ad; ad-free builds pay with one hint (see recoverStrikeFree in
     game.js). While the portal SDK is still answering, the button shows
     disabled rather than hidden, so it can never be tapped in the wrong
     mode. */
  const rb = $('btnRecoverStrike');
  if (rb) {
    const usable = !!(R && R.state === 'play' && canRecoverStrike());
    /* recovery is once per case: after it is spent, reaching 2 strikes again
       used to hide the button with no trace of why. Now the button stays,
       disabled, saying it was already used, so the limit is visible where
       the player would look for the button. */
    const used = !!(R && R.state === 'play' && R.strikes === 2 && R.strikeRecovered);
    rb.hidden = !(usable || used);
    if (usable) {
      rb.textContent = PORTAL.rewarded ? tr('recoverStrike') : tr('recoverStrikeFree');
      rb.disabled = PORTAL.settled === false;
      rb.classList.add('pulse');
      /* announce once, but only once the portal has answered: the free/ad
         wording depends on whether this build can show rewarded ads */
      if (!recoverAnnounced && PORTAL.settled !== false) { recoverAnnounced = true; toast(PORTAL.rewarded ? tr('recoverHint') : tr('recoverHintFree')); }
    } else if (used) {
      rb.textContent = tr('recoverUsed');
      rb.disabled = true;
      rb.classList.remove('pulse');
      if (!recoverUsedAnnounced) { recoverUsedAnnounced = true; toast(tr('recoverUsed')); }
    } else {
      rb.classList.remove('pulse');
      rb.disabled = false;
    }
  }
  $('timeMeter').textContent = fmtTime(elapsed());
}
setInterval(() => { if (R && R.state === 'play' && screen === 'case') $('timeMeter').textContent = fmtTime(elapsed()); }, 1000);
function renderCase() {
  const c = R.c;
  const chat = $('paneChat'), coachEl = $('coach'); chat.innerHTML = ''; chat.appendChild(coachEl);   /* the guide lives in the pane; keep it across re-renders */
  /* the brief starts open: it used to start collapsed (one-line ellipsis)
     once the tutorial was done, so returning players never saw the full
     intro — including facts the case turns on, like the clock case's
     20:50–21:10 window. Tapping still collapses it. */
  const brief = el('div', 'brief');
  if (ART_OK && ART.s[c.id]) { const sc = el('img', 'brief-scene'); sc.src = 'assets/s/' + c.id + '.webp'; sc.alt = ''; sc.decoding = 'async'; brief.classList.add('has-scene'); brief.appendChild(sc); }
  brief.append(el('b', null, tr('diff')[c.difficulty - 1] + ' · ' + c.place), c.intro); brief.onclick = () => brief.classList.toggle('closed'); chat.appendChild(brief);
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
  for (const [ic, t, photo] of c.facts) {
    const f = el('div', 'fact' + (photo ? ' photo' : '')), body = el('div');
    body.append(t);
    if (photo) {
      const sc = sceneSVG(c);
      if (sc) { const img = el('div', 'photo-img'); img.innerHTML = sc; img.onclick = () => openPhoto(c); body.appendChild(img); }
      const z = el('div', 'zoom'); for (const d of photo) z.appendChild(el('span', null, d)); body.appendChild(z);
    }
    f.append(el('div', 'ic', ic), body); ev.appendChild(f);
  }
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
/* a case photo: the scene with the suspects' real faces dropped in */
function sceneSVG(c) {
  const sc = typeof SCENES !== 'undefined' && SCENES[c.id]; if (!sc) return null;
  const face = (id, x, y, size, hood) => {
    const inner = faceSVG(c.id + ':' + id, genderOf(c, id)).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/<rect width="64" height="64"[^>]*\/>/, '');
    return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 64 64">${inner}${hood ? '<path d="M8 36c0-20 10-30 24-30s24 10 24 30c-6-8-14-12-24-12S14 28 8 36z" fill="#f5c400"/>' : ''}</svg>`;
  };
  return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">${sc(face)}</svg>`;
}
/* the photo, big: a close button, Esc, or a tap on the backdrop closes it.
   Tapping the photo itself no longer closes it — that was the only way out
   before, and it closed the picture by accident while looking at it. */
function openPhoto(c) {
  const d = el('div', 'modal photo-modal'), card = el('div', 'photo-big'); card.innerHTML = sceneSVG(c);
  const x = el('button', 'photo-close', '×'); x.type = 'button'; x.setAttribute('aria-label', tr('close'));
  x.onclick = e => { e.stopPropagation(); closePhoto(); };
  card.appendChild(x);
  d.appendChild(card);
  d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', tr('close'));
  d.onclick = e => { if (e.target === d) closePhoto(); };
  document.body.appendChild(d);
}
function closePhoto() { const m = document.querySelector('.photo-modal'); if (m) m.remove(); }
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
  /* step 2 used to name the liar and pulse their exact message — the first
     deduction, handed over. Now the guide only says a message contradicts
     the evidence; the player has to find which one. */
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
  const list = el('div', 'list');
  R.c.facts.forEach(([ic, t, photo], i) => {
    const tried = R.triedEv[k] && R.triedEv[k].has(i);
    /* no guide pulse on the right answer: the tutorial used to highlight
       the contradicting fact, which gave away the first lie outright */
    const b = el('button', 'evpick' + (tried ? ' tried' : '')); b.type = 'button'; b.disabled = !!tried;
    const tx = el('span', null, t); if (photo) { const z = el('div', 'zoom small'); for (const d of photo) z.appendChild(el('span', null, d)); tx.appendChild(z); }
    if (tried) tx.appendChild(el('span', 'tried-tag', ' · ' + tr('triedEv')));
    b.append(el('span', 'ic', ic), tx);
    b.onclick = () => { closeSheet(); doMark(k, i); };
    list.appendChild(b);
  });
  const no = el('button', 'btn ghost', tr('back')); no.onclick = () => openMarkSheet(k);
  card.append(list, no); $('sheet').hidden = false;
}
function closeSheet() { $('sheet').hidden = true; }
$('sheet').addEventListener('click', e => { if (e.target === $('sheet')) { sel = null; if (R) R.accuseFrozen = null; closeSheet(); renderCase(); } });
function doMark(k, ev) {
  const r = mark(k, ev); sel = null;
  if (r === 'lie') { A.ok(); renderCase(); const row = document.querySelector(`.msg[data-k="${k}"]`); if (row) { row.classList.add('just'); setTimeout(() => row.classList.remove('just'), 900); } if (allLiesFound() && coach < 0) setTimeout(() => toast(tr('accuse') + ' →'), 600); }
  else if (r === 'strike') {
    /* one neutral line for every wrong pick, whichever half was wrong:
       the player must not learn whether the message or the fact failed. */
    A.bad(); toast(tr('notLie'), 'bad'); renderCase();
    const row = document.querySelector(`.msg[data-k="${k}"]`); if (row) row.classList.add('wrong');
    /* the failed screen used to wait 700 ms; the only timer on this path,
       and the wait read as the game hanging. 300 ms still lets the shake
       and the toast register before the screen swaps. */
    if (R.state === 'failed') setTimeout(showFailed, 300);
  }
}
/* picking a suspect used to accuse on the spot — the tap that chose the
   name was also the verdict, and the detective's "It was you" line with
   its 🔎 avatar read as the confirm button. Now choosing a suspect opens
   a confirmation step with an explicit button, so the choice and the
   verdict are two separate taps. */
function openAccuseSheet() {
  const card = $('sheetCard'); card.innerHTML = ''; card.appendChild(el('h3', null, tr('accuseWho')));
  for (const [id, name, role] of R.c.suspects) {
    const p = el('button', 'pick'); p.type = 'button';
    const av = face(el('div', 'av'), id);
    const info = el('div'); info.append(el('b', null, name), el('span', null, role)); p.append(av, info);
    p.onclick = () => { A.click(); openAccuseConfirm(id, name); };
    card.appendChild(p);
  }
  const no = el('button', 'btn ghost', tr('close')); no.onclick = () => { R.accuseFrozen = null; closeSheet(); }; card.appendChild(no);
  $('sheet').hidden = false;
}
function openAccuseConfirm(id, name) {
  const card = $('sheetCard'); card.innerHTML = '';
  card.append(el('h3', null, tr('accuseConfirm', name)), el('div', 'quote', tr('accuseConfirmSub')));
  const yes = el('button', 'btn primary', tr('confirmAccuse'));
  yes.onclick = () => { closeSheet(); const stars = accuse(id); if (stars) playOutro(id, stars); else { A.bad(); toast(tr('wrongAccuse'), 'bad'); renderMeters(); if (R.state === 'failed') setTimeout(showFailed, 300); } };
  const no = el('button', 'btn ghost', tr('back')); no.onclick = openAccuseSheet;
  card.append(yes, no); $('sheet').hidden = false;
}
$('btnAccuse').addEventListener('click', () => {
  if (!allLiesFound() || R.state !== 'play') return; A.click();
  /* the clock freezes at this tap — the decision to accuse. If the
     accusation is right, the result time is this moment; if it is wrong,
     accuse() drops the freeze and the clock runs on. */
  R.accuseFrozen = (Date.now() - R.t0) / 1000;
  openAccuseSheet();
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
  /* the culprit's last line in the outro is where they break */
  let i = 0, videoShown = false, breakAt = -1;
  lines.forEach((l, k) => { if (l.s === c.culprit) breakAt = k; });
  const step = () => {
    if (i >= lines.length) { setTimeout(() => showSolved(stars), 900); return; }
    const l = lines[i++], last = i === lines.length, confess = l.s === c.culprit && i >= lines.length - 1;
    /* the culprit's breaking line plays as a video first, when there is one */
    if (i - 1 === breakAt && !videoShown) { videoShown = true; const go = () => { i--; step(); }; playConfession(c, l.m).then(go); return; }
    const ty = add(l.s, '…', 'typing');
    setTimeout(() => { ty.remove(); add(l.s, l.m, l.s === c.culprit ? (confess ? 'confess' : 'accused') : ''); A.msg ? A.msg() : A.click(); if (last) A.win(); step(); }, window.__al && window.__al.fast ? 20 : 500 + Math.min(1500, l.m.length * 22));
  };
  setTimeout(step, window.__al && window.__al.fast ? 20 : 600);
}

/* The culprit confessing on camera, in the player's language. Resolves when
   the clip ends, is skipped, or fails to load — a missing or blocked video
   must never hold up the result. Plays with sound only when sound is on. */
function playConfession(c, line) {
  const langs = ART_OK && ART.v[c.id];
  if (!langs || !langs.includes(LANG) || (window.__al && window.__al.fast)) return Promise.resolve();
  return new Promise(res => {
    const wrap = el('div', 'confess-vid'), card = el('div', 'cv-card'), v = document.createElement('video');
    v.src = 'assets/v/' + c.id + '-' + LANG + '.mp4'; v.playsInline = true; v.preload = 'auto'; v.muted = !S.settings.sound;
    const poster = portraitSrc(c, c.culprit, 'confess'); if (poster) v.poster = poster;
    const name = el('div', 'cv-name', nameOf(c, c.culprit)), sub = el('div', 'cv-sub', (typeof CONFESS !== 'undefined' && CONFESS[LANG] && CONFESS[LANG][c.id]) || line), skip = el('button', 'btn ghost cv-skip', tr('skip'));
    card.append(v, name, sub, skip); wrap.appendChild(card); document.body.appendChild(wrap);
    let done = false;
    const end = () => { if (done) return; done = true; A.setMuted(!S.settings.sound); wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); res(); };
    skip.onclick = () => { A.click(); end(); };
    v.onended = end; v.onerror = end;
    setTimeout(end, 15000);
    A.setMuted(true);   /* the game's own sounds and music step aside for the voice */
    const p = v.play(); if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(end); });
  });
}

/* ---- results ---- */
function showSolved(stars) {
  A.win(); PORTAL.happy(); PORTAL.stop();
  $('result').classList.remove('failed');
  /* the one interstitial for a solved case: on entering the result screen.
     The Next button no longer shows one, so a solved case costs exactly one
     midgame slot at most (and the cap/cooldown in portal.js may skip it). */
  PORTAL.midgame();
  $('btnResResumeAd').hidden = true;
  if (coach >= 0) { S.coachDone = true; persist(); } coach = -1; $('coach').hidden = true;
  $('resBadge').textContent = tr('solved'); $('resTitle').textContent = R.c.title;
  const rf = $('resFace'); rf.hidden = false; rf.innerHTML = faceHTML(R.c, R.c.culprit, 'confess'); rf.dataset.stamp = tr('confessed'); $('resName').textContent = nameOf(R.c, R.c.culprit) + ' · ' + (R.c.suspects.find(s => s[0] === R.c.culprit) || [])[2];
  const st = $('resStars'); st.innerHTML = ''; for (let k = 0; k < 3; k++) st.appendChild(el('span', k < stars ? '' : 'off', '★'));
  $('resBody').textContent = R.c.solve;
  const meta = $('resMeta'); meta.innerHTML = '';
  meta.append(el('span', null, tr('time') + ' ' + fmtTime(R.time)), el('span', null, tr('strikes') + ' ' + R.strikes), el('span', null, tr('hint') + ' ' + R.hints));
  if (R.daily) meta.appendChild(el('span', null, tr('daily')));
  $('btnResShare').hidden = false; $('btnResRestart').hidden = true;
  const last = R.i >= CL.length - 1;
  $('btnResNext').textContent = R.daily ? tr('toList') : last ? tr('allDone') : tr('next');
  $('btnResNext').onclick = () => { A.click(); if (R.daily) renderList(); else if (last) { toast(tr('allDoneSub')); renderList(); } else beginCase(R.i + 1); };
  show('result');
}
function showFailed() {
  A.lose(); PORTAL.stop(); $('coach').hidden = true; closeSheet();
  /* the toast from the pick that failed the run (e.g. "nothing
     contradicts this") must not linger under the failure screen. */
  $('toasts').innerHTML = '';
  /* no culprit face on this screen, so drop the two-column result grid —
     with the face hidden the wide layout put the title in the empty right
     column and the text and buttons in the left one, scattered. */
  $('result').classList.add('failed');
  $('resBadge').textContent = tr('failed'); $('resTitle').textContent = R.c.title; $('resStars').innerHTML = ''; $('resFace').hidden = true; $('resName').textContent = ''; $('resBody').textContent = PORTAL.rewarded ? tr('failedSub') : tr('failedSubFree'); $('resMeta').innerHTML = ''; $('btnResShare').hidden = true;
  /* free resume: one interstitial (the failure slot), then back in at 1 strike.
     Ad resume: a rewarded ad instead of the interstitial, then back in at 0.
     Restart: the same interstitial slot as before. At most one ad per choice. */
  $('btnResNext').textContent = tr('resume'); $('btnResNext').onclick = () => { A.click(); PORTAL.midgame().then(() => { resumeCase(); renderCase(); show('case'); PORTAL.start(); }); };
  const ra = $('btnResResumeAd'); ra.hidden = !PORTAL.rewarded; ra.textContent = tr('resumeAd');
  ra.onclick = () => {
    A.click(); ra.disabled = true;
    PORTAL.reward().then(ok => {
      ra.disabled = false;
      if (!ok) { toast(tr('adFail'), 'bad'); return; }
      resumeCase(true); renderCase(); show('case'); PORTAL.start();
    });
  };
  const rs = $('btnResRestart'); rs.hidden = false; rs.textContent = tr('restart'); rs.onclick = () => { A.click(); const d = R.daily; PORTAL.midgame().then(() => beginCase(R.i, d)); };
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
/* undo one strike, once per case, only at 2 strikes. Rewarded builds pay
   with an ad; ad-free builds pay with one hint instead (no ad to watch),
   so the button is usable in every build. */
$('btnRecoverStrike').addEventListener('click', () => {
  if (!canRecoverStrike()) return;
  const b = $('btnRecoverStrike'); b.disabled = true;
  if (!PORTAL.rewarded) {
    if (recoverStrikeFree()) { A.ok(); toast(tr('recoverDoneFree'), 'ok'); renderMeters(); }
    else b.disabled = false;
    return;
  }
  PORTAL.reward().then(ok => {
    b.disabled = false;
    if (ok && recoverStrike()) { A.ok(); toast(tr('recoverDone', R.strikes), 'ok'); renderMeters(); }
    else toast(tr('adFail'), 'bad');
  });
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
addEventListener('keydown', e => { if (e.key === 'Escape') { closePhoto(); $('settings').hidden = true; if (!$('hintModal').hidden) closeHint(); if (R) R.accuseFrozen = null; closeSheet(); } });
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
  /* the rewarded flag is only known once the SDK answers; refresh the
     strike-recovery button in case a case is already on screen */
  if (screen === 'case' && R) renderMeters();
});
renderTitle();
window.__al = { fast: false, get S() { return S; }, get R() { return R; }, beginCase, renderList };

