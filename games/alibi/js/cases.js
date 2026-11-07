'use strict';
/* ==========================================================================
   ALIBI — the cases. Each case: suspects, evidence facts, a group chat
   where some messages contradict the evidence (lies), and the culprit.
   The structure is shared; text is per language (CASES.ko / CASES.en).
   Rules of fairness: every lie is contradicted by a fact or photo in the
   same case, and the culprit is the only suspect the facts pin down.
   ========================================================================== */
const OUTRO = { en: {}, ko: {} };   /* filled by outro-*.js: chat lines after the accusation */
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
        { s: 'theo', t: '15:58', m: 'Wasn\'t me. I saw Mia open the fridge at quarter past three, right after she badged in.', ev: [1, 2], lie: 'The 15:12 fridge opening was Jun\'s — the badge log has Jun at 15:12 and Mia at 15:39, a minute before the 15:40 opening. Theo swapped the two openings to blame Mia.' },
        { s: 'mia', t: '15:59', m: 'Maybe the cleaning crew?' },
        { s: 'jun', t: '16:00', m: 'They come at 7. Someone here is lying.' }
      ],
      culprit: 'mia',
      solve: 'Mia badged into the kitchen at 15:39 and the fridge opened at 15:40. Theo claimed he saw Mia open it at quarter past three — but the 15:12 opening was Jun\'s, putting the cake in. Theo swapped the two openings to point at Mia.'
    },
    {
      id: 'vase', title: 'The Broken Vase', place: 'Apartment 7B · 7:30 pm', difficulty: 2,
      intro: 'Grandma Ro\'s vase is in pieces by the door. Three people were in the hallway tonight, and the loudest one is lying. That might not mean what it seems.',
      suspects: [['rafa', 'Rafa', 'Courier'], ['sol', 'Sol', 'Grandson, 12'], ['dana', 'Dana', 'Neighbor']],
      facts: [
        ['📷', 'Hallway CCTV: Rafa 18:02, parcel left at the door · Sol 18:30, in · Dana 19:15, knocking, then leaving at 19:17.'],
        ['🔐', 'Smart lock, 7B: opened by Sol\'s code 18:30 · locked 18:31 · no openings until Ro\'s code at 19:40.'],
        ['🌧️', 'Weather: rain started at 18:00 and did not stop.'],
        ['👣', 'Photo: small wet shoe prints from the door to the vase.'],
        ['🥋', 'Taekwondo gym: Sol\'s class is Tue/Thu 17:00–18:00. Today is Tuesday.']
      ],
      chat: [
        { s: 'rafa', t: '19:42', m: 'Courier here. I set the parcel down at 6:02 and left. Never touched the door.' },
        { s: 'dana', t: '19:44', m: 'Ro, I never came by tonight. I don\'t even have a code — the lock would prove I never got in.', ev: 0, lie: 'The hallway camera shows Dana at Ro\'s door at 19:15, knocking, and leaving at 19:17. Her lock claim is true — she never got in — but the visit itself is the lie.' },
        { s: 'sol', t: '19:45', m: 'grandma I was at taekwondo until 8!! just got home', ev: [0, 1, 4], lie: 'The smart lock opened with Sol\'s code at 18:30, and class ends at 18:00 anyway. The hallway camera also has Sol coming in at 18:30.' },
        { s: 'rafa', t: '19:47', m: 'Dana, the camera has you at the door at quarter past seven. Why say you weren\'t there?' },
        { s: 'dana', t: '19:48', m: 'That camera is wrong half the time. Whatever it shows, I had no reason to be there.' },
        { s: 'sol', t: '19:49', m: 'she knocks on our door all the time about the TV volume. she was probably mad again' },
        { s: 'rafa', t: '19:50', m: 'Mad enough to go in? The lock keeps a log too.' },
        { s: 'dana', t: '19:52', m: 'I did not go in. I don\'t even have a code. Ask the lock.' },
        { s: 'sol', t: '19:53', m: 'see, she\'s changing her story' }
      ],
      culprit: 'sol',
      solve: 'Dana lied about not coming by — hiding behind the true claim that the lock never opened for her — and the camera catches her at the door at 19:15. But the same camera shows her knocking and leaving: the facts that expose her lie also prove she never got inside. Sol\'s code opened the door at 18:30, class had ended at 18:00, it was raining, and the small wet prints run from the door to the vase. Dana only lied because she had come to ask Ro for a loan and was too embarrassed to say so.'
    },
    {
      id: 'draft', title: 'The Leaked Draft', place: 'Startup office · 11:40 pm', difficulty: 2,
      intro: 'A competitor posted your unreleased product page an hour after the draft was finished. Four people had access.',
      suspects: [['ava', 'Ava', 'Design lead'], ['ben', 'Ben', 'Engineer'], ['cleo', 'Cleo', 'Product manager'], ['dev', 'Dev', 'Intern']],
      facts: [
        ['📄', 'Document log: opened by Ben 22:10 (office) · Dev 22:31 (external IP) · Cleo 20:15 (office).'],
        ['📶', 'IT ticket: office Wi-Fi was down from 21:30 to 23:30.'],
        ['🌐', 'Competitor page went live at 23:00.'],
        ['🔑', 'Access list: Ben, Cleo, Dev. Ava was never added.']
      ],
      chat: [
        { s: 'cleo', t: '23:41', m: 'It\'s on their site. Word for word. Who opened the draft tonight?' },
        { s: 'ben', t: '23:43', m: 'I did, around 10, on the office wifi. Just proofreading, then I left.', ev: 1, lie: 'The office Wi-Fi was down from 21:30. Ben opened it at 22:10 from the office, so he used another connection and is hiding something about how.' },
        { s: 'dev', t: '23:44', m: 'I never opened the draft. I don\'t even think I have access?', ev: [0, 3], lie: 'The log shows Dev opened it at 22:31 from an external IP, and the access list includes Dev.' },
        { s: 'ava', t: '23:45', m: 'I couldn\'t have. Nobody ever added me to that doc.' },
        { s: 'cleo', t: '23:46', m: 'I opened it at quarter past eight to add the pricing table, then went home.' },
        { s: 'ben', t: '23:47', m: 'Dev, you were still here at 10:30, I saw you at your desk.' },
        { s: 'dev', t: '23:48', m: 'I was packing up!!' }
      ],
      culprit: 'dev',
      solve: 'Dev opened the draft at 22:31 from outside the office network, half an hour before the competitor published. Ben\'s story about the Wi-Fi was sloppy, but his access was earlier and from inside.'
    },
    {
      id: 'festival', title: 'The Festival Cash Box', place: 'School festival · 5:50 pm', difficulty: 2,
      intro: 'The ticket desk cash box was full at five. At quarter to six it was empty. Three students were on duty, and one of them took a selfie at exactly the wrong moment.',
      suspects: [['hana', 'Hana', 'Food stall'], ['ian', 'Ian', 'Band'], ['jae', 'Jae', 'Ticket desk']],
      facts: [
        ['🤳', 'Hana\'s selfie at the food stall, 17:20, posted to the class chat.', ['gym clock', 'ticket desk chair', 'cash box', 'jacket on the chair', 'stage']],
        ['💰', 'Teacher Kim counted the box at 17:00: full, lid closed.'],
        ['🎸', 'Stage video: Ian\'s band played 17:10–17:35, Ian on vocals in every shot.'],
        ['📋', 'Duty roster: Jae on the ticket desk 17:00–18:00, no breaks.']
      ],
      chat: [
        { s: 'ian', t: '17:52', m: 'We were on stage the whole set, it\'s on video' },
        { s: 'jae', t: '17:53', m: 'I never left the desk. Someone must have grabbed it while I was turned around.', ev: 0, lie: 'Hana\'s 17:20 selfie shows the ticket desk behind her with the chair empty and Jae\'s jacket left on it.' },
        { s: 'hana', t: '17:54', m: 'I was at the food stall the whole time, I couldn\'t even see the desk from there.', ev: 0, lie: 'Her own selfie has the ticket desk right behind her, box and all.' },
        { s: 'jae', t: '17:55', m: 'Honestly the box looked pretty empty already at 5.', ev: 1, lie: 'Teacher Kim counted it full at 17:00, with the lid closed.' },
        { s: 'ian', t: '17:56', m: 'Hana, you posted a selfie at 5:20. Zoom in behind your head.' },
        { s: 'hana', t: '17:57', m: 'that\'s just the gym, you can\'t tell anything from that' },
        { s: 'jae', t: '17:58', m: 'If I\'d left, my jacket would be gone too. I always take it.' },
        { s: 'ian', t: '17:59', m: 'Look at the chair, Jae.' }
      ],
      culprit: 'jae',
      solve: 'The selfie tells the whole story: at 5:20 by the gym clock the ticket desk chair is empty, Jae\'s jacket is still on it, and the cash box sits open on the desk, not closed the way Teacher Kim left it at five. Ian was on stage in every frame of the video, and Hana was in front of her own camera. Jae left the desk, and lied about it twice. Hana lied about seeing the desk only because she had noticed it was empty and said nothing.'
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
        { s: 'quill', t: '08:06', m: 'The log says 02:14, but the server was down for maintenance then.', ev: [0, 3], lie: 'Maintenance was 03:00–04:00. At 02:14 the server was up — the treasury log\'s timestamp stands.' },
        { s: 'pix', t: '08:07', m: 'Oak logged in himself at 2:10, from his own phone. Check the login log.', ev: [1, 2], lie: 'Oak\'s usual device was offline since 23:00, so the 02:10 new-device sign-in was not his. It came thirty minutes after Pix\'s 01:40 phishing link.' },
        { s: 'oak', t: '08:08', m: 'wait, I did click something from Pix before bed. a skin thing.' },
        { s: 'pix', t: '08:09', m: 'That wasn\'t me, my account must have been hacked too' },
        { s: 'nyx', t: '08:10', m: 'Somebody is lying and it\'s not the log.' }
      ],
      culprit: 'pix',
      solve: 'Oak\'s account was phished: Pix sent the link at 01:40, a "new device" signed in as Oak at 02:10 and emptied the treasury. Quill\'s maintenance claim fails — maintenance was 03:00–04:00, so the server was up at 02:14. Pix\'s login story hides the phishing chain.'
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
        { s: 'theo', t: '15:58', m: '저도 아니에요. 3시 15분에 미아가 출입증 찍고 냉장고 여는 거 봤어요.', ev: [1, 2], lie: '15:12 냉장고 열림은 준의 것이다. 출입 기록에 준 15:12, 미아 15:39가 있고, 냉장고는 15:40에 열렸다. 테오는 두 번의 열림을 바꿔치기해 미아에게 뒤집어씌웠다.' },
        { s: 'mia', t: '15:59', m: '청소하시는 분들 아닐까요?' },
        { s: 'jun', t: '16:00', m: '청소는 7시예요. 여기 누군가 거짓말하고 있어요.' }
      ],
      culprit: 'mia',
      solve: '미아는 15:39에 탕비실에 들어갔고 냉장고는 15:40에 열렸다. 테오는 3시 15분에 미아가 여는 걸 봤다고 했지만, 15:12 열림은 케이크를 넣던 준의 것이다. 테오는 두 번의 열림을 바꿔치기해 미아를 가리켰다.'
    },
    {
      id: 'vase', title: '깨진 화병', place: '아파트 7B · 오후 7:30', difficulty: 2,
      intro: '로 할머니의 화병이 현관 앞에서 산산조각 났다. 오늘 밤 복도에 있던 사람은 셋. 가장 큰 목소리로 거짓말하는 사람이 있지만, 그게 보이는 대로의 뜻은 아닐 수 있다.',
      suspects: [['rafa', '라파', '택배 기사'], ['sol', '솔', '손자, 12살'], ['dana', '다나', '옆집']],
      facts: [
        ['📷', '복도 CCTV: 라파 18:02, 택배 문 앞에 둠 · 솔 18:30, 들어감 · 다나 19:15, 노크 후 19:17에 돌아감.'],
        ['🔐', '7B 스마트 도어락: 18:30 솔의 비밀번호로 열림 · 18:31 잠김 · 19:40 로 여사님 비밀번호 전까지 열린 기록 없음.'],
        ['🌧️', '날씨: 18:00부터 비, 그친 적 없음.'],
        ['👣', '사진: 현관에서 화병까지 이어진 작은 젖은 발자국.'],
        ['🥋', '태권도장: 솔의 수업은 화·목 17:00–18:00. 오늘은 화요일.']
      ],
      chat: [
        { s: 'rafa', t: '19:42', m: '택배입니다. 6시 2분에 문 앞에 두고 갔어요. 문엔 손도 안 댔습니다.' },
        { s: 'dana', t: '19:44', m: '로 여사님, 저 오늘 밤에 간 적 없어요. 비밀번호도 없잖아요. 도어락이 제가 들어간 적 없다는 걸 증명할 거예요.', ev: 0, lie: '복도 카메라에 다나가 19:15에 로 여사님 집 문을 두드리고 19:17에 돌아가는 모습이 찍혀 있다. 도어락 이야기는 맞다. 들어간 적은 없다. 하지만 간 것 자체가 거짓말이다.' },
        { s: 'sol', t: '19:45', m: '할머니 나 8시까지 태권도장에 있었어!! 지금 막 왔어', ev: [0, 1, 4], lie: '도어락은 18:30에 솔의 비밀번호로 열렸고, 수업도 18:00에 끝난다. 복도 카메라에도 솔이 18:30에 들어가는 모습이 찍혀 있다.' },
        { s: 'rafa', t: '19:47', m: '다나 씨, 카메라에 7시 15분에 문 앞에 계신 게 찍혔는데요. 왜 안 왔다고 하세요?' },
        { s: 'dana', t: '19:48', m: '그 카메라 맨날 틀려요. 뭐가 찍혔든 저는 거기 갈 이유가 없었어요.' },
        { s: 'sol', t: '19:49', m: '아줌마 맨날 TV 소리 때문에 우리 집 두드려. 또 화나서 왔겠지' },
        { s: 'rafa', t: '19:50', m: '들어갈 만큼 화가 났을까요? 도어락도 기록이 남아요.' },
        { s: 'dana', t: '19:52', m: '안 들어갔어요. 비밀번호도 몰라요. 도어락한테 물어보세요.' },
        { s: 'sol', t: '19:53', m: '봐, 말이 계속 바뀌잖아' }
      ],
      culprit: 'sol',
      solve: '다나는 안 왔다고 거짓말했고 — 도어락이 열리지 않았다는 맞는 말 뒤에 숨었다 — 카메라는 19:15에 문 앞의 다나를 잡아낸다. 하지만 같은 카메라에 노크하고 돌아가는 모습이 찍혀 있고, 도어락은 다나에게 열린 적이 없다. 거짓말을 깨는 바로 그 증거가 다나가 안에 들어간 적 없다는 걸 증명한다. 솔의 비밀번호로 18:30에 문이 열렸고, 수업은 18:00에 끝났고, 비가 왔고, 작은 젖은 발자국이 현관에서 화병까지 이어진다. 다나는 돈을 빌리러 왔다가 창피해서 거짓말했을 뿐이다.'
    },
    {
      id: 'draft', title: '유출된 초안', place: '스타트업 사무실 · 오후 11:40', difficulty: 2,
      intro: '초안을 끝낸 지 한 시간 만에 경쟁사가 우리 미공개 제품 페이지를 올렸다. 접근 권한이 있던 사람은 넷.',
      suspects: [['ava', '아바', '디자인 리드'], ['ben', '벤', '엔지니어'], ['cleo', '클레오', 'PM'], ['dev', '데브', '인턴']],
      facts: [
        ['📄', '문서 기록: 벤 22:10 열람(사무실) · 데브 22:31 열람(외부 IP) · 클레오 20:15 열람(사무실).'],
        ['📶', 'IT 티켓: 사무실 와이파이 21:30–23:30 먹통.'],
        ['🌐', '경쟁사 페이지 게시: 23:00.'],
        ['🔑', '접근 권한: 벤, 클레오, 데브. 아바는 추가된 적 없음.']
      ],
      chat: [
        { s: 'cleo', t: '23:41', m: '경쟁사 사이트에 떴어요. 토씨 하나 안 틀리고. 오늘 밤 초안 연 사람?' },
        { s: 'ben', t: '23:43', m: '저요, 10시쯤 사무실 와이파이로요. 오타만 보고 퇴근했어요.', ev: 1, lie: '사무실 와이파이는 21:30부터 끊겨 있었다. 벤은 22:10에 사무실에서 열었으니 다른 연결을 썼고, 그걸 숨기고 있다.' },
        { s: 'dev', t: '23:44', m: '저는 초안 연 적 없어요. 저한테 권한이 있긴 한가요?', ev: [0, 3], lie: '기록에 데브가 22:31에 외부 IP로 열었다고 남아 있고, 권한 목록에도 데브가 있다.' },
        { s: 'ava', t: '23:45', m: '저는 못 열어요. 그 문서에 저 추가된 적이 없잖아요.' },
        { s: 'cleo', t: '23:46', m: '저는 8시 15분에 가격표 넣으려고 열었다가 바로 퇴근했어요.' },
        { s: 'ben', t: '23:47', m: '데브, 10시 반에도 자리에 있었잖아요. 제가 봤어요.' },
        { s: 'dev', t: '23:48', m: '짐 싸고 있었어요!!' }
      ],
      culprit: 'dev',
      solve: '데브는 22:31에 사무실 밖 네트워크에서 초안을 열었다. 경쟁사가 게시하기 30분 전이다. 벤의 와이파이 이야기는 허술했지만, 벤의 열람은 더 이른 시각에 사무실 안에서였다.'
    },
    {
      id: 'festival', title: '축제 현금함', place: '학교 축제 · 오후 5:50', difficulty: 2,
      intro: '5시에 가득 찼던 티켓 부스 현금함이 5시 45분에 비어 있었다. 당번 학생은 셋. 그중 하나가 하필 그 순간에 셀카를 찍었다.',
      suspects: [['hana', '하나', '먹거리 부스'], ['ian', '이안', '밴드'], ['jae', '재', '티켓 부스']],
      facts: [
        ['🤳', '하나의 셀카, 17:20, 먹거리 부스. 반 단톡방에 올림.', ['체육관 시계', '티켓 부스 의자', '현금함', '의자에 걸린 점퍼', '무대']],
        ['💰', '김 선생님이 17:00에 현금함 확인: 가득 참, 뚜껑 닫힘.'],
        ['🎸', '무대 영상: 이안의 밴드 공연 17:10–17:35, 모든 장면에 이안이 보컬.'],
        ['📋', '당번표: 재, 티켓 부스 17:00–18:00, 휴식 없음.']
      ],
      chat: [
        { s: 'ian', t: '17:52', m: '우린 공연 내내 무대에 있었어, 영상에 다 있어' },
        { s: 'jae', t: '17:53', m: '난 부스 떠난 적 없어. 내가 돌아선 사이에 누가 집어 간 거야.', ev: 0, lie: '하나의 17:20 셀카에 뒤쪽 티켓 부스 의자가 비어 있고 재의 점퍼만 걸려 있는 게 찍혀 있다.' },
        { s: 'hana', t: '17:54', m: '난 계속 먹거리 부스에 있었어. 거기서는 티켓 부스가 보이지도 않아.', ev: 0, lie: '본인 셀카에 티켓 부스가 현금함까지 바로 뒤에 찍혀 있다.' },
        { s: 'jae', t: '17:55', m: '솔직히 5시에 이미 현금함 거의 비어 있었어.', ev: 1, lie: '김 선생님이 17:00에 가득 찬 것을 확인했고 뚜껑도 닫혀 있었다.' },
        { s: 'ian', t: '17:56', m: '하나야, 너 5시 20분에 셀카 올렸잖아. 머리 뒤쪽 확대해 봐.' },
        { s: 'hana', t: '17:57', m: '그냥 체육관이야, 그걸로 뭘 알 수 있다고' },
        { s: 'jae', t: '17:58', m: '내가 나갔으면 점퍼도 없어졌겠지. 난 항상 챙겨.' },
        { s: 'ian', t: '17:59', m: '의자를 봐, 재.' }
      ],
      culprit: 'jae',
      solve: '셀카가 전부 말해 준다. 체육관 시계로 5시 20분, 티켓 부스 의자는 비어 있고, 재의 점퍼는 아직 의자에 걸려 있고, 현금함은 김 선생님이 5시에 닫아 둔 것과 달리 뚜껑이 열린 채 책상 위에 있다. 이안은 영상 모든 장면에서 무대 위였고, 하나는 자기 카메라 앞에 있었다. 재는 부스를 비웠고, 그에 대해 두 번 거짓말했다. 하나는 부스가 빈 걸 보고도 아무 말 안 한 게 켕겨서 거짓말했을 뿐이다.'
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
        { s: 'quill', t: '08:06', m: '기록은 02:14래요, 근데 그때 서버 점검 중이었잖아요.', ev: [0, 3], lie: '점검은 03:00–04:00이었다. 02:14에는 서버가 켜져 있었다.' },
        { s: 'pix', t: '08:07', m: '오크가 2시 10분에 자기 폰으로 직접 로그인했어요. 로그인 기록 보세요.', ev: [1, 2], lie: '오크의 평소 기기는 23:00부터 오프라인이었다. 02:10 새 기기 로그인은 오크 것이 아니고, 픽스의 01:40 링크 30분 뒤다.' },
        { s: 'oak', t: '08:08', m: '잠깐, 자기 전에 픽스가 보낸 거 누르긴 했어요. 스킨 뭐라고.' },
        { s: 'pix', t: '08:09', m: '그거 제가 아니에요, 제 계정도 해킹당한 거겠죠' },
        { s: 'nyx', t: '08:10', m: '누군가 거짓말하고 있고, 그건 기록이 아니야.' }
      ],
      culprit: 'pix',
      solve: '오크의 계정은 피싱당했다. 픽스가 01:40에 링크를 보냈고, "새 기기"가 02:10에 오크로 로그인해 금고를 비웠다. 퀼의 점검 주장은 틀렸다. 점검은 03:00–04:00이라 02:14에 서버는 켜져 있었다. 오크가 직접 로그인했다는 픽스의 말은 피싱 연결고리를 숨긴 것이다.'
    }
  ]
};
