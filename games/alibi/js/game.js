'use strict';
/* Progress and rules. No DOM. */
const SAVE_KEY = 'alibi.save.v1';
const MAX_STRIKES = 3;
function freshSave() { return { v: 1, done: {}, stars: {}, best: {}, daily: {}, tutorialSeen: false, coachDone: false, settings: { sound: true, music: true } }; }
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
  R = { i, c, marked: new Set(), found: new Set(), strikes: 0, hints: 0, accused: null, state: 'play', t0: Date.now(), time: 0, daily: daily || null, failedOnce: false, wrongEvUsed: new Set(), triedEv: {}, hintStage: 0, strikeRecovered: false };
  return R;
}
const elapsed = () => R ? (R.state === 'play' ? (Date.now() - R.t0) / 1000 : R.time) : 0;

/* the daily case: one per calendar day, same for everyone */
const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
function dailyIndex(key) { let h = 0; for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h % CL.length; }
function dailyStreak() { let n = 0; const d = new Date(); for (;;) { const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); if (!S.daily[k]) break; n++; d.setDate(d.getDate() - 1); } return n; }
const lieCount = c => c.chat.filter(m => m.lie).length;
const nameOf = (c, id) => (c.suspects.find(s => s[0] === id) || [])[1] || id;
/* mark a chat message together with the fact it contradicts.
   'lie' | 'wrongEvFree' (right lie, wrong fact — first try on that lie is free) |
   'wrongEv' (right lie, wrong fact again — counts as a strike) | 'strike' | 'already' */
const evOf = m => Array.isArray(m.ev) ? m.ev : [m.ev];
function failRun() { R.state = 'failed'; R.failedOnce = true; R.time = (Date.now() - R.t0) / 1000; }
function mark(k, ev) {
  const m = R.c.chat[k];
  if (R.found.has(k)) return 'already';
  if (m.lie && evOf(m).includes(ev)) { R.found.add(k); return 'lie'; }
  R.marked.add(k);
  if (m.lie) {
    (R.triedEv[k] = R.triedEv[k] || new Set()).add(ev);
    if (!R.wrongEvUsed.has(k)) { R.wrongEvUsed.add(k); return 'wrongEvFree'; }
    R.strikes++;
    if (R.strikes >= MAX_STRIKES) failRun();
    return 'wrongEv';
  }
  R.strikes++;
  if (R.strikes >= MAX_STRIKES) failRun();
  return 'strike';
}
/* resume after a failed run: keep the lies already found and the time spent so far.
   Free resume starts back at 1 strike (the failure still costs something);
   a clean resume — via a rewarded ad, see ui.js — starts at 0 strikes.
   The clock keeps running from the moment of failure. */
function resumeCase(clean) {
  if (!R || R.state !== 'failed') return false;
  R.state = 'play'; R.strikes = clean ? 0 : 1; R.t0 = Date.now() - R.time * 1000;
  return true;
}
/* undo one strike, once per case, only when 2 strikes are already banked
   (i.e. one mistake away from failing). Rewarded builds pay with an ad
   (see ui.js); ad-free builds pay with one hint instead, see below. */
const canRecoverStrike = () => R && R.state === 'play' && R.strikes === 2 && !R.strikeRecovered;
function recoverStrike() {
  if (!canRecoverStrike()) return false;
  R.strikes = 1; R.strikeRecovered = true;
  return true;
}
/* ad-free builds have no rewarded ad to watch, so the same recovery costs
   one hint instead. The hint counts toward the star rating (see accuse()):
   after a free recovery strikes are 1 and hints are at least 1, so ★3 is
   impossible and the run caps at ★2 — the recovery is never free in stars. */
function recoverStrikeFree() {
  if (!recoverStrike()) return false;
  R.hints++;
  return true;
}
const allLiesFound = () => R.found.size >= lieCount(R.c);
function accuse(id) {
  if (id === R.c.culprit) {
    R.state = 'solved'; R.time = (Date.now() - R.t0) / 1000;
    let stars = R.strikes === 0 && R.hints === 0 ? 3 : R.strikes <= 1 && R.hints <= 1 ? 2 : 1;
    if (R.failedOnce) stars = Math.min(stars, 2); /* a run that failed once can earn at most ★2 */
    S.done[R.c.id] = true; S.stars[R.c.id] = Math.max(S.stars[R.c.id] || 0, stars);
    S.best[R.c.id] = Math.min(S.best[R.c.id] || Infinity, Math.floor(R.time));
    if (R.daily) S.daily[R.daily] = { stars, time: Math.floor(R.time) };
    persist();
    return stars;
  }
  R.strikes++; if (R.strikes >= MAX_STRIKES) failRun();
  return 0;
}
/* hint, in 3 stages within one case — each use climbs one stage and costs
   one rewarded ad (free when the build has no ads). The stage is per case:
   1 = who is lying, 2 = which message to re-read (speaker + time, not the text),
   3 = one fact that contradicts it. Stage 3 is close to the answer by design,
   so a player who climbs all the way there is paying for it in stars
   (hints still count toward the star rating, see accuse()). */
function hintText() {
  const left = R.c.chat.map((m, k) => ({ m, k })).filter(x => x.m.lie && !R.found.has(x.k));
  R.hints++;
  if (!left.length) return tr('hintAccuse');
  const stage = Math.min(R.hintStage + 1, 3);
  R.hintStage = stage;
  const first = left[0], who = nameOf(R.c, first.m.s);
  if (stage === 1) return tr('hintStep', 1) + tr('hintLie', who);
  if (stage === 2) return tr('hintStep', 2) + tr('hintMsg', who, first.m.t);
  return tr('hintStep', 3) + tr('hintEv', R.c.facts[evOf(first.m)[0]][1]);
}
