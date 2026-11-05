'use strict';
/* ==========================================================================
   사다리 타기
   아래쪽 경품은 카드를 만들 때 설정된 확률(weight)대로 먼저 정해지고,
   사다리는 그 뒤에 무작위로 그려집니다. 어느 출발점을 고르든 확률은 같습니다 (README 참고).
   ========================================================================== */
const C = window.EVENT_CONFIG, T = C.text;
const $ = id => document.getElementById(id);
const q = new URLSearchParams(location.search);
const PREVIEW = q.get('preview') === '1';
const KEY = 'ladder.' + (C.couponPrefix || 'event');
const LANES = Math.max(2, Math.min(10, C.lanes | 0 || 6));

/* ---- 색과 문구 ---- */
const root = document.documentElement.style;
root.setProperty('--primary', C.colors.primary); root.setProperty('--bg', C.colors.bg); root.setProperty('--ink', C.colors.ink); root.setProperty('--lanes', LANES);
document.title = C.brand + ' · ' + C.title;
if (C.logoUrl) { const img = new Image(); img.src = C.logoUrl; img.alt = C.brand; $('logo').appendChild(img); } else $('logo').textContent = C.logoText || C.brand;
$('brandName').textContent = C.brand;
$('title').textContent = C.title; $('subtitle').textContent = C.subtitle; $('hint').textContent = T.pick;
$('footer').textContent = C.footer || ''; $('couponLbl').textContent = T.coupon; $('timeLbl').textContent = T.time;
$('show').textContent = T.show; $('btnAgain').textContent = T.again;
if (PREVIEW) { $('previewTag').textContent = T.preview; $('previewTag').hidden = false; }

/* ---- 하루 참여 제한 (기기별, localStorage) ---- */
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s && s.date === today() ? s : { date: today(), plays: [], board: null }; } catch (e) { return { date: today(), plays: [], board: null }; } }
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
  tick: () => tone(1100, .05, 'square', .06, .8),
  land: () => { tone(520, .12, 'sine', .25, 2.2); tone(1400, .25, 'triangle', .1); },
  win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .35, 'sine', .2), i * 110)),
  lose: () => tone(320, .5, 'sawtooth', .07, .5)
};
function drawMute() { $('btnMute').textContent = (muted ? '🔇' : '🔊'); $('btnMute').setAttribute('aria-pressed', String(muted)); $('btnMute').setAttribute('aria-label', T.mute); }
$('btnMute').onclick = () => { muted = !muted; try { localStorage.setItem(KEY + '.mute', muted ? '1' : '0'); } catch (e) {} drawMute(); };
drawMute();

/* ---- 경품 배치와 사다리 생성 ----
   bottoms: 줄마다 어떤 경품이 깔리는지. 각 줄은 weight 비율로 독립 추첨하므로 결과 확률은 weight를 따릅니다.
   rungs: [row][gap] 불리언. 같은 row에서 이웃한 gap 둘이 동시에 true면 안 됩니다. */
