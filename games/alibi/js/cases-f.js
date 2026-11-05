'use strict';
/* ALIBI — case pack F */
CASES.en.push(
  {
    id: 'locker', title: 'Locker 22', place: 'Northside Gym · 7:05 pm', difficulty: 2,
    intro: 'Vic came out of spin class to find locker 22 open and his watch gone. Three people were in the building for that hour. The locker room keeps records; so does the vending machine.',
    suspects: [['pam', 'Pam', 'Front desk'], ['theo', 'Theo', 'Spin instructor'], ['nell', 'Nell', 'Member, locker 23']],
    facts: [
      ['🚪', 'Locker-room turnstile log (member cards only): Vic in 17:55 · Nell in 18:02, out 18:08 · Vic out 19:05. Staff use the staff door, which keeps no log.'],
      ['🏃', 'Spin studio: attendance scan Vic 18:10, Nell 18:10. Class 18:10–19:00. Instructor roll call at 18:45: all twelve riders present. Class video shows Theo on the lead bike the whole hour.'],
      ['🗝️', 'Master-key sign-out sheet: Pam, 18:25–18:40, reason "member locked out, locker 14". No locked-out request was logged at the desk.'],
      ['🥤', 'Vending machine inside the locker room: 18:31, one sports drink, paid with Pam\'s staff card.'],
      ['📝', 'Vic\'s statement: went back for a towel at 18:09, watch still in locker 22, then straight into class.']
    ],
    chat: [
      { s: 'pam', t: '19:08', m: 'Vic says his watch is gone from locker 22. Did anyone see someone in the locker room during spin?' },
      { s: 'nell', t: '19:10', m: 'I was on the bike from six sharp. Never even used the locker room today, came in my gear.', ev: 0, lie: 'The turnstile log shows Nell\'s card entering the locker room at 18:02 and leaving at 18:08.' },
      { s: 'theo', t: '19:11', m: 'I had twelve riders in front of me until seven. Nobody walked out of my class.' },
      { s: 'pam', t: '19:13', m: 'I was at the desk the whole hour. Didn\'t set foot in the locker room.', ev: 3, lie: 'Her staff card bought a sports drink from the machine inside the locker room at 18:31.' },
      { s: 'nell', t: '19:14', m: 'Doesn\'t the master key get signed out? Check the sheet.' },
      { s: 'pam', t: '19:15', m: 'Sheet says locker 14, a member got locked out. Other wall entirely.' },
      { s: 'theo', t: '19:17', m: 'Who was locked out of 14? Nobody came to me about it.' },
      { s: 'pam', t: '19:18', m: 'Some guy. Didn\'t get a name.' },
      { s: 'nell', t: '19:20', m: 'A guy who doesn\'t exist, at 6:25, with the master key. Sure.' }
    ],
    culprit: 'pam',
    solve: 'Pam signed out the master key from 18:25 to 18:40 for a locked-out member nobody can name, and her own card bought a drink inside the locker room at 18:31 while she swore she was at the desk. Nell lied about never using the locker room, but the turnstile has her out by 18:08, Vic saw the watch at 18:09, and roll call put her on a bike at 18:45.'
  },
  {
    id: 'drone', title: 'Through the Glass', place: 'Orchard Lane greenhouse · 11:00 pm', difficulty: 3,
    intro: 'A drone came through the greenhouse roof at twenty past ten. The registration traces to one person. The flight log, the club paperwork and a parking receipt tell a longer story.',
    suspects: [['gil', 'Gil', 'Hobbyist, registered owner'], ['ren', 'Ren', 'Real-estate photographer'], ['jay', 'Jay', 'Teenager'], ['vera', 'Vera', 'Greenhouse owner\'s rival']],
    facts: [
      ['🛩️', 'Flight log recovered from the wreck: takeoff 22:14 from the gravel lot on Mill Road, 600 m from the greenhouse · crash 22:21.'],
      ['🪪', 'Registration lookup: the drone is registered to Gil.'],
      ['🤝', 'Hobby-club loan sheet: "Loaned to Vera, Thursday 18:00, return Sunday." Signed by Gil and Vera.'],
      ['🌬️', 'Weather station, 22:00–22:30: calm, wind 4 km/h. The flight log shows no wind correction.'],
      ['🅿️', 'Parking app receipt: Vera\'s car, Mill Road gravel lot, 22:05–22:30.']
    ],
    chat: [
      { s: 'gil', t: '23:02', m: 'The greenhouse owner just called the club. A drone went through his roof and the registration traces to ME.' },
      { s: 'gil', t: '23:03', m: 'It\'s been in my garage all week. Somebody must have stolen it.', ev: 2, lie: 'The club loan sheet, signed by Gil himself, shows the drone loaned to Vera on Thursday.' },
      { s: 'vera', t: '23:05', m: 'I was home all night. Haven\'t been near Mill Road in months.', ev: 4, lie: 'The parking app has Vera\'s car in the Mill Road gravel lot from 22:05 to 22:30, covering the 22:14 takeoff.' },
      { s: 'ren', t: '23:07', m: 'Probably a gust took it. It was blowing hard tonight, I cancelled a shoot because of the wind.', ev: 3, lie: 'The weather station recorded calm air at 4 km/h, and the flight log shows no wind correction.' },
      { s: 'jay', t: '23:08', m: 'I only fly at the park and never after dark. My dad would end me.' },
      { s: 'gil', t: '23:10', m: 'The flight log will say where it took off from.' },
      { s: 'vera', t: '23:11', m: 'Logs can be wrong.' },
      { s: 'jay', t: '23:13', m: 'The club keeps a loan sheet too. Who signed it out?' },
      { s: 'gil', t: '23:14', m: '…I\'ll check.' }
    ],
    culprit: 'vera',
    solve: 'The club sheet shows Gil lent the drone to Vera on Thursday, Vera\'s car sat in the Mill Road lot from 22:05 to 22:30, and the drone took off from that lot at 22:14. Gil lied about the garage to dodge the owner\'s liability, and Ren invented wind on a calm night, but nothing places Ren anywhere near Mill Road.'
  }
);
CASES.ko.push(
  {
    id: 'locker', title: '22번 사물함', place: '노스사이드 헬스장 · 오후 7:05', difficulty: 2,
    intro: '빅이 스피닝 수업을 마치고 나오니 22번 사물함이 열려 있고 시계가 사라졌다. 그 한 시간 동안 건물에 있던 사람은 셋. 탈의실에는 기록이 남고, 자판기에도 남는다.',
    suspects: [['pam', '팸', '프런트 직원'], ['theo', '테오', '스피닝 강사'], ['nell', '넬', '회원, 23번 사물함']],
    facts: [
      ['🚪', '탈의실 회전문 기록(회원 카드만): 빅 입장 17:55 · 넬 입장 18:02, 퇴장 18:08 · 빅 퇴장 19:05. 직원은 기록이 남지 않는 직원용 문을 쓴다.'],
      ['🏃', '스피닝 스튜디오: 출석 스캔 빅 18:10, 넬 18:10. 수업 18:10–19:00. 18:45 강사 점호: 12명 전원 자리에 있음. 수업 영상에 테오는 한 시간 내내 앞 자전거에 있다.'],
      ['🗝️', '마스터키 대출 장부: 팸, 18:25–18:40, 사유 "회원 잠김, 14번 사물함". 프런트에 잠김 신고 기록은 없음.'],
      ['🥤', '탈의실 안 자판기: 18:31, 이온음료 1개, 팸의 직원 카드로 결제.'],
      ['📝', '빅의 진술: 18:09에 수건 가지러 다시 들어갔을 때 시계는 22번 사물함에 있었고, 바로 수업에 들어감.']
    ],
    chat: [
      { s: 'pam', t: '19:08', m: '빅 씨가 22번 사물함에서 시계가 없어졌대요. 스피닝 시간에 탈의실에서 누구 본 사람 있어요?' },
      { s: 'nell', t: '19:10', m: '저는 6시 정각부터 자전거 위였어요. 오늘 탈의실은 쓰지도 않았어요, 운동복 입고 왔거든요.', ev: 0, lie: '회전문 기록에 넬의 카드가 18:02에 탈의실에 들어가 18:08에 나온 것으로 남아 있다.' },
      { s: 'theo', t: '19:11', m: '저는 7시까지 12명 앞에 있었어요. 제 수업에서 나간 사람 없어요.' },
      { s: 'pam', t: '19:13', m: '저는 한 시간 내내 프런트에 있었어요. 탈의실엔 발도 안 들였어요.', ev: 3, lie: '팸의 직원 카드로 18:31에 탈의실 안 자판기에서 이온음료를 샀다.' },
      { s: 'nell', t: '19:14', m: '마스터키는 대출 장부 쓰지 않나요? 장부 확인해 보세요.' },
      { s: 'pam', t: '19:15', m: '장부엔 14번이에요. 회원이 잠겨서요. 아예 반대쪽 벽이에요.' },
      { s: 'theo', t: '19:17', m: '14번 잠긴 사람이 누구예요? 저한테 온 사람은 없는데.' },
      { s: 'pam', t: '19:18', m: '어떤 남자분이요. 이름은 못 물어봤어요.' },
      { s: 'nell', t: '19:20', m: '존재하지 않는 남자가, 6시 25분에, 마스터키랑요. 그러시겠죠.' }
    ],
    culprit: 'pam',
    solve: '팸은 아무도 이름을 모르는 "잠긴 회원"을 이유로 18:25부터 18:40까지 마스터키를 빌렸고, 프런트에 있었다던 18:31에 본인 카드로 탈의실 안에서 음료를 샀다. 넬은 탈의실을 안 썼다고 거짓말했지만, 회전문 기록상 18:08에 나갔고 빅은 18:09에 시계를 봤으며 18:45 점호 때 넬은 자전거 위에 있었다.'
  },
  {
    id: 'drone', title: '유리를 뚫고', place: '오처드 레인 온실 · 오후 11:00', difficulty: 3,
    intro: '10시 20분쯤 드론 하나가 온실 지붕을 뚫고 떨어졌다. 등록 정보는 한 사람을 가리킨다. 비행 기록과 동호회 서류, 주차 영수증은 더 긴 이야기를 한다.',
    suspects: [['gil', '길', '취미 비행, 등록 소유자'], ['ren', '렌', '부동산 사진가'], ['jay', '제이', '10대'], ['vera', '베라', '온실 주인의 경쟁자']],
    facts: [
      ['🛩️', '잔해에서 복구한 비행 기록: 이륙 22:14, 밀 로드 자갈 주차장(온실에서 600m) · 추락 22:21.'],
      ['🪪', '등록 조회: 드론은 길 명의로 등록됨.'],
      ['🤝', '동호회 대여 장부: "베라에게 대여, 목요일 18:00, 일요일 반납." 길과 베라 서명.'],
      ['🌬️', '기상 관측, 22:00–22:30: 잔잔함, 풍속 4km/h. 비행 기록에 바람 보정 없음.'],
      ['🅿️', '주차 앱 영수증: 베라의 차, 밀 로드 자갈 주차장, 22:05–22:30.']
    ],
    chat: [
      { s: 'gil', t: '23:02', m: '온실 주인이 방금 동호회에 전화했어요. 드론이 지붕을 뚫었는데 등록 조회하니 제 이름이래요.' },
      { s: 'gil', t: '23:03', m: '일주일 내내 제 차고에 있었어요. 누가 훔쳐 간 게 분명해요.', ev: 2, lie: '길 본인이 서명한 동호회 대여 장부에 목요일에 베라에게 빌려준 것으로 남아 있다.' },
      { s: 'vera', t: '23:05', m: '저는 밤새 집에 있었어요. 밀 로드 근처엔 몇 달째 간 적도 없어요.', ev: 4, lie: '주차 앱에 베라의 차가 22:05부터 22:30까지 밀 로드 자갈 주차장에 있었고, 22:14 이륙 시각이 그 안에 든다.' },
      { s: 'ren', t: '23:07', m: '돌풍에 휩쓸린 거겠죠. 오늘 바람 엄청 셌어요, 저도 바람 때문에 촬영 취소했어요.', ev: 3, lie: '기상 관측은 풍속 4km/h의 잔잔한 밤이었고, 비행 기록에도 바람 보정이 없다.' },
      { s: 'jay', t: '23:08', m: '저는 공원에서만 날리고 밤엔 절대 안 해요. 아빠한테 죽어요.' },
      { s: 'gil', t: '23:10', m: '비행 기록 보면 어디서 이륙했는지 나올 거예요.' },
      { s: 'vera', t: '23:11', m: '기록도 틀릴 수 있죠.' },
      { s: 'jay', t: '23:13', m: '동호회에 대여 장부도 있잖아요. 누가 빌려 갔어요?' },
      { s: 'gil', t: '23:14', m: '…확인해 볼게요.' }
    ],
    culprit: 'vera',
    solve: '대여 장부는 길이 목요일에 베라에게 드론을 빌려줬다고 말하고, 베라의 차는 22:05부터 22:30까지 밀 로드 주차장에 있었으며, 드론은 22:14에 바로 그 주차장에서 이륙했다. 길은 소유자 책임을 피하려고 차고 이야기를 지어냈고, 렌은 바람 한 점 없는 밤에 돌풍을 꾸며 냈지만, 렌을 밀 로드 근처에 두는 증거는 아무것도 없다.'
  }
);
