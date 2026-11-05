'use strict';
/* ALIBI — case pack C */
CASES.en.push(
  {
    id: 'bakery', title: 'The Cold Oven', place: 'Bakery Lune · 6:10 am', difficulty: 2,
    intro: 'The overnight croissant batch is raw: someone switched the oven off while the shop was closed. Three people could get in last night, and two records disagree about one of them.',
    suspects: [['nia', 'Nia', 'Night baker'], ['sam', 'Sam', 'Owner\'s son, closes up'], ['kiro', 'Kiro', 'Flour delivery, has a key']],
    facts: [
      ['🔥', 'Oven controller log: ON 22:00 · OFF 23:48. No power interruption recorded.'],
      ['🚨', 'Back-door alarm log: armed 23:10 (Sam\'s code) · disarmed 23:40 (delivery code) · re-armed 23:55 (delivery code).'],
      ['📦', 'Flour delivery note: 6 sacks, signed "Kiro", 23:45.'],
      ['🚕', 'Taxi receipt: Nia, pickup at the bakery 22:30, drop-off home 22:52.'],
      ['🗣️', 'Statement from Mr. Hale, upstairs: "Nia\'s blue bike was chained outside the bakery at 23:30. She was there, I\'d bet on it."'],
      ['🔧', 'Repair-shop ticket, Monday: Nia\'s blue bike, rear flat. "Left chained at Bakery Lune until pickup on Saturday."']
    ],
    chat: [
      { s: 'sam', t: '06:12', m: 'Croissants are raw. Oven is stone cold. Who touched it??' },
      { s: 'nia', t: '06:15', m: 'I left at half ten by taxi. Oven was on and humming when I walked out.' },
      { s: 'sam', t: '06:16', m: 'Taxi? Mr. Hale upstairs says your bike was chained out front at half eleven. So you came back.' },
      { s: 'kiro', t: '06:17', m: 'Dropped the flour by the front, never used the back door or the alarm. Didn\'t go near the kitchen.', ev: 1, lie: 'The alarm log shows the back door disarmed with the delivery code at 23:40 and re-armed at 23:55, right around Kiro\'s 23:45 delivery.' },
      { s: 'sam', t: '06:18', m: 'I armed the alarm at 11:10 and went home. The oven was definitely OFF when I locked up, so whoever came back turned it on and off again.', ev: 0, lie: 'The oven log shows it running from 22:00 straight through to 23:48, so it was on when Sam locked up at 23:10.' },
      { s: 'nia', t: '06:20', m: 'My bike has been chained there since Monday. Rear flat. Ask the repair shop, I\'m picking it up Saturday.' },
      { s: 'kiro', t: '06:22', m: 'Maybe a power cut?' },
      { s: 'sam', t: '06:25', m: 'No outage, I asked the building. Nia, a flat tire is a very convenient story.' },
      { s: 'nia', t: '06:27', m: 'Then read the alarm log. Someone was inside after eleven, and it wasn\'t me or my bike.' }
    ],
    culprit: 'kiro',
    solve: 'Two records put Nia in two places: the taxi dropped her at home at 22:52, but the neighbor swears her bike proves she was back at 23:30. The repair ticket decides it: the bike has been chained there with a flat since Monday, so it proves nothing. That leaves the alarm log. The delivery code opened the back door at 23:40, Kiro signed for the flour at 23:45, and the oven went off at 23:48 while he was the only one inside. Sam lied about the oven being off to cover for not checking it, but he had armed the alarm and left at 23:10.'
  },
  {
    id: 'train', title: 'The 23:05 to Harbor', place: 'Last train · 11:50 pm', difficulty: 3,
    intro: 'A commuter\'s laptop bag vanished between Central and Harbor on the last train. The transit officer put everyone who was in carriage 3 into one chat.',
    suspects: [['mara', 'Mara', 'Commuter'], ['dell', 'Dell', 'Conductor'], ['yoon', 'Yoon', 'Student, similar bag'], ['bram', 'Bram', 'Busker']],
    facts: [
      ['🚆', 'Stop times: Central 23:05 · Riverside 23:14 · Oakfield 23:22 · Harbor 23:31 (terminus). The bag was missed at Harbor.'],
      ['📷', 'Platform CCTV, Oakfield 23:22: one passenger alights from carriage 3 carrying two bags, hood up, face not visible.'],
      ['💳', 'Gate tap-out log: Mara 23:23 Oakfield · Yoon 23:33 Harbor · Bram 23:35 Harbor. Dell is staff and does not tap.'],
      ['🎫', 'Conductor\'s ticket check, 23:10, carriage 3: student pass (Yoon) seated across from the passenger with the laptop bag.'],
      ['🧾', 'Lost & found, Harbor: nothing handed in before 23:50.']
    ],
    chat: [
      { s: 'dell', t: '23:50', m: 'Transit officer asked me to open this group. A laptop bag went missing on the 23:05. Where did everyone get off?' },
      { s: 'yoon', t: '23:52', m: 'Harbor. I have a bag like that but it\'s mine, textbooks inside, check it.' },
      { s: 'mara', t: '23:53', m: 'Rode all the way to Harbor too, dozed off the whole way, saw nothing.', ev: 2, lie: 'The gate log shows Mara tapped out at Oakfield at 23:23, one minute after the hooded passenger with two bags got off there.' },
      { s: 'bram', t: '23:54', m: 'Harbor. I was setting up to play in the hall by half eleven.' },
      { s: 'yoon', t: '23:55', m: 'And I was in the first carriage the whole trip, nowhere near anyone\'s bag.', ev: 3, lie: 'The conductor\'s 23:10 check places Yoon in carriage 3, seated across from the passenger with the laptop bag.' },
      { s: 'dell', t: '23:56', m: 'I checked carriage 3 at ten past. One person got off at Oakfield with the hood up, couldn\'t see a face.' },
      { s: 'mara', t: '23:57', m: 'Probably the student then. Same bag. Come on.' },
      { s: 'bram', t: '23:58', m: 'The gates keep a log, don\'t they?' },
      { s: 'dell', t: '23:59', m: 'They do.' }
    ],
    culprit: 'mara',
    solve: 'The bag left the train at Oakfield with the hooded passenger, and the only suspect who tapped out there was Mara, at 23:23. Yoon lied about his seat out of panic at being suspected, but he reached Harbor at 23:33 with his own bag, and nothing was swapped or handed in.'
  }
);
CASES.ko.push(
  {
    id: 'bakery', title: '식은 오븐', place: '베이커리 룬 · 오전 6:10', difficulty: 2,
    intro: '밤새 구워야 할 크루아상이 날것 그대로다. 가게가 닫힌 사이 누군가 오븐을 껐다. 어젯밤 들어올 수 있었던 사람은 셋. 그중 한 명에 대해 두 기록이 서로 다른 말을 한다.',
    suspects: [['nia', '니아', '야간 제빵사'], ['sam', '샘', '사장 아들, 마감 담당'], ['kiro', '키로', '밀가루 배송, 열쇠 보유']],
    facts: [
      ['🔥', '오븐 컨트롤러 기록: 켜짐 22:00 · 꺼짐 23:48. 정전 기록 없음.'],
      ['🚨', '뒷문 경보 기록: 설정 23:10(샘 코드) · 해제 23:40(배송 코드) · 재설정 23:55(배송 코드).'],
      ['📦', '밀가루 배송 전표: 6포대, 서명 "키로", 23:45.'],
      ['🚕', '택시 영수증: 니아, 가게 앞 승차 22:30, 집 하차 22:52.'],
      ['🗣️', '위층 헤일 씨 진술: "23:30에 니아 씨 파란 자전거가 가게 앞에 묶여 있었어요. 거기 있었던 거죠, 장담해요."'],
      ['🔧', '수리점 접수증, 월요일: 니아의 파란 자전거, 뒷바퀴 펑크. "토요일 수거 때까지 베이커리 룬 앞에 묶어 둠."']
    ],
    chat: [
      { s: 'sam', t: '06:12', m: '크루아상 다 날것이에요. 오븐이 완전히 식었어요. 누가 건드렸어요??' },
      { s: 'nia', t: '06:15', m: '저는 10시 반에 택시 타고 갔어요. 나갈 때 오븐 켜져서 돌아가고 있었고요.' },
      { s: 'sam', t: '06:16', m: '택시요? 위층 헤일 씨가 11시 반에 누나 자전거가 가게 앞에 묶여 있었대요. 그러니까 다시 왔던 거네요.' },
      { s: 'kiro', t: '06:17', m: '밀가루는 앞쪽에 내려놓고 갔어요. 뒷문도 경보도 안 건드렸고 주방 근처엔 가지도 않았어요.', ev: 1, lie: '경보 기록에 뒷문이 23:40에 배송 코드로 해제되고 23:55에 재설정된 것이 남아 있다. 키로가 서명한 23:45 배송 바로 그 시간대다.' },
      { s: 'sam', t: '06:18', m: '저는 11시 10분에 경보 걸고 집에 갔어요. 마감할 때 오븐은 분명히 꺼져 있었어요. 다시 온 사람이 켰다가 또 끈 거죠.', ev: 0, lie: '오븐 기록은 22:00부터 23:48까지 쭉 켜져 있었다고 말한다. 샘이 23:10에 마감할 때 오븐은 켜져 있었다.' },
      { s: 'nia', t: '06:20', m: '제 자전거는 월요일부터 거기 묶여 있어요. 뒷바퀴 펑크예요. 수리점에 물어보세요, 토요일에 찾으러 가요.' },
      { s: 'kiro', t: '06:22', m: '정전 아니었을까요?' },
      { s: 'sam', t: '06:25', m: '정전 없었어요. 건물에 물어봤어요. 누나, 펑크는 참 편리한 핑계네요.' },
      { s: 'nia', t: '06:27', m: '그럼 경보 기록을 읽어요. 11시 이후에 누가 안에 있었고, 그건 저도 제 자전거도 아니에요.' }
    ],
    culprit: 'kiro',
    solve: '두 기록이 니아를 두 곳에 둔다. 택시는 22:52에 그녀를 집에 내려 줬고, 이웃은 자전거가 23:30에 그녀가 돌아온 증거라고 장담한다. 수리점 접수증이 결론을 낸다. 자전거는 월요일부터 펑크 난 채 거기 묶여 있었으니 아무것도 증명하지 않는다. 남는 건 경보 기록이다. 배송 코드가 23:40에 뒷문을 열었고, 키로는 23:45에 전표에 서명했고, 23:48에 오븐이 꺼질 때 안에 있던 사람은 키로뿐이었다. 샘은 오븐을 확인하지 않은 책임을 피하려고 꺼져 있었다고 거짓말했지만, 23:10에 경보를 걸고 떠난 뒤였다.'
  },
  {
    id: 'train', title: '23:05 하버행', place: '막차 · 오후 11:50', difficulty: 3,
    intro: '막차에서 센트럴과 하버 사이 어딘가에 한 승객의 노트북 가방이 사라졌다. 교통 담당관이 3호차에 있던 사람들을 한 채팅방에 모았다.',
    suspects: [['mara', '마라', '통근자'], ['dell', '델', '승무원'], ['yoon', '윤', '학생, 비슷한 가방'], ['bram', '브람', '버스킹 연주자']],
    facts: [
      ['🚆', '정차 시각: 센트럴 23:05 · 리버사이드 23:14 · 오크필드 23:22 · 하버 23:31(종점). 가방이 없어진 걸 안 곳은 하버.'],
      ['📷', '오크필드 승강장 CCTV, 23:22: 3호차에서 가방 두 개를 든 승객 한 명 하차, 후드를 써서 얼굴 안 보임.'],
      ['💳', '개찰구 태그 기록: 마라 23:23 오크필드 · 윤 23:33 하버 · 브람 23:35 하버. 델은 직원이라 태그 없음.'],
      ['🎫', '승무원 검표, 23:10, 3호차: 학생 패스(윤) 확인, 노트북 가방을 든 승객 맞은편 좌석.'],
      ['🧾', '하버역 분실물 센터: 23:50 이전 접수된 물건 없음.']
    ],
    chat: [
      { s: 'dell', t: '23:50', m: '교통 담당관 요청으로 방 열었습니다. 23:05 열차에서 노트북 가방이 없어졌어요. 다들 어디서 내리셨죠?' },
      { s: 'yoon', t: '23:52', m: '하버요. 저도 비슷한 가방 있는데 제 거예요, 교과서 들었어요, 확인해 보세요.' },
      { s: 'mara', t: '23:53', m: '저도 하버까지 쭉 갔어요. 내내 졸아서 아무것도 못 봤어요.', ev: 2, lie: '개찰구 기록에 마라는 23:23 오크필드에서 나갔다. 가방 두 개를 든 후드 승객이 거기서 내린 1분 뒤다.' },
      { s: 'bram', t: '23:54', m: '하버요. 11시 반엔 역 홀에서 연주 준비하고 있었어요.' },
      { s: 'yoon', t: '23:55', m: '그리고 저는 내내 1호차에 있었어요. 누구 가방 근처에도 안 갔어요.', ev: 3, lie: '승무원의 23:10 검표 기록은 윤이 3호차, 노트북 가방을 든 승객 맞은편에 앉아 있었다고 말한다.' },
      { s: 'dell', t: '23:56', m: '3호차는 10분에 검표했어요. 오크필드에서 한 명이 후드 쓰고 내렸는데 얼굴은 못 봤습니다.' },
      { s: 'mara', t: '23:57', m: '그럼 학생이겠네요. 가방도 똑같고. 뻔하잖아요.' },
      { s: 'bram', t: '23:58', m: '개찰구에 기록 남지 않나요?' },
      { s: 'dell', t: '23:59', m: '남습니다.' }
    ],
    culprit: 'mara',
    solve: '가방은 오크필드에서 후드 쓴 승객과 함께 열차를 떠났고, 거기서 태그하고 나간 용의자는 23:23의 마라뿐이다. 윤은 의심받는 게 겁나서 좌석에 대해 거짓말했지만, 23:33에 자기 가방을 들고 하버에 도착했고 바뀐 것도 접수된 것도 없었다.'
  }
);
