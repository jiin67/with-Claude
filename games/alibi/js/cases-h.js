'use strict';
/* ALIBI — case pack H: the photo case. Most of the lies are contradicted by details inside one photo. */
CASES.en.push({
  id: 'window', title: 'The Window Seat', place: 'Café Oru · 4:40 pm', difficulty: 2,
  intro: 'The tip jar was full at twenty past four and empty by twenty-five to five. A customer at the window seat took one photo in between. Study it.',
  suspects: [['noa', 'Noa', 'Barista', 'm'], ['finn', 'Finn', 'Regular', 'm'], ['mara', 'Mara', 'Manager', 'f']],
  facts: [
    ['📷', 'Customer photo, 16:20, taken from the window seat.', ['wall clock', 'espresso machine', 'tip jar on the counter', 'front door', 'window']],
    ['📱', 'Loyalty app: Finn checked in 16:18. His profile picture: a yellow raincoat.'],
    ['🗓️', 'Staff schedule: Noa, break 16:22–16:40, out the back door. Back-door log: opened 16:23, 16:39.'],
    ['🏦', 'Mara counted the jar full at 16:20 before leaving; bank deposit slip stamped 16:31, branch two blocks away. Back at 16:35: jar empty.'],
    ['🌧️', 'Weather: rain from noon until evening.']
  ],
  chat: [
    { s: 'mara', t: '16:41', m: 'Tip jar is empty. Completely. It was full when I left for the bank at 4:20. Who was here?' },
    { s: 'noa', t: '16:43', m: 'Not me. I was already on my break at 4:20, out back on the step.', ev: [0, 2], lie: 'The photo at 16:20 shows Noa at the espresso machine, steaming milk, with the clock reading 4:20. The staff schedule has his break starting at 16:22, so at 16:20 he was not on break yet.' },
    { s: 'finn', t: '16:44', m: "I didn't come in today at all. It's been pouring, I stayed home.", ev: [0, 1], lie: 'The photo shows a man in a yellow raincoat at the door at 16:20, the same raincoat as in Finn\'s profile picture, two minutes after his check-in. The loyalty app has Finn checking in at 16:18, so he was there that afternoon.' },
    { s: 'mara', t: '16:45', m: 'Someone at the window seat took a picture around then. Sending it.' },
    { s: 'noa', t: '16:47', m: 'Okay, fine, my break started at 4:22. But the jar was still full when I walked out.' },
    { s: 'finn', t: '16:48', m: 'Okay, I checked in at 4:18. But lots of people own yellow raincoats, and I left straight after.', ev: [0, 1], lie: 'The photo at 16:20 shows the man in the yellow raincoat still at the door, two minutes after Finn\'s 16:18 check-in. He had not left.' },
    { s: 'mara', t: '16:50', m: 'That yellow raincoat in your profile picture — that\'s you, Finn.' },
    { s: 'noa', t: '16:51', m: 'The counter was empty from 4:23. Anyone could have reached over.' },
    { s: 'finn', t: '16:52', m: 'So that is nobody, then.' }
  ],
  culprit: 'finn',
  solve: 'The photo settles it: at 4:20 the jar is full, Noa is still at the machine, and Finn is at the door in the same yellow raincoat as his profile picture despite "staying home". He then claimed he left right after checking in — but the photo catches him at the door at 16:20, two minutes later. Noa went out back at 16:23 and Mara was at the bank until 16:35, so Finn was alone at the counter for twelve minutes. Noa lied about already being on break at 4:20; the same photo clears him, since the jar is full while he is still there.'
});
CASES.ko.push({
  id: 'window', title: '창가 자리', place: '카페 오루 · 오후 4:40', difficulty: 2,
  intro: '4시 20분에 가득했던 팁 통이 4시 35분에 비어 있었다. 그 사이에 창가 손님이 사진 한 장을 찍었다. 사진을 잘 보라.',
  suspects: [['noa', '노아', '바리스타', 'm'], ['finn', '핀', '단골', 'm'], ['mara', '마라', '매니저', 'f']],
  facts: [
    ['📷', '창가 손님 사진, 16:20.', ['벽시계', '에스프레소 머신', '카운터 위 팁 통', '출입문', '창문']],
    ['📱', '멤버십 앱: 핀 16:18 체크인. 프로필 사진은 노란 우비 차림.'],
    ['🗓️', '근무표: 노아, 휴식 16:22–16:40, 뒷문 이용. 뒷문 기록: 16:23 열림, 16:39 열림.'],
    ['🏦', '마라가 16:20 통 가득 확인 후 외출. 은행 입금 전표 16:31, 두 블록 거리. 16:35 복귀: 통 비어 있음.'],
    ['🌧️', '날씨: 정오부터 저녁까지 비.']
  ],
  chat: [
    { s: 'mara', t: '16:41', m: '팁 통 비었어요. 완전히. 4시 20분에 은행 갈 때는 가득했는데. 누가 있었어요?' },
    { s: 'noa', t: '16:43', m: '저 아니에요. 4시 20분엔 이미 휴식 중이라 뒷문 계단에 있었어요.', ev: [0, 2], lie: '16:20 사진에 노아가 에스프레소 머신 앞에서 우유를 스팀하고 있고, 벽시계는 4시 20분이다. 근무표에 노아의 휴식은 16:22부터라, 16:20에는 아직 휴식이 아니었다.' },
    { s: 'finn', t: '16:44', m: '저 오늘 아예 안 갔어요. 비가 너무 와서 집에 있었어요.', ev: [0, 1], lie: '사진 속 문 앞에 노란 우비를 입은 남자가 16:20에 서 있다. 핀의 프로필 사진과 같은 우비이고, 체크인 2분 뒤다. 멤버십 앱에 핀이 16:18에 체크인한 기록도 있다.' },
    { s: 'mara', t: '16:45', m: '그때쯤 창가 손님이 사진을 찍었대요. 보낼게요.' },
    { s: 'noa', t: '16:47', m: '네, 솔직히 휴식은 16:22부터였어요. 근데 나갈 때 통은 가득했어요.' },
    { s: 'finn', t: '16:48', m: '네, 4시 18분에 체크인은 했어요. 근데 노란 우비 입은 사람이 한둘인가요? 바로 나갔고요.', ev: [0, 1], lie: '16:20 사진에 노란 우비를 입은 남자가 아직 문 앞에 있다. 핀의 16:18 체크인 2분 뒤다. 핀은 나가지 않았다.' },
    { s: 'mara', t: '16:50', m: '프로필 사진 속 노란 우비, 그게 딱 너예요, 핀.' },
    { s: 'noa', t: '16:51', m: '4시 23분부터 카운터가 비어 있었어요. 누구든 손 뻗을 수 있었죠.' },
    { s: 'finn', t: '16:52', m: '그러니까 아무도 아니라는 거네요.' }
  ],
  culprit: 'finn',
  solve: '사진이 결론을 낸다. 4시 20분에 통은 가득하고, 노아는 아직 머신 앞이고, "집에 있었다"는 핀은 프로필 사진과 같은 노란 우비 차림으로 문 앞에 있다. 그 뒤 체크인하고 바로 나갔다고 했지만, 사진은 2분 뒤인 16:20에 핀이 아직 문 앞에 있는 걸 잡아냈다. 노아는 16:23에 뒷문으로 나갔고 마라는 16:35까지 은행이었으니, 12분 동안 카운터 앞엔 핀뿐이었다. 노아는 4시 20분에 이미 쉬고 있었다고 거짓말했지만, 같은 사진이 노아를 구한다. 노아가 있을 때 통은 가득했다.'
});
Object.assign(OUTRO.en, {
  window: [
    { s: 'finn', m: 'A raincoat in a blurry phone picture. That is your whole case?' },
    { s: 'mara', m: 'The same yellow raincoat as your profile picture, at 4:20, two minutes after your app check-in. Not blurry.' },
    { s: 'finn', m: "Rent went up and I was forty short. It's a jar of coins, I figured nobody counts it. I'll bring it back tomorrow, all of it." },
    { s: 'noa', m: 'And I said I was out back because I had claimed I was already on break at 4:20. Sorry.' },
    { s: 'mara', m: 'Tomorrow, Finn. In the jar, not in my hand. And Noa, go on break when the schedule says.' }
  ]
});
Object.assign(OUTRO.ko, {
  window: [
    { s: 'finn', m: '흐릿한 폰 사진 속 우비요. 그게 전부예요?' },
    { s: 'mara', m: '프로필 사진이랑 똑같은 노란 우비요. 4시 20분, 앱 체크인 2분 뒤. 흐릿하지 않아요.' },
    { s: 'finn', m: '월세가 올랐는데 4만 원이 모자랐어요. 동전 통이잖아요, 아무도 안 셀 줄 알았어요. 내일 다 돌려놓을게요.' },
    { s: 'noa', m: '저는 4시 20분에 이미 쉬고 있다고 한 게 걸릴까 봐 뒷문에 있었다고 했어요. 죄송해요.' },
    { s: 'mara', m: '내일이에요, 핀. 제 손이 아니라 통에요. 노아는 근무표대로 쉬고요.' }
  ]
});
