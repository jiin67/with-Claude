'use strict';
/* ALIBI — case pack D */
CASES.en.push(
  {
    id: 'pool', title: 'The Empty Pool', place: 'Community pool · 6:40 am', difficulty: 2,
    intro: 'The swim team arrives at seven. The pool is a tiled hole. Someone opened the maintenance valve in the middle of the night, and three people are in the chat.',
    suspects: [['dax', 'Dax', 'Lifeguard', 'm'], ['rin', 'Rin', 'Maintenance tech', 'n'], ['hal', 'Hal', 'Swim-team parent', 'm']],
    facts: [
      ['🔐', 'Valve-room keypad log: maintenance code 4471 entered at 21:30 and again at 02:10. No other codes that night.'],
      ['📉', 'Depth sensor: pool full until 02:12, draining from 02:15, empty at 04:30.'],
      ['🚗', 'Parking-lot plate reader: Dax out 20:35 · Rin out 21:50 · Hal in 01:55, out 02:40.'],
      ['📧', 'Hal\'s email to the club, 23:10: "Give the 6am lanes back to the team, or nobody swims tomorrow."'],
      ['🗒️', 'Photo of the pool-office whiteboard this morning: "VALVE ROOM 4471" in marker, readable from the front counter.']
    ],
    chat: [
      { s: 'dax', t: '06:42', m: 'Pool is EMPTY. Like, tiles-on-the-floor empty. Swim team is here in twenty minutes.' },
      { s: 'rin', t: '06:45', m: 'Valve log says my code at 2:10am. I did the check at 9:30, drove home, and that was it.' },
      { s: 'hal', t: '06:47', m: 'Not my problem. I was asleep by midnight and never went near the pool.', ev: 2, lie: 'The plate reader has Hal\'s car entering the lot at 01:55 and leaving at 02:40, right around the 02:10 keypad entry.' },
      { s: 'dax', t: '06:49', m: 'I wipe the office whiteboard every night before I lock up. The code wasn\'t on it, nobody could have seen it.', ev: 4, lie: 'The morning photo shows "VALVE ROOM 4471" still on the whiteboard, readable from the counter.' },
      { s: 'rin', t: '06:50', m: 'Then how did somebody type my code?' },
      { s: 'hal', t: '06:52', m: 'Maybe your tech left the valve open. Happens all the time.' },
      { s: 'rin', t: '06:53', m: 'A valve does not open itself at two in the morning.' },
      { s: 'dax', t: '06:55', m: 'The lot camera reads plates. It\'ll show who drove in.' }
    ],
    culprit: 'hal',
    solve: 'Hal threatened exactly this at 23:10, drove in at 01:55, typed the code that was sitting on the whiteboard, and left at 02:40 while the pool drained. Dax lied about wiping the board to hide a lazy habit, but Dax\'s car left at 20:35 and never came back.'
  },
  {
    id: 'exam', title: 'The Answer Key', place: 'Faculty office 3B · 9:00 pm', difficulty: 3,
    intro: 'A photo of tomorrow\'s answer key is in the class chat. The badge log for office 3B names one person. The photo says something else.',
    suspects: [['ana', 'Ana', 'Teaching assistant', 'f'], ['bo', 'Bo', 'Department secretary', 'f'], ['cy', 'Cy', 'Student, part-time cleaner', 'm'], ['dov', 'Dov', 'Visiting lecturer', 'm']],
    facts: [
      ['🪪', 'Office 3B badge log: Bo in 08:00, out 17:05 · Ana in 17:40, out 17:52 · Cy in 19:00, out 19:35. The door locks by itself.'],
      ['🖨️', 'Copier log, office 3B: "FINAL EXAM — ANSWER KEY", 1 copy, 17:45, Ana\'s account.'],
      ['📂', 'When Bo went back at 20:30, the printed key was lying in the copier\'s out-tray.'],
      ['📷', 'Metadata of the leaked photo: taken 19:12, device "Pixel 7".'],
      ['📱', 'Department device list for the group chat: Ana iPhone 13 · Bo Galaxy S22 · Cy Pixel 7 · Dov iPhone 15.'],
      ['🧹', 'Cleaning roster: Cy, office 3B, 19:00–19:30.']
    ],
    chat: [
      { s: 'bo', t: '21:02', m: 'The answer key is in the class chat. A photo of the actual sheet. Who had it?' },
      { s: 'ana', t: '21:05', m: 'I printed it at quarter to six, locked it in Bo\'s drawer and left. It never sat out.', ev: 2, lie: 'At 20:30 the key was still lying in the copier\'s out-tray, not in any drawer.' },
      { s: 'dov', t: '21:06', m: 'I don\'t even have a badge for 3B. I\'ve been in the library all week.' },
      { s: 'cy', t: '21:08', m: 'I vacuumed 3B at seven like always. My phone was dead the whole shift, I couldn\'t have taken a picture of anything.', ev: [3, 4], lie: 'The photo was taken at 19:12, during Cy\'s shift, on a Pixel 7, and the only Pixel 7 on the department list is Cy\'s.' },
      { s: 'bo', t: '21:10', m: 'I went back at 8:30. The key was in the copier tray, not in my drawer.' },
      { s: 'ana', t: '21:11', m: 'That can\'t be right.' },
      { s: 'dov', t: '21:13', m: 'Who was in the office after six?' },
      { s: 'bo', t: '21:14', m: 'The badge log says one person.' },
      { s: 'cy', t: '21:15', m: 'Cleaning. That\'s literally my job.' }
    ],
    culprit: 'cy',
    solve: 'Ana printed the key at 17:45 and, whatever she says, left it in the copier tray. Cy was alone in 3B from 19:00, and the leaked photo was taken at 19:12 on a Pixel 7, the only one on the department list, Cy\'s. Ana lied to hide her carelessness, but she badged out at 17:52, long before the photo.'
  }
);
CASES.ko.push(
  {
    id: 'pool', title: '텅 빈 수영장', place: '주민 수영장 · 오전 6:40', difficulty: 2,
    intro: '수영팀은 7시에 온다. 수영장은 타일 바닥이 드러난 구덩이다. 누군가 한밤중에 배수 밸브를 열었고, 채팅방에는 세 사람이 있다.',
    suspects: [['dax', '도윤', '안전요원', 'm'], ['rin', '수린', '시설 기사', 'n'], ['hal', '한수', '수영팀 학부모', 'm']],
    facts: [
      ['🔐', '밸브실 키패드 기록: 시설 코드 4471 입력 21:30, 02:10. 그날 밤 다른 코드 없음.'],
      ['📉', '수심 센서: 02:12까지 가득 참, 02:15부터 배수, 04:30 비어 있음.'],
      ['🚗', '주차장 번호판 인식기: 도윤 출차 20:35 · 수린 출차 21:50 · 한수 입차 01:55, 출차 02:40.'],
      ['📧', '한수가 클럽에 보낸 메일, 23:10: "6시 레인 팀에 돌려주세요. 아니면 내일 아무도 못 헤엄칩니다."'],
      ['🗒️', '오늘 아침 사무실 화이트보드 사진: 마커로 "밸브실 4471". 카운터 앞에서도 읽힘.']
    ],
    chat: [
      { s: 'dax', t: '06:42', m: '수영장 텅 비었어요. 바닥 타일이 다 보여요. 수영팀 20분 뒤에 와요.' },
      { s: 'rin', t: '06:45', m: '밸브 기록에 새벽 2시 10분 제 코드래요. 저는 9시 반에 점검하고 집에 갔고 그게 다예요.' },
      { s: 'hal', t: '06:47', m: '제 알 바 아니에요. 자정 전에 잤고 수영장 근처에도 안 갔어요.', ev: 2, lie: '번호판 인식기에 한수의 차가 01:55 입차, 02:40 출차로 남아 있다. 02:10 키패드 입력 시각과 맞물린다.' },
      { s: 'dax', t: '06:49', m: '저는 매일 밤 문 잠그기 전에 화이트보드 지워요. 코드 안 적혀 있었어요. 아무도 못 봤을걸요.', ev: 4, lie: '아침 사진에 "밸브실 4471"이 그대로 적혀 있고 카운터에서도 읽힌다.' },
      { s: 'rin', t: '06:50', m: '그럼 누가 제 코드를 친 거죠?' },
      { s: 'hal', t: '06:52', m: '기사님이 밸브 안 잠그고 간 거 아니에요? 흔한 일이잖아요.' },
      { s: 'rin', t: '06:53', m: '밸브가 새벽 2시에 저절로 열리진 않아요.' },
      { s: 'dax', t: '06:55', m: '주차장 카메라가 번호판 읽어요. 누가 들어왔는지 나올 거예요.' }
    ],
    culprit: 'hal',
    solve: '한수는 23:10에 바로 이 일을 예고했고, 01:55에 들어와 화이트보드에 적힌 코드를 치고, 물이 빠지는 동안 02:40에 나갔다. 도윤은 게으른 습관을 숨기려고 보드를 지웠다고 거짓말했지만, 도윤의 차는 20:35에 나간 뒤 돌아오지 않았다.'
  },
  {
    id: 'exam', title: '정답지', place: '교수실 3B · 오후 9:00', difficulty: 3,
    intro: '내일 시험 정답지 사진이 수업 단톡방에 올라왔다. 3B 출입 기록은 한 사람을 가리킨다. 사진은 다른 말을 한다.',
    suspects: [['ana', '안나', '조교', 'f'], ['bo', '보라', '학과 사무원', 'f'], ['cy', '시우', '근로 학생, 청소 담당', 'm'], ['dov', '도현', '초빙 강사', 'm']],
    facts: [
      ['🪪', '3B 출입 기록: 보라 08:00 입실, 17:05 퇴실 · 안나 17:40 입실, 17:52 퇴실 · 시우 19:00 입실, 19:35 퇴실. 문은 자동 잠금.'],
      ['🖨️', '3B 복사기 기록: "기말고사 — 정답지", 1부, 17:45, 안나 계정.'],
      ['📂', '보라가 20:30에 다시 가 보니 인쇄된 정답지가 복사기 배출함에 그대로 놓여 있었음.'],
      ['📷', '유출 사진 메타데이터: 촬영 19:12, 기기 "Pixel 7".'],
      ['📱', '학과 단톡방 기기 목록: 안나 iPhone 13 · 보라 Galaxy S22 · 시우 Pixel 7 · 도현 iPhone 15.'],
      ['🧹', '청소 당번표: 시우, 3B, 19:00–19:30.']
    ],
    chat: [
      { s: 'bo', t: '21:02', m: '정답지가 수업 단톡방에 올라왔어요. 실제 종이 사진이에요. 누가 갖고 있었죠?' },
      { s: 'ana', t: '21:05', m: '5시 45분에 뽑아서 보라 씨 서랍에 넣고 잠근 뒤 나왔어요. 밖에 둔 적 없어요.', ev: 2, lie: '20:30에 정답지는 서랍이 아니라 복사기 배출함에 그대로 놓여 있었다.' },
      { s: 'dov', t: '21:06', m: '저는 3B 출입증도 없어요. 이번 주 내내 도서관에 있었고요.' },
      { s: 'cy', t: '21:08', m: '평소처럼 7시에 3B 청소했어요. 근무 내내 폰이 꺼져 있어서 사진 같은 건 찍을 수도 없었어요.', ev: [3, 4], lie: '사진은 시우의 근무 시간인 19:12에 Pixel 7으로 찍혔고, 학과 기기 목록에서 Pixel 7은 시우뿐이다.' },
      { s: 'bo', t: '21:10', m: '8시 반에 다시 갔는데 정답지가 복사기 배출함에 있었어요. 제 서랍이 아니라요.' },
      { s: 'ana', t: '21:11', m: '그럴 리가 없는데요.' },
      { s: 'dov', t: '21:13', m: '6시 이후에 사무실에 있었던 사람이 누구죠?' },
      { s: 'bo', t: '21:14', m: '출입 기록엔 한 명이에요.' },
      { s: 'cy', t: '21:15', m: '청소요. 그게 제 일이잖아요.' }
    ],
    culprit: 'cy',
    solve: '안나는 17:45에 정답지를 뽑았고, 뭐라고 하든 복사기 배출함에 두고 나갔다. 시우는 19:00부터 3B에 혼자 있었고, 유출 사진은 19:12에 학과 목록에서 유일한 Pixel 7, 시우의 폰으로 찍혔다. 안나는 부주의를 숨기려고 거짓말했지만 사진보다 한참 전인 17:52에 퇴실했다.'
  }
);
