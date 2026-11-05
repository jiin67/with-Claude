'use strict';
/* Progress and rules. No DOM. */
const SAVE_KEY = 'alibi.save.v1';
const MAX_STRIKES = 3;
function freshSave() { return { v: 1, done: {}, stars: {}, best: {}, daily: {}, tutorialSeen: false, settings: { sound: true } }; }
function loadSave(raw) {
  const f = freshSave();
  try {
    if (raw === undefined) raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return f;
    const s = JSON.parse(raw); if (!s || typeof s !== 'object') return f;
    for (const k in f) { const fv = f[k], sv = s[k]; if (sv === undefined || sv === null) continue; if (fv && typeof fv === 'object') { if (typeof sv === 'object') f[k] = { ...fv, ...sv }; } else if (typeof sv === typeof fv) f[k] = sv; }
  } catch (e) {}
  return f;
}
let S = loadSave();
function persist() {
  const raw = JSON.stringify(S);
  try { localStorage.setItem(SAVE_KEY, raw); } catch (e) {}
  try { if (PORTAL.store) PORTAL.store.setItem(SAVE_KEY, raw); } catch (e) {}
}
const totalStars = () => Object.values(S.stars).reduce((a, b) => a + b, 0);
const unlocked = i => i === 0 || !!S.done[CL[i - 1].id];

/* one investigation */
let R = null;
function startCase(i, daily) {
  const c = CL[i];
  R = { i, c, marked: new Set(), found: new Set(), strikes: 0, hints: 0, accused: null, state: 'play', t0: Date.now(), time: 0, daily: daily || null };
  return R;
}
const elapsed = () => R ? (R.state === 'play' ? (Date.now() - R.t0) / 1000 : R.time) : 0;

/* the daily case: one per calendar day, same for everyone */
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function dailyIndex(key) { let h = 0; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h % CL.length; }
function dailyStreak() { let n = 0; const d = new Date(); for (;;) { const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); if (!S.daily[k]) break; n++; d.setDate(d.getDate() - 1); } return n; }
const lieCount = c => c.chat.filter(m => m.lie).length;
const nameOf = (c, id) => (c.suspects.find(s => s[0] === id) || [])[1] || id;
/* mark a chat message: returns 'lie' | 'strike' | 'already' */
function mark(k) {
  const m = R.c.chat[k];
  if (R.found.has(k)) return 'already';
  if (m.lie) { R.found.add(k); return 'lie'; }
  R.marked.add(k); R.strikes++;
  if (R.strikes >= MAX_STRIKES) { R.state = 'failed'; R.time = (Date.now() - R.t0) / 1000; }
  return 'strike';
}
const allLiesFound = () => R.found.size >= lieCount(R.c);
function accuse(id) {
  if (id === R.c.culprit) {
    R.state = 'solved'; R.time = (Date.now() - R.t0) / 1000;
    const stars = R.strikes === 0 && R.hints === 0 ? 3 : R.strikes <= 1 && R.hints <= 1 ? 2 : 1;
    S.done[R.c.id] = true; S.stars[R.c.id] = Math.max(S.stars[R.c.id] || 0, stars);
    S.best[R.c.id] = Math.min(S.best[R.c.id] || Infinity, Math.floor(R.time));
    if (R.daily) S.daily[R.daily] = { stars, time: Math.floor(R.time) };
    persist();
    return stars;
  }
  R.strikes++; if (R.strikes >= MAX_STRIKES) { R.state = 'failed'; R.time = (Date.now() - R.t0) / 1000; }
  return 0;
}
/* hint: names the speaker of a lie not yet found, else nudges the accusation */
function hintText() {
  const left = R.c.chat.map((m, k) => ({ m, k })).filter(x => x.m.lie && !R.found.has(x.k));
  R.hints++;
  if (left.length) return tr('hintLie', nameOf(R.c, left[0].m.s));
  return tr('hintAccuse');
}
