'use strict';
/* ==========================================================================
   ALIBI — the cases. Each case: suspects, evidence facts, a group chat
   where some messages contradict the evidence (lies), and the culprit.
   The structure is shared; text is per language (CASES.ko / CASES.en).
   Rules of fairness: every lie is contradicted by a fact or photo in the
   same case, and the culprit is the only suspect the facts pin down.
   ========================================================================== */
const CASES = {
  en: [
    {
      id: 'cake', title: 'The Missing Cake', place: 'Office kitchen · 3:55 pm', difficulty: 1,
      intro: 'A chocolate cake for the team vanished from the office fridge. Three people were around. Read the chat, find what doesn\'t add up, then accuse.',
      suspects: [['jun', 'Jun', 'Account manager'], ['mia', 'Mia', 'Designer'], ['theo', 'Theo', 'Developer']],
      facts: [
        ['🧾', 'Receipt, 14:50 — Bakery Mori: 1 chocolate cake.'],
        ['❄️', 'Fridge sensor: door opened at 15:12 and 15:40.'],
        ['🪪', 'Kitchen badge log: Jun 15:12 · Mia 15:39.'],
        ['📅', 'Calendar: Jun, client call 15:00–16:00 (meeting room B).']
      ],
      chat: [
        { s: 'jun', t: '15:05', m: 'Cake\'s in the fridge for the 4pm thing. Don\'t touch 🙏' },
        { s: 'theo', t: '15:06', m: 'no promises' },
        { s: 'jun', t: '15:55', m: 'WHO ate the cake' },
        { s: 'jun', t: '15:56', m: 'I stepped out of my call at quarter past to put it in, it was fine then' },
        { s: 'mia', t: '15:57', m: 'Not me. I haven\'t been in the kitchen all afternoon.', ev: 2, lie: 'The badge log shows Mia entering the kitchen at 15:39, a minute before the fridge opened.' },
        { s: 'theo', t: '15:58', m: 'Wasn\'t me either, it was strawberry anyway and I\'m allergic', ev: 0, lie: 'The receipt says chocolate. Theo never saw the cake, so he is guessing to sound innocent.' },
        { s: 'mia', t: '15:59', m: 'Maybe the cleaning crew?' },
        { s: 'jun', t: '16:00', m: 'They come at 7. Someone here is lying.' }
      ],
      culprit: 'mia',
      solve: 'Mia badged into the kitchen at 15:39 and the fridge opened at 15:40. Theo lied about the flavor to seem uninvolved, but only Mia was there when the cake disappeared.'
    },
    {
      id: 'vase', title: 'The Broken Vase', place: 'Apartment 7B · 7:30 pm', difficulty: 1,
      intro: 'Grandma Ro\'s vase is in pieces by the door. Three people passed through this evening. One of them is lying about it.',
      suspects: [['rafa', 'Rafa', 'Courier'], ['sol', 'Sol', 'Grandson, 12'], ['dana', 'Dana', 'Neighbor']],
      facts: [
        ['📷', 'Hallway CCTV: Rafa 18:02 · Sol 18:30 · Dana 19:15.'],
        ['🌧️', 'Weather: rain started at 18:00 and did not stop.'],
        ['👣', 'Photo: small wet shoe prints from the door to the vase.'],
        ['🥋', 'Taekwondo gym: Sol\'s class is Tue/Thu 17:00–18:00. Today is Tuesday.']
      ],
      chat: [
        { s: 'dana', t: '19:20', m: 'Ro, I knocked at 7:15 and nobody answered, but I saw the vase through the door glass. Already broken.' },
        { s: 'rafa', t: '19:22', m: 'Hi, courier here. Left the parcel outside the door, never went in. It was still dry when I came by.', ev: 1, lie: 'It had been raining since 18:00; Rafa arrived at 18:02.' },
        { s: 'sol', t: '19:25', m: 'grandma I was at taekwondo until 8!! just got home', ev: [0, 3], lie: 'CCTV shows Sol in the hallway at 18:30, and class ends at 18:00 anyway.' },
        { s: 'dana', t: '19:26', m: 'I didn\'t go inside either, the door was locked.' },
        { s: 'sol', t: '19:27', m: 'maybe the courier dropped the box on it' },
        { s: 'rafa', t: '19:28', m: 'The parcel is a pillow. It weighs nothing.' }
      ],
      culprit: 'sol',
      solve: 'Sol came home at 18:30 in the rain and walked in with wet shoes: the small prints lead straight to the vase. Rafa fibbed about the weather, but he never entered.'
    },
    {
      id: 'draft', title: 'The Leaked Draft', place: 'Startup office · 11:40 pm', difficulty: 2,
      intro: 'A competitor posted your unreleased product page an hour after the draft was finished. Four people had access.',
      suspects: [['ava', 'Ava', 'Design lead'], ['ben', 'Ben', 'Engineer'], ['cleo', 'Cleo', 'Product manager'], ['dev', 'Dev', 'Intern']],
      facts: [
        ['📄', 'Document log: opened by Ben 22:10 (office) · Dev 22:31 (external IP) · Cleo 09:00 next morning.'],
        ['📶', 'IT ticket: office Wi-Fi was down from 21:30 to 23:30.'],
        ['🌐', 'Competitor page went live at 23:00.'],
        ['🔑', 'Access list: Ben, Cleo, Dev. Ava was never added.']
      ],
      chat: [
        { s: 'cleo', t: '23:41', m: 'It\'s on their site. Word for word. Who opened the draft tonight?' },
        { s: 'ben', t: '23:43', m: 'I did, around 10, on the office wifi. Just proofreading, then I left.', ev: 1, lie: 'The office Wi-Fi was down from 21:30. Ben opened it at 22:10 from the office, so he used another connection and is hiding something about how.' },
        { s: 'dev', t: '23:44', m: 'I never opened the draft. I don\'t even think I have access?', ev: [0, 3], lie: 'The log shows Dev opened it at 22:31 from an external IP, and the access list includes Dev.' },
        { s: 'ava', t: '23:45', m: 'I couldn\'t have. Nobody ever added me to that doc.' },
        { s: 'cleo', t: '23:46', m: 'I only opened it this morning to add the pricing table.' },
        { s: 'ben', t: '23:47', m: 'Dev, you were still here at 10:30, I saw you at your desk.' },
        { s: 'dev', t: '23:48', m: 'I was packing up!!' }
      ],
      culprit: 'dev',
      solve: 'Dev opened the draft at 22:31 from outside the office network, half an hour before the competitor published. Ben\'s story about the Wi-Fi was sloppy, but his access was earlier and from inside.'
    },
    {
      id: 'festival', title: 'The Festival Cash Box', place: 'School festival · 5:50 pm', difficulty: 2,
      intro: 'The ticket desk cash box was full at five. At quarter to six it was empty. Three students were on duty.',
      suspects: [['hana', 'Hana', 'Food stall'], ['ian', 'Ian', 'Band'], ['jae', 'Jae', 'Ticket desk']],
      facts: [
        ['💰', 'Teacher Kim counted the box at 17:00: full.'],
        ['🎸', 'Stage video: Ian\'s band played 17:10–17:35.'],
        ['🤳', 'Hana\'s selfie, 17:20, at the food stall. Behind her: the ticket desk, chair empty.'],
        ['📋', 'Duty roster: Jae on the ticket desk 17:00–18:00, no breaks.']
      ],
      chat: [
        { s: 'ian', t: '17:52', m: 'We were on stage the whole set, ask anyone' },
        { s: 'jae', t: '17:53', m: 'I never left the desk. Someone must have grabbed it while I was turned around.', ev: 2, lie: 'Hana\'s 17:20 selfie shows the ticket desk with an empty chair.' },
        { s: 'hana', t: '17:54', m: 'I was at the food stall the whole time, I couldn\'t even see the desk from there.', ev: 2, lie: 'Her own selfie has the ticket desk right behind her.' },
        { s: 'jae', t: '17:55', m: 'Honestly the box looked pretty empty already at 5.', ev: 0, lie: 'Teacher Kim counted it full at 17:00.' },
        { s: 'ian', t: '17:56', m: 'Jae, we literally saw you walk past the stage around 5:20' },
        { s: 'jae', t: '17:56', m: 'That was the bathroom. 2 minutes.' }
      ],
      culprit: 'jae',
      solve: 'Jae left the desk around 17:20 and lied about it twice, including about the box being empty at five. Hana lied about not seeing the desk only because she didn\'t want to admit she noticed and said nothing.'
    },
    {
      id: 'hotel', title: 'Room 1204', place: 'Hotel Marin · 2:30 pm', difficulty: 3,
      intro: 'A guest returned to room 1204 to find the door ajar and his watch gone. Three staff and guests were on the twelfth floor today.',
      suspects: [['lee', 'Lee', 'Housekeeping'], ['oren', 'Oren', 'Guest, room 1206'], ['pat', 'Pat', 'Bell staff']],
      facts: [
        ['🔑', 'Keycard log, room 1204: housekeeping 10:05 · guest 14:20. No other entries.'],
        ['🛠️', 'Maintenance ticket 13:30: door closer on 1204 broken, door does not latch on its own.'],
        ['🛗', 'Elevator camera: Pat with a luggage cart, floor 12, 13:50.'],
        ['🧹', 'Housekeeping schedule: Lee, floor 12 10:00–10:30, then floor 9.'],
        ['🧳', 'Front desk: Oren checked out at 12:00.']
      ],
      chat: [
        { s: 'lee', t: '14:35', m: 'I cleaned 1204 at ten and was down on nine by eleven. Watch was on the nightstand when I left.' },
        { s: 'oren', t: '14:36', m: 'I was still in my room at 2, didn\'t hear anything next door.', ev: 4, lie: 'Oren checked out at 12:00.' },
        { s: 'pat', t: '14:37', m: 'I was on the ground floor all afternoon, never went up to 12 today.', ev: 2, lie: 'The elevator camera shows Pat on floor 12 at 13:50 with a cart.' },
        { s: 'lee', t: '14:38', m: 'The keycard log would show whoever went in, right?' },
        { s: 'pat', t: '14:39', m: 'Exactly. And it only shows housekeeping.' },
        { s: 'oren', t: '14:40', m: 'Maybe the guest just lost it.' }
      ],
      culprit: 'pat',
      solve: 'The door didn\'t latch after 13:30, so no keycard was needed. Pat was on floor 12 at 13:50 and lied about it. Oren lied about being in his room, but he had checked out two hours earlier and was gone.'
    },
    {
      id: 'guild', title: 'The Guild Treasury', place: 'Online · 2:14 am', difficulty: 3,
      intro: '10,000 gold left the guild treasury in the middle of the night. The log blames one account. The chat tells a different story.',
      suspects: [['nyx', 'Nyx', 'Guild leader'], ['oak', 'Oak', 'Treasurer'], ['pix', 'Pix', 'Recruiter'], ['quill', 'Quill', 'Raid lead']],
      facts: [
        ['🏦', 'Treasury log: 10,000 gold withdrawn at 02:14 by account Oak.'],
        ['💻', 'Login log: Oak signed in at 02:10 from a new device. Oak\'s usual device was offline since 23:00.'],
        ['✉️', 'Direct message log: Pix → Oak, 01:40: "free skin, claim here" + link. Link flagged as phishing.'],
        ['🛠️', 'Server maintenance: 03:00–04:00.']
      ],
      chat: [
        { s: 'nyx', t: '08:02', m: 'Treasury is empty. Log says Oak. Explain.' },
        { s: 'oak', t: '08:05', m: 'I was asleep. I haven\'t logged in since 11pm, I swear.' },
        { s: 'quill', t: '08:06', m: 'Can\'t have been 2am anyway, the server was down for maintenance then.', ev: 3, lie: 'Maintenance was 03:00–04:00. At 02:14 the server was up.' },
        { s: 'pix', t: '08:07', m: 'I didn\'t message anyone last night, I was raiding.', ev: 2, lie: 'The DM log shows Pix sent Oak a phishing link at 01:40.' },
        { s: 'oak', t: '08:08', m: 'wait, I did click something from Pix before bed. a skin thing.' },
        { s: 'pix', t: '08:09', m: 'That wasn\'t me, my account must have been hacked too' },
        { s: 'nyx', t: '08:10', m: 'Somebody is lying and it\'s not the log.' }
      ],
      culprit: 'pix',
      solve: 'Oak\'s account was phished: Pix sent the link at 01:40, a "new device" signed in as Oak at 02:10 and emptied the treasury. Quill\'s maintenance claim was just wrong; Pix\'s denial was the real lie.'
    }
  ],
  ko: [
    {
      id: 'cake', title: '사라진 케이크', place: '사무실 탕비실 · 오후 3:55', difficulty: 1,
      intro: '팀 회의용 초콜릿 케이크가 냉장고에서 사라졌다. 근처에 있던 사람은 셋. 채팅을 읽고, 앞뒤가 안 맞는 말을 찾은 뒤, 범인을 지목하라.',
      suspects: [['jun', '준', '영업 담당'], ['mia', '미아', '디자이너'], ['theo', '테오', '개발자']],
      facts: [
        ['🧾', '영수증, 14:50 — 베이커리 모리: 초콜릿 케이크 1개.'],
        ['❄️', '냉장고 센서: 문 열림 15:12, 15:40.'],
        ['🪪', '탕비실 출입 기록: 준 15:12 · 미아 15:39.'],
        ['📅', '일정: 준, 고객 통화 15:00–16:00 (회의실 B).']
      ],
      chat: [
        { s: 'jun', t: '15:05', m: '4시 회의용 케이크 냉장고에 넣어 둘게요. 손대지 마세요 🙏' },
        { s: 'theo', t: '15:06', m: '약속은 못 함' },
        { s: 'jun', t: '15:55', m: '케이크 누가 먹었어요' },
        { s: 'jun', t: '15:56', m: '3시 15분에 통화 잠깐 빠져나와서 넣었는데 그땐 멀쩡했어요' },
        { s: 'mia', t: '15:57', m: '저 아니에요. 오후 내내 탕비실 근처도 안 갔어요.', ev: 2, lie: '출입 기록에 미아가 15:39에 탕비실에 들어간 것으로 남아 있다. 냉장고가 열리기 1분 전이다.' },
        { s: 'theo', t: '15:58', m: '저도 아님, 어차피 딸기 케이크였잖아요 저 딸기 알레르기', ev: 0, lie: '영수증에는 초콜릿 케이크다. 테오는 케이크를 본 적도 없으면서 결백해 보이려고 지어냈다.' },
        { s: 'mia', t: '15:59', m: '청소하시는 분들 아닐까요?' },
        { s: 'jun', t: '16:00', m: '청소는 7시예요. 여기 누군가 거짓말하고 있어요.' }
      ],
      culprit: 'mia',
      solve: '미아는 15:39에 탕비실에 들어갔고 냉장고는 15:40에 열렸다. 테오는 무관해 보이려고 케이크 맛을 꾸며 냈지만, 케이크가 사라질 때 그 자리에 있던 사람은 미아뿐이다.'
    },
    {
      id: 'vase', title: '깨진 화병', place: '아파트 7B · 오후 7:30', difficulty: 1,
      intro: '로 할머니의 화병이 현관 앞에서 산산조각 났다. 오늘 저녁 집 앞을 지난 사람은 셋. 그중 하나가 거짓말을 하고 있다.',
      suspects: [['rafa', '라파', '택배 기사'], ['sol', '솔', '손자, 12살'], ['dana', '다나', '옆집']],
      facts: [
        ['📷', '복도 CCTV: 라파 18:02 · 솔 18:30 · 다나 19:15.'],
        ['🌧️', '날씨: 18:00부터 비, 그친 적 없음.'],
        ['👣', '사진: 현관에서 화병까지 이어진 작은 젖은 발자국.'],
        ['🥋', '태권도장: 솔의 수업은 화·목 17:00–18:00. 오늘은 화요일.']
      ],
      chat: [
        { s: 'dana', t: '19:20', m: '로 여사님, 7시 15분에 노크했는데 대답이 없더라고요. 문 유리로 화병이 보였는데 이미 깨져 있었어요.' },
        { s: 'rafa', t: '19:22', m: '택배입니다. 문 앞에 두고 갔고 안에는 안 들어갔어요. 제가 갔을 땐 비도 안 왔고요.', ev: 1, lie: '비는 18:00부터 내렸고 라파는 18:02에 도착했다.' },
        { s: 'sol', t: '19:25', m: '할머니 나 8시까지 태권도장에 있었어!! 지금 막 왔어', ev: [0, 3], lie: 'CCTV에 솔은 18:30에 복도에 있었고, 수업도 18:00에 끝난다.' },
        { s: 'dana', t: '19:26', m: '저도 안 들어갔어요. 문이 잠겨 있었거든요.' },
        { s: 'sol', t: '19:27', m: '택배 아저씨가 상자 떨어뜨린 거 아냐?' },
        { s: 'rafa', t: '19:28', m: '택배는 베개예요. 무게가 없다시피 해요.' }
      ],
      culprit: 'sol',
      solve: '솔은 18:30에 빗속에서 집에 돌아와 젖은 신발로 들어갔다. 작은 발자국이 화병까지 곧장 이어진다. 라파는 날씨를 얼버무렸지만 안에 들어간 적은 없다.'
    },
    {
      id: 'draft', title: '유출된 초안', place: '스타트업 사무실 · 오후 11:40', difficulty: 2,
      intro: '초안을 끝낸 지 한 시간 만에 경쟁사가 우리 미공개 제품 페이지를 올렸다. 접근 권한이 있던 사람은 넷.',
      suspects: [['ava', '아바', '디자인 리드'], ['ben', '벤', '엔지니어'], ['cleo', '클레오', 'PM'], ['dev', '데브', '인턴']],
      facts: [
        ['📄', '문서 기록: 벤 22:10 열람(사무실) · 데브 22:31 열람(외부 IP) · 클레오 다음 날 09:00.'],
        ['📶', 'IT 티켓: 사무실 와이파이 21:30–23:30 먹통.'],
        ['🌐', '경쟁사 페이지 게시: 23:00.'],
        ['🔑', '접근 권한: 벤, 클레오, 데브. 아바는 추가된 적 없음.']
      ],
      chat: [
        { s: 'cleo', t: '23:41', m: '경쟁사 사이트에 떴어요. 토씨 하나 안 틀리고. 오늘 밤 초안 연 사람?' },
        { s: 'ben', t: '23:43', m: '저요, 10시쯤 사무실 와이파이로요. 오타만 보고 퇴근했어요.', ev: 1, lie: '사무실 와이파이는 21:30부터 끊겨 있었다. 벤은 22:10에 사무실에서 열었으니 다른 연결을 썼고, 그걸 숨기고 있다.' },
        { s: 'dev', t: '23:44', m: '저는 초안 연 적 없어요. 저한테 권한이 있긴 한가요?', ev: [0, 3], lie: '기록에 데브가 22:31에 외부 IP로 열었다고 남아 있고, 권한 목록에도 데브가 있다.' },
        { s: 'ava', t: '23:45', m: '저는 못 열어요. 그 문서에 저 추가된 적이 없잖아요.' },
        { s: 'cleo', t: '23:46', m: '저는 오늘 아침에 가격표 넣으려고 연 게 전부예요.' },
        { s: 'ben', t: '23:47', m: '데브, 10시 반에도 자리에 있었잖아요. 제가 봤어요.' },
        { s: 'dev', t: '23:48', m: '짐 싸고 있었어요!!' }
      ],
      culprit: 'dev',
      solve: '데브는 22:31에 사무실 밖 네트워크에서 초안을 열었다. 경쟁사가 게시하기 30분 전이다. 벤의 와이파이 이야기는 허술했지만, 벤의 열람은 더 이른 시각에 사무실 안에서였다.'
    },
    {
      id: 'festival', title: '축제 현금함', place: '학교 축제 · 오후 5:50', difficulty: 2,
      intro: '5시에 가득 찼던 티켓 부스 현금함이 5시 45분에 비어 있었다. 당번 학생은 셋.',
      suspects: [['hana', '하나', '먹거리 부스'], ['ian', '이안', '밴드'], ['jae', '재', '티켓 부스']],
      facts: [
        ['💰', '김 선생님이 17:00에 현금함 확인: 가득 참.'],
        ['🎸', '무대 영상: 이안의 밴드 공연 17:10–17:35.'],
        ['🤳', '하나의 셀카, 17:20, 먹거리 부스. 뒤로 티켓 부스가 보이고 의자는 비어 있음.'],
        ['📋', '당번표: 재, 티켓 부스 17:00–18:00, 휴식 없음.']
      ],
      chat: [
        { s: 'ian', t: '17:52', m: '우린 공연 내내 무대에 있었어, 아무나 물어봐' },
        { s: 'jae', t: '17:53', m: '난 부스 떠난 적 없어. 내가 돌아선 사이에 누가 집어 간 거야.', ev: 2, lie: '하나의 17:20 셀카에 티켓 부스 의자가 비어 있는 게 찍혀 있다.' },
        { s: 'hana', t: '17:54', m: '난 계속 먹거리 부스에 있었어. 거기서는 티켓 부스가 보이지도 않아.', ev: 2, lie: '본인 셀카에 티켓 부스가 바로 뒤에 찍혀 있다.' },
        { s: 'jae', t: '17:55', m: '솔직히 5시에 이미 현금함 거의 비어 있었어.', ev: 0, lie: '김 선생님이 17:00에 가득 찬 것을 확인했다.' },
        { s: 'ian', t: '17:56', m: '재, 너 5시 20분쯤 무대 앞 지나가는 거 우리가 봤는데' },
        { s: 'jae', t: '17:56', m: '화장실. 2분.' }
      ],
      culprit: 'jae',
      solve: '재는 17:20쯤 부스를 비웠고, 그 일과 5시의 현금함 상태에 대해 두 번 거짓말했다. 하나는 부스를 봤다는 걸 인정하고 싶지 않아서 거짓말했지만, 함을 가져가지는 않았다.'
    },
    {
      id: 'hotel', title: '1204호', place: '호텔 마린 · 오후 2:30', difficulty: 3,
      intro: '투숙객이 1204호로 돌아오니 문이 열려 있고 시계가 사라졌다. 오늘 12층에 있던 직원과 손님은 셋.',
      suspects: [['lee', '이 주임', '객실 청소'], ['oren', '오렌', '1206호 손님'], ['pat', '팻', '벨 직원']],
      facts: [
        ['🔑', '1204호 카드키 기록: 청소 10:05 · 투숙객 14:20. 다른 출입 없음.'],
        ['🛠️', '시설 티켓 13:30: 1204호 도어 클로저 고장, 문이 저절로 닫히지 않음.'],
        ['🛗', '엘리베이터 카메라: 팻, 짐 카트와 함께 12층, 13:50.'],
        ['🧹', '청소 일정: 이 주임, 12층 10:00–10:30, 이후 9층.'],
        ['🧳', '프런트: 오렌 12:00 체크아웃.']
      ],
      chat: [
        { s: 'lee', t: '14:35', m: '1204호는 10시에 청소했고 11시엔 9층에 있었어요. 나올 때 시계는 협탁 위에 있었고요.' },
        { s: 'oren', t: '14:36', m: '저는 2시에도 방에 있었는데 옆방에서 아무 소리도 못 들었어요.', ev: 4, lie: '오렌은 12:00에 체크아웃했다.' },
        { s: 'pat', t: '14:37', m: '저는 오후 내내 1층이었어요. 오늘 12층엔 올라간 적도 없어요.', ev: 2, lie: '엘리베이터 카메라에 팻이 13:50에 카트를 끌고 12층에 있는 모습이 찍혔다.' },
        { s: 'lee', t: '14:38', m: '카드키 기록 보면 누가 들어갔는지 나오지 않나요?' },
        { s: 'pat', t: '14:39', m: '그렇죠. 그리고 거기엔 청소밖에 없잖아요.' },
        { s: 'oren', t: '14:40', m: '손님이 그냥 잃어버린 거 아닐까요.' }
      ],
      culprit: 'pat',
      solve: '13:30 이후 문이 저절로 닫히지 않았으니 카드키 없이도 들어갈 수 있었다. 팻은 13:50에 12층에 있었고 그 사실을 숨겼다. 오렌도 방에 있었다고 거짓말했지만, 두 시간 전에 이미 체크아웃한 뒤였다.'
    },
    {
      id: 'guild', title: '길드 금고', place: '온라인 · 새벽 2:14', difficulty: 3,
      intro: '한밤중에 길드 금고에서 골드 1만이 빠져나갔다. 기록은 한 계정을 가리킨다. 채팅은 다른 이야기를 한다.',
      suspects: [['nyx', '닉스', '길드장'], ['oak', '오크', '금고 담당'], ['pix', '픽스', '모집 담당'], ['quill', '퀼', '레이드 리더']],
      facts: [
        ['🏦', '금고 기록: 02:14, 오크 계정이 골드 10,000 인출.'],
        ['💻', '로그인 기록: 오크, 02:10 새 기기에서 로그인. 오크의 평소 기기는 23:00부터 오프라인.'],
        ['✉️', '귓속말 기록: 픽스 → 오크, 01:40 "무료 스킨, 여기서 받아" + 링크. 링크는 피싱으로 분류됨.'],
        ['🛠️', '서버 점검: 03:00–04:00.']
      ],
      chat: [
        { s: 'nyx', t: '08:02', m: '금고 비었어. 기록은 오크래. 설명해.' },
        { s: 'oak', t: '08:05', m: '저 자고 있었어요. 11시 이후로 접속한 적 없어요, 진짜로.' },
        { s: 'quill', t: '08:06', m: '어차피 2시엔 불가능해요. 그때 서버 점검이었잖아요.', ev: 3, lie: '점검은 03:00–04:00이었다. 02:14에는 서버가 켜져 있었다.' },
        { s: 'pix', t: '08:07', m: '저 어젯밤에 아무한테도 귓속말 안 했어요. 레이드 중이었어요.', ev: 2, lie: '귓속말 기록에 픽스가 01:40에 오크에게 피싱 링크를 보낸 것이 남아 있다.' },
        { s: 'oak', t: '08:08', m: '잠깐, 자기 전에 픽스가 보낸 거 누르긴 했어요. 스킨 뭐라고.' },
        { s: 'pix', t: '08:09', m: '그거 제가 아니에요, 제 계정도 해킹당한 거겠죠' },
        { s: 'nyx', t: '08:10', m: '누군가 거짓말하고 있고, 그건 기록이 아니야.' }
      ],
      culprit: 'pix',
      solve: '오크의 계정은 피싱당했다. 픽스가 01:40에 링크를 보냈고, "새 기기"가 02:10에 오크로 로그인해 금고를 비웠다. 퀼의 점검 이야기는 그냥 틀린 말이었고, 픽스의 부인이 진짜 거짓말이었다.'
    }
  ]
};
