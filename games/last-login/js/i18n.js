'use strict';
/* Language (Korean / English) and the interface strings outside the story. */
const LANG_KEY = 'lastlogin.lang';
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
    title: '마지막 접속 LAST LOGIN', tagline: '실종된 연구원의 노트북. 로그인은 당신 몫이다.',
    start: '노트북 열기', resume: '이어서 하기', restart: '처음부터', chapter: n => `챕터 ${n}`,
    hint: '힌트', hintAd: '광고 보고 힌트', hintFree: '힌트 보기', hintNone: '이 화면에는 힌트가 없어요', hintUsed: (n, m) => `힌트 ${n} / ${m}`,
    adFail: '지금은 광고를 불러올 수 없어요', adPlaying: '광고 재생 중…',
    back: '뒤로', close: '닫기', menu: '메뉴', settings: '설정', sound: '효과음', language: '언어 / Language',
    reset: '진행 상황 지우기', resetConfirm: '정말 지우기', resetWarn: '처음부터 다시 시작합니다.',
    locked: '잠김', newApp: '새 앱', lockScreen: '잠금 화면', enterPin: 'PIN 입력', notif: '알림',
    chapterDone: n => `챕터 ${n} 완료`, next: '계속', typeAnswer: '답 입력', send: '보내기', unknownFile: '알 수 없는 파일',
    copied: '복사했어요', result: (t, h, w) => `마지막 접속 LAST LOGIN 클리어 · ${t} · 힌트 ${h} · 오답 ${w}`,
    inboxEmpty: '메일이 없습니다', pick: '선택', playing: '재생 중', paused: '일시정지', empty: '비어 있음'
  },
  en: {
    title: 'LAST LOGIN', tagline: "A missing researcher's laptop. The login is yours.",
    start: 'Open the laptop', resume: 'Continue', restart: 'Start over', chapter: n => `Chapter ${n}`,
    hint: 'Hint', hintAd: 'Watch ad for a hint', hintFree: 'Show hint', hintNone: 'No hints for this screen', hintUsed: (n, m) => `Hint ${n} / ${m}`,
    adFail: 'No ad available right now', adPlaying: 'Ad playing…',
    back: 'Back', close: 'Close', menu: 'Menu', settings: 'Settings', sound: 'Sound', language: 'Language / 언어',
    reset: 'Erase progress', resetConfirm: 'Really erase', resetWarn: 'Starts the game from the beginning.',
    locked: 'Locked', newApp: 'New app', lockScreen: 'Lock screen', enterPin: 'Enter PIN', notif: 'Notifications',
    chapterDone: n => `Chapter ${n} complete`, next: 'Continue', typeAnswer: 'Type your answer', send: 'Send', unknownFile: 'Unknown file',
    copied: 'Copied', result: (t, h, w) => `LAST LOGIN cleared · ${t} · ${h} hints · ${w} wrong answers`,
    inboxEmpty: 'No mail', pick: 'Pick', playing: 'Playing', paused: 'Paused', empty: 'Empty'
  }
};
function tr(key, ...a) {
  const s = STR[LANG][key] !== undefined ? STR[LANG][key] : STR.en[key];
  if (s === undefined) return key;
  return typeof s === 'function' ? s(...a) : s;
}
const C = CONTENT[LANG];
function fmtTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  return (h ? h + ':' : '') + String(m).padStart(h ? 2 : 1, '0') + ':' + String(s).padStart(2, '0');
}
