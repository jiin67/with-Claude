'use strict';
/* ==========================================================================
   Language (Korean / English), UI strings and number formatting.
   tr(key, ...args) returns a string; names of game things come from NAMES.
   ========================================================================== */
const LANG_KEY = 'orbitforge.lang';
const LANG = (() => {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ko' || q === 'en') return q;
    const s = localStorage.getItem(LANG_KEY);
    if (s === 'ko' || s === 'en') return s;
  } catch (e) {}
  return /^ko\b/i.test(navigator.language || '') ? 'ko' : 'en';
})();
document.documentElement.lang = LANG;
function setLang(l) {
  try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
  const u = new URL(location.href); u.searchParams.delete('lang'); location.replace(u.href);
}

const STR = {
  ko: {
    title: '궤도 제련소 ORBIT FORGE', logo: '궤도 제련소', tagline: '소행성을 캐고, 함대를 짓고, 별을 삼켜라',
    ore: '광석', perSec: '초당', tapHint: '소행성을 눌러 광석을 캐세요', canvas: '소행성 채굴장',
    tabBuild: '시설', tabUp: '개량', tabCollapse: '붕괴', tabRecords: '기록',
    buyN: '구매 수량', owned: '보유', each: '개당', next: '다음',
    produces: v => `초당 ${v}`, share: p => `전체의 ${p}%`, locked: '???', lockedHint: '이전 시설을 지으면 정체가 드러납니다',
    noUps: '지금 살 수 있는 개량이 없습니다. 시설을 더 지어 보세요.', upBought: '개량 완료',
    tierDesc: (n, m) => `${n} 생산량 ×${m}`, tapMult: m => `탭 한 번의 채굴량 ×${m}`, tapPct: p => `탭할 때마다 초당 생산량의 ${p}%를 추가로 캡니다`,
    globalDesc: m => `모든 생산량 ×${m}`,
    boost: '광고 보고 2배', boostOn: t => `2배 ${t}`, boostDesc: '10분 동안 모든 생산 2배 (최대 60분까지 쌓임)',
    frenzy: '혜성 폭주! 생산 ×5', lump: v => `혜성 포획! +${v}`,
    welcome: '돌아오셨군요', away: t => `자리를 비운 ${t} 동안 함대가 캐 둔 광석`, collect: '받기', collect2: '광고 보고 2배로 받기',
    collapseTitle: '항성 붕괴', collapseIntro: '모든 시설과 개량, 광석을 바치고 별을 붕괴시켜 암흑 물질을 얻습니다. 암흑 물질은 영원히 남고 모든 생산을 끌어올립니다.',
    collapseNeed: v => `이번 회차에 광석을 ${v} 캐면 붕괴할 수 있습니다.`,
    collapseGain: v => `지금 붕괴하면 암흑 물질 +${v}`, collapseBtn: '붕괴시키기', collapseConfirm: '정말 붕괴시키기',
    dmOwned: '보유 암흑 물질', dmBonus: v => `생산 보너스 +${v}%`, relics: '유물', relicLv: (l, m) => `${l} / ${m}`, relicBuy: c => `◈ ${c}`, maxed: '최대',
    collapsed: v => `붕괴 완료 · 암흑 물질 +${v}`,
    achTitle: '업적', achBonus: (n, p) => `업적 ${n}개 · 생산 +${p}%`, achGot: '업적 달성', stats: '통계',
    stOre: '총 채굴량', stRun: '이번 회차 채굴량', stTaps: '탭 횟수', stComets: '잡은 혜성', stCollapses: '붕괴 횟수', stPlay: '플레이 시간', stTap: '탭 한 번',
    settings: '설정', sound: '효과음', notation: '숫자 표기', notShort: '만·억·조', notSci: '과학 표기 (1.2e15)',
    language: '언어 / Language', reset: '데이터 초기화', resetConfirm: '정말 지우기', resetWarn: '모든 진행 상황을 지웁니다. 되돌릴 수 없습니다.', close: '닫기',
    adFail: '지금은 광고를 불러올 수 없습니다', adPlaying: '광고 재생 중…', saved: '저장됨',
    tut1: '소행성을 눌러 광석을 캐세요', tut2: '광석이 모였어요. <b>채굴 드론</b>을 사면 알아서 캡니다', tut3: '<b>개량</b> 탭에서 시설을 더 강하게 만들 수 있어요',
    tutComet: '지나가는 <b>혜성</b>을 누르면 보너스!',
    kTap: '탭', kFleet: '함대',
    h: '시간', m: '분', s: '초'
  },
  en: {
    title: 'ORBIT FORGE — Idle Space Mining', logo: 'ORBIT FORGE', tagline: 'Mine the rock. Build the fleet. Swallow the stars.',
    ore: 'Ore', perSec: 'per sec', tapHint: 'Tap the asteroid to mine ore', canvas: 'Asteroid mining field',
    tabBuild: 'Build', tabUp: 'Upgrades', tabCollapse: 'Collapse', tabRecords: 'Records',
    buyN: 'Buy amount', owned: 'Owned', each: 'each', next: 'Next',
    produces: v => `${v}/s`, share: p => `${p}% of total`, locked: '???', lockedHint: 'Build the previous structure to reveal it',
    noUps: 'No upgrades available right now. Build more structures.', upBought: 'Upgraded',
    tierDesc: (n, m) => `${n} output ×${m}`, tapMult: m => `Ore per tap ×${m}`, tapPct: p => `Each tap also mines ${p}% of your ore per second`,
    globalDesc: m => `All production ×${m}`,
    boost: 'Watch ad: 2×', boostOn: t => `2× ${t}`, boostDesc: 'All production 2× for 10 minutes (stacks up to 60)',
    frenzy: 'Comet frenzy! Production ×5', lump: v => `Comet caught! +${v}`,
    welcome: 'Welcome back', away: t => `Ore your fleet mined while you were away for ${t}`, collect: 'Collect', collect2: 'Watch ad: collect 2×',
    collapseTitle: 'Stellar Collapse', collapseIntro: 'Sacrifice every structure, upgrade and ore to collapse a star into Dark Matter. Dark Matter stays forever and boosts all production.',
    collapseNeed: v => `Mine ${v} ore this run to unlock Collapse.`,
    collapseGain: v => `Collapse now for +${v} Dark Matter`, collapseBtn: 'Collapse', collapseConfirm: 'Really collapse',
    dmOwned: 'Dark Matter', dmBonus: v => `Production bonus +${v}%`, relics: 'Relics', relicLv: (l, m) => `${l} / ${m}`, relicBuy: c => `◈ ${c}`, maxed: 'Max',
    collapsed: v => `Collapsed · +${v} Dark Matter`,
    achTitle: 'Achievements', achBonus: (n, p) => `${n} achievements · production +${p}%`, achGot: 'Achievement', stats: 'Stats',
    stOre: 'Ore mined (all time)', stRun: 'Ore mined this run', stTaps: 'Taps', stComets: 'Comets caught', stCollapses: 'Collapses', stPlay: 'Time played', stTap: 'Ore per tap',
    settings: 'Settings', sound: 'Sound', notation: 'Number format', notShort: 'Short (1.2M)', notSci: 'Scientific (1.2e15)',
    language: 'Language / 언어', reset: 'Reset data', resetConfirm: 'Really erase', resetWarn: 'Erases all progress. This cannot be undone.', close: 'Close',
    adFail: 'No ad available right now', adPlaying: 'Ad playing…', saved: 'Saved',
    tut1: 'Tap the asteroid to mine ore', tut2: 'You have ore. Buy a <b>Mining Drone</b> and it mines for you', tut3: 'Make structures stronger in the <b>Upgrades</b> tab',
    tutComet: 'Tap the passing <b>comet</b> for a bonus!',
    kTap: 'TAP', kFleet: 'FLEET',
    h: 'h', m: 'm', s: 's'
  }
};
function tr(key, ...a) {
  const s = STR[LANG][key] !== undefined ? STR[LANG][key] : STR.ko[key];
  if (s === undefined) return key;
  return typeof s === 'function' ? s(...a) : s;
}
function applyStaticText() {
  document.title = tr('title');
  for (const e of document.querySelectorAll('[data-i18n]')) e.textContent = tr(e.dataset.i18n);
  for (const e of document.querySelectorAll('[data-i18n-aria]')) e.setAttribute('aria-label', tr(e.dataset.i18nAria));
}

