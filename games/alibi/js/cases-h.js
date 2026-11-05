'use strict';
/* ALIBI — case pack H: the photo case. Most of the lies are contradicted by details inside one photo. */
CASES.en.push({
  id: 'window', title: 'The Window Seat', place: 'Café Oru · 4:40 pm', difficulty: 2,
  intro: 'The tip jar was full at twenty past four and empty by twenty-five to five. A customer at the window seat took one photo in between. Study it.',
  suspects: [['noa', 'Noa', 'Barista'], ['finn', 'Finn', 'Regular'], ['mara', 'Mara', 'Manager']],
  facts: [
    ['📷', 'Customer photo, 16:20, taken from the window seat.', ['wall clock reads 4:20', 'Noa at the espresso machine, steaming milk', 'tip jar on the counter, full to the lid', 'a man in a yellow raincoat with a FINN name patch at the door', 'rain streaking the window']],
    ['📱', 'Loyalty app check-in: Finn 16:18.'],
    ['🗓️', 'Staff schedule: Noa, break 16:22–16:40, out the back door. Back-door log: opened 16:23, 16:39.'],
    ['🏦', 'Mara counted the jar full at 16:20 before leaving; bank deposit slip stamped 16:31, branch two blocks away. Back at 16:35: jar empty.'],
    ['🌧️', 'Weather: rain from noon until evening.']
  ],
  chat: [
    { s: 'mara', t: '16:41', m: 'Tip jar is empty. Completely. It was full when I left for the bank at 4:20. Who was here?' },
    { s: 'noa', t: '16:43', m: 'Not me. I was already on my break at 4:20, out back on the step.', ev: 0, lie: 'The photo at 16:20 shows Noa at the espresso machine, steaming milk, with the clock reading 4:20.' },
    { s: 'finn', t: '16:44', m: "I didn't come in yesterday at all. It was pouring, I stayed home.", ev: 0, lie: 'The photo shows a man in a yellow raincoat with a FINN name patch standing at the door at 16:20.' },
    { s: 'mara', t: '16:45', m: 'Someone at the window seat took a picture around then. Sending it.' },
    { s: 'noa', t: '16:47', m: 'Okay, fine, I went on break a couple of minutes late. But the jar was still full when I walked out.' },
    { s: 'finn', t: '16:48', m: 'Lots of people own yellow raincoats.', ev: 1, lie: 'The loyalty app has Finn checking in at 16:18, two minutes before the photo.' },
    { s: 'mara', t: '16:50', m: 'Lots of people do not have your name sewn on the chest, Finn.' },
    { s: 'noa', t: '16:51', m: 'The counter was empty from 4:23. Anyone could have reached over.' },
    { s: 'finn', t: '16:52', m: 'So that is nobody, then.' }
  ],
  culprit: 'finn',
  solve: 'The photo settles it: at 4:20 the jar is full, Noa is still at the machine, and Finn is at the door in his named raincoat despite "staying home". Noa went out back at 16:23 and Mara was at the bank until 16:35, so Finn was alone at the counter for twelve minutes. Noa lied about her break only because she was late taking it; the same photo clears her, since the jar is full while she is still there.'
});
CASES.ko.push({
  id: 'window', title: '창가 자리', place: '카페 오루 · 오후 4:40', difficulty: 2,
  intro: '4시 20분에 가득했던 팁 통이 4시 35분에 비어 있었다. 그 사이에 창가 손님이 사진 한 장을 찍었다. 사진을 잘 보라.',
  suspects: [['noa', '노아', '바리스타'], ['finn', '핀', '단골'], ['mara', '마라', '매니저']],
  facts: [
    ['📷', '창가 손님 사진, 16:20.', ['벽시계 4시 20분', '노아는 에스프레소 머신 앞에서 우유 스팀 중', '카운터 위 팁 통은 뚜껑까지 가득', '문 앞에 FINN 이름표가 달린 노란 우비 남자', '창문에 빗줄기']],
    ['📱', '멤버십 앱 체크인: 핀 16:18.'],
    ['🗓️', '근무표: 노아, 휴식 16:22–16:40, 뒷문 이용. 뒷문 기록: 16:23 열림, 16:39 열림.'],
    ['🏦', '마라가 16:20 통 가득 확인 후 외출. 은행 입금 전표 16:31, 두 블록 거리. 16:35 복귀: 통 비어 있음.'],
    ['🌧️', '날씨: 정오부터 저녁까지 비.']
  ],
  chat: [
    { s: 'mara', t: '16:41', m: '팁 통 비었어요. 완전히. 4시 20분에 은행 갈 때는 가득했는데. 누가 있었어요?' },
    { s: 'noa', t: '16:43', m: '저 아니에요. 4시 20분엔 이미 휴식 중이라 뒷문 계단에 있었어요.', ev: 0, lie: '16:20 사진에 노아가 에스프레소 머신 앞에서 우유를 스팀하고 있고, 벽시계는 4시 20분이다.' },
    { s: 'finn', t: '16:44', m: '저 어제 아예 안 갔어요. 비가 너무 와서 집에 있었어요.', ev: 0, lie: '사진 문 앞에 FINN 이름표가 달린 노란 우비를 입은 남자가 16:20에 서 있다.' },
    { s: 'mara', t: '16:45', m: '그때쯤 창가 손님이 사진을 찍었대요. 보낼게요.' },
    { s: 'noa', t: '16:47', m: '네, 솔직히 휴식 몇 분 늦게 나갔어요. 근데 나갈 때 통은 가득했어요.' },
    { s: 'finn', t: '16:48', m: '노란 우비 입은 사람이 한둘인가요.', ev: 1, lie: '멤버십 앱에 핀이 사진 2분 전인 16:18에 체크인한 기록이 있다.' },
    { s: 'mara', t: '16:50', m: '가슴에 자기 이름 박아 놓은 사람은 한둘이 아니라 하나예요, 핀.' },
    { s: 'noa', t: '16:51', m: '4시 23분부터 카운터가 비어 있었어요. 누구든 손 뻗을 수 있었죠.' },
    { s: 'finn', t: '16:52', m: '그러니까 아무도 아니라는 거네요.' }
  ],
  culprit: 'finn',
  solve: '사진이 결론을 낸다. 4시 20분에 통은 가득하고, 노아는 아직 머신 앞이고, "집에 있었다"는 핀은 이름표 달린 우비 차림으로 문 앞에 있다. 노아는 16:23에 뒷문으로 나갔고 마라는 16:35까지 은행이었으니, 12분 동안 카운터 앞엔 핀뿐이었다. 노아는 휴식을 늦게 나간 게 들킬까 봐 거짓말했지만, 같은 사진이 그녀를 구한다. 그녀가 있을 때 통은 가득했다.'
});
Object.assign(OUTRO.en, {
  window: [
    { s: 'finn', m: 'A raincoat in a blurry phone picture. That is your whole case?' },
    { s: 'mara', m: 'A raincoat with FINN stitched on it, at 4:20, two minutes after your app check-in. Not blurry.' },
    { s: 'finn', m: "Rent went up and I was forty short. It's a jar of coins, I figured nobody counts it. I'll bring it back tomorrow, all of it." },
    { s: 'noa', m: 'And I said I was out back because I went on break three minutes late and thought I would get blamed. Sorry.' },
    { s: 'mara', m: 'Tomorrow, Finn. In the jar, not in my hand. And Noa, go on break when the schedule says.' }
  ]
});
Object.assign(OUTRO.ko, {
  window: [
    { s: 'finn', m: '흐릿한 폰 사진 속 우비요. 그게 전부예요?' },
    { s: 'mara', m: 'FINN 박힌 우비요. 4시 20분, 앱 체크인 2분 뒤. 흐릿하지 않아요.' },
    { s: 'finn', m: '월세가 올랐는데 4만 원이 모자랐어요. 동전 통이잖아요, 아무도 안 셀 줄 알았어요. 내일 다 돌려놓을게요.' },
    { s: 'noa', m: '저는 휴식 3분 늦게 나간 게 걸릴까 봐 뒷문에 있었다고 했어요. 죄송해요.' },
    { s: 'mara', m: '내일이에요, 핀. 제 손이 아니라 통에요. 노아는 근무표대로 쉬고요.' }
  ]
});
