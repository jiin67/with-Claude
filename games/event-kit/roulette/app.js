'use strict';
/* 행운 룰렛. config.js의 설정만 읽어서 그립니다. */
const C = window.EVENT_CONFIG, T = C.text;
const $ = id => document.getElementById(id);
const q = new URLSearchParams(location.search);
const PALETTE = ['#ff6a3d', '#ffcf5a', '#3ddc97', '#5b8cff', '#c66bff', '#ff4d6d', '#2ec4b6', '#f49ac1'];
const prizes = C.prizes.slice(0, 8).map((p, i) => ({ ...p, color: p.color || PALETTE[i % PALETTE.length] }));
const KEY = 'event.roulette.' + (C.couponPrefix || 'x');
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

/* ---- 설정을 화면에 적용 ---- */
document.documentElement.style.setProperty('--primary', C.colors.primary);
document.documentElement.style.setProperty('--bg', C.colors.bg);
document.documentElement.style.setProperty('--ink', C.colors.ink);
document.title = C.brand + ' · ' + C.title;
if (C.logoUrl) { const img = new Image(); img.src = C.logoUrl; img.alt = C.brand; $('logo').classList.add('img'); $('logo').appendChild(img); } else $('logo').textContent = C.logoText || C.brand;
$('brandName').textContent = C.brand; $('title').textContent = C.title; $('subtitle').textContent = C.subtitle;
$('footer').textContent = C.footer || ''; $('btnSpin').textContent = T.spin; $('btnClose').textContent = T.close;
$('resShow').textContent = T.show; $('doneTitle').textContent = T.done; $('doneSub').textContent = T.doneSub;

/* ---- 하루 참여 횟수 ---- */
function loadLog() { try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); return s.day === todayKey() ? s : { day: todayKey(), plays: [] }; } catch (e) { return { day: todayKey(), plays: [] }; } }
function saveLog(l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} }
if (q.get('reset') === '1') { try { localStorage.removeItem(KEY); } catch (e) {} }
const preview = q.get('preview') === '1';
let log = loadLog();
const exhausted = () => !preview && C.limitPerDay > 0 && log.plays.length >= C.limitPerDay;