/* names and flavor text of game things, keyed by id */
const NAMES = {
  ko: {
    drone: ['채굴 드론', '작고 성실하다. 소행성 표면을 쪼아 광석을 모은다.'],
    drill: ['레이저 드릴', '암반을 녹여 깊은 곳의 광맥까지 뚫는다.'],
    magnet: ['광석 자석', '흩어진 금속 조각을 궤도 위로 끌어올린다.'],
    refinery: ['정제소', '원광을 순수한 금속으로 바꾼다.'],
    hauler: ['화물선', '이웃 소행성대에서 광석을 실어 나른다.'],
    furnace: ['플라즈마 용광로', '태양보다 뜨거운 불로 소행성을 통째로 녹인다.'],
    quantum: ['양자 추출기', '확률을 비틀어 광석이 있었던 것으로 만든다.'],
    siphon: ['중력 흡입기', '근처 행성의 지각을 조금씩 빨아들인다.'],
    harvester: ['항성 수확기', '별의 바깥층을 걷어 내 무거운 원소를 거둔다.'],
    dyson: ['다이슨 군집', '항성 하나를 통째로 둘러싼 거대 채굴망.'],
    tap1: '강화 곡괭이', tap2: '다이아몬드 곡괭이', tap3: '음파 망치', tap4: '메아리 탭', tap5: '공명 탭', tap6: '조화 탭', tap7: '특이점 탭',
    g1: '함대 물류', g2: '궤도 중계소', g3: '심우주 탐사', g4: '초공간 항로망', g5: '항성 지도', g6: '중력자 격자', g7: '우주 협약',
    kit: ['출격 장비', '회차를 시작할 때마다 채굴 드론 +10'],
    cache: ['심층 저장고', '자리 비움 수익 한도 +4시간'],
    lens: ['집속 렌즈', '탭 채굴량 +50%'],
    comet: ['혜성 미끼', '혜성 출현 빈도 +15%'],
    discount: ['대량 계약', '모든 시설 가격 -3%'],
    amp: ['암흑 증폭기', '암흑 물질 보너스 강화 (+0.5%씩)'],
    tier: (n, k) => `${n} ${k + 2}단계`,
    ach: {
      tap100: ['손에 익다', '탭 100번'], tap2500: ['불굴의 검지', '탭 2,500번'],
      ore1e4: ['첫 광맥', '광석 1만 채굴'], ore1e6: ['백만장자', '광석 100만 채굴'], ore1e9: ['광산 재벌', '광석 10억 채굴'],
      ore1e12: ['행성 하나 분량', '광석 1조 채굴'], ore1e15: ['은하의 금고', '광석 1,000조 채굴'],
      b10: ['작은 함대', '시설 10개 보유'], b100: ['채굴 기지', '시설 100개 보유'], b500: ['산업 혁명', '시설 500개 보유'],
      allTypes: ['완전한 생산망', '모든 종류의 시설 보유'], drone100: ['벌떼', '채굴 드론 100기 보유'], dyson1: ['별을 두르다', '다이슨 군집 건설'],
      comet10: ['혜성 사냥꾼', '혜성 10개 포획'], comet50: ['꼬리를 잡다', '혜성 50개 포획'],
      collapse1: ['첫 붕괴', '항성 붕괴 1회'], collapse5: ['재와 별', '항성 붕괴 5회'], dm100: ['어둠의 무게', '암흑 물질 100 획득'],
      relic: ['고대의 유산', '유물 처음 구매'], away: ['믿고 맡기다', '1시간 넘게 자리 비우기']
    }
  },
  en: {
    drone: ['Mining Drone', 'Small and diligent. Pecks ore off the asteroid surface.'],
    drill: ['Laser Drill', 'Melts through bedrock to reach deep veins.'],
    magnet: ['Ore Magnet', 'Pulls stray metal fragments up into orbit.'],
    refinery: ['Refinery', 'Turns raw ore into pure metal.'],
    hauler: ['Cargo Hauler', 'Ferries ore in from neighboring belts.'],
    furnace: ['Plasma Furnace', 'Melts whole asteroids with fire hotter than a sun.'],
    quantum: ['Quantum Extractor', 'Bends probability so the ore was always there.'],
    siphon: ['Gravity Siphon', 'Slowly drinks the crust of nearby planets.'],
    harvester: ['Star Harvester', 'Skims a star’s outer layers for heavy elements.'],
    dyson: ['Dyson Swarm', 'A mining web wrapped around an entire star.'],
    tap1: 'Reinforced Pick', tap2: 'Diamond Pick', tap3: 'Sonic Hammer', tap4: 'Echo Tap', tap5: 'Resonant Tap', tap6: 'Harmonic Tap', tap7: 'Singularity Tap',
    g1: 'Fleet Logistics', g2: 'Orbital Relay', g3: 'Deep Survey', g4: 'Hyperlane Network', g5: 'Stellar Cartography', g6: 'Graviton Lattice', g7: 'Cosmic Accord',
    kit: ['Starter Kit', '+10 Mining Drones at the start of every run'],
    cache: ['Deep Cache', 'Offline earnings cap +4 hours'],
    lens: ['Focus Lens', 'Tap power +50%'],
    comet: ['Comet Lure', 'Comets appear 15% more often'],
    discount: ['Bulk Contracts', 'All structures 3% cheaper'],
    amp: ['Dark Amplifier', 'Stronger Dark Matter bonus (+0.5% each)'],
    tier: (n, k) => `${n} Mk ${['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][k]}`,
    ach: {
      tap100: ['Getting the Hang of It', 'Tap 100 times'], tap2500: ['Iron Finger', 'Tap 2,500 times'],
      ore1e4: ['First Vein', 'Mine 10K ore'], ore1e6: ['Millionaire', 'Mine 1M ore'], ore1e9: ['Mining Mogul', 'Mine 1B ore'],
      ore1e12: ['A Planet’s Worth', 'Mine 1T ore'], ore1e15: ['Galactic Vault', 'Mine 1Qa ore'],
      b10: ['Small Fleet', 'Own 10 structures'], b100: ['Mining Base', 'Own 100 structures'], b500: ['Industrial Revolution', 'Own 500 structures'],
      allTypes: ['Full Supply Chain', 'Own every kind of structure'], drone100: ['The Swarm', 'Own 100 Mining Drones'], dyson1: ['Wrapped a Star', 'Build a Dyson Swarm'],
      comet10: ['Comet Hunter', 'Catch 10 comets'], comet50: ['Tail Grabber', 'Catch 50 comets'],
      collapse1: ['First Collapse', 'Collapse a star'], collapse5: ['Ash and Stars', 'Collapse 5 times'], dm100: ['Weight of the Dark', 'Earn 100 Dark Matter'],
      relic: ['Ancient Legacy', 'Buy your first relic'], away: ['Trust the Fleet', 'Stay away for over an hour']
    }
  }
};
const NM = NAMES[LANG];
const bName = i => NM[BUILDINGS[i].id][0];
const bDesc = i => NM[BUILDINGS[i].id][1];
function upName(u) { return u.kind === 'tier' ? NM.tier(bName(u.bi), u.tier) : NM[u.id]; }
function upDesc(u) {
  if (u.kind === 'tier') return tr('tierDesc', bName(u.bi), u.mult);
  if (u.kind === 'tap') return u.mult ? tr('tapMult', u.mult) : tr('tapPct', Math.round(u.pct * 100));
  return tr('globalDesc', u.mult);
}

