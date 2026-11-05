'use strict';
/* ==========================================================================
   투표·설문 이벤트
   질문을 한 장씩 보여 주고, 다 답하면 참여 쿠폰을 발급합니다.
   서버가 없으므로 결과 그래프는 이 기기의 응답 + config.seedResults 입니다.
   ========================================================================== */
const C = window.EVENT_CONFIG, T = C.text;
const $ = id => document.getElementById(id);
const q = new URLSearchParams(location.search);
const PREVIEW = q.get('preview') === '1';
const KEY = 'vote.' + ((C.reward && C.reward.couponPrefix) || 'event');
const QS = (C.questions || []).slice(0, 3);

/* ---- 색과 문구 ---- */
const root = document.documentElement.style;
root.setProperty('--primary', C.colors.primary); root.setProperty('--bg', C.colors.bg); root.setProperty('--ink', C.colors.ink);
document.title = C.brand + ' · ' + C.title;
if (C.logoUrl) { const img = new Image(); img.src = C.logoUrl; img.alt = C.brand; $('logo').appendChild(img); } else $('logo').textContent = C.logoText || C.brand;
$('brandName').textContent = C.brand;
$('title').textContent = C.title; $('subtitle').textContent = C.subtitle;
$('footer').textContent = C.footer || '';
$('rewardLbl').textContent = T.rewardLbl; $('couponLbl').textContent = T.coupon; $('timeLbl').textContent = T.time;
$('show').textContent = T.show; $('chartTitle').textContent = T.results;
if (PREVIEW) { $('previewTag').textContent = T.preview; $('previewTag').hidden = false; }

/* ---- 하루 참여 제한 (기기별, localStorage) ---- */
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); return s && s.date === today() ? s : { date: today(), plays: [] }; } catch (e) { return { date: today(), plays: [] }; } }
function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
/* 이 기기에서 누적된 응답 (그래프용, 날짜와 무관) */
function loadTally() { try { return JSON.parse(localStorage.getItem(KEY + '.tally') || 'null') || {}; } catch (e) { return {}; } }
function saveTally(t) { try { localStorage.setItem(KEY + '.tally', JSON.stringify(t)); } catch (e) {} }
if (q.get('reset') === '1') { try { localStorage.removeItem(KEY); localStorage.removeItem(KEY + '.tally'); } catch (e) {} history.replaceState(null, '', location.pathname); }
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
  next: () => { tone(520, .08, 'triangle', .12); setTimeout(() => tone(780, .1, 'triangle', .12), 70); },
  win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .35, 'sine', .2), i * 110))
};
function drawMute() { $('btnMute').textContent = (muted ? '🔇' : '🔊'); $('btnMute').setAttribute('aria-pressed', String(muted)); $('btnMute').setAttribute('aria-label', T.mute); }
$('btnMute').onclick = () => { muted = !muted; try { localStorage.setItem(KEY + '.mute', muted ? '1' : '0'); } catch (e) {} drawMute(); };
drawMute();

/* ---- 쿠폰 번호 ---- */
function couponCode() {
  const d = new Date(), mmdd = String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
  const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = '';          /* 헷갈리는 0/O/1/I 제외 */
  const buf = new Uint32Array(4); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(buf) : buf.forEach((_, i) => buf[i] = Math.random() * 1e9);
  for (let i = 0; i < 4; i++) s += alpha[buf[i] % alpha.length];
  return ((C.reward && C.reward.couponPrefix) || 'EVT') + '-' + mmdd + '-' + s;
}
const fmtTime = iso => { const d = new Date(iso); return d.getFullYear() + '.' + (d.getMonth() + 1) + '.' + d.getDate() + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

/* ---- 설문 진행 ---- */
let idx = 0;
const answers = QS.map(() => null);     /* 선택 문항: 선택지 번호 배열, 자유 문항: 문자열 */
const poll = $('poll'), opts = $('options'), free = $('free'), err = $('err');

function renderProgress() {
  const p = $('progress'); p.innerHTML = '';
  QS.forEach((_, i) => { const b = document.createElement('i'); if (i <= idx) b.className = 'on'; p.appendChild(b); });
  $('step').textContent = typeof T.step === 'function' ? T.step(idx + 1, QS.length) : (idx + 1) + ' / ' + QS.length;
}
function renderQuestion() {
  const Q = QS[idx]; err.hidden = true;
  renderProgress();
  $('qText').textContent = Q.q;
  opts.innerHTML = ''; opts.hidden = !!Q.free; free.hidden = !Q.free;
  $('btnSkip').hidden = !Q.free; $('btnSkip').textContent = T.skip;
  $('btnNext').textContent = idx === QS.length - 1 ? T.submit : T.next;
  if (Q.free) {
    $('qHint').textContent = '';
    free.value = answers[idx] || ''; free.placeholder = T.freePh;
    let cnt = poll.querySelector('.counter'); if (!cnt) { cnt = document.createElement('div'); cnt.className = 'counter'; free.after(cnt); }
    const upd = () => { cnt.textContent = free.value.length + ' / 120'; }; free.oninput = upd; upd(); cnt.hidden = false;
    setTimeout(() => free.focus(), 50);
    return;
  }
  const cnt = poll.querySelector('.counter'); if (cnt) cnt.hidden = true;
  $('qHint').textContent = Q.multi ? T.pickMany : T.pickOne;
  const sel = answers[idx] || [];
  Q.options.forEach((label, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'opt' + (Q.multi ? ' multi' : '');
    b.setAttribute('aria-pressed', String(sel.includes(i)));
    b.innerHTML = '<i></i>'; b.append(label);
    b.onclick = () => {
      S.tap(); err.hidden = true;
      let cur = answers[idx] || [];
      if (Q.multi) cur = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i];
      else cur = [i];
      answers[idx] = cur;
      for (const [j, el] of [...opts.children].entries()) el.setAttribute('aria-pressed', String(cur.includes(j)));
    };
    opts.appendChild(b);
  });
}
function advance(skip) {
  const Q = QS[idx];
  if (Q.free) answers[idx] = skip ? '' : free.value.trim().slice(0, 120);
  else if (!answers[idx] || !answers[idx].length) { err.textContent = T.need; err.hidden = false; return; }
  if (idx < QS.length - 1) { idx++; S.next(); renderQuestion(); poll.scrollIntoView({ block: 'start' }); }
  else submit();
}
$('form').addEventListener('submit', e => { e.preventDefault(); advance(false); });
$('btnSkip').onclick = () => advance(true);

