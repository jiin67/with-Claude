'use strict';
/* ==========================================================================
   즉석 복권. 설정은 config.js에서 읽습니다.
   당첨 결과는 카드를 만들 때 정해지고 저장되므로 새로고침해도 바뀌지 않습니다.
   ========================================================================== */
const CFG = window.EVENT_CONFIG;
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const KEY = 'scratch.' + (CFG.couponPrefix || 'EVENT');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

/* ---- storage: { day, plays: [ { prize, code, at, done } ] } ---- */
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.day === today()) return s; } catch (e) {} return { day: today(), plays: [] }; }
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
if (params.get('reset') === '1') { try { localStorage.removeItem(KEY); } catch (e) {} }
const preview = params.get('preview') === '1';
let state = load();

/* ---- prize: weighted random, decided before any scratching ---- */
function pickPrize() {
  const total = CFG.prizes.reduce((a, p) => a + (p.weight || 0), 0);
  let r = Math.random() * total;
  for (const p of CFG.prizes) { r -= p.weight || 0; if (r < 0) return p; }
  return CFG.prizes[CFG.prizes.length - 1];
}
function makeCode() {
  const d = new Date(), mmdd = String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = '';
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return (CFG.couponPrefix || 'EVENT') + '-' + mmdd + '-' + s;
}
function fmtTime(ts) { const d = new Date(ts); return d.getMonth() + 1 + '월 ' + d.getDate() + '일 ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }

/* the current play: resume an unfinished one, or start a new one if allowed */
let play = state.plays.find(p => !p.done) || null;
const exhausted = !preview && !play && state.plays.length >= (CFG.limitPerDay || 1);
if (!play && !exhausted) {
  const p = pickPrize();
  play = { prize: p.label, lose: !!p.lose, code: p.lose ? '' : makeCode(), at: Date.now(), done: false };
  if (!preview) { state.plays.push(play); save(state); }
}

/* ---- apply config to the page ---- */
const T = CFG.text || {};
document.title = CFG.brand + ' · ' + CFG.title;
for (const [k, v] of Object.entries(CFG.colors || {})) document.documentElement.style.setProperty('--' + k, v);
const logo = $('logo');
if (CFG.logoUrl) { const img = document.createElement('img'); img.src = CFG.logoUrl; img.alt = CFG.brand; logo.appendChild(img); logo.style.background = 'transparent'; }
else logo.textContent = CFG.logoText || CFG.brand;
$('brandName').textContent = CFG.brand; $('title').textContent = CFG.title; $('subtitle').textContent = CFG.subtitle;
$('hint').textContent = T.hint || ''; $('footer').textContent = CFG.footer || '';
$('codeLbl').textContent = T.code || ''; $('show').textContent = T.show || ''; $('timeLbl').textContent = T.time || '';
$('btnMute').textContent = T.mute || '♪';

/* ---- sound: a filtered noise burst while scratching ---- */
const A = {
  c: null, g: null, muted: false, src: null,
  init() { if (this.c) return; try { const X = window.AudioContext || window.webkitAudioContext; if (!X) return; this.c = new X(); const n = this.c.sampleRate * 2, buf = this.c.createBuffer(1, n, this.c.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; this.src = this.c.createBufferSource(); this.src.buffer = buf; this.src.loop = true; const f = this.c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = .8; this.g = this.c.createGain(); this.g.gain.value = 0; this.src.connect(f); f.connect(this.g); this.g.connect(this.c.destination); this.src.start(); } catch (e) { this.c = null; } },
  on() { if (this.c && !this.muted) { if (this.c.state === 'suspended') this.c.resume(); this.g.gain.setTargetAtTime(.12, this.c.currentTime, .02); } },
  off() { if (this.c) this.g.gain.setTargetAtTime(0, this.c.currentTime, .05); },
  ding() { if (!this.c || this.muted) return; [880, 1175, 1568].forEach((fr, i) => { const o = this.c.createOscillator(), g = this.c.createGain(), t = this.c.currentTime + i * .09; o.frequency.value = fr; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.18, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .5); o.connect(g); g.connect(this.c.destination); o.start(t); o.stop(t + .55); }); }
};
$('btnMute').addEventListener('click', () => { A.init(); A.muted = !A.muted; if (A.muted) A.off(); $('btnMute').setAttribute('aria-pressed', String(A.muted)); });

/* ---- the foil ---- */
const cv = $('foil'), ctx = cv.getContext('2d');
let W = 0, H = 0, DPR = 1, scratching = false, done = false, checkT = 0;
function paintFoil() {
  const r = cv.getBoundingClientRect(); DPR = Math.min(2, window.devicePixelRatio || 1);
  W = Math.round(r.width); H = Math.round(r.height); cv.width = W * DPR; cv.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const foil = (CFG.colors && CFG.colors.foil) || '#b8bcc8';
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, foil); g.addColorStop(.45, '#ffffff'); g.addColorStop(.55, foil); g.addColorStop(1, '#8e93a3');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  /* fine grain so it reads as metal, not flat grey */
  ctx.globalAlpha = .18;
  for (let i = 0; i < W * H / 60; i++) { ctx.fillStyle = Math.random() < .5 ? '#000' : '#fff'; ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5); }
  ctx.globalAlpha = .12; ctx.fillStyle = '#000';
  for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 1);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'destination-out';
}
function pos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
let lastP = null;
function scratchTo(x, y) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 44;
  ctx.beginPath();
  if (lastP) { ctx.moveTo(lastP[0], lastP[1]); ctx.lineTo(x, y); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
  lastP = [x, y];
}
/* share of the foil cleared, sampled on a 12px grid */
function cleared() {
  const step = 12 * DPR, data = ctx.getImageData(0, 0, cv.width, cv.height).data;
  let n = 0, off = 0;
  for (let y = 0; y < cv.height; y += step) for (let x = 0; x < cv.width; x += step) { n++; if (data[(y * cv.width + x) * 4 + 3] < 40) off++; }
  return n ? off / n : 0;
}
function revealAll() {
  if (done) return; done = true; lastP = null; A.off();
  cv.classList.add('fade'); $('hint').classList.add('off');
  if (play && !play.done) { play.done = true; if (!preview) save(state); }
  setTimeout(showResult, 450);
}
cv.addEventListener('pointerdown', e => { if (done) return; A.init(); scratching = true; lastP = null; $('hint').classList.add('off'); const [x, y] = pos(e); scratchTo(x, y); A.on(); try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
cv.addEventListener('pointermove', e => { if (!scratching || done) return; const [x, y] = pos(e); scratchTo(x, y); const now = performance.now(); if (now - checkT > 120) { checkT = now; if (cleared() * 100 >= (CFG.revealPercent || 55)) revealAll(); } });
const stop = () => { scratching = false; lastP = null; A.off(); if (!done && cleared() * 100 >= (CFG.revealPercent || 55)) revealAll(); };
cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop); cv.addEventListener('pointerleave', () => { if (scratching) stop(); });

/* ---- result ---- */
function showResult() {
  const p = play || state.plays[state.plays.length - 1];
  $('result').hidden = false;
  $('codeBox').hidden = !p || p.lose;
  if (p && !p.lose) $('code').textContent = p.code;
  $('time').textContent = p ? fmtTime(p.at) : '';
  $('show').hidden = !p || p.lose;
  if (p && !p.lose) { A.ding(); confetti(); }
}
function fillPrize(p) {
  $('card').classList.toggle('lose', !!p.lose);
  $('prizeKind').textContent = p.lose ? (T.lose || '') : (T.win || '');
  $('prizeLabel').textContent = p.prize;
}

/* ---- confetti ---- */
function confetti() {
  const c = $('confetti'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const colors = [CFG.colors.primary, '#ffd166', '#ff6a3d', '#5b8cff', '#ffffff'];
  const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: 4 + Math.random() * 5, c: colors[Math.floor(Math.random() * colors.length)], a: Math.random() * Math.PI, s: (Math.random() - .5) * .3 }));
  let t = 0;
  (function frame() {
    x.clearRect(0, 0, c.width, c.height); t++;
    for (const p of ps) { p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.a += p.s; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.globalAlpha = Math.max(0, 1 - t / 110); x.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); x.restore(); }
    if (t < 120) requestAnimationFrame(frame); else x.clearRect(0, 0, c.width, c.height);
  })();
}

/* ---- start ---- */
if (exhausted) {
  /* already played today: show the last result, no foil */
  const last = state.plays[state.plays.length - 1];
  fillPrize({ prize: last.prize, lose: last.lose });
  cv.remove(); $('hint').remove(); done = true;
  $('limitBox').hidden = false; $('limitTitle').textContent = T.limit || ''; $('limitSub').textContent = T.limitSub || '';
  play = last; showResult();
} else {
  fillPrize(play);
  paintFoil();
  addEventListener('resize', () => { if (!done) paintFoil(); });   /* a rotated phone gets a fresh foil; the prize underneath is unchanged */
}

/* test hook */
window.__scratch = { revealAll, cleared, get play() { return play; }, get state() { return state; } };
