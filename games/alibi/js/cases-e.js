'use strict';
/* ALIBI — case pack E */
CASES.en.push(
  {
    id: 'dog', title: 'The Open Gate', place: 'Maple Court · 4:20 pm', difficulty: 1,
    intro: 'Biscuit the beagle was found two streets away at ten past four. The yard is fenced and the gate has a smart lock. Three people came by today.',
    suspects: [['wren', 'Wren', 'Dog walker'], ['otis', 'Otis', 'Meter reader'], ['lia', 'Lia', 'Neighbor, 15']],
    facts: [
      ['🔔', 'Doorbell camera: 10:05 Otis at the front door with a utility badge · 15:30 Lia at the front door with a bag of treats. Nobody else all day.'],
      ['🔐', 'Gate smart lock: locked 13:41 (Wren\'s code) · unlocked 15:32 (Lia\'s code) · "gate left open" alert 15:34. Never re-locked.'],
      ['📍', 'GPS collar: in the yard until 15:36 · through the gate 15:36 · Elm Street 16:10.'],
      ['🧾', 'Utility visit slip: meter read 10:06, "read from the sidewalk, no entry to the yard".'],
      ['🐕', 'Walker app: Wren\'s walk 13:00–13:40, "returned to yard, gate locked".']
    ],
    chat: [
      { s: 'wren', t: '16:22', m: 'Got him back at 1:40 and locked the gate behind me. Code and everything, it beeped.' },
      { s: 'otis', t: '16:24', m: 'I wasn\'t even on that street today, my route was the north side.', lie: 'The doorbell camera shows Otis at the door at 10:05 and the utility slip has the meter read at 10:06.' },
      { s: 'lia', t: '16:26', m: 'I just left some treats at the front door around 3:30. Never went into the yard.', lie: 'The gate was unlocked with Lia\'s code at 15:32, two minutes after the doorbell saw her.' },
      { s: 'wren', t: '16:27', m: 'Did anyone go back after me? The lock keeps a log.' },
      { s: 'lia', t: '16:28', m: 'Maybe the latch is broken. It sticks sometimes.' },
      { s: 'otis', t: '16:30', m: 'If the gate was open the collar will show when he left.' },
      { s: 'wren', t: '16:31', m: 'It does. 3:36. Somebody opened that gate right before.' },
      { s: 'lia', t: '16:33', m: 'well he\'s home now so' }
    ],
    culprit: 'lia',
    solve: 'Lia unlocked the gate with her own code at 15:32 to feed Biscuit, left it open, and the collar shows him walking out at 15:36. Otis lied about his route, but the slip proves he only read the meter from the sidewalk at 10:06, five hours before the gate opened.'
  },
  {
    id: 'gallery', title: 'Blue Hour', place: 'Gallery Sett · 9:40 pm', difficulty: 3,
    intro: 'Sometime tonight the painting Blue Hour was swapped for a print. The lights went down for a two-minute projection during the toast. Four people were close enough.',
    suspects: [['nell', 'Nell', 'Gallery assistant'], ['hugo', 'Hugo', 'Collector, sponsor'], ['bea', 'Bea', 'Caterer'], ['kai', 'Kai', 'Artist\'s partner']],
    facts: [
      ['🧥', 'Coat check: #12 Hugo in 18:40, out 20:15 · #19 Kai in 19:05, out 21:30. Catering staff checked no coats.'],
      ['⏱️', 'AV booth timeline: 19:58 toast by sponsor Hugo at the microphone, front of the main room · 20:00 lights down for the projection · 20:02 lights up. Hugo kept the mic until 20:02.'],
      ['🚪', 'AV booth door log: Nell in 19:55, out 20:05. No one else entered the booth tonight.'],
      ['🚐', 'Catering van, parking receipt: in 17:30 · out 20:01. The lot is a three-minute walk from the gallery.'],
      ['🖼️', 'Insurance photo, 17:10, on the gallery wall: brass plaque "Blue Hour · 2019" on the bottom rail of the frame. The print\'s frame has no plaque.']
    ],
    chat: [
      { s: 'nell', t: '21:40', m: 'The piece in the back room is a print. Someone swapped Blue Hour tonight. When?' },
      { s: 'hugo', t: '21:42', m: 'Honestly? It was a print all evening. No plaque on that frame when I walked in at 6:40.', lie: 'The insurance photo at 17:10 shows the original on the wall with its brass plaque; the plaque was there before Hugo arrived.' },
      { s: 'bea', t: '21:44', m: 'I was serving inside through the toast and the whole blackout. Nobody went into the back room.', lie: 'The catering van left the lot at 20:01, a three-minute walk away, so Bea was outside during the lights-down.' },
      { s: 'kai', t: '21:45', m: 'During the projection I was up in the booth helping Nell with the slides.', lie: 'The booth door log shows only Nell entering, at 19:55, and no one else all night.' },
      { s: 'nell', t: '21:46', m: 'The booth has a door log. It was just me in there.' },
      { s: 'hugo', t: '21:48', m: 'I was standing right next to the painting during the blackout. I would have seen anyone.', lie: 'The timeline puts Hugo at the microphone at the front of the main room from 19:58 to 20:02, not in the back room.' },
      { s: 'kai', t: '21:50', m: 'Then it must have happened before the lights went down.' },
      { s: 'nell', t: '21:52', m: 'The projector ran two minutes. That\'s the only window the room was dark.' }
    ],
    culprit: 'kai',
    solve: 'For the two dark minutes, Nell was in the booth, Bea was out at the van, and Hugo was at the microphone in front of the whole room. Only Kai is unaccounted for, and Kai lied about being in the booth. Hugo lied twice, about the plaque and about guarding the painting, but sixty guests watched him hold the mic the entire time.'
  }
);
CASES.ko.push(
  {
    id: 'dog', title: '열린 대문', place: '메이플 코트 · 오후 4:20', difficulty: 1,
    intro: '비글 비스킷이 4시 10분에 두 블록 떨어진 곳에서 발견됐다. 마당은 울타리로 막혀 있고 대문엔 스마트 잠금장치가 있다. 오늘 집에 들른 사람은 셋.',
    suspects: [['wren', '렌', '도그워커'], ['otis', '오티스', '검침원'], ['lia', '리아', '옆집, 15살']],
    facts: [
      ['🔔', '초인종 카메라: 10:05 오티스, 공사 배지를 달고 현관 앞 · 15:30 리아, 간식 봉지를 들고 현관 앞. 그 밖엔 하루 종일 아무도 없음.'],
      ['🔐', '대문 스마트 잠금: 13:41 잠김(렌의 코드) · 15:32 열림(리아의 코드) · 15:34 "대문 열림" 경고. 이후 다시 잠긴 적 없음.'],
      ['📍', 'GPS 목걸이: 15:36까지 마당 · 15:36 대문 통과 · 16:10 엘름 스트리트.'],
      ['🧾', '검침 방문 전표: 10:06 검침, "인도에서 확인, 마당 출입 없음".'],
      ['🐕', '산책 앱: 렌의 산책 13:00–13:40, "마당에 복귀, 대문 잠금".']
    ],
    chat: [
      { s: 'wren', t: '16:22', m: '1시 40분에 데려다주고 대문 잠갔어요. 코드 누르고 삑 소리까지 확인했어요.' },
      { s: 'otis', t: '16:24', m: '저 오늘 그 길은 가지도 않았어요. 북쪽 구역 돌았어요.', lie: '초인종 카메라에 오티스가 10:05에 현관 앞에 있는 모습이 찍혔고, 검침 전표에도 10:06 검침이 적혀 있다.' },
      { s: 'lia', t: '16:26', m: '3시 반쯤 현관에 간식만 두고 갔어요. 마당엔 들어간 적 없어요.', lie: '초인종이 리아를 본 2분 뒤인 15:32에 대문이 리아의 코드로 열렸다.' },
      { s: 'wren', t: '16:27', m: '제 다음에 누가 또 왔어요? 잠금장치에 기록 남잖아요.' },
      { s: 'lia', t: '16:28', m: '걸쇠가 고장 났을 수도 있어요. 가끔 걸리던데.' },
      { s: 'otis', t: '16:30', m: '대문이 열려 있었으면 목걸이에 언제 나갔는지 나오겠네요.' },
      { s: 'wren', t: '16:31', m: '나와요. 3시 36분. 바로 전에 누가 대문을 연 거예요.' },
      { s: 'lia', t: '16:33', m: '어쨌든 지금은 집에 왔으니까' }
    ],
    culprit: 'lia',
    solve: '리아는 비스킷에게 간식을 주려고 15:32에 자기 코드로 대문을 열고 그대로 두었다. 목걸이는 비스킷이 15:36에 걸어 나간 것을 보여 준다. 오티스는 동선을 거짓말했지만, 전표대로 대문이 열리기 다섯 시간 전인 10:06에 인도에서 검침만 했다.'
  },
  {
    id: 'gallery', title: '블루 아워', place: '갤러리 세트 · 오후 9:40', difficulty: 3,
    intro: '오늘 밤 어느 순간 그림 "블루 아워"가 인쇄본으로 바뀌었다. 건배사 도중 2분짜리 영상 상영으로 조명이 꺼졌다. 가까이 있던 사람은 넷.',
    suspects: [['nell', '넬', '갤러리 어시스턴트'], ['hugo', '휴고', '수집가, 후원자'], ['bea', '베아', '케이터링'], ['kai', '카이', '작가의 파트너']],
    facts: [
      ['🧥', '코트 보관: #12 휴고 18:40 맡김, 20:15 찾음 · #19 카이 19:05 맡김, 21:30 찾음. 케이터링 직원은 맡긴 코트 없음.'],
      ['⏱️', 'AV 부스 타임라인: 19:58 후원자 휴고의 건배사, 메인 홀 앞쪽 마이크 · 20:00 상영을 위해 소등 · 20:02 점등. 휴고는 20:02까지 마이크를 잡고 있었음.'],
      ['🚪', 'AV 부스 출입 기록: 넬 19:55 입실, 20:05 퇴실. 오늘 밤 부스에 들어간 사람은 그 외 없음.'],
      ['🚐', '케이터링 밴 주차 영수증: 17:30 입차 · 20:01 출차. 주차장은 갤러리에서 걸어서 3분.'],
      ['🖼️', '보험용 사진, 17:10, 갤러리 벽에서 촬영: 액자 아래 테두리에 황동 명판 "Blue Hour · 2019". 인쇄본 액자에는 명판이 없음.']
    ],
    chat: [
      { s: 'nell', t: '21:40', m: '뒷방에 걸린 건 인쇄본이에요. 오늘 밤 누가 블루 아워를 바꿔치기했어요. 언제죠?' },
      { s: 'hugo', t: '21:42', m: '솔직히요? 저녁 내내 인쇄본이었어요. 6시 40분에 들어왔을 때 액자에 명판 없었어요.', lie: '17:10 보험용 사진에 원본이 황동 명판과 함께 벽에 걸려 있다. 휴고가 오기 전부터 명판은 있었다.' },
      { s: 'bea', t: '21:44', m: '건배사부터 소등 내내 안에서 서빙하고 있었어요. 뒷방에 들어간 사람 없었어요.', lie: '케이터링 밴은 걸어서 3분 거리의 주차장에서 20:01에 나갔다. 소등 시간에 베아는 밖에 있었다.' },
      { s: 'kai', t: '21:45', m: '상영 동안 저는 부스에 올라가서 넬 슬라이드 넘기는 거 도왔어요.', lie: '부스 출입 기록에는 19:55에 들어간 넬뿐이고, 밤새 다른 사람은 없다.' },
      { s: 'nell', t: '21:46', m: '부스에 출입 기록 있어요. 안에는 저 혼자였어요.' },
      { s: 'hugo', t: '21:48', m: '소등 때 저는 그림 바로 옆에 서 있었어요. 누가 왔으면 봤을 거예요.', lie: '타임라인상 휴고는 19:58부터 20:02까지 메인 홀 앞쪽 마이크 앞에 있었다. 뒷방이 아니다.' },
      { s: 'kai', t: '21:50', m: '그럼 조명 꺼지기 전에 일어난 일이겠네요.' },
      { s: 'nell', t: '21:52', m: '영상은 2분 돌았어요. 방이 어두웠던 건 그때뿐이에요.' }
    ],
    culprit: 'kai',
    solve: '어두웠던 2분 동안 넬은 부스에, 베아는 밴에, 휴고는 홀 전체가 보는 마이크 앞에 있었다. 행방이 비는 사람은 카이뿐이고, 카이는 부스에 있었다고 거짓말했다. 휴고는 명판과 그림을 지켰다는 것, 두 번 거짓말했지만 손님 예순 명이 그가 내내 마이크를 잡고 있는 걸 봤다.'
  }
);