/* ---- 제출: 집계 저장, 쿠폰 발급, 보고 ---- */
function submit() {
  if (exhausted()) return;
  const tally = loadTally();
  QS.forEach((Q, i) => { if (Q.free) return; tally[i] = tally[i] || {}; for (const o of answers[i]) tally[i][o] = (tally[i][o] || 0) + 1; });
  saveTally(tally);
  const picked = QS.map((Q, i) => ({ q: Q.q, a: Q.free ? (answers[i] || '') : answers[i].map(o => Q.options[o]) }));
  const play = { label: C.reward.label, code: couponCode(), at: new Date().toISOString(), answers: picked };
  state.plays.push(play); save(state);
  try { window.EVENT_REPORT && EVENT_REPORT({ prize: play.label, code: play.code, lose: false, answers: picked }); } catch (e) {}
  showResult(play, false);
}
function showResult(play, replay) {
  poll.hidden = true; $('intro').hidden = replay ? false : true;
  const res = $('result'); res.hidden = false; res.classList.toggle('done', replay);
  $('kicker').textContent = replay ? T.done : T.thanks;
  $('prize').textContent = play.label; $('coupon').textContent = play.code; $('time').textContent = fmtTime(play.at);
  let note = res.querySelector('.done-note');
  if (replay) { if (!note) { note = document.createElement('p'); note.className = 'done-note'; res.insertBefore(note, $('card')); } note.textContent = T.doneSub; }
  else if (note) note.remove();
  if (C.showResults) renderChart(play.answers);
  if (!replay) { S.win(); confetti(); }
  setTimeout(() => res.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

/* ---- 결과 그래프: seedResults + 이 기기의 응답 ---- */
function renderChart(mine) {
  const box = $('chart'), body = $('chartBody'); body.innerHTML = ''; box.hidden = false;
  const tally = loadTally();
  QS.forEach((Q, i) => {
    if (Q.free) return;
    const seed = (C.seedResults && C.seedResults[i]) || [];
    const counts = Q.options.map((_, o) => (seed[o] || 0) + ((tally[i] || {})[o] || 0));
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const minePicks = mine && mine[i] && Array.isArray(mine[i].a) ? mine[i].a : [];
    body.appendChild(Object.assign(document.createElement('div'), { className: 'qq', textContent: Q.q }));
    Q.options.forEach((label, o) => {
      const pct = Math.round(counts[o] / total * 100);
      const row = document.createElement('div'); row.className = 'bar' + (minePicks.includes(label) ? ' mine' : '');
      row.innerHTML = `<div class="lbl"><span></span><span>${pct}%</span></div><div class="track"><i></i></div>`;
      row.querySelector('.lbl span').textContent = label;
      body.appendChild(row);
      requestAnimationFrame(() => requestAnimationFrame(() => { row.querySelector('.track i').style.width = pct + '%'; }));
    });
  });
}

/* ---- 시작 ---- */
if (exhausted()) showResult(state.plays[state.plays.length - 1], true);
else if (QS.length) { poll.hidden = false; renderQuestion(); }

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

/* 테스트 훅 */
window.__vote = { get answers() { return answers; }, get idx() { return idx; }, state: () => load() };
