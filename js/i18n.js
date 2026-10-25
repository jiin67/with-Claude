'use strict';
/* ==========================================================================
   Language: Korean or English, picked from the saved setting or the browser.
   L(ko, en) returns the active one. Changing the language reloads the page,
   so text built once at load (data.js) stays consistent.
   ========================================================================== */
const LANG = (() => {
  try {
    const s = JSON.parse(localStorage.getItem('stardrift.save.v2') || 'null');
    const l = s && s.settings && s.settings.lang;
    if (l === 'ko' || l === 'en') return l;
  } catch (e) {}
  return /^ko\b/i.test(navigator.language || '') ? 'ko' : 'en';
})();
const L = (ko, en) => LANG === 'ko' ? ko : en;
/* static markup carries its English in data-en (innerHTML) and data-en-label (aria-label) */
function applyStaticText() {
  document.documentElement.lang = LANG;
  if (LANG === 'ko') return;
  for (const e of document.querySelectorAll('[data-en]')) e.innerHTML = e.dataset.en;
  for (const e of document.querySelectorAll('[data-en-label]')) e.setAttribute('aria-label', e.dataset.enLabel);
  document.title = 'STARDRIFT';
}
applyStaticText();
