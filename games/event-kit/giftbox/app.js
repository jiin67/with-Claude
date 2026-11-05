'use strict';
/* ==========================================================================
   랜덤 뽑기 상자
   상자를 하나 고르면 설정된 확률로 경품을 뽑고 쿠폰 번호를 만듭니다.
   어느 상자를 고르든 확률은 같습니다 (README 참고).
   ========================================================================== */
const C = window.EVENT_CONFIG, T = C.text;
const $ = id => document.getElementById(id);
const q = new URLSearchParams(location.search);
const PREVIEW = q.get('preview') === '1';
const KEY = 'giftbox.' + (C.couponPrefix || 'event');

/* ---- 색과 문구 ---- */
const root = document.documentElement.style;
root.setProperty('--primary', C.colors.primary); root.setProperty('--bg', C.colors.bg); root.setProperty('--ink', C.colors.ink);
document.title = C.brand + ' · ' + C.title;
if (C.logoUrl) { const img = new Image(); img.src = C.logoUrl; img.alt = C.brand; $('logo').appendChild(img); } else $('logo').textContent = C.logoText || C.brand;
$('brandName').textContent = C.brand;
$('title').textContent = C.title; $('subtitle').textContent = C.subtitle; $('hint').textContent = T.pick;
$('footer').textContent = C.footer || ''; $('couponLbl').textContent = T.coupon; $('timeLbl').textContent = T.time;
$('show').textContent = T.show; $('btnAgain').textContent = T.again;
if (PREVIEW) { $('previewTag').textContent = T.preview; $('previewTag').hidden = false; }

/* ---- 하루 참여 제한 (기기별, localStorage) ---- */
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s && s.date === today() ? s : { date: today(), plays: [] }; } catch (e) { return { date: today(), plays: [] }; } }
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
if (q.get('reset') === '1') { try { localStorage.removeItem(KEY); } catch (e) {} history.replaceState(null, '', location.pathname); }
let state = load();
const exhausted = () => !PREVIEW && C.limitPerDay > 0 && state.plays.length >= C.limitPerDay;

/* ---- 소리 (Web Audio, 파일 없음) ---- */
let muted = false;
try { muted = localStorage.getItem(KEY + '.mute') === '1'; } catch (e) {}
let ac = null;
function tone(f, d, type, v, slide) {
  if (muted) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d + .02);
  } catch (e) {}
}
const S = {
  tap: () => tone(700, .06, 'triangle', .15, .7),
  shake: () => { for (let i = 0; i < 4; i++) setTimeout(() => tone(220 + i * 40, .08, 'square', .05), i * 110); },
  pop: () => { tone(520, .12, 'sine', .25, 2.2); tone(1400, .25, 'triangle', .1); },
  win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .35, 'sine', .2), i * 110)),
  lose: () => tone(320, .5, 'sawtooth', .07, .5)
};
function drawMute() { $('btnMute').textContent = (muted ? '🔇' : '🔊'); $('btnMute').setAttribute('aria-pressed', String(muted)); $('btnMute').setAttribute('aria-label', T.mute); }
$('btnMute').onclick = () => { muted = !muted; try { localStorage.setItem(KEY + '.mute', muted ? '1' : '0'); } catch (e) {} drawMute(); };
drawMute();

/* ---- 상자 ---- */
function boxSVG(i) {
  const p = C.colors.primary;
  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    <circle class="glow" cx="50" cy="52" r="46" fill="${p}" opacity="0"/>
    <g class="burst" opacity="0"><g fill="#ffe27a">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="48" y="4" width="4" height="16" rx="2" transform="rotate(${a} 50 50)"/>`).join('')}</g></g>
    <rect x="18" y="44" width="64" height="46" rx="6" fill="${p}"/>
    <rect x="18" y="44" width="64" height="46" rx="6" fill="rgba(0,0,0,.18)"/>
    <rect x="44" y="44" width="12" height="46" fill="#ffe27a"/>
    <g class="lid">
      <rect x="12" y="30" width="76" height="18" rx="5" fill="${p}"/>
      <rect x="44" y="30" width="12" height="18" fill="#ffe27a"/>
      <path d="M50 30c-6-10-20-14-18-4s12 6 18 4zm0 0c6-10 20-14 18-4s-12 6-18 4z" fill="#ffd54a" stroke="#e4b32a" stroke-width="1.5"/>
    </g>
  </svg>`;
}
const grid = $('grid');
const n = Math.max(2, Math.min(12, C.boxes | 0 || 6));
grid.className = 'grid n' + n;
for (let i = 0; i < n; i++) {
  const b = document.createElement('button'); b.className = 'box'; b.type = 'button'; b.setAttribute('aria-label', (i + 1) + '번 상자');
  b.innerHTML = boxSVG(i); b.addEventListener('click', () => pick(b));
  grid.appendChild(b);
}