function draw() {
  const total = C.prizes.reduce((s, p) => s + (p.weight > 0 ? p.weight : 0), 0);
  let r = Math.random() * total;
  for (const p of C.prizes) { r -= p.weight > 0 ? p.weight : 0; if (r < 0) return C.prizes.indexOf(p); }
  return C.prizes.length - 1;
}
function makeBoard() {
  const bottoms = []; for (let i = 0; i < LANES; i++) bottoms.push(draw());
  const rows = 10, gaps = LANES - 1, rungs = [];
  let count = 0;
  for (let r = 0; r < rows; r++) {
    const row = new Array(gaps).fill(false);
    for (let g = 0; g < gaps; g++) if (!row[g - 1] && Math.random() < .25) { row[g] = true; count++; }
    rungs.push(row);
  }
  /* 너무 심심하지 않게: 가로줄이 8개보다 적으면 빈 자리에 채워 넣음 */
  for (let tries = 0; count < 8 && tries < 200; tries++) {
    const r = (Math.random() * rows) | 0, g = (Math.random() * gaps) | 0;
    if (!rungs[r][g] && !rungs[r][g - 1] && !rungs[r][g + 1]) { rungs[r][g] = true; count++; }
  }
  /* 12개를 넘으면 무작위로 덜어냄 */
  for (let tries = 0; count > 12 && tries < 400; tries++) {
    const r = (Math.random() * rows) | 0, g = (Math.random() * gaps) | 0;
    if (rungs[r][g]) { rungs[r][g] = false; count--; }
  }
  return { bottoms, rungs, rows };
}
/* 출발 줄에서 내려가며 거치는 지점들 */
function tracePath(board, lane) {
  const pts = [{ row: -1, lane }];
  let l = lane;
  for (let r = 0; r < board.rows; r++) {
    pts.push({ row: r, lane: l });
    if (board.rungs[r][l]) { l++; pts.push({ row: r, lane: l }); }
    else if (l > 0 && board.rungs[r][l - 1]) { l--; pts.push({ row: r, lane: l }); }
  }
  pts.push({ row: board.rows, lane: l });
  return { pts, end: l };
}

