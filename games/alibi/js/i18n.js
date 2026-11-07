'use strict';
/* Language (Korean / English) and interface strings. Case text lives in cases.js. */
const LANG_KEY = 'alibi.lang';
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
    title: '알리바이 ALIBI', tagline: '채팅을 읽고, 증거와 대조하고, 거짓말을 잡아라.', start: '사건 파일 열기', cases: '사건 파일',
    tabChat: '채팅', tabEvidence: '증거', tabSuspects: '용의자', lies: (f, n) => `거짓말 ${f} / ${n}`, strikes: '실수',
    markLie: '거짓말로 표시', unmark: '표시 해제', notLie: '이 말은 증거와 어긋나지 않아요', foundLie: '거짓말 발견',
    accuse: '범인 지목', accuseWho: '누가 범인인가요?', wrongAccuse: '아니에요. 증거가 가리키는 사람이 아니에요.', confirm: '지목',
    solved: '사건 해결', failed: '수사 실패', failedSub: '실수가 세 번 쌓였어요. 찾은 거짓말은 그대로 두고 이어서 수사할 수 있어요. 무료로 이어하면 실수 1회부터, 광고를 보면 실수 0회부터 시작해요.', retry: '다시 수사', resume: '이어서 수사하기', resumeAd: '광고 보고 실수 없이 이어하기', restart: '처음부터 다시', next: '다음 사건', toList: '사건 목록',
    hint: '힌트', hintAd: '광고 보고 힌트', hintFree: '힌트 보기', hintNone: '지금은 힌트가 없어요', hintStep: n => `힌트 ${n}/3 — `,
    hintLie: n => `아직 못 찾은 거짓말이 있어요. ${n} 쪽의 말을 증거와 하나씩 대조해 보세요.`,
    hintMsg: (n, t) => `${n}의 ${t} 메시지를 다시 읽어보세요. 그 말이 증거와 어긋나는 지점이 있어요.`,
    hintEv: f => `이 증거와 어긋나요: ${f}`,
    recoverStrike: '광고 보고 실수 1회 되돌리기', recoverDone: '실수 1회를 되돌렸어요. 실수 1회로 계속합니다.',
    recoverStrikeFree: '실수 1회 되돌리기', recoverDoneFree: '실수 1회를 되돌렸어요. 힌트 1회를 사용했어요.',
    recoverHint: '실수 2회예요. 복구 버튼으로 1회를 되돌릴 수 있어요.', recoverHintFree: '실수 2회예요. 복구 버튼으로 1회를 되돌릴 수 있어요. 힌트 1회 사용.',
    hintAccuse: '거짓말을 한 사람 중, 사건 현장에 있을 수 있었던 사람은 누구인가요?',
    adFail: '지금은 광고를 불러올 수 없어요', adPlaying: '광고 재생 중…', locked: '이전 사건을 해결하면 열려요', stars: '별', diff: ['쉬움', '보통', '어려움'],
    tutorial: '채팅에서 수상한 말을 누르고 <b>거짓말로 표시</b>하세요. 증거 탭과 어긋나는 말이 거짓말이에요. 다 찾으면 범인을 지목합니다.',
    settings: '설정', sound: '효과음', language: '언어 / Language', reset: '진행 상황 지우기', resetConfirm: '정말 지우기', resetWarn: '모든 사건의 기록을 지웁니다.', close: '닫기', back: '뒤로',
    allDone: '모든 사건 해결', allDoneSub: '새 사건은 업데이트로 추가됩니다.', total: (s, m) => `별 ${s} / ${m}`, share: '기록 복사', copied: '복사했어요',
    result: (s, m) => `알리바이 ALIBI · 별 ${s}/${m} · 모든 사건 해결`,
    daily: '오늘의 사건', dailyDone: (st, t) => `오늘 해결 · ${'★'.repeat(st)} · ${t}`, dailySub: '매일 새 사건. 시간은 기록돼요.', time: '시간', claims: '이 사람의 주장', noClaims: '아직 한 말이 없어요',
    shareCase: (title, st, t) => `알리바이 ALIBI · ${title} · ${'★'.repeat(st)}${'☆'.repeat(3 - st)} · ${t}`, streak: n => `${n}일 연속`,
    music: '배경 음악', confessed: '자백', brief: '사건 개요', accuseLine: n => `범인은 ${n}, 당신이에요.`, me: '탐정', pickEv: '어느 증거와 어긋나나요?', wrongEv: '수상한 말은 맞아요. 하지만 어긋나는 증거는 그게 아니에요.', wrongEvFree: '거짓말은 맞아요. 다른 증거를 골라보세요 — 이번만 실수가 아니에요.', triedEv: '시도함', evidenceFirst: '증거', chatFirst: '채팅',
    coach: ['먼저 <b>증거</b> 탭을 열어 사실을 읽어 보세요.', '다시 <b>채팅</b>으로 돌아오세요.', n => `${n}의 말이 증거와 어긋나요. 그 말을 누르고, <b>어긋나는 증거</b>를 고르세요.`, '잘했어요. 남은 거짓말 하나는 직접 찾아보세요.', '거짓말을 다 찾았어요. <b>범인 지목</b>을 누르세요.']
  },
  en: {
    title: 'ALIBI', tagline: 'Read the chat. Check the evidence. Catch the lie.', start: 'Open the case files', cases: 'Case files',
    tabChat: 'Chat', tabEvidence: 'Evidence', tabSuspects: 'Suspects', lies: (f, n) => `Lies ${f} / ${n}`, strikes: 'Mistakes',
    markLie: 'Mark as a lie', unmark: 'Unmark', notLie: 'Nothing in the evidence contradicts this', foundLie: 'Lie found',
    accuse: 'Accuse', accuseWho: 'Who did it?', wrongAccuse: 'No. The evidence doesn\'t point there.', confirm: 'Accuse',
    solved: 'Case closed', failed: 'Investigation failed', failedSub: 'Three mistakes. Keep the lies you found and carry on, or start over. Resuming free starts back at 1 mistake; watch an ad to resume at 0.', retry: 'Try again', resume: 'Keep investigating', resumeAd: 'Watch an ad to resume at 0 mistakes', restart: 'Start over', next: 'Next case', toList: 'Case files',
    hint: 'Hint', hintAd: 'Watch ad for a hint', hintFree: 'Show hint', hintNone: 'No hint right now', hintStep: n => `Hint ${n}/3 — `,
    hintLie: n => `There is still a lie you haven't found. Check what ${n} says against the evidence, one claim at a time.`,
    hintMsg: (n, t) => `Re-read ${n}'s ${t} message. Something in it doesn't match the evidence.`,
    hintEv: f => `This fact contradicts it: ${f}`,
    recoverStrike: 'Watch an ad to undo 1 mistake', recoverDone: 'Undid 1 mistake — back to 1 mistake.',
    recoverStrikeFree: 'Undo 1 mistake', recoverDoneFree: 'Undid 1 mistake — it cost 1 hint.',
    recoverHint: '2 mistakes. The recovery button can undo one.', recoverHintFree: '2 mistakes. The recovery button can undo one — it costs 1 hint.',
    hintAccuse: 'Of the people who lied, who could actually have been at the scene?',
    adFail: 'No ad available right now', adPlaying: 'Ad playing…', locked: 'Solve the previous case to unlock', stars: 'stars', diff: ['Easy', 'Medium', 'Hard'],
    tutorial: 'Tap a suspicious message and <b>mark it as a lie</b>. A lie is a claim the Evidence tab contradicts. Find them all, then accuse.',
    settings: 'Settings', sound: 'Sound', language: 'Language / 언어', reset: 'Erase progress', resetConfirm: 'Really erase', resetWarn: 'Erases every case record.', close: 'Close', back: 'Back',
    allDone: 'All cases closed', allDoneSub: 'New cases arrive with updates.', total: (s, m) => `${s} / ${m} stars`, share: 'Copy result', copied: 'Copied',
    result: (s, m) => `ALIBI · ${s}/${m} stars · all cases closed`,
    daily: 'Today\'s case', dailyDone: (st, t) => `Solved today · ${'★'.repeat(st)} · ${t}`, dailySub: 'A new case every day. Your time counts.', time: 'Time', claims: 'What they claim', noClaims: 'Nothing said yet',
    shareCase: (title, st, t) => `ALIBI · ${title} · ${'★'.repeat(st)}${'☆'.repeat(3 - st)} · ${t}`, streak: n => `${n}-day streak`,
    music: 'Music', confessed: 'CONFESSED', brief: 'Case brief', accuseLine: n => `It was you, ${n}.`, me: 'Detective', pickEv: 'Which evidence contradicts it?', wrongEv: 'Right message, wrong evidence. Something else contradicts it.', wrongEvFree: 'Right message — try another piece of evidence. No mistake this time.', triedEv: 'tried', evidenceFirst: 'Evidence', chatFirst: 'Chat',
    coach: ['Open the <b>Evidence</b> tab first and read the facts.', 'Now go back to the <b>Chat</b>.', n => `What ${n} says doesn't match the evidence. Tap that message, then <b>pick the evidence it contradicts</b>.`, 'Nice. Find the remaining lie on your own.', 'All lies found. Press <b>Accuse</b>.']
  }
};
function tr(key, ...a) {
  const s = STR[LANG][key] !== undefined ? STR[LANG][key] : STR.en[key];
  if (s === undefined) return key;
  return typeof s === 'function' ? s(...a) : s;
}
/* play order: the tutorial first, then the cases with the strongest twists early, so fewer players quit before the good ones */
const ORDER = ['cake', 'window', 'vase', 'clock', 'guild', 'bike', 'hotel', 'podcast', 'festival', 'bakery', 'draft', 'karaoke', 'library', 'rooftop', 'dog', 'wedding', 'train', 'pool', 'exam', 'locker', 'gallery', 'drone', 'server'];
const CL = [...ORDER.map(id => CASES[LANG].find(c => c.id === id)).filter(Boolean), ...CASES[LANG].filter(c => !ORDER.includes(c.id))];

function fmtTime(sec) { sec = Math.max(0, Math.floor(sec)); const m = Math.floor(sec / 60), x = sec % 60; return m + ':' + String(x).padStart(2, '0'); }
