'use strict';
/* ALIBI — case pack G */
CASES.en.push(
  {
    id: 'karaoke', title: 'Room 7', place: 'Star Karaoke · 11:30 pm', difficulty: 1,
    intro: 'Dani\'s phone vanished from karaoke room 7 at the end of her birthday party. Three people were in and out of that room tonight. One of them walked off with it.',
    suspects: [['yuri', 'Yuri', 'Booked the room'], ['sol', 'Sol', 'Staff'], ['teo', 'Teo', 'Latecomer']],
    facts: [
      ['🚪', 'Room 7 door log: Yuri in 20:00 · Sol (staff card) in 21:40, out 21:44 · Teo in 22:35. Party checked out 23:10.'],
      ['🎤', 'Song queue: 22:41 "Dynamite" queued by Teo · 22:52 "Bad Guy" queued by Yuri · 23:05 "Hype Boy" queued by Teo.'],
      ['🧾', 'Bar receipt, room 7: 2 lemonades, ordered 21:38, delivered 21:42 by Sol. No other orders.'],
      ['📍', 'Find My Phone: 23:08 inside Star Karaoke · 23:14 at the bus stop 50 m from the entrance, moving · then offline.'],
      ['🚌', 'Transit card log: Teo tapped in at that bus stop at 23:15, route 273.']
    ],
    chat: [
      { s: 'yuri', t: '23:31', m: 'Dani\'s phone is gone. It was on the table by the mic while we were singing. Who saw it last?' },
      { s: 'sol', t: '23:33', m: 'Staff here. I just handed the lemonades in at the door around 9:40, never actually stepped into room 7.', ev: 0, lie: 'The door log shows Sol\'s staff card opening room 7 at 21:40 and leaving at 21:44.' },
      { s: 'teo', t: '23:35', m: 'I got there late, sang two songs, left a bit before you guys. Walked home, it\'s ten minutes.', ev: 4, lie: 'The transit card log shows Teo tapping in at the bus stop at 23:15, a minute after the phone pinged there.' },
      { s: 'yuri', t: '23:36', m: 'Dani checked Find My Phone. It was still in the building at 11:08.' },
      { s: 'sol', t: '23:38', m: 'Then it left with the party. We lock the rooms right after checkout.' },
      { s: 'teo', t: '23:39', m: 'Could\'ve fallen between the couch cushions. Those rooms eat everything.' },
      { s: 'yuri', t: '23:41', m: 'Staff checked, nothing. And it pinged at the bus stop at 11:14. Moving.' },
      { s: 'teo', t: '23:42', m: 'Lots of people take that bus.' }
    ],
    culprit: 'teo',
    solve: 'The phone was still inside at 23:08 and at the bus stop at 23:14, moving. Teo tapped his transit card at that stop at 23:15 while claiming he walked home. Sol lied about stepping into the room, but Sol left at 21:44, hours before the phone moved.'
  },
  {
    id: 'server', title: 'DROP DATABASE', place: 'Engineering chat · 8:10 am', difficulty: 3,
    intro: 'The production database was deleted at 03:12 and restored from backup an hour later. The audit log blames a shared service account. Four people could have been behind it.',
    suspects: [['ona', 'Ona', 'On-call engineer'], ['rex', 'Rex', 'Contractor'], ['vale', 'Vale', 'CTO'], ['pip', 'Pip', 'New hire']],
    facts: [
      ['🔐', 'VPN login log: Ona 02:50–03:30 · Rex 03:02–03:20 · Vale 08:10. Pip: no login after 18:00 yesterday.'],
      ['🧾', 'Command audit log: 03:12 "DROP DATABASE prod" by account svc-deploy, via the bastion host. The bastion does not record client IPs.'],
      ['📟', 'On-call schedule: Ona this week. Pager alert "disk 91%" fired 02:48, acknowledged by Ona at 02:50.'],
      ['🎫', 'Credential rotation ticket, Monday: svc-deploy password rotated. "Shared with: Rex (migration work), Pip (onboarding walkthrough)". Nobody else.'],
      ['💬', 'Slack, yesterday 22:30, Pip: "laptop\'s staying at the office, heading out, back Monday".']
    ],
    chat: [
      { s: 'vale', t: '08:12', m: 'Prod was dropped at 3:12 and restored from backup. Audit says svc-deploy. Who was on last night?' },
      { s: 'ona', t: '08:14', m: 'I was on call but it was dead quiet, no alerts all night. First I heard of it was your message.', ev: 2, lie: 'The pager fired a disk alert at 02:48 and Ona acknowledged it at 02:50.' },
      { s: 'rex', t: '08:15', m: 'Not me. Logged off at six, asleep till seven. Never touched the VPN.', ev: 0, lie: 'The VPN log shows Rex connected from 03:02 to 03:20, covering the 03:12 drop.' },
      { s: 'pip', t: '08:16', m: 'I don\'t even have prod access set up yet. And my laptop stayed at the office over the weekend.' },
      { s: 'vale', t: '08:18', m: 'svc-deploy is internal only. No contractor has ever been given that password.', ev: 3, lie: 'Monday\'s rotation ticket says the new svc-deploy password was shared with Rex, a contractor.' },
      { s: 'ona', t: '08:19', m: 'The bastion doesn\'t log client IPs. The VPN does, though.' },
      { s: 'rex', t: '08:21', m: 'Could be an automated job. Those run at night.' },
      { s: 'pip', t: '08:22', m: 'Doesn\'t the rotation ticket list who got the new password this week?' },
      { s: 'vale', t: '08:23', m: 'Pulling it now.' }
    ],
    culprit: 'rex',
    solve: 'Only Rex and Pip held the svc-deploy password, and Pip had no VPN session after 18:00. Rex was on the VPN from 03:02 to 03:20, straddling the 03:12 drop, and lied about it. Ona lied about the quiet pager to hide that she slept through the warning, but she never had the password. Vale\'s claim about contractors was simply wrong.'
  }
);
CASES.ko.push(
  {
    id: 'karaoke', title: '7번 방', place: '스타 노래방 · 오후 11:30', difficulty: 1,
    intro: '다니의 생일 파티가 끝날 무렵, 노래방 7번 방에서 다니의 휴대폰이 사라졌다. 오늘 밤 그 방을 드나든 사람은 셋. 그중 하나가 들고 나갔다.',
    suspects: [['yuri', '유리', '방 예약자'], ['sol', '솔', '직원'], ['teo', '태오', '늦게 온 친구']],
    facts: [
      ['🚪', '7번 방 출입 기록: 유리 20:00 입장 · 솔(직원 카드) 21:40 입장, 21:44 퇴장 · 태오 22:35 입장. 파티 체크아웃 23:10.'],
      ['🎤', '선곡 기록: 22:41 "Dynamite" 태오 예약 · 22:52 "Bad Guy" 유리 예약 · 23:05 "Hype Boy" 태오 예약.'],
      ['🧾', '7번 방 영수증: 레모네이드 2잔, 21:38 주문, 21:42 솔이 배달. 다른 주문 없음.'],
      ['📍', '내 휴대폰 찾기: 23:08 스타 노래방 안 · 23:14 입구에서 50m 떨어진 버스 정류장, 이동 중 · 이후 오프라인.'],
      ['🚌', '교통카드 기록: 태오, 23:15 그 정류장에서 273번 버스 승차.']
    ],
    chat: [
      { s: 'yuri', t: '23:31', m: '다니 폰 없어졌어. 노래 부를 때 마이크 옆 테이블에 있었는데. 마지막으로 본 사람?' },
      { s: 'sol', t: '23:33', m: '직원입니다. 9시 40분쯤 레모네이드만 문 앞에서 건넸고, 7번 방 안에는 들어간 적 없어요.', ev: 0, lie: '출입 기록에 솔의 직원 카드로 21:40에 7번 방에 들어갔다가 21:44에 나온 것이 남아 있다.' },
      { s: 'teo', t: '23:35', m: '나 늦게 가서 두 곡 부르고 너희보다 좀 먼저 나왔어. 걸어서 집에 갔고, 10분 거리잖아.', ev: 4, lie: '교통카드 기록에 태오가 23:15에 그 정류장에서 버스를 탄 것이 남아 있다. 휴대폰이 거기서 잡히고 1분 뒤다.' },
      { s: 'yuri', t: '23:36', m: '다니가 폰 찾기 돌려 봤는데 11시 8분엔 아직 건물 안이었대.' },
      { s: 'sol', t: '23:38', m: '그럼 파티랑 같이 나간 거네요. 체크아웃하면 바로 방을 잠그거든요.' },
      { s: 'teo', t: '23:39', m: '소파 틈에 빠진 거 아냐? 그 방 뭐든 잘 먹잖아.' },
      { s: 'yuri', t: '23:41', m: '직원분이 확인했는데 없대. 그리고 11시 14분에 버스 정류장에서 잡혔어. 이동 중으로.' },
      { s: 'teo', t: '23:42', m: '그 버스 타는 사람 많잖아.' }
    ],
    culprit: 'teo',
    solve: '휴대폰은 23:08에 아직 건물 안에 있었고 23:14에 버스 정류장에서 이동 중이었다. 태오는 걸어갔다고 했지만 23:15에 바로 그 정류장에서 교통카드를 찍었다. 솔은 방에 들어간 걸 숨겼지만 21:44에 나갔고, 휴대폰이 움직인 건 그로부터 한참 뒤다.'
  },
  {
    id: 'server', title: 'DROP DATABASE', place: '엔지니어링 채팅 · 오전 8:10', difficulty: 3,
    intro: '새벽 3시 12분에 운영 데이터베이스가 삭제됐고 한 시간 뒤 백업으로 복구됐다. 감사 기록은 공용 서비스 계정을 가리킨다. 뒤에 있을 수 있는 사람은 넷.',
    suspects: [['ona', '온아', '당직 엔지니어'], ['rex', '렉스', '외주 개발자'], ['vale', '베일', 'CTO'], ['pip', '핍', '신입']],
    facts: [
      ['🔐', 'VPN 접속 기록: 온아 02:50–03:30 · 렉스 03:02–03:20 · 베일 08:10. 핍: 어제 18:00 이후 접속 없음.'],
      ['🧾', '명령 감사 기록: 03:12 "DROP DATABASE prod", 계정 svc-deploy, 배스천 호스트 경유. 배스천은 접속 IP를 남기지 않음.'],
      ['📟', '당직표: 이번 주 온아. 02:48 "디스크 91%" 호출기 경보 발생, 02:50 온아가 확인 처리.'],
      ['🎫', '비밀번호 교체 티켓, 월요일: svc-deploy 비밀번호 교체. "공유 대상: 렉스(마이그레이션 작업), 핍(온보딩 실습)". 그 외 없음.'],
      ['💬', '슬랙, 어제 22:30, 핍: "노트북 사무실에 두고 퇴근합니다, 월요일에 봬요".']
    ],
    chat: [
      { s: 'vale', t: '08:12', m: '3시 12분에 운영 DB가 삭제됐고 백업으로 복구했어요. 감사 기록은 svc-deploy예요. 어젯밤 접속한 사람?' },
      { s: 'ona', t: '08:14', m: '제가 당직이었는데 밤새 조용했어요. 경보 하나 없었고, 방금 메시지 보고 처음 알았어요.', ev: 2, lie: '호출기는 02:48에 디스크 경보를 울렸고 온아가 02:50에 확인 처리했다.' },
      { s: 'rex', t: '08:15', m: '저 아니에요. 6시에 로그아웃하고 7시까지 잤어요. VPN 근처에도 안 갔어요.', ev: 0, lie: 'VPN 기록에 렉스가 03:02부터 03:20까지 접속해 있었다. 03:12 삭제 시각을 그대로 덮는다.' },
      { s: 'pip', t: '08:16', m: '저는 운영 접근 권한도 아직 없어요. 노트북도 주말 내내 사무실에 있었고요.' },
      { s: 'vale', t: '08:18', m: 'svc-deploy는 내부 전용이에요. 외주한테 그 비밀번호를 준 적은 한 번도 없어요.', ev: 3, lie: '월요일 교체 티켓에 새 svc-deploy 비밀번호를 외주 개발자인 렉스에게 공유했다고 적혀 있다.' },
      { s: 'ona', t: '08:19', m: '배스천은 접속 IP를 안 남겨요. VPN은 남기지만요.' },
      { s: 'rex', t: '08:21', m: '자동 작업일 수도 있어요. 밤에 돌잖아요.' },
      { s: 'pip', t: '08:22', m: '교체 티켓에 이번 주에 누가 새 비밀번호 받았는지 적혀 있지 않나요?' },
      { s: 'vale', t: '08:23', m: '지금 꺼내 볼게요.' }
    ],
    culprit: 'rex',
    solve: 'svc-deploy 비밀번호를 가진 사람은 렉스와 핍뿐이고, 핍은 18:00 이후 VPN 접속이 없다. 렉스는 03:02부터 03:20까지 VPN에 있었고, 03:12 삭제 시각이 그 안에 들어가며, 그 사실을 숨겼다. 온아는 경보를 놓치고 잔 것을 감추려고 거짓말했지만 비밀번호가 없었다. 베일의 외주 이야기는 그냥 틀린 말이었다.'
  }
);
