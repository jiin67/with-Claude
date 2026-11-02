'use strict';
/* ==========================================================================
   The shell: title, lock screen, desktop with windows and dock, chapter
   cards, hints, settings, ending, sounds and the clock.
   ========================================================================== */
const $ = id => document.getElementById(id);
const isPhone = () => matchMedia('(max-width:720px)').matches;

/* ---- tiny synthesized sounds ---- */
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
  click() { this.tone(900, .04, 'triangle', .12); },
  key() { this.tone(1200, .05, 'sine', .12, .7); },
  ok() { this.tone(660, .12, 'sine', .25); this.tone(990, .18, 'sine', .22, 1, .09); },
  bad() { this.tone(200, .14, 'square', .08, .7); },
  msg() { this.tone(1046, .09, 'sine', .18); this.tone(1318, .12, 'sine', .15, 1, .08); },
  chapter() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, .3, 'sine', .18, 1, i * .11)); }
};
function applySettings() { A.setMuted(!S.settings.sound); }

/* ---- toasts ---- */
function toast(kind, text) {
  const t = el('div', 'toast'); if (kind) t.appendChild(el('b', null, kind)); t.append(text);
  const box = $('toasts'); box.appendChild(t); while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => t.remove(), 3600);
}

/* ---- screens ---- */
const SCREENS = ['title', 'lock', 'desktop', 'ending'];
let screen = 'title';
function show(id) { screen = id; for (const s of SCREENS) $(s).hidden = s !== id; }

/* ---- title ---- */
function renderTitle() {
  $('titleSub').textContent = C.device + ' · ' + C.dateLine;
  $('btnResume').hidden = !S.started || S.done;
  $('btnStart').textContent = S.started && !S.done ? tr('restart') : tr('start');
  show('title');
}
function startGame(fresh) {
  A.init();
  if (fresh) { const st = S.settings; S = freshSave(); S.settings = st; S.started = true; persist(); }
  S.started = true; persist();
  if (S.unlocked) enterDesktop(); else enterLock();
  PORTAL.start();
}

/* ---- lock screen ---- */
let pin = '';
function enterLock() {
  $('lockDate').textContent = C.dateLine; $('lockOwner').textContent = C.owner; $('stickyNote').textContent = C.lockNote;
  $('wTitle').textContent = C.lockWidget.title;
  const wi = $('wItems'); wi.innerHTML = '';
  for (const [d, t] of C.lockWidget.items) { const r = el('div', 'w-item'); r.append(el('b', null, d), el('span', null, t)); wi.appendChild(r); }
  const wn = $('wNotifs'); wn.innerHTML = '';
  for (const [from, t] of C.lockNotifs) { const n = el('div', 'n'); n.append(el('b', null, from), el('span', null, t)); wn.appendChild(n); }
  const kp = $('keypad'); kp.innerHTML = '';
  for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']) {
    const b = el('button', k === '⌫' ? 'sub' : '', k); b.type = 'button'; if (!k) b.style.visibility = 'hidden';
    b.onclick = () => { A.init(); if (k === '⌫') pin = pin.slice(0, -1); else if (pin.length < 4) pin += k; A.key(); drawPin(); if (pin.length === 4) checkPin(); };
    kp.appendChild(b);
  }
  pin = ''; drawPin(); $('pinMsg').textContent = '';
  show('lock');
}
function drawPin() { [...$('pinDots').children].forEach((d, i) => d.classList.toggle('on', i < pin.length)); }
function checkPin() {
  if (tryPin(pin)) { A.ok(); $('pinMsg').style.color = 'var(--ok)'; $('pinMsg').textContent = C.unlocked; setTimeout(() => { enterDesktop(); checkChapter(); }, 500); }
  else { A.bad(); const d = $('pinDots'); d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); $('pinMsg').style.color = ''; $('pinMsg').textContent = C.wrongPin; setTimeout(() => { pin = ''; drawPin(); }, 350); }
}
addEventListener('keydown', e => {
  if (screen !== 'lock' || !$('hintModal').hidden || !$('settings').hidden) return;
  if (/^[0-9]$/.test(e.key) && pin.length < 4) { A.init(); pin += e.key; A.key(); drawPin(); if (pin.length === 4) checkPin(); }
  else if (e.key === 'Backspace') { pin = pin.slice(0, -1); drawPin(); }
});

