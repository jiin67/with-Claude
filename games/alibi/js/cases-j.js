'use strict';
/* ALIBI — case pack J: the lie that proves innocence */
CASES.en.push({
  id: 'bike', title: 'The Missing E-Bike', place: 'Maple Court, 3rd-floor hallway · 10:45 pm', difficulty: 2,
  intro: 'Lin\'s electric bike vanished from the hallway rack between 22:00 and 22:30. Four people had the hallway that evening. The loudest liar is not the thief.',
  suspects: [['dae', 'Dae', 'Lin\'s roommate'], ['lin', 'Lin', 'Bike owner'], ['owen', 'Owen', 'Delivery rider, 3C'], ['piper', 'Piper', 'Building super']],
  facts: [
    ['🚪', 'Stairwell door log: Owen out 22:12 (delivery jacket on the camera) · Piper in 22:40 · Dae in 22:52. No other exits 22:00–22:30.'],
    ['🔌', 'Lobby scooter charger: Owen\'s scooter plugged in 21:30 at 4% · unplugged 22:05 at 9% · never plugged back in.'],
    ['🍔', 'Delivery app, Owen: order picked up 22:20 at Han Kitchen, 3 km away · delivered 22:34.'],
    ['🎬', 'Cinema ticket scan: Dae, Riverside Cinema (across town), 21:40 showing. Bus card tap back to Maple Court: 22:40.'],
    ['📚', 'Study group chat, 21:00: "Dae, you coming? Exam\'s Friday." Dae: "studying at home tonight 🙏". No reply after.']
  ],
  chat: [
    { s: 'lin', t: '22:46', m: 'My bike is GONE. It was locked on the rack at 10. Who was in the hallway?' },
    { s: 'dae', t: '22:48', m: 'Not me. I was home studying all night, door closed, headphones on. Didn\'t hear a thing.', ev: [3, 4], lie: 'The cinema scanned Dae\'s ticket across town at 21:40 and his bus card tapped back at 22:40. He was nowhere near the rack, and not studying either.' },
    { s: 'owen', t: '22:50', m: 'I was out on deliveries. My scooter was charging in the lobby the whole time, check the charger.', ev: 1, lie: 'The charger log shows the scooter unplugged at 22:05, at 9%, and never plugged back in.' },
    { s: 'piper', t: '22:51', m: 'I came in at 22:40 from the parking side. Rack was already empty by then.' },
    { s: 'lin', t: '22:53', m: 'Dae, you literally walked in two minutes ago. "Home all night"?' },
    { s: 'dae', t: '22:54', m: 'I went out for air. Briefly. It\'s not a crime.' },
    { s: 'owen', t: '22:55', m: 'Dae\'s been weird all week. Just saying.' },
    { s: 'piper', t: '22:57', m: 'The stairwell door logs everyone. I\'ll pull it.' },
    { s: 'dae', t: '22:58', m: 'Pull whatever you want.' }
  ],
  culprit: 'owen',
  solve: 'Owen\'s scooter came off the charger at 22:05 with 9% battery, he went out the stairwell door at 22:12, and at 22:20 he picked up an order 3 km away: impossible on a dead scooter, easy on Lin\'s e-bike. Dae lied about his entire evening, but the very ticket scan and bus tap that expose the lie put him across town until 22:40. His lie is what clears him; he just didn\'t want the study group to know he\'d gone to the movies.'
});
CASES.ko.push({
  id: 'bike', title: '사라진 전기자전거', place: '메이플 코트 3층 복도 · 오후 10:45', difficulty: 2,
  intro: '린의 전기자전거가 22:00에서 22:30 사이 복도 거치대에서 사라졌다. 그날 저녁 복도를 지난 사람은 넷. 가장 크게 거짓말하는 사람이 도둑은 아니다.',
  suspects: [['dae', '대현', '린의 룸메이트'], ['lin', '린', '자전거 주인'], ['owen', '오웬', '배달 기사, 3C호'], ['piper', '파이퍼', '관리인']],
  facts: [
    ['🚪', '계단실 문 기록: 오웬 22:12 나감(카메라에 배달 조끼) · 파이퍼 22:40 들어옴 · 대현 22:52 들어옴. 22:00–22:30 사이 다른 출입 없음.'],
    ['🔌', '로비 스쿠터 충전기: 오웬 스쿠터 21:30 연결(4%) · 22:05 분리(9%) · 이후 다시 연결 안 됨.'],
    ['🍔', '배달 앱, 오웬: 22:20 한 키친(3km 거리)에서 픽업 · 22:34 배달 완료.'],
    ['🎬', '영화관 티켓 스캔: 대현, 리버사이드 시네마(시내 반대편), 21:40 상영. 메이플 코트로 돌아오는 버스 카드 태그: 22:40.'],
    ['📚', '스터디 단톡, 21:00: "대현아 올 거야? 금요일 시험이야." 대현: "오늘은 집에서 공부할게 🙏". 이후 답 없음.']
  ],
  chat: [
    { s: 'lin', t: '22:46', m: '자전거 없어졌어. 10시에 거치대에 잠가 뒀는데. 복도에 누구 있었어?' },
    { s: 'dae', t: '22:48', m: '난 아냐. 밤새 집에서 공부했어, 문 닫고 이어폰 끼고. 아무 소리도 못 들었어.', ev: [3, 4], lie: '영화관에서 21:40에 시내 반대편에서 대현의 티켓을 스캔했고, 버스 카드는 22:40에 돌아오는 태그가 찍혔다. 거치대 근처에 없었고, 공부도 안 했다.' },
    { s: 'owen', t: '22:50', m: '저는 배달 나가 있었어요. 스쿠터는 내내 로비에서 충전 중이었고요, 충전기 확인해 보세요.', ev: 1, lie: '충전기 기록에 스쿠터가 22:05에 9%로 분리됐고 다시 연결되지 않았다.' },
    { s: 'piper', t: '22:51', m: '저는 22:40에 주차장 쪽으로 들어왔어요. 그때 거치대는 이미 비어 있었어요.' },
    { s: 'lin', t: '22:53', m: '대현아 너 2분 전에 들어왔잖아. "밤새 집"?' },
    { s: 'dae', t: '22:54', m: '바람 쐬러 잠깐 나갔어. 잠깐. 그게 죄야?' },
    { s: 'owen', t: '22:55', m: '대현 씨 이번 주 내내 이상했어요. 그냥 그렇다고요.' },
    { s: 'piper', t: '22:57', m: '계단실 문은 전부 기록돼요. 뽑아 볼게요.' },
    { s: 'dae', t: '22:58', m: '뽑고 싶은 대로 뽑으세요.' }
  ],
  culprit: 'owen',
  solve: '오웬의 스쿠터는 22:05에 9%로 충전기에서 빠졌고, 22:12에 계단실 문으로 나갔으며, 22:20에 3km 떨어진 곳에서 주문을 픽업했다. 방전된 스쿠터로는 불가능하지만 린의 전기자전거로는 쉽다. 대현은 저녁 전체를 거짓말했지만, 그 거짓말을 드러내는 티켓 스캔과 버스 태그가 그를 22:40까지 시내 반대편에 두었다. 거짓말이 곧 결백의 증거다. 스터디 모임에 영화 보러 간 걸 들키기 싫었을 뿐이다.'
});
Object.assign(OUTRO.en, {
  bike: [
    { s: 'owen', m: 'Me? I was working. You can see the deliveries right there in the app.' },
    { s: 'piper', m: 'Your scooter left the charger at 9% at 22:05. Nobody does a 3 km pickup at 22:20 on 9%. The door log has you out at 22:12.' },
    { s: 'owen', m: 'The battery died mid-shift and a cancelled order kills my rating. The bike was right there. I was going to bring it back after the last drop. I know. I know.' },
    { s: 'lin', m: 'It\'s in the Han Kitchen rack, isn\'t it. Go get it. Now.' },
    { s: 'dae', m: 'Okay, since we\'re confessing: I wasn\'t studying. I saw a movie. Please don\'t tell the study group.' },
    { s: 'lin', m: 'Dae, that is the least guilty thing anyone has said tonight.' }
  ]
});
Object.assign(OUTRO.ko, {
  bike: [
    { s: 'owen', m: '제가요? 저 일하고 있었어요. 배달 내역 앱에 다 있잖아요.' },
    { s: 'piper', m: '스쿠터가 22:05에 9%로 충전기에서 빠졌어요. 9%로 22:20에 3km 픽업은 못 가요. 문 기록엔 22:12에 나갔고요.' },
    { s: 'owen', m: '배달 중에 배터리가 죽었고, 주문 취소하면 평점이 날아가요. 자전거가 바로 거기 있었어요. 마지막 배달 끝나고 갖다 놓으려고 했어요. 알아요. 알아요.' },
    { s: 'lin', m: '한 키친 거치대에 있는 거죠? 가서 가져와요. 지금요.' },
    { s: 'dae', m: '그래, 다들 고백하는 김에: 나 공부 안 했어. 영화 봤어. 스터디 애들한테는 말하지 마.' },
    { s: 'lin', m: '대현아, 그게 오늘 밤 나온 말 중에 제일 떳떳한 말이야.' }
  ]
});