/* ---- numbers ---- */
const EN_SUFFIX = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'OcDc', 'NoDc', 'Vg'];
const KO_UNIT = ['', '만', '억', '조', '경', '해', '자', '양', '구', '간', '정', '재', '극', '항하사', '아승기', '나유타', '불가사의', '무량대수'];
let NOTATION = 'short';
function fmt(n, dec) {
  if (!isFinite(n)) return '∞';
  if (n < 0) return '-' + fmt(-n, dec);
  if (n < 1000) return n < 10 && dec ? n.toFixed(1).replace(/\.0$/, '') : Math.floor(n).toLocaleString('en-US');
  const sig = v => v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  if (NOTATION === 'sci') { const e = Math.floor(Math.log10(n)); return sig(n / Math.pow(10, e)).replace(/\.?0+$/, '') + 'e' + e; }
  if (LANG === 'ko') {
    if (n < 1e4) return Math.floor(n).toLocaleString('ko-KR');
    const k = Math.floor(Math.log10(n) / 4);
    if (k >= KO_UNIT.length) { const e = Math.floor(Math.log10(n)); return sig(n / Math.pow(10, e)) + 'e' + e; }
    return sig(n / Math.pow(10, 4 * k)) + KO_UNIT[k];
  }
  const k = Math.floor(Math.log10(n) / 3);
  if (k >= EN_SUFFIX.length) { const e = Math.floor(Math.log10(n)); return sig(n / Math.pow(10, e)) + 'e' + e; }
  return sig(n / Math.pow(10, 3 * k)) + EN_SUFFIX[k];
}
function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  if (h) return `${h}${tr('h')} ${m}${tr('m')}`;
  if (m) return `${m}${tr('m')} ${String(s).padStart(2, '0')}${tr('s')}`;
  return `${s}${tr('s')}`;
}