/* ---- 룰렛 그리기 ---- */
const cv = $('wheel'), ctx = cv.getContext('2d');
const total = prizes.reduce((s, p) => s + p.weight, 0);
const n = prizes.length, SEG = Math.PI * 2 / n;    /* 칸 크기는 같고, 확률은 weight로만 정합니다 */
let angle = 0;
function draw() {
  const r = cv.width / 2;
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.save(); ctx.translate(r, r); ctx.rotate(angle);
  prizes.forEach((p, i) => {
    const a0 = -Math.PI / 2 + i * SEG, a1 = a0 + SEG;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, a0, a1); ctx.closePath();
    ctx.fillStyle = p.color; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3; ctx.stroke();
    /* 글자: 칸 가운데 선을 따라. 왼쪽 반원은 뒤집어 그려서 늘 바로 읽히게 */
    const mid = a0 + SEG / 2, left = Math.cos(mid + angle) < 0;
    ctx.save(); ctx.rotate(left ? mid + Math.PI : mid);
    ctx.textAlign = left ? 'left' : 'right'; ctx.textBaseline = 'middle';
    ctx.fillStyle = luma(p.color) > .6 ? '#1a1a1a' : '#fff';
    const size = n > 6 ? 24 : 28; ctx.font = `800 ${size}px system-ui, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
    ctx.fillText(fit(p.label, r * .66, size), left ? -r * .92 : r * .92, 0);
    ctx.restore();
  });
  ctx.restore();
}
function luma(hex) { const c = hex.replace('#', ''); const v = c.length === 3 ? c.split('').map(x => parseInt(x + x, 16)) : [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16)); return (v[0] * .299 + v[1] * .587 + v[2] * .114) / 255; }
function fit(text, maxW, size) { ctx.font = `800 ${size}px system-ui, sans-serif`; let t = text; while (t.length > 1 && ctx.measureText(t).width > maxW) t = t.slice(0, -1); return t === text ? t : t.slice(0, -1) + '…'; }
draw();

/* ---- 추첨 ---- */
function pick() { let r = Math.random() * total; for (let i = 0; i < n; i++) { r -= prizes[i].weight; if (r <= 0) return i; } return n - 1; }
function couponCode() {
  const d = new Date(), chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = ''; for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return (C.couponPrefix || 'EV') + '-' + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + s;
}
const fmtTime = d => new Date(d).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });

/* ---- 소리 ---- */
const A = { c: null, on: true,
  init() { if (this.c) return; try { this.c = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} },
  tick(f = 1800, v = .06) { if (!this.c || !this.on) return; const t = this.c.currentTime, o = this.c.createOscillator(), g = this.c.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + .04); o.connect(g); g.connect(this.c.destination); o.start(t); o.stop(t + .05); },
  win() { [523, 659, 784, 1046].forEach((f, i) => { if (!this.c || !this.on) return; const t = this.c.currentTime + i * .1, o = this.c.createOscillator(), g = this.c.createGain(); o.frequency.value = f; g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.0001, t + .35); o.connect(g); g.connect(this.c.destination); o.start(t); o.stop(t + .4); }); }
};
$('btnSound').addEventListener('click', () => { A.on = !A.on; $('btnSound').setAttribute('aria-pressed', String(A.on)); $('btnSound').textContent = A.on ? '🔊' : '🔇'; });

/* ---- 돌리기: 당첨 칸이 정확히 포인터(위쪽) 아래에 멈추도록 목표 각도를 계산 ---- */
let spinning = false;
function spin() {
  if (spinning || exhausted()) return;
  A.init(); spinning = true; $('btnSpin').disabled = true; $('btnSpin').textContent = T.spinning;
  const win = pick();
  const center = win * SEG + SEG / 2;                                   /* 칸 중심의 각도(회전 0일 때, 위쪽 기준) */
  const jitter = (Math.random() - .5) * SEG * .6;                       /* 칸 안에서 조금 다른 위치에 멈춤 */
  const target = Math.PI * 2 * (5 + Math.floor(Math.random() * 2)) - center + jitter;
  const start = angle % (Math.PI * 2), dur = 4200 + Math.random() * 1200, t0 = performance.now();
  let lastSeg = -1;
  const frame = now => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    angle = start + (target - start) * e; draw();
    const seg = Math.floor(((-angle % (Math.PI * 2)) + Math.PI * 2) / SEG) % n;
    if (seg !== lastSeg) { lastSeg = seg; A.tick(1400 + 800 * (1 - p)); }
    if (p < 1) requestAnimationFrame(frame); else finish(win);
  };
  requestAnimationFrame(frame);
}
function finish(i) {
  spinning = false;
  const p = prizes[i], rec = { prize: p.label, miss: !!p.miss, code: couponCode(), at: Date.now() };
  log.plays.push(rec); saveLog(log);
  showResult(rec);
  if (!p.miss) { A.win(); confetti(); }
  $('btnSpin').textContent = T.spin;
  if (exhausted()) showDone(); else $('btnSpin').disabled = false;
}
function ticket(box, rec) {
  box.innerHTML = '';
  const add = (cls, t) => { const d = document.createElement('div'); d.className = cls; d.textContent = t; box.appendChild(d); };
  add('prize', rec.prize);
  if (!rec.miss) { add('k', T.coupon); add('code', rec.code); }
  add('time', T.at + ' ' + fmtTime(rec.at));
}
function showResult(rec) {
  $('resEyebrow').textContent = rec.miss ? T.missTitle : T.resultTitle; $('resPrize').textContent = rec.prize;
  ticket($('resTicket'), rec); $('resShow').hidden = rec.miss; $('result').hidden = false;
}
function showDone() {
  const last = log.plays[log.plays.length - 1];
  $('btnSpin').disabled = true; $('btnSpin').textContent = T.done;
  if (last) ticket($('doneTicket'), last);
  $('done').hidden = false;
}
$('btnSpin').addEventListener('click', spin);
$('btnClose').addEventListener('click', () => { $('result').hidden = true; });
$('result').addEventListener('click', e => { if (e.target === $('result')) $('result').hidden = true; });
if (exhausted()) showDone();

/* ---- 색종이 ---- */
function confetti() {
  const c = $('confetti'), x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const parts = Array.from({ length: 140 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, r: 4 + Math.random() * 6, a: Math.random() * Math.PI, va: (Math.random() - .5) * .3, col: PALETTE[Math.floor(Math.random() * PALETTE.length)] }));
  const t0 = performance.now();
  const frame = now => {
    x.clearRect(0, 0, c.width, c.height);
    for (const p of parts) { p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.col; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); }
    if (now - t0 < 2600) requestAnimationFrame(frame); else x.clearRect(0, 0, c.width, c.height);
  };
  requestAnimationFrame(frame);
}
