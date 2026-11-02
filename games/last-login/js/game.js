'use strict';
/* ==========================================================================
   Progress, puzzle checks, hints and saving. No DOM here.
   ========================================================================== */
const SAVE_KEY = 'lastlogin.save.v1';
function freshSave() {
  return { v: 1, started: false, chapter: 0, done: false, unlocked: false,
    vault: { word: false, number: false, color: false, open: false }, mounted: false, read: {}, decoded: false, played: false,
    msgStep: 0, msgLog: [], hints: {}, hintsUsed: 0, wrong: 0, playT: 0, settings: { sound: true } };
}
function loadSave(raw) {
  const f = freshSave();
  try {
    if (raw === undefined) raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return f;
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return f;
    for (const k in f) {
      const fv = f[k], sv = s[k];
      if (sv === undefined || sv === null) continue;
      if (Array.isArray(fv)) { if (Array.isArray(sv)) f[k] = sv; }
      else if (fv && typeof fv === 'object') { if (typeof sv === 'object') f[k] = { ...fv, ...sv }; }
      else if (typeof sv === typeof fv) f[k] = sv;
    }
  } catch (e) {}
  return f;
}
let S = loadSave();
function persist() {
  const raw = JSON.stringify(S);
  try { localStorage.setItem(SAVE_KEY, raw); } catch (e) {}
  try { if (PORTAL.store) PORTAL.store.setItem(SAVE_KEY, raw); } catch (e) {}
}

const norm = s => String(s || '').trim().toUpperCase().replace(/\s+/g, ' ');
const matches = (list, v) => list.some(a => norm(a) === norm(v));

/* which puzzle a screen is on, for hints */
function currentHintKey(app) {
  if (!S.unlocked) return 'pin';
  if (app === 'vault') return !S.vault.word ? 'word' : !S.vault.number ? 'number' : !S.vault.color ? 'color' : null;
  if (app === 'terminal') return !S.mounted ? 'mount' : !S.decoded ? 'cipher' : !S.played ? 'morse' : null;
  if (app === 'messages') { const st = C.messages.script[S.msgStep]; return st && st.who === 'ask' ? st.key : null; }
  if (app === 'music') return S.vault.word ? null : 'word';
  if (app === 'mail') return S.vault.number ? null : 'number';
  if (app === 'notes') return S.vault.color ? null : S.vault.open ? 'mount' : 'color';
  return S.vault.open ? (S.mounted ? null : 'mount') : 'word';
}
function hintLevel(key) { return S.hints[key] || 0; }
function takeHint(key) {
  const list = C.hints[key]; if (!list) return null;
  const l = Math.min(list.length, hintLevel(key) + 1);
  if (l !== hintLevel(key)) { S.hints[key] = l; S.hintsUsed++; persist(); }
  return list[l - 1];
}

/* ---- checks ---- */
function tryPin(v) { if (matches(ANSWERS.pin, v)) { S.unlocked = true; S.chapter = Math.max(S.chapter, 1); persist(); return true; } S.wrong++; persist(); return false; }
function tryVault(kind, v) {
  const ok = kind === 'word' ? matches(ANSWERS.word, v) : kind === 'number' ? matches(ANSWERS.number, v) : v === ANSWERS.color;
  if (ok) S.vault[kind] = true; else S.wrong++;
  if (S.vault.word && S.vault.number && S.vault.color && !S.vault.open) { S.vault.open = true; S.chapter = Math.max(S.chapter, 2); }
  persist(); return ok;
}
function tryMount(v) { if (matches(ANSWERS.mountKey, v)) { S.mounted = true; persist(); return true; } S.wrong++; persist(); return false; }
function checkEcho() { if (S.mounted && S.decoded && S.played && S.chapter < 3) { S.chapter = 3; persist(); return true; } return false; }
function caesar(text, shift) {
  return text.replace(/[A-Z]/g, ch => String.fromCharCode((ch.charCodeAt(0) - 65 + shift + 2600) % 26 + 65));
}
const CIPHER_TEXT = caesar(CIPHER_PLAIN, ANSWERS.shift);
function morseOf(word) { return word.split('').map(c => MORSE[c]).join('   '); }

/* messages: advance the script, returns the new lines to show */
function msgAdvance(answer) {
  const sc = C.messages.script, out = [];
  while (S.msgStep < sc.length) {
    const st = sc[S.msgStep];
    if (st.who === 'ask') {
      if (answer === undefined) break;
      if (matches(ANSWERS[st.key], answer)) { out.push({ who: 'me', t: answer }); S.msgStep++; answer = undefined; }
      else { S.wrong++; out.push({ who: 'me', t: answer }, { who: 'them', t: st.wrong }); answer = undefined; break; }
    } else { out.push({ who: 'them', t: st.t }); S.msgStep++; }
  }
  S.msgLog.push(...out);
  if (S.msgStep >= sc.length && !S.done) { S.done = true; S.chapter = 4; }
  persist();
  return out;
}