/* ---- desktop: windows ---- */
const WIN = {};
let zTop = 10, cascade = 0;
const SIZES = { notes: [640, 420], mail: [680, 440], photos: [620, 460], music: [520, 480], trash: [600, 380], vault: [520, 470], terminal: [660, 440], messages: [440, 520] };
function enterDesktop() {
  $('mbDevice').textContent = C.device;
  dockRefresh(); updateChapterLabel();
  show('desktop');
}
function updateChapterLabel() { $('mbChapter').textContent = tr('chapter', Math.min(4, S.chapter + 1)) + ' · ' + C.chapters[Math.min(3, S.chapter)]; }
function dockRefresh() {
  const dock = $('dock'); dock.innerHTML = '';
  for (const id of dockApps()) {
    const b = el('button', 'dock-app'); b.type = 'button'; b.innerHTML = ICONS[id]; b.setAttribute('aria-label', C.apps[id]);
    b.appendChild(el('span', 'lbl', C.apps[id]));
    if (WIN[id]) b.appendChild(el('i', 'dot'));
    if (id === 'messages' && !S.msgLog.length) b.appendChild(el('span', 'badge', '1'));
    b.onclick = () => { A.init(); A.click(); openApp(id); };
    dock.appendChild(b);
  }
}
function openApp(id) {
  if (WIN[id]) { front(id); return; }
  if (isPhone()) for (const k in WIN) closeApp(k);      /* one app at a time on a phone */
  const w = el('div', 'win'), bar = el('div', 'win-bar'), lights = el('div', 'lights'), body = el('div', 'win-body');
  const back = el('button', 'back', '‹ ' + tr('back')); back.type = 'button'; back.onclick = () => closeApp(id);
  const c = el('i', 'c'); c.onclick = () => closeApp(id);
  lights.append(c, el('i', 'm'), el('i', 'z'));
  bar.append(lights, back, el('b', null, C.apps[id])); w.append(bar, body);
  const [ww, hh] = SIZES[id], area = $('windows').getBoundingClientRect();
  const x = Math.max(8, Math.min(area.width - ww - 8, 40 + (cascade % 6) * 36)), y = Math.max(8, Math.min(area.height - hh - 80, 24 + (cascade % 6) * 28));
  cascade++;
  w.style.left = x + 'px'; w.style.top = y + 'px'; w.style.width = Math.min(ww, area.width - 16) + 'px'; w.style.height = Math.min(hh, area.height - 90) + 'px';
  $('windows').appendChild(w);
  WIN[id] = { el: w, body };
  APPS[id](body);
  front(id); drag(w, bar); dockRefresh();
  if (id === 'messages') { S.read.messagesOpened = true; }
}
function closeApp(id) { const w = WIN[id]; if (!w) return; w.el.remove(); delete WIN[id]; A.click(); dockRefresh(); }
function front(id) { for (const k in WIN) WIN[k].el.classList.remove('front'); WIN[id].el.classList.add('front'); WIN[id].el.style.zIndex = ++zTop; }
function drag(w, bar) {
  let sx, sy, ox, oy, on = false;
  bar.addEventListener('pointerdown', e => { if (isPhone() || e.target.closest('button, i')) return; on = true; sx = e.clientX; sy = e.clientY; ox = w.offsetLeft; oy = w.offsetTop; bar.setPointerCapture(e.pointerId); for (const k in WIN) if (WIN[k].el === w) front(k); });
  bar.addEventListener('pointermove', e => { if (!on) return; const area = $('windows').getBoundingClientRect(); w.style.left = Math.max(-w.offsetWidth + 80, Math.min(area.width - 80, ox + e.clientX - sx)) + 'px'; w.style.top = Math.max(0, Math.min(area.height - 40, oy + e.clientY - sy)) + 'px'; });
  const up = () => { on = false; }; bar.addEventListener('pointerup', up); bar.addEventListener('pointercancel', up);
}
function frontApp() { let best = null, z = -1; for (const k in WIN) { const zz = +WIN[k].el.style.zIndex || 0; if (zz > z) { z = zz; best = k; } } return best; }

/* ---- chapters ---- */
function checkChapter() {
  const shown = S.cardShown || 0;
  if (S.chapter <= shown || S.chapter >= 4) return;
  const n = S.chapter; S.cardShown = n; persist();
  updateChapterLabel();
  $('chEyebrow').textContent = tr('chapterDone', n); $('chTitle').textContent = C.chapters[n - 1];
  $('chBody').textContent = (LANG === 'ko' ? '다음: ' : 'Next: ') + C.chapters[n];
  A.chapter(); $('chapterCard').hidden = false; PORTAL.stop();
}
$('btnChapterNext').addEventListener('click', () => {
  $('chapterCard').hidden = true;
  const after = () => { PORTAL.start(); if (screen !== 'desktop') enterDesktop(); };
  if (S.chapter >= 2) PORTAL.midgame().then(after); else after();
});

/* ---- hints ---- */
let hintKey = null;
function openHint() {
  A.init();
  hintKey = currentHintKey(screen === 'lock' ? null : frontApp());
  const list = hintKey && C.hints[hintKey];
  if (!list) { $('hintText').textContent = tr('hintNone'); $('hintCount').textContent = ''; $('btnHintMore').hidden = true; $('hintModal').hidden = false; return; }
  if (!hintLevel(hintKey)) takeHint(hintKey);          /* the first hint is always free */
  drawHint();
  $('hintModal').hidden = false; PORTAL.stop();
}
function drawHint() {
  const list = C.hints[hintKey], l = hintLevel(hintKey);
  $('hintText').textContent = list[l - 1]; $('hintCount').textContent = tr('hintUsed', l, list.length);
  const more = $('btnHintMore'); more.hidden = false; more.disabled = l >= list.length;
  more.textContent = PORTAL.rewarded ? tr('hintAd') : tr('hintFree');
}
$('btnHintMore').addEventListener('click', () => {
  const b = $('btnHintMore'); if (b.disabled) return;
  if (!PORTAL.rewarded) { takeHint(hintKey); drawHint(); return; }
  b.disabled = true;
  PORTAL.reward().then(ok => { if (ok) takeHint(hintKey); else toast(tr('hint'), tr('adFail')); drawHint(); });
});
const closeHint = () => { $('hintModal').hidden = true; if (screen !== 'ending') PORTAL.start(); };
$('btnHintClose').addEventListener('click', closeHint);
$('hintModal').addEventListener('click', e => { if (e.target === $('hintModal')) closeHint(); });
$('btnHint').addEventListener('click', openHint); $('hintLock').addEventListener('click', openHint);

