'use strict';
/* ALIBI — the exact words spoken in each confession video (art/ART_BRIEF.md §5),
   shown as the subtitle so text and voice match. A case without an entry
   falls back to the culprit's last outro line. */
const CONFESS = {
  en: {
    cake: 'Fine. I skipped lunch, and it was just sitting there. I only meant to take a corner… then there was no corner left.',
    window: 'Rent went up and I was forty short. I figured nobody counts a jar of coins. I\'ll bring it all back tomorrow.',
    vase: 'I came in with wet shoes and slipped. It just fell! I thought you\'d be madder about the shoes…',
    clock: 'Fine. I\'m three months behind on rent, and my client bailed. It was going on a resale site tonight.',
    bike: 'My battery died mid-shift, and a cancelled order kills my rating. The bike was right there. I know. I know.'
  },
  ko: {
    cake: '네, 알았어요. 점심도 걸렀는데 그냥 거기 있었어요. 귀퉁이만 먹으려고 했는데… 귀퉁이가 안 남았어요.',
    window: '월세가 올랐는데 4만 원이 모자랐어요. 동전 통은 아무도 안 셀 줄 알았어요. 내일 다 돌려놓을게요.',
    vase: '젖은 신발로 들어오다가 미끄러졌어. 그냥 떨어진 거야! 신발 때문에 더 혼날 줄 알았단 말이야…',
    clock: '알았어요. 월세 석 달 밀렸는데 클라이언트가 날랐어요. 오늘 밤 중고로 팔 생각이었어요.',
    bike: '배달 중에 배터리가 죽었고, 취소하면 평점이 날아가요. 자전거가 바로 거기 있었어요. 알아요. 알아요.'
  }
};
