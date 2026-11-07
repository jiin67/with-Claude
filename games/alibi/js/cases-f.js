'use strict';
/* ALIBI — case pack F
   locker: a photo carries the decisive details, and the loudest lie clears its teller
   drone:  two records disagree; a third decides which one counts */
CASES.en.push(
  {
    id: 'locker', title: 'Locker 22', place: 'Northside Gym · 7:05 pm', difficulty: 3,
    intro: 'Vic came out of spin class to find locker 22 open and his watch gone. Three people were in the building for that hour. A member\'s selfie by the water fountain shows more than she meant it to.',
    suspects: [['pam', 'Pam', 'Front desk', 'f'], ['theo', 'Theo', 'Spin instructor', 'm'], ['nell', 'Nell', 'Member, locker 23', 'f']],
    facts: [
      ['📷', 'Member selfie by the water fountain, 18:31. Posted with "halfway through spin 💦".', ['wall clock', 'front desk', 'key hook', 'locker-room door', 'desk surface']],
      ['🚪', 'Locker-room turnstile log (member cards only): Vic in 17:55 · Nell in 18:02, out 18:08 · Vic out 19:05. Staff use the staff door, which keeps no log.'],
      ['🗝️', 'Master-key sign-out sheet: Pam, 18:25–18:40, reason "member locked out, locker 14". The desk log has no locked-out request all evening; locker 14 has been unassigned since May.'],
      ['🏃', 'Spin studio: attendance scan Vic 18:10, Nell 18:10. Roll call at 18:45: all twelve riders present. Class video shows Theo on the lead bike 18:10–19:00.'],
      ['📝', 'Vic\'s statement: went back for a towel at 18:09, watch still in locker 22, then straight into class.']
    ],
    chat: [
      { s: 'pam', t: '19:08', m: 'Vic says his watch is gone from locker 22. Did anyone see someone in the locker room during spin?' },
      { s: 'nell', t: '19:10', m: 'I was on the bike from six sharp. Never even used the locker room today, came in my gear.', ev: 1, lie: 'The turnstile log has Nell\'s card going into the locker room at 18:02 and out at 18:08.' },
      { s: 'theo', t: '19:11', m: 'I had twelve riders in front of me until seven. Nobody walked out of my class.' },
      { s: 'pam', t: '19:13', m: 'I was at the desk the whole hour. Didn\'t set foot in the locker room.', ev: 0, lie: 'The 18:31 selfie shows the front desk empty behind the fountain, her lanyard on it, and the master-key hook bare.' },
      { s: 'nell', t: '19:14', m: 'Someone posted a selfie from the fountain at half six. The desk is in it.' },
      { s: 'pam', t: '19:15', m: 'I stepped away for two minutes, fine. A member was locked out of 14, I signed the key out for him.', ev: 2, lie: 'No locked-out request was logged that evening, and locker 14 has been unassigned since May.' },
      { s: 'theo', t: '19:17', m: 'Who was locked out of 14? Nobody came to me about it.' },
      { s: 'pam', t: '19:18', m: 'Some guy. Didn\'t get a name.' },
      { s: 'nell', t: '19:20', m: 'A guy who doesn\'t exist, for a locker nobody has, with the master key, during the one hour the room was empty. Sure.' }
    ],
    culprit: 'pam',
    solve: 'The selfie does the work: at 18:31 the desk is empty, Pam\'s lanyard is lying on it, the master-key hook is bare and the locker-room door is propped open, all inside the 18:25–18:40 window she signed the key out for a locked-out member who was never logged, for a locker nobody has. Nell lied about never using the locker room, but the very turnstile log that catches her also clears her: she was out at 18:08, Vic still saw the watch at 18:09, and roll call put her on a bike at 18:45.'
  },
  {
    id: 'drone', title: 'Through the Glass', place: 'Orchard Lane greenhouse · 11:00 pm', difficulty: 3,
    intro: 'A drone came through the greenhouse roof at twenty past ten. The registration traces to one person. Two records say Vera was in two places at once; a third says which one to believe.',
    suspects: [['gil', 'Gil', 'Hobbyist, registered owner', 'm'], ['ren', 'Ren', 'Real-estate photographer', 'n'], ['jay', 'Jay', 'Teenager', 'n'], ['vera', 'Vera', 'Greenhouse owner\'s rival', 'f']],
    facts: [
      ['🛩️', 'Flight log recovered from the wreck: takeoff 22:14 from the gravel lot on Mill Road, 600 m from the greenhouse · crash 22:21.'],
      ['📍', 'Vera\'s phone location history, which she sent to the group herself: "Home, 21:30–23:00."'],
      ['🅿️', 'Parking app receipt: Vera\'s car, Mill Road gravel lot, 22:05–22:30. Paid from her account.'],
      ['📱', 'The same phone\'s activity log: last unlock 21:40, no screen activity until 22:52. Location history records where the phone is, not where its owner is.'],
      ['🤝', 'Hobby-club loan sheet: "Loaned to Vera, Thursday 18:00, return Sunday." Signed by Gil and Vera.'],
      ['🌬️', 'Weather station, 22:00–22:30: calm, wind 4 km/h. The flight log shows no wind correction.']
    ],
    chat: [
      { s: 'gil', t: '23:02', m: 'The greenhouse owner just called the club. A drone went through his roof and the registration traces to ME.' },
      { s: 'gil', t: '23:03', m: 'It\'s been in my garage all week. Somebody must have stolen it.', ev: [0, 4], lie: 'The club loan sheet, signed by Gil himself, shows the drone loaned to Vera on Thursday. The flight log recovered from the wreck also has it taking off at 22:14 from the Mill Road lot, not sitting in a garage.' },
      { s: 'vera', t: '23:05', m: 'I was home all night. My phone\'s location history proves it, I\'ll send it right now.', ev: 2, lie: 'Her car was parked in the Mill Road lot from 22:05 to 22:30, paid from her own account. The phone history only shows where the phone was, and the phone sat untouched at home from 21:40 to 22:52.' },
      { s: 'ren', t: '23:07', m: 'Probably a gust took it. It was blowing hard tonight, I cancelled a shoot because of the wind.', ev: 5, lie: 'The weather station recorded calm air at 4 km/h, and the flight log shows no wind correction.' },
      { s: 'jay', t: '23:08', m: 'I only fly at the park and never after dark. My dad would end me.' },
      { s: 'gil', t: '23:10', m: 'Vera, your car paid for parking on Mill Road at five past ten. The lot the thing took off from.' },
      { s: 'vera', t: '23:11', m: 'Then someone used my car. My phone was home. You can\'t be in two places.' },
      { s: 'jay', t: '23:13', m: 'Your phone can be home without you. When did you last unlock it?' },
      { s: 'vera', t: '23:14', m: '…I don\'t see how that matters.' }
    ],
    culprit: 'vera',
    solve: 'Two records put Vera in two places: her phone says home, her car says the Mill Road lot from 22:05 to 22:30. The phone\'s own activity log settles it: nobody touched it from 21:40 to 22:52, so the history only proves the phone stayed home while Vera drove to the lot the drone took off from at 22:14, with the drone Gil had lent her on Thursday. Gil lied about the garage to dodge the owner\'s liability, and Ren invented wind on a calm night, but nothing places Ren near Mill Road.'
  }
);
CASES.ko.push(
  {
    id: 'locker', title: '22번 사물함', place: '노스사이드 헬스장 · 오후 7:05', difficulty: 3,
    intro: '빅이 스피닝 수업을 마치고 나오니 22번 사물함이 열려 있고 시계가 사라졌다. 그 한 시간 동안 건물에 있던 사람은 셋. 어느 회원이 정수기 앞에서 찍은 셀카에는 본인이 의도한 것보다 많은 것이 찍혀 있다.',
    suspects: [['pam', '팸', '프런트 직원', 'f'], ['theo', '테오', '스피닝 강사', 'm'], ['nell', '넬', '회원, 23번 사물함', 'f']],
    facts: [
      ['📷', '회원 셀카, 정수기 앞, 18:31. "스피닝 절반 완료 💦"와 함께 게시.', ['벽시계', '프런트 데스크', '키 걸이', '탈의실 문', '데스크 위']],
      ['🚪', '탈의실 회전문 기록(회원 카드만): 빅 입장 17:55 · 넬 입장 18:02, 퇴장 18:08 · 빅 퇴장 19:05. 직원은 기록이 남지 않는 직원용 문을 쓴다.'],
      ['🗝️', '마스터키 대출 장부: 팸, 18:25–18:40, 사유 "회원 잠김, 14번 사물함". 프런트 일지에 그날 저녁 잠김 신고는 없음. 14번 사물함은 5월부터 배정되지 않은 빈 칸.'],
      ['🏃', '스피닝 스튜디오: 출석 스캔 빅 18:10, 넬 18:10. 18:45 점호: 12명 전원 자리에 있음. 수업 영상에 테오는 18:10–19:00 내내 앞 자전거에 있다.'],
      ['📝', '빅의 진술: 18:09에 수건 가지러 다시 들어갔을 때 시계는 22번 사물함에 있었고, 바로 수업에 들어감.']
    ],
    chat: [
      { s: 'pam', t: '19:08', m: '빅 씨가 22번 사물함에서 시계가 없어졌대요. 스피닝 시간에 탈의실에서 누구 본 사람 있어요?' },
      { s: 'nell', t: '19:10', m: '저는 6시 정각부터 자전거 위였어요. 오늘 탈의실은 쓰지도 않았어요, 운동복 입고 왔거든요.', ev: 1, lie: '회전문 기록에 넬의 카드가 18:02에 탈의실에 들어가 18:08에 나온 것으로 남아 있다.' },
      { s: 'theo', t: '19:11', m: '저는 7시까지 12명 앞에 있었어요. 제 수업에서 나간 사람 없어요.' },
      { s: 'pam', t: '19:13', m: '저는 한 시간 내내 프런트에 있었어요. 탈의실엔 발도 안 들였어요.', ev: 0, lie: '18:31 셀카에 정수기 뒤 프런트가 비어 있고, 그 위에 팸의 사원증이 놓여 있으며, 마스터키 걸이가 비어 있는 것이 찍혀 있다.' },
      { s: 'nell', t: '19:14', m: '6시 반에 누가 정수기 앞에서 셀카 올렸던데요. 프런트가 찍혀 있어요.' },
      { s: 'pam', t: '19:15', m: '2분 자리 비운 건 맞아요. 회원이 14번에 잠겨서 제가 키 대출해 드린 거예요.', ev: 2, lie: '그날 저녁 잠김 신고는 기록에 없고, 14번 사물함은 5월부터 배정되지 않은 빈 칸이다.' },
      { s: 'theo', t: '19:17', m: '14번 잠긴 사람이 누구예요? 저한테 온 사람은 없는데.' },
      { s: 'pam', t: '19:18', m: '어떤 남자분이요. 이름은 못 물어봤어요.' },
      { s: 'nell', t: '19:20', m: '존재하지 않는 남자가, 아무도 안 쓰는 사물함 때문에, 마스터키를 들고, 탈의실이 빈 그 한 시간에요. 그러시겠죠.' }
    ],
    culprit: 'pam',
    solve: '셀카가 사건을 푼다. 18:31에 프런트는 비어 있고, 그 위에 팸의 사원증이 놓여 있고, 마스터키 걸이는 비어 있고, 탈의실 문은 괴어 열려 있다. 전부 팸이 "잠긴 회원" 때문에 키를 빌렸다는 18:25–18:40 안의 일인데, 그런 신고는 없었고 14번 사물함은 주인도 없다. 넬은 탈의실을 안 썼다고 거짓말했지만, 그 거짓말을 잡아낸 회전문 기록이 넬을 풀어 준다. 18:08에 나갔고, 빅은 18:09에 시계를 봤으며, 18:45 점호 때 넬은 자전거 위에 있었다.'
  },
  {
    id: 'drone', title: '유리를 뚫고', place: '오처드 레인 온실 · 오후 11:00', difficulty: 3,
    intro: '10시 20분쯤 드론 하나가 온실 지붕을 뚫고 떨어졌다. 등록 정보는 한 사람을 가리킨다. 두 기록은 베라가 동시에 두 곳에 있었다고 말하고, 세 번째 기록이 어느 쪽을 믿을지 알려 준다.',
    suspects: [['gil', '길', '취미 비행, 등록 소유자', 'm'], ['ren', '렌', '부동산 사진가', 'n'], ['jay', '제이', '10대', 'n'], ['vera', '베라', '온실 주인의 경쟁자', 'f']],
    facts: [
      ['🛩️', '잔해에서 복구한 비행 기록: 이륙 22:14, 밀 로드 자갈 주차장(온실에서 600m) · 추락 22:21.'],
      ['📍', '베라가 직접 단체방에 보낸 휴대폰 위치 기록: "집, 21:30–23:00."'],
      ['🅿️', '주차 앱 영수증: 베라의 차, 밀 로드 자갈 주차장, 22:05–22:30. 베라 계정으로 결제.'],
      ['📱', '같은 휴대폰의 사용 기록: 마지막 잠금 해제 21:40, 22:52까지 화면 활동 없음. 위치 기록은 휴대폰이 있던 곳이지, 주인이 있던 곳이 아니다.'],
      ['🤝', '동호회 대여 장부: "베라에게 대여, 목요일 18:00, 일요일 반납." 길과 베라 서명.'],
      ['🌬️', '기상 관측, 22:00–22:30: 잔잔함, 풍속 4km/h. 비행 기록에 바람 보정 없음.']
    ],
    chat: [
      { s: 'gil', t: '23:02', m: '온실 주인이 방금 동호회에 전화했어요. 드론이 지붕을 뚫었는데 등록 조회하니 제 이름이래요.' },
      { s: 'gil', t: '23:03', m: '일주일 내내 제 차고에 있었어요. 누가 훔쳐 간 게 분명해요.', ev: [0, 4], lie: '길 본인이 서명한 동호회 대여 장부에 목요일에 베라에게 빌려준 것으로 남아 있다. 잔해에서 복구한 비행 기록에도 22:14에 밀 로드 주차장에서 이륙한 것으로 남아 있어, 차고에 있던 게 아니다.' },
      { s: 'vera', t: '23:05', m: '저는 밤새 집에 있었어요. 휴대폰 위치 기록이 증명해요, 지금 바로 보낼게요.', ev: 2, lie: '베라의 차는 22:05부터 22:30까지 밀 로드 주차장에 있었고 베라 계정으로 결제됐다. 위치 기록은 휴대폰이 있던 곳일 뿐이고, 그 휴대폰은 21:40부터 22:52까지 집에서 아무도 건드리지 않았다.' },
      { s: 'ren', t: '23:07', m: '돌풍에 휩쓸린 거겠죠. 오늘 바람 엄청 셌어요, 저도 바람 때문에 촬영 취소했어요.', ev: 5, lie: '기상 관측은 풍속 4km/h의 잔잔한 밤이었고, 비행 기록에도 바람 보정이 없다.' },
      { s: 'jay', t: '23:08', m: '저는 공원에서만 날리고 밤엔 절대 안 해요. 아빠한테 죽어요.' },
      { s: 'gil', t: '23:10', m: '베라 씨, 10시 5분에 베라 씨 차가 밀 로드 주차비를 냈어요. 드론이 뜬 바로 그 주차장이요.' },
      { s: 'vera', t: '23:11', m: '그럼 누가 제 차를 썼겠죠. 제 폰은 집에 있었어요. 사람이 두 군데 있을 순 없잖아요.' },
      { s: 'jay', t: '23:13', m: '폰은 사람 없이도 집에 있을 수 있죠. 마지막으로 잠금 푼 게 언제예요?' },
      { s: 'vera', t: '23:14', m: '…그게 왜 중요한지 모르겠네요.' }
    ],
    culprit: 'vera',
    solve: '두 기록이 베라를 두 곳에 둔다. 휴대폰은 집, 차는 22:05부터 22:30까지 밀 로드 주차장. 휴대폰 사용 기록이 결론을 낸다. 21:40부터 22:52까지 아무도 건드리지 않았으니, 위치 기록은 휴대폰이 집에 있었다는 것만 증명한다. 그사이 베라는 목요일에 길에게 빌린 드론을 들고 주차장으로 갔고, 드론은 22:14에 그곳에서 떴다. 길은 소유자 책임을 피하려고 차고 이야기를 지어냈고, 렌은 바람 한 점 없는 밤에 돌풍을 꾸며 냈지만, 렌을 밀 로드 근처에 두는 증거는 없다.'
  }
);