/* ---- 경품 뽑기와 쿠폰 번호 ---- */
function draw() {
  const total = C.prizes.reduce((s, p) => s + (p.weight > 0 ? p.weight : 0), 0);
  let r = Math.random() * total;
  for (const p of C.prizes) { r -= p.weight > 0 ? p.weight : 0; if (r < 0) return p; }
  return C.prizes[C.prizes.length - 1];
}
function couponCode() {
  const d = new Date(), mmdd = String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = '';          /* 헷갈리는 0/O/1/I 제외 */
  const buf = new Uint32Array(4); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(buf) : buf.forEach((_, i) => buf[i] = Math.random() * 1e9);
  for (let i = 0; i < 4; i++) s += alpha[buf[i] % alpha.length];
  return (C.couponPrefix || 'EVT') + '-' + mmdd + '-' + s;
}
const fmtTime = iso => { const d = new Date(iso); return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

let busy = false;
function pick(box) {
  if (busy || exhausted()) return;
  busy = true; S.tap();
  grid.classList.add('locked');
  for (const b of grid.children) if (b !== box) b.classList.add('dim');
  $('hint').textContent = T.opening;
  box.classList.add('shake'); S.shake();
  setTimeout(() => {
    box.classList.remove('shake'); box.classList.add('open'); S.pop();
    const prize = draw(), play = { label: prize.label, lose: !!prize.lose, code: prize.lose ? '' : couponCode(), at: new Date().toISOString() };
    state.plays.push(play); save(state);
    window.EVENT_REPORT && EVENT_REPORT({ prize: play.label, code: play.code, lose: play.lose });
    setTimeout(() => showResult(play, false), 550);
  }, 600);
}

function showResult(play, replay) {
  const res = $('result'), card = $('card');
  res.hidden = false; res.classList.toggle('done', replay); card.classList.toggle('lose', play.lose);
  $('kicker').textContent = replay ? T.done : play.lose ? T.lose : T.win;
  $('prize').textContent = play.label;
  $('couponBox').hidden = play.lose; $('coupon').textContent = play.code;
  $('time').textContent = fmtTime(play.at);
  $('show').hidden = play.lose;
  let note = res.querySelector('.done-note');
  if (replay) { if (!note) { note = document.createElement('p'); note.className = 'done-note'; res.insertBefore(note, card); } note.textContent = T.doneSub; }
  else if (note) note.remove();
  $('btnAgain').hidden = exhausted();
  $('hint').textContent = replay ? T.done : play.lose ? T.lose : T.win;
  if (!replay) { if (play.lose) S.lose(); else { S.win(); confetti(); } }
  if (replay) { grid.classList.add('locked'); for (const b of grid.children) b.classList.add('dim'); }
  setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
$('btnAgain').onclick = () => {
  if (exhausted()) return;
  busy = false; $('result').hidden = true; grid.classList.remove('locked');
  for (const b of grid.children) b.classList.remove('dim', 'open', 'shake');
  for (const b of grid.children) b.innerHTML = boxSVG(0);
  $('hint').textContent = T.pick;
};

/* 이미 참여한 기기: 오늘 결과를 다시 보여 줌 */
if (exhausted()) showResult(state.plays[state.plays.length - 1], true);

/* ---- 색종이 ---- */
function confetti() {
  const cv = $('confetti'), ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.scale(dpr, dpr);
  const cols = [C.colors.primary, '#ffe27a', '#ff8fb1', '#7ef0c8', '#ffffff'], ps = [];
  for (let i = 0; i < 140; i++) ps.push({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .45, vx: (Math.random() - .5) * 900, vy: -Math.random() * 700 - 200, r: 4 + Math.random() * 5, c: cols[i % cols.length], a: Math.random() * 6, s: (Math.random() - .5) * 12 });
  let t0 = performance.now();
  const step = now => {
    const dt = Math.min(.03, (now - t0) / 1000); t0 = now;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    let alive = 0;
    for (const p of ps) {
      p.vy += 1400 * dt; p.vx *= .99; p.x += p.vx * dt; p.y += p.vy * dt; p.a += p.s * dt;
      if (p.y < innerHeight + 20) alive++;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
    }
    if (alive) requestAnimationFrame(step); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  };
  requestAnimationFrame(step);
}
