'use strict';
/* ALIBI — case pack B */
CASES.en.push(
  {
    id: 'rooftop', title: 'The Rooftop Garden', place: 'Apartment rooftop · 7:10 am', difficulty: 2,
    intro: 'Every tomato plant in the shared rooftop garden was cut down overnight. The roof door needs a key fob. Three people have one.',
    suspects: [['gus', 'Gus', 'Neighbor, 5th floor', 'm'], ['mo', 'Mo', 'Building manager', 'n'], ['yun', 'Yun', 'Student, waters the plants', 'n']],
    facts: [
      ['🔐', 'Roof door fob log: Yun 20:10 · Gus 23:40. No other entries until morning.'],
      ['🌧️', 'Weather report: rain 22:00–01:00, wind calm all night (under 10 km/h).'],
      ['✂️', 'Photo: every stem cut clean at an angle. Marks match the pruning shears from the garden shed.'],
      ['📋', 'Residents\' meeting, Tuesday 19:00: Gus asked for the garden to be removed. Vote postponed to next month.']
    ],
    chat: [
      { s: 'yun', t: '07:12', m: 'The tomatoes are all gone?? Who did this' },
      { s: 'mo', t: '07:15', m: 'Calm down, it was the wind. It was blowing hard all night, snapped them right off.', ev: [1, 2], lie: 'The weather report says the wind was calm all night, and the photo shows clean angled cuts, not snapped stems.' },
      { s: 'yun', t: '07:16', m: 'I watered them at 8 last night and they were fine.' },
      { s: 'gus', t: '07:20', m: 'Don\'t look at me. I haven\'t been up on that roof in weeks.', ev: 0, lie: 'The fob log shows Gus opening the roof door at 23:40.' },
      { s: 'gus', t: '07:21', m: 'And for the record, I said at the meeting the garden should go. Legally. With a vote.' },
      { s: 'mo', t: '07:24', m: 'The shed was open this morning, I\'ll admit I may have left it unlocked.' },
      { s: 'yun', t: '07:25', m: 'So someone took the shears from the shed. In the rain.' },
      { s: 'gus', t: '07:27', m: 'Or a raccoon.' }
    ],
    culprit: 'gus',
    solve: 'Gus went up to the roof at 23:40, in the rain, weeks after demanding the garden be removed, and lied about it. Mo lied about the wind to cover for leaving the shed unlocked, but Mo never went through the roof door.'
  },
  {
    id: 'podcast', title: 'The Leaked Episode', place: 'Studio Nine · 9:30 am', difficulty: 3,
    intro: 'An unreleased episode went up on a file-sharing site last night. The drive log points at one laptop. Four people had something to do with that laptop.',
    suspects: [['ren', 'Ren', 'Host', 'n'], ['sae', 'Sae', 'Producer', 'n'], ['tom', 'Tom', 'Audio editor', 'm'], ['vi', 'Vi', 'Guest', 'n']],
    facts: [
      ['☁️', 'Cloud drive log: master file downloaded 19:20 by device "Tom-Laptop" · opened 09:00 today by "Sae-Phone".'],
      ['🌐', 'The leak was uploaded to the sharing site at 21:05.'],
      ['📅', 'Calendar: recording 14:00–16:00 with all four. Tom: "dentist 16:30, back tomorrow".'],
      ['💬', 'Screenshot, 18:30: Tom → Vi: "left my laptop in the studio, can you grab it? password on the sticky note". Vi: "got it 👍".']
    ],
    chat: [
      { s: 'ren', t: '09:31', m: 'It\'s online. The whole episode. Before we even cut the ad reads.' },
      { s: 'sae', t: '09:33', m: 'Nobody touched the master until I opened it on my phone this morning. I checked.', ev: [0, 1], lie: 'The drive log shows "Tom-Laptop" downloading the master at 19:20 last night. The leak was already uploaded to the sharing site at 21:05, so the master had been taken before this morning.' },
      { s: 'tom', t: '09:35', m: 'The log says my laptop? I wasn\'t even in the building. Dentist at 4:30, then home.' },
      { s: 'tom', t: '09:36', m: 'Vi picked it up for me last night, it was still on my desk.' },
      { s: 'vi', t: '09:38', m: 'I left right after we finished recording and never went back to the studio.', ev: 3, lie: 'The screenshot shows Vi agreeing at 18:30 to pick up Tom\'s laptop from the studio, after the 16:00 end of recording.' },
      { s: 'ren', t: '09:40', m: 'Then who used Tom\'s laptop at 7:20?' },
      { s: 'vi', t: '09:41', m: 'Maybe it got hacked. Those things happen.' },
      { s: 'sae', t: '09:42', m: 'The sticky note had the password on it. Anyone who had the laptop had the file.' }
    ],
    culprit: 'vi',
    solve: 'Tom was at the dentist; Vi collected his laptop after 18:30, with the password on the sticky note, and the master was downloaded from that laptop at 19:20. The leak followed at 21:05. Sae lied about checking the log, but Sae\'s only access was this morning, after the leak.'
  }
);
CASES.ko.push(
  {
    id: 'rooftop', title: '옥상 텃밭', place: '아파트 옥상 · 오전 7:10', difficulty: 2,
    intro: '공용 옥상 텃밭의 토마토가 밤사이 전부 잘려 나갔다. 옥상 문은 열쇠 태그가 있어야 열린다. 태그를 가진 사람은 셋.',
    suspects: [['gus', '구 씨', '5층 주민', 'm'], ['mo', '모 소장', '관리소장', 'n'], ['yun', '윤', '학생, 물 주는 담당', 'n']],
    facts: [
      ['🔐', '옥상 문 태그 기록: 윤 20:10 · 구 씨 23:40. 아침까지 다른 출입 없음.'],
      ['🌧️', '기상 기록: 22:00–01:00 비, 바람은 밤새 잔잔함(시속 10km 미만).'],
      ['✂️', '사진: 줄기가 전부 비스듬히 깔끔하게 잘림. 자국이 창고의 전지가위와 일치.'],
      ['📋', '입주민 회의, 화요일 19:00: 구 씨가 텃밭 철거를 요구. 표결은 다음 달로 연기.']
    ],
    chat: [
      { s: 'yun', t: '07:12', m: '토마토가 다 없어졌어요?? 누가 이랬어요' },
      { s: 'mo', t: '07:15', m: '진정해요, 바람이에요. 밤새 세게 불어서 뚝뚝 부러진 거예요.', ev: [1, 2], lie: '기상 기록에 바람은 밤새 잔잔했고, 사진의 줄기는 부러진 게 아니라 비스듬히 깔끔하게 잘렸다.' },
      { s: 'yun', t: '07:16', m: '어젯밤 8시에 물 줄 때는 멀쩡했어요.' },
      { s: 'gus', t: '07:20', m: '나 보지 마요. 옥상 안 올라간 지 몇 주 됐어요.', ev: 0, lie: '태그 기록에 구 씨가 23:40에 옥상 문을 연 것으로 남아 있다.' },
      { s: 'gus', t: '07:21', m: '그리고 분명히 말하는데, 회의에서 텃밭 없애자고 한 건 맞아요. 합법적으로. 표결로.' },
      { s: 'mo', t: '07:24', m: '아침에 창고가 열려 있던데, 제가 안 잠갔을 수도 있다는 건 인정합니다.' },
      { s: 'yun', t: '07:25', m: '그럼 누가 창고에서 가위를 꺼낸 거네요. 비 오는데.' },
      { s: 'gus', t: '07:27', m: '너구리일 수도 있고.' }
    ],
    culprit: 'gus',
    solve: '구 씨는 텃밭 철거를 요구한 지 몇 주 뒤, 비 오는 23:40에 옥상에 올라갔고 그 사실을 숨겼다. 모 소장은 창고를 안 잠근 걸 덮으려고 바람 핑계를 댔지만, 옥상 문을 지나간 적은 없다.'
  },
  {
    id: 'podcast', title: '유출된 에피소드', place: '스튜디오 나인 · 오전 9:30', difficulty: 3,
    intro: '미공개 에피소드가 어젯밤 파일 공유 사이트에 올라왔다. 드라이브 기록은 노트북 하나를 가리킨다. 그 노트북에 얽힌 사람은 넷.',
    suspects: [['ren', '렌', '진행자', 'n'], ['sae', '새', '프로듀서', 'n'], ['tom', '톰', '오디오 편집자', 'm'], ['vi', '비', '게스트', 'n']],
    facts: [
      ['☁️', '클라우드 기록: 마스터 파일 19:20 "Tom-Laptop" 기기에서 다운로드 · 오늘 09:00 "Sae-Phone"에서 열람.'],
      ['🌐', '유출본은 21:05에 공유 사이트에 업로드됨.'],
      ['📅', '일정: 녹음 14:00–16:00, 네 명 모두 참석. 톰: "16:30 치과, 내일 복귀".'],
      ['💬', '캡처, 18:30: 톰 → 비: "스튜디오에 노트북 두고 왔는데 좀 챙겨 줄래? 비번은 포스트잇에". 비: "오케이 👍".']
    ],
    chat: [
      { s: 'ren', t: '09:31', m: '올라왔어요. 에피소드 통째로. 광고 부분 자르기도 전에.' },
      { s: 'sae', t: '09:33', m: '제가 오늘 아침 폰으로 열기 전까지 아무도 마스터 안 건드렸어요. 확인했어요.', ev: [0, 1], lie: '드라이브 기록에 어젯밤 19:20 "Tom-Laptop"이 마스터를 다운로드한 것으로 남아 있다. 유출본은 이미 21:05에 공유 사이트에 올라가 있었으니, 마스터는 오늘 아침 전에 이미 빠져나간 것이다.' },
      { s: 'tom', t: '09:35', m: '기록이 제 노트북이라고요? 저 건물에 있지도 않았어요. 4시 반 치과, 그다음 집.' },
      { s: 'tom', t: '09:36', m: '비가 어젯밤에 대신 챙겨 줬어요. 책상에 그대로 있었거든요.' },
      { s: 'vi', t: '09:38', m: '저는 녹음 끝나자마자 나갔고 스튜디오에 다시 간 적 없어요.', ev: 3, lie: '캡처에 비가 18:30에 톰의 노트북을 스튜디오에서 챙기기로 한 것이 남아 있다. 녹음이 끝난 16:00 이후다.' },
      { s: 'ren', t: '09:40', m: '그럼 7시 20분에 톰 노트북은 누가 쓴 거예요?' },
      { s: 'vi', t: '09:41', m: '해킹당한 거 아닐까요. 그런 일 있잖아요.' },
      { s: 'sae', t: '09:42', m: '포스트잇에 비번이 있었어요. 노트북만 있으면 파일은 누구나 받을 수 있었던 거죠.' }
    ],
    culprit: 'vi',
    solve: '톰은 치과에 있었다. 비는 18:30 이후 포스트잇의 비밀번호와 함께 톰의 노트북을 챙겼고, 19:20에 그 노트북에서 마스터가 다운로드됐다. 유출은 21:05. 새는 기록을 확인했다고 거짓말했지만, 새의 접근은 유출 뒤인 오늘 아침뿐이다.'
  }
);
