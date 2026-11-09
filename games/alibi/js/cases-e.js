'use strict';
/* ALIBI — case pack E */
CASES.en.push(
  {
    id: 'dog', title: 'The Open Gate', place: 'Maple Court · 4:20 pm', difficulty: 2,
    intro: 'Biscuit the beagle was found two streets away at ten past four. The yard is fenced and the gate has a smart lock. The doorbell camera caught one still that afternoon. Look closely.',
    suspects: [['wren', 'Wren', 'Dog walker', 'n'], ['otis', 'Otis', 'Meter reader', 'm'], ['lia', 'Lia', 'Neighbor, 15', 'f']],
    facts: [
      ['🔔', 'Doorbell camera still, 15:33.', ['timestamp', 'person on the path', 'side gate latch', 'the dog', 'the street']],
      ['🔐', 'Gate smart lock: locked 13:41 (Wren\'s code) · unlocked 15:32 (Lia\'s code) · "gate left open" alert 15:34. Never re-locked.'],
      ['📍', 'GPS collar: in the yard until 15:36 · through the gate 15:36 · Elm Street 16:10.'],
      ['🧾', 'Utility visit slip: meter read 10:06, "read from the sidewalk, no entry to the yard". Doorbell still 10:05: Otis at the door with a badge.'],
      ['🐕', 'Walker app: Wren\'s walk 13:00–13:40, "returned to yard, gate locked".']
    ],
    chat: [
      { s: 'wren', t: '16:22', m: 'Got him back at 1:40 and locked the gate behind me. Code and everything, it beeped.' },
      { s: 'otis', t: '16:24', m: 'I wasn\'t even on that street today, my route was the north side.', ev: 3, lie: 'The utility slip has the meter read at 10:06 and the morning doorbell still shows Otis at the door at 10:05.' },
      { s: 'lia', t: '16:26', m: 'I just left some treats at the front door around 3:30. Never went near the gate.', ev: [0, 1], lie: 'The 15:33 still shows Lia walking back from the side gate with an empty treat bag, and the lock log has her code opening it at 15:32.' },
      { s: 'wren', t: '16:27', m: 'Did anyone go back after me? The lock keeps a log. And the doorbell takes stills.' },
      { s: 'lia', t: '16:28', m: 'Okay, I looked at the gate. It was already open when I got there, the latch sticks.', ev: 1, lie: 'The lock log says the gate stayed locked from Wren\'s code at 13:41 until Lia\'s own code opened it at 15:32.' },
      { s: 'otis', t: '16:30', m: 'If the gate was open the collar will show when he left.' },
      { s: 'wren', t: '16:31', m: 'It does. 3:36. Two minutes after somebody\'s code opened it.' },
      { s: 'lia', t: '16:33', m: 'well he\'s home now so' }
    ],
    culprit: 'lia',
    solve: 'The 15:33 doorbell still does the work: Lia is walking back from the side gate with an empty treat bag, the latch is up, the gate is ajar, and Biscuit already has his nose in the gap. The lock log matches it, her code at 15:32 and "left open" at 15:34, and the collar has him through the gate at 15:36. Otis lied about his route, but the slip and the morning still put him on the sidewalk at 10:06, five hours earlier, never inside the yard.'
  },
  {
    id: 'gallery', title: 'Blue Hour', place: 'Vireo Gallery · 9:40 pm', difficulty: 3,
    intro: 'Sometime tonight the painting Blue Hour was swapped for a print. The lights went down for a two-minute projection during the toast. Four people were close enough.',
    suspects: [['nell', 'Isabel', 'Gallery assistant', 'f'], ['hugo', 'Hugo', 'Collector, sponsor', 'm'], ['bea', 'Bea', 'Caterer', 'f'], ['kai', 'Kai', 'Artist\'s partner', 'n']],
    facts: [
      ['🧥', 'Coat check: #12 Hugo in 18:40, out 20:15 · #19 Kai in 19:05, out 21:30. Catering staff checked no coats.'],
      ['⏱️', 'AV booth timeline: 19:58 toast by sponsor Hugo at the microphone, front of the main room · 20:00 lights down for the projection · 20:02 lights up. Hugo kept the mic until 20:02.'],
      ['🚪', 'AV booth door log: Isabel in 19:55, out 20:05. No one else entered the booth tonight.'],
      ['🚐', 'Catering van, parking receipt: in 17:30 · out 20:01. The lot is a three-minute walk from the gallery.'],
      ['🖼️', 'Insurance photo, 17:10, on the gallery wall: brass plaque "Blue Hour · 2019" on the bottom rail of the frame. The print\'s frame has no plaque.']
    ],
    chat: [
      { s: 'nell', t: '21:40', m: 'The piece in the back room is a print. Someone swapped Blue Hour tonight. When?' },
      { s: 'hugo', t: '21:42', m: 'Honestly? It was a print all evening. No plaque on that frame when I walked in at 6:40.', ev: 4, lie: 'The insurance photo at 17:10 shows the original on the wall with its brass plaque; the plaque was there before Hugo arrived.' },
      { s: 'bea', t: '21:44', m: 'I was serving inside through the toast and the whole blackout. Nobody went into the back room.', ev: 3, lie: 'The catering van left the lot at 20:01, a three-minute walk away, so Bea was outside during the lights-down.' },
      { s: 'kai', t: '21:45', m: 'During the projection I was up in the booth helping Isabel with the slides.', ev: 2, lie: 'The booth door log shows only Isabel entering, at 19:55, and no one else all night.' },
      { s: 'nell', t: '21:46', m: 'The booth has a door log. It was just me in there.' },
      { s: 'hugo', t: '21:48', m: 'I was standing right next to the painting during the blackout. I would have seen anyone.', ev: 1, lie: 'The timeline puts Hugo at the microphone at the front of the main room from 19:58 to 20:02, not in the back room.' },
      { s: 'kai', t: '21:50', m: 'Then it must have happened before the lights went down.' },
      { s: 'nell', t: '21:52', m: 'The projector ran two minutes. That\'s the only window the room was dark.' }
    ],
    culprit: 'kai',
    solve: 'For the two dark minutes, Isabel was in the booth, Bea was out at the van, and Hugo was at the microphone in front of the whole room. Only Kai is unaccounted for, and Kai lied about being in the booth. Hugo lied twice, about the plaque and about guarding the painting, but sixty guests watched him hold the mic the entire time.'
  }
);
CASES.ko.push(
  {
    id: 'dog', title: '열린 대문', place: '메이플 코트 · 오후 4:20', difficulty: 2,
    intro: '비글 비스킷이 4시 10분에 두 블록 떨어진 곳에서 발견됐다. 마당은 울타리로 막혀 있고 대문엔 스마트 잠금장치가 있다. 그날 오후 초인종 카메라가 사진 한 장을 남겼다. 자세히 보라.',
    suspects: [['wren', '에린', '도그워커', 'n'], ['otis', '오티스', '검침원', 'm'], ['lia', '리아', '옆집, 15살', 'f']],
    facts: [
      ['🔔', '초인종 카메라 사진, 15:33.', ['타임스탬프', '길 위의 사람', '옆문 걸쇠', '강아지', '길']],
      ['🔐', '대문 스마트 잠금: 13:41 잠김(에린의 코드) · 15:32 열림(리아의 코드) · 15:34 "대문 열림" 경고. 이후 다시 잠긴 적 없음.'],
      ['📍', 'GPS 목걸이: 15:36까지 마당 · 15:36 대문 통과 · 16:10 엘름 스트리트.'],
      ['🧾', '검침 방문 전표: 10:06 검침, "인도에서 확인, 마당 출입 없음". 초인종 사진 10:05: 배지를 단 오티스가 현관 앞.'],
      ['🐕', '산책 앱: 에린의 산책 13:00–13:40, "마당에 복귀, 대문 잠금".']
    ],
    chat: [
      { s: 'wren', t: '16:22', m: '1시 40분에 데려다주고 대문 잠갔어요. 코드 누르고 삑 소리까지 확인했어요.' },
      { s: 'otis', t: '16:24', m: '저 오늘 그 길은 가지도 않았어요. 북쪽 구역 돌았어요.', ev: 3, lie: '검침 전표에 10:06 검침이 적혀 있고, 아침 초인종 사진에 오티스가 10:05에 현관 앞에 있다.' },
      { s: 'lia', t: '16:26', m: '3시 반쯤 현관에 간식만 두고 갔어요. 대문 근처엔 가지도 않았어요.', ev: [0, 1], lie: '15:33 사진에 리아가 빈 간식 봉지를 들고 옆 대문 쪽에서 돌아오고 있고, 잠금 기록엔 15:32에 리아의 코드로 문이 열렸다.' },
      { s: 'wren', t: '16:27', m: '제 다음에 누가 또 왔어요? 잠금장치에 기록 남잖아요. 초인종도 사진 찍고요.' },
      { s: 'lia', t: '16:28', m: '네, 대문 쪽 보긴 했어요. 근데 갔을 때 이미 열려 있었어요. 걸쇠가 잘 걸리더라고요.', ev: 1, lie: '잠금 기록상 대문은 13:41 에린의 코드로 잠긴 뒤 15:32 리아 본인의 코드로 열릴 때까지 잠겨 있었다.' },
      { s: 'otis', t: '16:30', m: '대문이 열려 있었으면 목걸이에 언제 나갔는지 나오겠네요.' },
      { s: 'wren', t: '16:31', m: '나와요. 3시 36분. 누군가의 코드로 열린 지 2분 뒤예요.' },
      { s: 'lia', t: '16:33', m: '어쨌든 지금은 집에 왔으니까' }
    ],
    culprit: 'lia',
    solve: '15:33 초인종 사진이 다 말해 준다. 리아는 빈 간식 봉지를 들고 옆 대문에서 돌아오는 중이고, 걸쇠는 올라가 있고, 문은 열려 있고, 비스킷은 벌써 틈에 코를 들이밀고 있다. 잠금 기록이 그대로 맞아떨어진다. 15:32 리아의 코드, 15:34 "대문 열림", 그리고 목걸이는 15:36 대문 통과. 오티스는 동선을 거짓말했지만, 전표와 아침 사진은 그를 다섯 시간 전인 10:06에 인도에 두었을 뿐 마당 안엔 없었다.'
  },
  {
    id: 'gallery', title: '블루 아워', place: '비레오 갤러리 · 오후 9:40', difficulty: 3,
    intro: '오늘 밤 어느 순간 그림 "블루 아워"가 인쇄본으로 바뀌었다. 건배사 도중 2분짜리 영상 상영으로 조명이 꺼졌다. 가까이 있던 사람은 넷.',
    suspects: [['nell', '이사벨', '갤러리 어시스턴트', 'f'], ['hugo', '휴고', '수집가, 후원자', 'm'], ['bea', '베아', '케이터링', 'f'], ['kai', '카이', '작가의 파트너', 'n']],
    facts: [
      ['🧥', '코트 보관: #12 휴고 18:40 맡김, 20:15 찾음 · #19 카이 19:05 맡김, 21:30 찾음. 케이터링 직원은 맡긴 코트 없음.'],
      ['⏱️', 'AV 부스 타임라인: 19:58 후원자 휴고의 건배사, 메인 홀 앞쪽 마이크 · 20:00 상영을 위해 소등 · 20:02 점등. 휴고는 20:02까지 마이크를 잡고 있었음.'],
      ['🚪', 'AV 부스 출입 기록: 이사벨 19:55 입실, 20:05 퇴실. 오늘 밤 부스에 들어간 사람은 그 외 없음.'],
      ['🚐', '케이터링 밴 주차 영수증: 17:30 입차 · 20:01 출차. 주차장은 갤러리에서 걸어서 3분.'],
      ['🖼️', '보험용 사진, 17:10, 갤러리 벽에서 촬영: 액자 아래 테두리에 황동 명판 "Blue Hour · 2019". 인쇄본 액자에는 명판이 없음.']
    ],
    chat: [
      { s: 'nell', t: '21:40', m: '뒷방에 걸린 건 인쇄본이에요. 오늘 밤 누가 블루 아워를 바꿔치기했어요. 언제죠?' },
      { s: 'hugo', t: '21:42', m: '솔직히요? 저녁 내내 인쇄본이었어요. 6시 40분에 들어왔을 때 액자에 명판 없었어요.', ev: 4, lie: '17:10 보험용 사진에 원본이 황동 명판과 함께 벽에 걸려 있다. 휴고가 오기 전부터 명판은 있었다.' },
      { s: 'bea', t: '21:44', m: '건배사부터 소등 내내 안에서 서빙하고 있었어요. 뒷방에 들어간 사람 없었어요.', ev: 3, lie: '케이터링 밴은 걸어서 3분 거리의 주차장에서 20:01에 나갔다. 소등 시간에 베아는 밖에 있었다.' },
      { s: 'kai', t: '21:45', m: '상영 동안 저는 부스에 올라가서 이사벨 슬라이드 넘기는 거 도왔어요.', ev: 2, lie: '부스 출입 기록에는 19:55에 들어간 이사벨뿐이고, 밤새 다른 사람은 없다.' },
      { s: 'nell', t: '21:46', m: '부스에 출입 기록 있어요. 안에는 저 혼자였어요.' },
      { s: 'hugo', t: '21:48', m: '소등 때 저는 그림 바로 옆에 서 있었어요. 누가 왔으면 봤을 거예요.', ev: 1, lie: '타임라인상 휴고는 19:58부터 20:02까지 메인 홀 앞쪽 마이크 앞에 있었다. 뒷방이 아니다.' },
      { s: 'kai', t: '21:50', m: '그럼 조명 꺼지기 전에 일어난 일이겠네요.' },
      { s: 'nell', t: '21:52', m: '영상은 2분 돌았어요. 방이 어두웠던 건 그때뿐이에요.' }
    ],
    culprit: 'kai',
    solve: '어두웠던 2분 동안 이사벨은 부스에, 베아는 밴에, 휴고는 홀 전체가 보는 마이크 앞에 있었다. 행방이 비는 사람은 카이뿐이고, 카이는 부스에 있었다고 거짓말했다. 휴고는 명판과 그림을 지켰다는 것, 두 번 거짓말했지만 손님 예순 명이 그가 내내 마이크를 잡고 있는 걸 봤다.'
  }
);