/* ---- ending ---- */
function showEnding() {
  const E = C.ending;
  $('endSub').textContent = E.sub; $('endTitle').textContent = E.title; $('endBody').textContent = E.body;
  const st = $('endStats'); st.innerHTML = '';
  [[E.stats.time, fmtTime(S.playT)], [E.stats.hints, String(S.hintsUsed)], [E.stats.wrong, String(S.wrong)]].forEach(([k, v]) => { const d = el('div'); d.append(el('span', null, k), el('b', null, v)); st.appendChild(d); });
  $('btnAgain').textContent = E.again; $('btnShare').textContent = E.share;
  for (const k in WIN) closeApp(k);
  A.chapter(); PORTAL.happy(); PORTAL.stop(); persist();
  show('ending');
}
$('btnAgain').addEventListener('click', () => { startGame(true); });
$('btnShare').addEventListener('click', () => {
  const t = tr('result', fmtTime(S.playT), S.hintsUsed, S.wrong);
  try { navigator.clipboard.writeText(t).then(() => toast('', tr('copied'))); } catch (e) { toast('', t); }
});

/* ---- settings ---- */
function openSettings() { A.init(); $('optSound').checked = S.settings.sound; $('optLang').value = LANG; $('btnResetConfirm').hidden = true; $('settings').hidden = false; }
$('btnTitleSettings').addEventListener('click', openSettings); $('btnDeskSettings').addEventListener('click', openSettings);
$('btnSettingsClose').addEventListener('click', () => { $('settings').hidden = true; });
$('settings').addEventListener('click', e => { if (e.target === $('settings')) $('settings').hidden = true; });
$('optSound').addEventListener('change', e => { S.settings.sound = e.target.checked; applySettings(); persist(); });
$('optLang').addEventListener('change', e => { persist(); setLang(e.target.value); });
$('btnReset').addEventListener('click', () => { $('btnResetConfirm').hidden = false; });
$('btnResetConfirm').addEventListener('click', () => { const st = S.settings; S = freshSave(); S.settings = st; persist(); for (const k in WIN) closeApp(k); $('settings').hidden = true; renderTitle(); });
addEventListener('keydown', e => { if (e.key === 'Escape') { $('settings').hidden = true; if (!$('hintModal').hidden) closeHint(); } });

/* ---- title buttons ---- */
$('btnStart').addEventListener('click', () => startGame(S.started && !S.done));
$('btnResume').addEventListener('click', () => startGame(false));

/* ---- clock and play time ---- */
let last = performance.now(), saveT = 10;
function tick() {
  const now = performance.now(), dt = Math.min(1, (now - last) / 1000); last = now;
  const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
  $('lockClock').textContent = hh + ':' + mm; $('mbClock').textContent = hh + ':' + mm;
  if ((screen === 'lock' || screen === 'desktop') && !document.hidden && !S.done) { S.playT += dt; if ((saveT -= dt) <= 0) { saveT = 10; persist(); } }
}
setInterval(tick, 1000);
document.addEventListener('visibilitychange', () => { if (document.hidden) { persist(); PORTAL.stop(); } else if (screen === 'lock' || screen === 'desktop') PORTAL.start(); });
addEventListener('pagehide', persist);
addEventListener('resize', () => { if (isPhone()) return; for (const k in WIN) { const w = WIN[k].el, area = $('windows').getBoundingClientRect(); w.style.left = Math.max(0, Math.min(area.width - 80, w.offsetLeft)) + 'px'; } });

/* ---- start ---- */
function applyStaticText() {
  document.title = tr('title');
  for (const e of document.querySelectorAll('[data-i18n]')) e.textContent = tr(e.dataset.i18n);
}
applyStaticText(); applySettings();
PORTAL.onAd = playing => { A.setMuted(playing || !S.settings.sound); };
PORTAL.ready.then(() => {
  if (PORTAL.store) {
    let raw = null; try { raw = PORTAL.store.getItem(SAVE_KEY); } catch (e) {}
    if (raw) { const s2 = loadSave(raw); if (s2.chapter > S.chapter || (s2.chapter === S.chapter && s2.playT > S.playT)) S = s2; }
    persist();
  }
  applySettings(); renderTitle(); PORTAL.loaded();
});
renderTitle();

/* test hook */
window.__ll = { get S() { return S; }, set: s => { S = s; persist(); }, openApp, closeApp, WIN, showEnding, enterDesktop };
