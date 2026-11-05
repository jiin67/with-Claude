/* Checks every case in both languages for structural fairness.
   node games/alibi/tools/lint-cases.mjs            → lists problems, exit 1 if any */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ctx = vm.createContext({});
const files = ['cases.js', ...readdirSync(join(ROOT, 'js')).filter(f => /^cases-.*\.js$/.test(f)).sort()];
for (const f of files) vm.runInContext(readFileSync(join(ROOT, 'js', f), 'utf8').replace(/^const /m, 'var '), ctx);
const CASES = vm.runInContext('CASES', ctx);
const problems = [];
const bad = (id, msg) => problems.push(`${id}: ${msg}`);

const en = CASES.en, ko = CASES.ko;
if (en.length !== ko.length) bad('*', `en has ${en.length} cases, ko has ${ko.length}`);
const ids = new Set();
en.forEach((c, i) => {
  const k = ko[i];
  if (!k || k.id !== c.id) { bad(c.id, `ko case ${i} is ${k && k.id}, expected same id`); return; }
  if (ids.has(c.id)) bad(c.id, 'duplicate id'); ids.add(c.id);
  for (const [lang, x] of [['en', c], ['ko', k]]) {
    const sids = x.suspects.map(s => s[0]);
    if (!sids.includes(x.culprit)) bad(x.id, `${lang}: culprit "${x.culprit}" is not a suspect`);
    if (x.suspects.length < 3) bad(x.id, `${lang}: fewer than 3 suspects`);
    if (x.facts.length < 3) bad(x.id, `${lang}: fewer than 3 facts`);
    x.facts.forEach((f, i) => { if (!Array.isArray(f) || typeof f[0] !== 'string' || typeof f[1] !== 'string') bad(x.id, `${lang}: facts[${i}] must be [icon, text, details?]`); if (f[2] !== undefined && (!Array.isArray(f[2]) || f[2].length < 2 || f[2].some(d => typeof d !== 'string'))) bad(x.id, `${lang}: facts[${i}] photo details must be 2+ strings`); });
    if (x.chat.length < 6) bad(x.id, `${lang}: chat shorter than 6 messages`);
    if (![1, 2, 3].includes(x.difficulty)) bad(x.id, `${lang}: difficulty must be 1..3`);
    const lies = x.chat.filter(m => m.lie);
    if (lies.length < 2) bad(x.id, `${lang}: fewer than 2 lies`);
    const liars = new Set(lies.map(m => m.s));
    if (!liars.has(x.culprit)) bad(x.id, `${lang}: the culprit never lies`);
    if (liars.size < 2) bad(x.id, `${lang}: only one person lies (no misdirection)`);
    x.chat.forEach((m, j) => {
      if (!sids.includes(m.s)) bad(x.id, `${lang}: chat[${j}] speaker "${m.s}" is not a suspect`);
      if (!/^\d{1,2}:\d{2}$/.test(m.t)) bad(x.id, `${lang}: chat[${j}] time "${m.t}" is not HH:MM`);
      if (m.lie !== undefined && (typeof m.lie !== 'string' || m.lie.length < 15)) bad(x.id, `${lang}: chat[${j}] lie reason too short`);
      if (m.lie) {
        const ev = Array.isArray(m.ev) ? m.ev : [m.ev];
        if (m.ev === undefined || !ev.length || ev.some(e => !Number.isInteger(e) || e < 0 || e >= x.facts.length)) bad(x.id, `${lang}: chat[${j}] ev must index facts (0..${x.facts.length - 1})`);
      } else if (m.ev !== undefined) bad(x.id, `${lang}: chat[${j}] has ev but is not a lie`);
      if (!m.m || !m.m.trim()) bad(x.id, `${lang}: chat[${j}] empty message`);
    });
    for (const key of ['title', 'place', 'intro', 'solve']) if (!x[key] || !x[key].trim()) bad(x.id, `${lang}: missing ${key}`);
  }
  /* structure must match across languages so the same taps work */
  if (c.chat.length !== k.chat.length) bad(c.id, `chat length differs (en ${c.chat.length}, ko ${k.chat.length})`);
  else c.chat.forEach((m, j) => { if (!!m.lie !== !!k.chat[j].lie) bad(c.id, `chat[${j}] lie flag differs between languages`); if (m.s !== k.chat[j].s) bad(c.id, `chat[${j}] speaker differs between languages`); if (JSON.stringify(m.ev) !== JSON.stringify(k.chat[j].ev)) bad(c.id, `chat[${j}] ev differs between languages`); });
  if (c.culprit !== k.culprit) bad(c.id, 'culprit differs between languages');
  if (c.suspects.map(s => s[0]).join() !== k.suspects.map(s => s[0]).join()) bad(c.id, 'suspect ids differ between languages');
  if (c.difficulty !== k.difficulty) bad(c.id, 'difficulty differs between languages');
  if (c.facts.length !== k.facts.length) bad(c.id, 'fact count differs between languages');
  else c.facts.forEach((f, i) => { if (!!f[2] !== !!k.facts[i][2] || (f[2] && f[2].length !== k.facts[i][2].length)) bad(c.id, `facts[${i}] photo details differ between languages`); });
});
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`✓ ${en.length} cases ok (${files.join(', ')})`);
