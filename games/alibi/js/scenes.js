'use strict';
/* ==========================================================================
   The photos. Each scene is a flat illustration (SVG, 320×200) for a case
   whose key evidence is a picture. `face(id, x, y, size, hood)` drops in the
   suspect's own face, so the player recognizes people from the chat.
   ========================================================================== */
const clockFace = (cx, cy, r, h, m) => {
  const ha = (h % 12 + m / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = m / 60 * Math.PI * 2 - Math.PI / 2;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#2b2b33" stroke-width="2"/>` +
    [0, 1, 2, 3].map(i => { const a = i * Math.PI / 2 - Math.PI / 2; return `<circle cx="${cx + Math.cos(a) * r * .78}" cy="${cy + Math.sin(a) * r * .78}" r="1.2" fill="#2b2b33"/>`; }).join('') +
    `<path d="M${cx} ${cy}L${cx + Math.cos(ha) * r * .5} ${cy + Math.sin(ha) * r * .5}" stroke="#2b2b33" stroke-width="2.4" stroke-linecap="round"/>` +
    `<path d="M${cx} ${cy}L${cx + Math.cos(ma) * r * .74} ${cy + Math.sin(ma) * r * .74}" stroke="#2b2b33" stroke-width="1.6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="1.6" fill="#2b2b33"/>`;
};
const person = (x, y, h, color, faceSvg) => `<path d="M${x - h * .32} ${y + h}c0-${h * .34} ${h * .14}-${h * .5} ${h * .32}-${h * .5}s${h * .32} ${h * .16} ${h * .32} ${h * .5}z" fill="${color}"/>${faceSvg}`;
const rain = (x, y, w, h) => { let s = ''; for (let i = 0; i < 9; i++) s += `<path d="M${x + 6 + i * (w / 9)} ${y + 4 + (i % 3) * 14}l-4 16" stroke="#9fc4e8" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>`; return s; };

const SCENES = {
  /* café from the window seat: clock, Noa at the machine, the full jar, a hooded yellow figure at the door */
  window: face => `
    <rect width="320" height="200" fill="#efe4d2"/>
    <rect y="130" width="320" height="70" fill="#8b6b4f"/>
    <rect x="14" y="26" width="86" height="92" rx="4" fill="#bcd6ea" stroke="#5a4634" stroke-width="4"/>${rain(16, 30, 82, 86)}
    ${clockFace(124, 40, 17, 4, 20)}
    <path d="M190 110c0-18 10-28 24-28s24 10 24 28z" fill="#5a9a6a"/>${face('noa', 196, 46, 36)}
    <rect x="112" y="112" width="208" height="30" fill="#5a4634"/><rect x="112" y="108" width="208" height="8" fill="#d9c7a8"/>
    <rect x="150" y="74" width="54" height="38" rx="4" fill="#2f3140"/><rect x="156" y="80" width="42" height="10" rx="2" fill="#6b6f85"/><rect x="166" y="94" width="8" height="18" fill="#9aa0b4"/>
    <path d="M176 70q4-8 0-14M184 70q4-8 0-14" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>
    <rect x="236" y="78" width="26" height="32" rx="6" fill="#dff1ff" stroke="#8fb6d4" stroke-width="2"/><rect x="238" y="86" width="22" height="22" rx="4" fill="#f2c94c"/><rect x="236" y="74" width="26" height="6" rx="2" fill="#8fb6d4"/><text x="249" y="98" font-size="8" text-anchor="middle" font-family="Inter" font-weight="700" fill="#7a5a00">TIPS</text>
    <rect x="270" y="30" width="46" height="100" fill="#3b2d22"/><rect x="276" y="36" width="34" height="88" fill="#9fc4e8" opacity=".5"/>
    <path d="M281 112c0-16 6-28 12-28s12 12 12 28z" fill="#f5c400"/><path d="M283 84c2-10 7-14 10-14s8 4 10 14c-3-3-6-4-10-4s-7 1-10 4z" fill="#f5c400"/>
    ${face('finn', 283, 66, 20, true)}
    <rect x="0" y="0" width="320" height="200" fill="none" stroke="#fff" stroke-width="6"/>`,

  /* Hana's selfie at the food stall: the gym clock, the stage, the empty ticket desk behind her */
  festival: face => `
    <rect width="320" height="200" fill="#d9d2c4"/>
    <rect y="140" width="320" height="60" fill="#b8a98d"/>
    <rect x="200" y="36" width="120" height="76" fill="#2b2440"/>
    ${[0, 1, 2, 3].map(i => `<path d="M${206 + i * 30} 40l12 40" stroke="#ffd166" stroke-width="5" opacity=".55"/>`).join('')}
    ${[0, 1, 2].map(i => `<g><rect x="${222 + i * 28}" y="74" width="14" height="28" rx="6" fill="#7b6cff"/><circle cx="${229 + i * 28}" cy="68" r="7" fill="#f0c9a8"/></g>`).join('')}
    ${clockFace(170, 42, 15, 5, 20)}
    <rect x="96" y="96" width="112" height="46" fill="#7a5a3a"/><rect x="96" y="92" width="112" height="8" fill="#a07c54"/>
    <rect x="112" y="60" width="28" height="36" rx="4" fill="#4a4a55"/><rect x="108" y="96" width="36" height="6" fill="#4a4a55"/>
    <path d="M108 70l10-12h28l10 12-6 4v22h-36v-22z" fill="#2f6bd6"/><path d="M118 58l8 6 8-6" fill="#1f4fa8"/><path d="M108 70l-4 18h8z M156 70l4 18h-8z" fill="#2f6bd6"/>
    <rect x="156" y="78" width="40" height="18" rx="2" fill="#8d8d99"/><path d="M156 78l20-14h40l-20 14z" fill="#b5b5c2"/><rect x="160" y="82" width="32" height="10" fill="#4e9a5a"/>
    ${face('hana', 10, 60, 110)}
    <rect x="0" y="0" width="320" height="200" fill="none" stroke="#fff" stroke-width="6"/>`,

  /* doorbell still: Lia walking back from the side gate, latch up, the dog's nose in the gap */
  dog: face => `
    <rect width="320" height="200" fill="#9fd0e8"/>
    <rect y="110" width="320" height="90" fill="#7fb36b"/>
    <path d="M0 200l60-90h200l60 90z" fill="#c9c2b4"/>
    <rect x="236" y="60" width="84" height="80" fill="#8a6a4a"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${240 + i * 16}" y="64" width="10" height="72" fill="#a3825f"/>`).join('')}
    <rect x="226" y="52" width="4" height="96" fill="#5a4634"/>
    <g transform="rotate(-14 226 60)"><rect x="166" y="56" width="62" height="88" fill="#8a6a4a"/>${[0, 1, 2, 3].map(i => `<rect x="${170 + i * 15}" y="60" width="9" height="80" fill="#a3825f"/>`).join('')}</g>
    <rect x="212" y="80" width="26" height="5" fill="#333" transform="rotate(-50 225 82)"/>
    <ellipse cx="206" cy="128" rx="18" ry="13" fill="#c9a16b"/><circle cx="194" cy="126" r="6" fill="#4a3a2a"/><circle cx="212" cy="118" r="3" fill="#2b2b33"/><path d="M216 112l8-10 4 12z" fill="#c9a16b"/>
    ${person(120, 76, 100, '#e8a0bf', face('lia', 92, 72, 56))}
    <path d="M150 140l10 24h-26z" fill="#f4f4f4" stroke="#999" stroke-width="2"/>
    <rect x="8" y="8" width="54" height="16" rx="3" fill="rgba(0,0,0,.6)"/><text x="35" y="20" text-anchor="middle" font-size="10" font-family="Inter" font-weight="700" fill="#fff">15:33</text>
    <rect x="0" y="0" width="320" height="200" rx="18" fill="none" stroke="#111" stroke-width="10"/>`,

  /* gym selfie by the fountain: the clock, the empty front desk, the bare key hook, the propped door */
  locker: face => `
    <rect width="320" height="200" fill="#e9ecf2"/>
    <rect y="138" width="320" height="62" fill="#aab0bd"/>
    ${clockFace(230, 40, 15, 6, 31)}
    <rect x="150" y="92" width="110" height="46" fill="#3b4256"/><rect x="150" y="88" width="110" height="8" fill="#6b738a"/>
    <rect x="176" y="62" width="26" height="30" rx="4" fill="#59627a"/><rect x="172" y="92" width="34" height="5" fill="#59627a"/>
    <path d="M214 90c6 0 10-4 18-4s8 6 14 6" stroke="#ff6a3d" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="238" y="84" width="10" height="7" rx="1" fill="#fff" stroke="#ff6a3d"/>
    <rect x="270" y="56" width="40" height="30" rx="3" fill="#c9b08a"/>${[0, 1, 2].map(i => `<path d="M${280 + i * 10} 68v8" stroke="#6b5a3a" stroke-width="2"/><circle cx="${280 + i * 10}" cy="68" r="2" fill="#6b5a3a"/>`).join('')}<text x="290" y="64" text-anchor="middle" font-size="6" font-family="Inter" font-weight="700" fill="#6b5a3a">KEYS</text>
    <rect x="96" y="50" width="42" height="88" fill="#8a94ab"/><rect x="104" y="54" width="30" height="84" fill="#dfe3ea"/><g transform="rotate(-24 117 96)"><rect x="104" y="54" width="30" height="84" fill="#c7ced9"/></g>
    <path d="M128 138l8-26h8l8 26z" fill="#ff8a3d"/><rect x="124" y="136" width="30" height="5" fill="#ff8a3d"/><rect x="132" y="122" width="12" height="4" fill="#fff"/>
    <rect x="40" y="100" width="36" height="40" rx="4" fill="#d8dde6"/><rect x="48" y="90" width="20" height="12" rx="3" fill="#9aa4b6"/><path d="M58 90q6-8 0-14" stroke="#7fc8ff" stroke-width="3" fill="none"/>
    ${face('member', 6, 70, 92)}
    <rect x="0" y="0" width="320" height="200" fill="none" stroke="#fff" stroke-width="6"/>`
};
