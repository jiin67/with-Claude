'use strict';
/* ALIBI — case pack I: the conflicting-evidence case.
   Two facts disagree (camera still vs badge log); a third (the IT note) says which to trust. */
CASES.en.push({
  id: 'clock', title: 'The Laptop in the Quiet Room', place: 'Coworking Loft, 3F · 9:15 pm', difficulty: 2,
  intro: 'A laptop vanished from the quiet room between 20:50 and 21:10. The camera and the badge log tell different stories — and both look right.',
  suspects: [['ira', 'Ira', 'Member'], ['ben', 'Ben', 'Night receptionist'], ['suki', 'Suki', 'Cleaner']],
  facts: [
    ['📷', 'Lobby camera still, timestamp 20:48: Ira walking out the front door.'],
    ['🪪', 'Badge log: Ira out 21:03 · Suki in 21:25. Desk console: Ben signed in a courier at 20:56 and logged a call at 21:00.'],
    ['🛠️', 'IT note taped to the recorder: "Camera clock has run 15 minutes slow since Monday\'s power cut. Both cameras. Not fixed yet."'],
    ['🚪', 'Quiet-room door sensor: opened 20:55 and 21:01. No badge needed from inside.'],
    ['🧹', 'Cleaning roster: Suki, quiet room 21:30–21:45.'],
    ['📷', 'Back-door camera still (same recorder), timestamp 20:35–20:38: Ben outside the back door with a coffee.']
  ],
  chat: [
    { s: 'ben', t: '21:15', m: 'The laptop in the quiet room is gone. Owner says it was there at 8:50. Who was still on the floor?' },
    { s: 'ira', t: '21:17', m: 'Not me. I was out by 8:48 — the lobby camera has me leaving at 8:48.', ev: [1, 2], lie: 'The badge log has Ira leaving at 21:03. The camera\'s 20:48 is the same moment: the recorder runs 15 minutes slow, so 20:48 on screen is 21:03.' },
    { s: 'suki', t: '21:18', m: 'I only get to the quiet room at half nine. Already empty, so I called it in.' },
    { s: 'ben', t: '21:19', m: 'I never left the desk all night. Nobody walked past me with a laptop.', ev: 5, lie: 'The back-door still shows Ben outside with a coffee at 20:35 on the slow clock, which is 20:50 real time.' },
    { s: 'ira', t: '21:21', m: 'Then it went out the back. Cleaners use that door.' },
    { s: 'suki', t: '21:22', m: 'I came in through the front at 9:25 and badged. Look it up.' },
    { s: 'ben', t: '21:24', m: 'Badge log has you out at 21:03, Ira. Camera says 20:48. One of those is wrong.' },
    { s: 'ira', t: '21:25', m: 'Cameras don\'t lie.' },
    { s: 'suki', t: '21:26', m: 'IT taped a note on the recorder on Monday. Read it.' }
  ],
  culprit: 'ira',
  solve: 'Ira said she was out by 8:48, but that 20:48 timestamp is on the slow recorder: add 15 minutes and it is 21:03, exactly what the badge log says — inside the 20:50–21:10 window, two minutes after the quiet-room door opened at 21:01. Ben slipped out for a coffee but was back at the desk by 20:56, before the door opened, and Suki arrived at 21:25, after the laptop was gone. Only Ira was still inside when it vanished.'
});
CASES.ko.push({
  id: 'clock', title: '집중실의 노트북', place: '코워킹 로프트 3층 · 오후 9:15', difficulty: 2,
  intro: '20:50에서 21:10 사이에 집중실의 노트북이 사라졌다. 카메라와 출입 기록은 서로 다른 이야기를 한다. 둘 다 맞는 것처럼 보인다.',
  suspects: [['ira', '이라', '회원'], ['ben', '벤', '야간 안내 데스크'], ['suki', '수키', '청소']],
  facts: [
    ['📷', '로비 카메라 정지 화면, 표시 시각 20:48: 이라가 정문으로 나가는 모습.'],
    ['🪪', '출입 기록: 이라 퇴장 21:03 · 수키 입장 21:25. 데스크 콘솔: 벤이 20:56 택배 기사 등록, 21:00 전화 응대 기록.'],
    ['🛠️', '녹화기에 붙은 IT 메모: "월요일 정전 이후 카메라 시계가 15분 느림. 두 대 모두. 아직 수리 전."'],
    ['🚪', '집중실 문 센서: 20:55, 21:01 열림. 안에서는 카드 없이 열림.'],
    ['🧹', '청소 일정: 수키, 집중실 21:30–21:45.'],
    ['📷', '후문 카메라 정지 화면(같은 녹화기), 표시 시각 20:35–20:38: 벤이 커피를 들고 후문 밖에 서 있음.']
  ],
  chat: [
    { s: 'ben', t: '21:15', m: '집중실 노트북이 없어졌어요. 주인은 8시 50분까지 있었대요. 그 뒤에 층에 남아 있던 분?' },
    { s: 'ira', t: '21:17', m: '저 아니에요. 8시 48분에 나갔어요. 로비 카메라에 8시 48분에 나가는 게 찍혀 있어요.', ev: [1, 2], lie: '출입 기록에 이라의 퇴장은 21:03이다. 카메라의 20:48은 같은 순간이다. 녹화기가 15분 느리니 화면의 20:48이 실제 21:03이다.' },
    { s: 'suki', t: '21:18', m: '저는 9시 반에야 집중실에 가요. 이미 비어 있어서 바로 신고했어요.' },
    { s: 'ben', t: '21:19', m: '저는 밤새 데스크를 떠난 적이 없어요. 노트북 들고 지나간 사람도 없었고요.', ev: 5, lie: '후문 화면에 벤이 커피를 들고 밖에 있는 모습이 느린 시계로 20:35, 실제로는 20:50에 찍혀 있다.' },
    { s: 'ira', t: '21:21', m: '그럼 뒷문으로 나간 거네요. 청소하시는 분들이 그 문 쓰잖아요.' },
    { s: 'suki', t: '21:22', m: '저는 9시 25분에 정문으로 들어와서 카드 찍었어요. 확인해 보세요.' },
    { s: 'ben', t: '21:24', m: '이라 씨, 출입 기록은 21:03 퇴장이에요. 카메라는 20:48이고요. 둘 중 하나는 틀렸어요.' },
    { s: 'ira', t: '21:25', m: '카메라는 거짓말 안 해요.' },
    { s: 'suki', t: '21:26', m: '월요일에 IT가 녹화기에 메모 붙여 놨어요. 읽어 보세요.' }
  ],
  culprit: 'ira',
  solve: '이라는 8시 48분에 나갔다고 했지만, 그 20:48은 느린 녹화기의 시각이다. 15분을 더하면 21:03으로 출입 기록과 정확히 일치하고, 도난 시간대(20:50–21:10) 안이며 집중실 문이 열린 21:01의 2분 뒤다. 벤은 커피를 사러 잠깐 나갔지만 20:56에는 데스크에 돌아와 있었고, 수키는 노트북이 사라진 뒤인 21:25에 도착했다. 노트북이 사라질 때 안에 남아 있던 사람은 이라뿐이다.'
});
Object.assign(OUTRO.en, {
  clock: [
    { s: 'ira', m: 'Based on a badge log? Those things double-scan all the time. The camera has me leaving at 8:48.' },
    { s: 'suki', m: 'That camera has been fifteen minutes slow since Monday. IT taped a note on it. 8:48 on that screen is 9:03.' },
    { s: 'ira', m: 'Fine. Three months behind on this desk and my client bailed. The laptop was going on a resale site tonight. I\'d have been gone by morning.' },
    { s: 'ben', m: 'For the record, I did step out. Three minutes for a coffee at ten to nine. I didn\'t want it on my review.' },
    { s: 'suki', m: 'It\'s in your bag, Ira. Put it on the desk and Ben calls the owner, not the police. Your call.' }
  ]
});
Object.assign(OUTRO.ko, {
  clock: [
    { s: 'ira', m: '출입 기록 하나로요? 그거 이중 인식 맨날 나요. 카메라엔 제가 8시 48분에 나가는 게 찍혀 있어요.' },
    { s: 'suki', m: '그 카메라 월요일부터 15분 느려요. IT가 메모까지 붙여 놨어요. 그 화면의 8시 48분이 9시 3분이에요.' },
    { s: 'ira', m: '알았어요. 자리 월세 석 달 밀렸는데 클라이언트가 날랐어요. 노트북은 오늘 밤 중고 사이트에 올릴 생각이었어요. 아침이면 떠났을 거고요.' },
    { s: 'ben', m: '참고로 저 잠깐 나갔다 온 건 맞아요. 8시 50분에 커피 사러 3분. 평가에 남을까 봐 말 안 했어요.' },
    { s: 'suki', m: '가방 안에 있죠, 이라 씨. 데스크에 올려놓으면 벤이 경찰 말고 주인한테 전화할 거예요. 선택하세요.' }
  ]
});
