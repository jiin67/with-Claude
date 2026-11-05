'use strict';
/* ALIBI — case pack A */
CASES.en.push(
  {
    id: 'library', title: 'The Rare Book', place: 'University library · 8:00 am', difficulty: 2,
    intro: 'A 1702 botanical folio vanished from the rare reading room overnight. The room was locked and alarmed. Three people had reasons to be in the building.',
    suspects: [['nora', 'Nora', 'Night librarian'], ['sam', 'Sam', 'Grad student'], ['gus', 'Gus', 'Security guard']],
    facts: [
      ['📚', 'Book scanner log: Hortus Botanicus scanned back into the rare room by Nora at 21:30. No checkout after that.'],
      ['🚨', 'Alarm panel, rare room: armed 22:05 · disarmed 23:10 · armed again 23:18. The disarm code belongs to security.'],
      ['🥤', 'Vending machine receipt, level 2 (next to the rare room door): 23:12, one can coffee, paid with Gus\'s staff card.'],
      ['🪪', 'Entrance gate log: Sam in 18:40, out 21:20. Student cards stop working at 22:00.'],
      ['📋', 'Shift roster: Nora 14:00–22:00 · Gus 22:00–06:00.']
    ],
    chat: [
      { s: 'nora', t: '08:02', m: 'Hortus is gone from the rare room. I shelved it myself at 9:30 and scanned it in.' },
      { s: 'gus', t: '08:05', m: 'Room was armed all night. Nobody went in after you locked up.', lie: 'The alarm panel shows the room disarmed at 23:10 and re-armed at 23:18.' },
      { s: 'sam', t: '08:06', m: 'I was in the reading room until Nora closed up at ten. Left with everyone else.', lie: 'The gate log shows Sam leaving the building at 21:20, before closing.' },
      { s: 'nora', t: '08:07', m: 'Sam, your desk was empty by half nine when I did the last round.' },
      { s: 'sam', t: '08:08', m: 'Maybe. Point is I didn\'t take anything.' },
      { s: 'gus', t: '08:09', m: 'I was doing rounds on level 4 around eleven, never touched level 2.', lie: 'His staff card bought a coffee at the level 2 vending machine, next to the rare room door, at 23:12.' },
      { s: 'nora', t: '08:10', m: 'The panel says the room was disarmed at ten past eleven. Only security has that code.' },
      { s: 'gus', t: '08:11', m: 'That panel glitches all the time.' },
      { s: 'sam', t: '08:12', m: 'Who else even has the code?' }
    ],
    culprit: 'gus',
    solve: 'Gus disarmed the rare room at 23:10 with the security code, bought a coffee at the machine by its door at 23:12 and re-armed it at 23:18. Sam lied about staying until closing to hide that he skipped out early, but his card could not open anything after 22:00.'
  },
  {
    id: 'wedding', title: 'The Ring Box', place: 'Hotel Aster, suite 1801 · 1:05 pm', difficulty: 3,
    intro: 'The ceremony is in an hour and the ring box is gone from the groom\'s desk. It was photographed there at five past twelve. Four people were around the suite since.',
    suspects: [['max', 'Max', 'Best man'], ['fern', 'Fern', 'Florist'], ['remy', 'Remy', 'Groom\'s cousin'], ['ivy', 'Ivy', 'Room service']],
    facts: [
      ['📸', 'Photographer\'s shot list: 12:05 rings on the desk, groom and best man in frame · 12:15–12:45 groomsmen on the terrace, Max in every frame · 12:50 family arrivals in the lobby, Remy with his parents.'],
      ['🔑', 'Keycard log, suite 1801: groom 11:20 · staff card (Ivy) 12:20 · groom 12:55. No other entries.'],
      ['💐', 'Florist delivery slip: boutonnières for 1801 handed over in the lobby at 12:15, "received: Ivy, room service". Ballroom flowers signed by the planner at 12:30.'],
      ['🤳', 'Terrace group selfie, 12:35: Max and the groomsmen. Remy is not in it.']
    ],
    chat: [
      { s: 'max', t: '13:05', m: 'Ring box isn\'t on the desk. Nobody panic. Who was in 1801 after noon?' },
      { s: 'ivy', t: '13:07', m: 'Room service here. I only left the towels at the door, never stepped inside 1801.', lie: 'The keycard log shows her staff card opening 1801 at 12:20, and she carried the boutonnières up to the suite.' },
      { s: 'fern', t: '13:08', m: 'I never went up to 18. Handed the boutonnières to room service in the lobby around quarter past.' },
      { s: 'remy', t: '13:09', m: 'I was already upstairs with you guys by half twelve, didn\'t see any box.', lie: 'The lobby photo shows Remy arriving with his parents at 12:50, and he is not in the 12:35 terrace selfie.' },
      { s: 'max', t: '13:10', m: 'Honestly I didn\'t even see the rings in the room this morning.', lie: 'The 12:05 photo has the rings on the desk with Max standing right there.' },
      { s: 'ivy', t: '13:11', m: 'Maybe the florist left the door open?' },
      { s: 'fern', t: '13:12', m: 'I didn\'t have a key. Check the lock log.' },
      { s: 'remy', t: '13:13', m: 'Hotel staff have master cards, just saying.' },
      { s: 'max', t: '13:14', m: 'Ceremony is in 45 minutes. Someone talk.' }
    ],
    culprit: 'ivy',
    solve: 'Ivy is the only person who entered 1801 between the ring photo at 12:05 and the groom\'s return at 12:55, and she lied about going in. Max lied about never seeing the rings because he was embarrassed he hadn\'t pocketed them, but he was on the terrace in every frame. Remy lied about being upstairs early, yet he only arrived at 12:50.'
  }
);
CASES.ko.push(
  {
    id: 'library', title: '희귀본 실종', place: '대학 도서관 · 오전 8:00', difficulty: 2,
    intro: '1702년 식물 도감이 밤사이 희귀본 열람실에서 사라졌다. 열람실은 잠겨 있었고 경보도 켜져 있었다. 건물에 있을 이유가 있던 사람은 셋.',
    suspects: [['nora', '나래', '야간 사서'], ['sam', '상우', '대학원생'], ['gus', '길수', '경비']],
    facts: [
      ['📚', '도서 스캐너 기록: 호르투스 보타니쿠스, 21:30 나래가 희귀본실에 반납 스캔. 이후 대출 없음.'],
      ['🚨', '희귀본실 경보 패널: 22:05 설정 · 23:10 해제 · 23:18 다시 설정. 해제 코드는 경비용.'],
      ['🥤', '2층 자판기 영수증 (희귀본실 문 옆): 23:12, 캔커피 1개, 길수의 직원 카드로 결제.'],
      ['🪪', '출입 게이트 기록: 상우 18:40 입장, 21:20 퇴장. 학생 카드는 22:00 이후 작동하지 않음.'],
      ['📋', '근무표: 나래 14:00–22:00 · 길수 22:00–06:00.']
    ],
    chat: [
      { s: 'nora', t: '08:02', m: '희귀본실에서 호르투스가 없어졌어요. 9시 반에 제가 직접 꽂고 스캔까지 했는데요.' },
      { s: 'gus', t: '08:05', m: '열람실은 밤새 경보 켜져 있었어요. 문 잠근 뒤로 아무도 안 들어갔습니다.', lie: '경보 패널에 23:10 해제, 23:18 재설정 기록이 남아 있다.' },
      { s: 'sam', t: '08:06', m: '저는 나래 쌤이 10시에 문 닫을 때까지 열람실에 있었어요. 다 같이 나왔고요.', lie: '게이트 기록에 상우는 폐관 전인 21:20에 건물을 나간 것으로 남아 있다.' },
      { s: 'nora', t: '08:07', m: '상우 씨, 9시 반에 마지막 순회 돌 때 자리 비어 있었는데요.' },
      { s: 'sam', t: '08:08', m: '그랬나요. 어쨌든 저는 아무것도 안 가져갔어요.' },
      { s: 'gus', t: '08:09', m: '11시쯤엔 4층 순찰 중이었고 2층은 근처도 안 갔어요.', lie: '길수의 직원 카드로 23:12에 2층 자판기에서, 그것도 희귀본실 문 옆에서 커피를 샀다.' },
      { s: 'nora', t: '08:10', m: '패널에는 11시 10분에 해제됐다고 나와요. 그 코드는 경비실만 알잖아요.' },
      { s: 'gus', t: '08:11', m: '그 패널 맨날 오작동해요.' },
      { s: 'sam', t: '08:12', m: '그 코드 아는 사람이 또 누가 있어요?' }
    ],
    culprit: 'gus',
    solve: '길수는 23:10에 경비 코드로 희귀본실 경보를 해제하고, 23:12에 문 옆 자판기에서 커피를 산 뒤, 23:18에 다시 설정했다. 상우는 일찍 빠져나간 걸 숨기려고 폐관까지 있었다고 거짓말했지만, 그의 카드는 22:00 이후 어떤 문도 열 수 없었다.'
  },
  {
    id: 'wedding', title: '사라진 반지 상자', place: '호텔 아스터 1801호 · 오후 1:05', difficulty: 3,
    intro: '예식까지 한 시간. 신랑 방 책상 위에 있던 반지 상자가 사라졌다. 12시 5분에 사진까지 찍어 둔 상자다. 그 뒤로 방 근처에 있던 사람은 넷.',
    suspects: [['max', '민재', '신랑 들러리'], ['fern', '다정', '플로리스트'], ['remy', '재민', '신랑 사촌'], ['ivy', '아영', '룸서비스']],
    facts: [
      ['📸', '사진사 촬영 목록: 12:05 책상 위 반지, 신랑과 들러리 함께 · 12:15–12:45 테라스 들러리 촬영, 민재는 모든 컷에 있음 · 12:50 로비 가족 도착, 재민이 부모님과 함께.'],
      ['🔑', '1801호 카드키 기록: 신랑 11:20 · 직원 카드(아영) 12:20 · 신랑 12:55. 다른 출입 없음.'],
      ['💐', '꽃 배송 전표: 1801호 부토니에, 12:15 로비에서 전달, "수령: 아영, 룸서비스". 연회장 꽃은 12:30 플래너 서명.'],
      ['🤳', '테라스 단체 셀카, 12:35: 민재와 들러리들. 재민은 없음.']
    ],
    chat: [
      { s: 'max', t: '13:05', m: '반지 상자가 책상에 없어. 다들 침착하고. 12시 이후에 1801호 들어간 사람?' },
      { s: 'ivy', t: '13:07', m: '룸서비스입니다. 수건만 문 앞에 두고 갔고 1801호 안에는 들어간 적 없어요.', lie: '카드키 기록에 아영의 직원 카드가 12:20에 1801호를 열었고, 부토니에도 아영이 방까지 가져갔다.' },
      { s: 'fern', t: '13:08', m: '저는 18층에 올라간 적 없어요. 12시 15분쯤 로비에서 룸서비스 분께 부토니에 드렸어요.' },
      { s: 'remy', t: '13:09', m: '나 12시 반엔 이미 올라가서 너희랑 있었어. 상자 같은 건 못 봤고.', lie: '로비 사진에 재민은 12:50에 부모님과 도착하는 것으로 찍혔고, 12:35 테라스 셀카에도 없다.' },
      { s: 'max', t: '13:10', m: '솔직히 난 아침에 방에서 반지를 본 적도 없어.', lie: '12:05 사진에 책상 위 반지와 함께 민재가 바로 옆에 서 있다.' },
      { s: 'ivy', t: '13:11', m: '플로리스트 분이 문을 열어 두고 가신 건 아닐까요?' },
      { s: 'fern', t: '13:12', m: '저는 키가 없었어요. 잠금 기록 확인해 보세요.' },
      { s: 'remy', t: '13:13', m: '호텔 직원은 마스터 카드 있잖아. 그냥 하는 말이야.' },
      { s: 'max', t: '13:14', m: '예식 45분 남았어. 누구든 말 좀 해.' }
    ],
    culprit: 'ivy',
    solve: '12:05 반지 사진과 12:55 신랑 귀환 사이에 1801호에 들어간 사람은 아영뿐이고, 아영은 들어간 적 없다고 거짓말했다. 민재는 반지를 챙기지 않은 게 민망해서 본 적 없다고 둘러댔지만 테라스 촬영 모든 컷에 있었다. 재민은 일찍 올라와 있었다고 했지만 12:50에야 도착했다.'
  }
);