/* ---- 그리기 ---- */
const W = 320, PAD = 16, ROW_H = 30;
const svg = $('ladder');
let board = null;
const laneX = l => PAD + (W - PAD * 2) * (LANES === 1 ? .5 : l / (LANES - 1));
const rowY = r => 14 + (r + .5) * ROW_H;
function render() {
  const H = 14 + (board.rows + 1) * ROW_H;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  let s = '';
  for (let l = 0; l < LANES; l++) s += `<line class="rail" data-lane="${l}" x1="${laneX(l)}" y1="0" x2="${laneX(l)}" y2="${H}" stroke="var(--rail)" stroke-width="4" stroke-linecap="round"/>`;
  board.rungs.forEach((row, r) => row.forEach((on, g) => { if (on) s += `<line class="rung" x1="${laneX(g)}" y1="${rowY(r)}" x2="${laneX(g + 1)}" y2="${rowY(r)}" stroke="var(--rail)" stroke-width="4" stroke-linecap="round"/>`; }));
  s += `<path id="trail" d="" fill="none" stroke="${C.colors.primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
  s += `<circle id="marker" r="9" fill="${C.colors.primary}" stroke="#fff" stroke-width="3" opacity="0"/>`;
  svg.innerHTML = s;
  const st = $('starts'); st.innerHTML = '';
  for (let l = 0; l < LANES; l++) { const b = document.createElement('button'); b.type = 'button'; b.className = 'start'; b.textContent = (l + 1) + (T.start || ''); b.setAttribute('aria-label', (l + 1) + '번 출발'); b.addEventListener('click', () => pick(l)); st.appendChild(b); }
  const pr = $('prizes'); pr.innerHTML = '';
  for (let l = 0; l < LANES; l++) {
    const d = document.createElement('div'); d.className = 'prize-slot';
    const p = C.prizes[board.bottoms[l]]; if (p.lose) d.classList.add('lose');
    d.innerHTML = `<div class="face"><span class="q">?</span><span class="lbl"></span></div>`; d.querySelector('.lbl').textContent = p.label;
    pr.appendChild(d);
  }
}
const pt = p => ({ x: laneX(p.lane), y: p.row < 0 ? 0 : p.row >= board.rows ? 14 + (board.rows + 1) * ROW_H : rowY(p.row) });

/* ---- 쿠폰 번호 ---- */
function couponCode() {
  const d = new Date(), mmdd = String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = '';          /* 헷갈리는 0/O/1/I 제외 */
  const buf = new Uint32Array(4); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(buf) : buf.forEach((_, i) => buf[i] = Math.random() * 1e9);
  for (let i = 0; i < 4; i++) s += alpha[buf[i] % alpha.length];
  return (C.couponPrefix || 'EVT') + '-' + mmdd + '-' + s;
}
const fmtTime = iso => { const d = new Date(iso); return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

/* ---- 출발: 표시가 사다리를 따라 내려감 ---- */
let busy = false;
function pick(lane) {
  if (busy || exhausted()) return;
  busy = true; S.tap();
  const st = $('starts'); st.classList.add('locked'); st.children[lane].classList.add('on');
  $('hint').textContent = T.tracing;
  const { pts, end } = tracePath(board, lane);
  const segs = pts.map(pt), marker = $('marker'), trail = $('trail');
  const total = segs.reduce((s, p, i) => i ? s + Math.hypot(p.x - segs[i - 1].x, p.y - segs[i - 1].y) : 0, 0);
  const dur = Math.min(3200, Math.max(1800, total * 6));
  marker.setAttribute('opacity', '1');
  let t0 = null, lastSeg = -1;
  const ease = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  const step = now => {
    if (t0 === null) t0 = now;
    const u = Math.min(1, (now - t0) / dur), dist = ease(u) * total;
    let acc = 0, d = '', x = segs[0].x, y = segs[0].y, seg = 0;
    for (let i = 1; i < segs.length; i++) {
      const len = Math.hypot(segs[i].x - segs[i - 1].x, segs[i].y - segs[i - 1].y);
      if (acc + len >= dist) { const k = (dist - acc) / (len || 1); x = segs[i - 1].x + (segs[i].x - segs[i - 1].x) * k; y = segs[i - 1].y + (segs[i].y - segs[i - 1].y) * k; seg = i; break; }
      acc += len; x = segs[i].x; y = segs[i].y; seg = i;
    }
    d = `M${segs[0].x} ${segs[0].y}`; for (let i = 1; i < seg; i++) d += ` L${segs[i].x} ${segs[i].y}`; d += ` L${x} ${y}`;
    trail.setAttribute('d', d); marker.setAttribute('cx', x); marker.setAttribute('cy', y);
    if (seg !== lastSeg) { if (lastSeg >= 0 && segs[seg].y === segs[seg - 1].y) S.tick(); lastSeg = seg; }
    if (u < 1) requestAnimationFrame(step); else land(end);
  };
  requestAnimationFrame(step);
}
function land(end) {
  S.land();
  const prize = C.prizes[board.bottoms[end]];
  const play = { label: prize.label, lose: !!prize.lose, code: prize.lose ? '' : couponCode(), at: new Date().toISOString(), lane: end };
  state.plays.push(play); save(state);
  const slots = $('prizes').children;
  slots[end].classList.add('open', 'hit');
  setTimeout(() => { for (const s of slots) s.classList.add('open'); }, 700);
  setTimeout(() => showResult(play, false), 500);
  try { window.EVENT_REPORT && EVENT_REPORT({ prize: prize.label, code: play.code, lose: play.lose }); } catch (e) {}
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
  if (replay) {
    $('starts').classList.add('locked');
    const slots = $('prizes').children; for (const s of slots) s.classList.add('open');
    if (play.lane !== undefined && slots[play.lane]) slots[play.lane].classList.add('hit');
  }
  setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}
$('btnAgain').onclick = () => {
  if (exhausted()) return;
  busy = false; $('result').hidden = true; $('starts').classList.remove('locked');
  board = makeBoard(); state.board = board; save(state); render();
  $('hint').textContent = T.pick;
};

/* ---- 시작: 오늘 판이 있으면 그대로, 없으면 새 판 (새로고침해도 다시 뽑히지 않음) ---- */
board = state.board && state.board.bottoms && state.board.bottoms.length === LANES ? state.board : makeBoard();
if (board !== state.board) { state.board = board; save(state); }
render();
if (exhausted()) showResult(state.plays[state.plays.length - 1], true);
window.__ladder = { get board() { return board; }, trace: tracePath, lanes: LANES };

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
