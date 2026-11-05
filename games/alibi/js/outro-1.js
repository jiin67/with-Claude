'use strict';
/* ALIBI — what happens in the chat after the accusation, cases 1–10 */
Object.assign(OUTRO.en, {
  cake: [
    { s: 'mia', m: 'Me? Based on what, a badge log? Those things glitch all the time.' },
    { s: 'jun', m: 'It had you in the kitchen at 15:39. The fridge opened at 15:40. That\'s not a glitch, Mia.' },
    { s: 'mia', m: 'Fine. I skipped lunch for the deadline and it was just sitting there. I only meant to take a corner. Then there was no corner left.' },
    { s: 'theo', m: 'For the record I said strawberry because I didn\'t want to look like I\'d been anywhere near it. I hadn\'t.' },
    { s: 'jun', m: 'New rule: the 4pm cake lives in my desk drawer.' }
  ],
  vase: [
    { s: 'sol', m: 'Grandma it wasn\'t me!! Dana\'s the one who lied, you all saw it' },
    { s: 'rafa', m: 'She lied about knocking. The lock says she never came in. Your code opened the door at 6:30, Sol, and class ends at 6.' },
    { s: 'sol', m: '…I came in with wet shoes and slid. It just fell. I thought you\'d be madder about the shoes than the vase.' },
    { s: 'dana', m: 'And I said I wasn\'t there because I\'d come to ask Ro for a loan. I didn\'t want the whole building reading that.' },
    { s: 'rafa', m: 'Nobody\'s reading anything. Sol, glue. Dana, come by tomorrow, Ro\'s putting the kettle on.' }
  ],
  draft: [
    { s: 'dev', m: 'I\'m the intern. Why would I leak the one thing that gets me hired?' },
    { s: 'cleo', m: 'Because the log says you opened it at 22:31 from outside the office, and their page went up at 23:00.' },
    { s: 'dev', m: 'They offered me a real job. A salary. All I had to do was "show them what we were working on". I didn\'t think they\'d post it word for word.' },
    { s: 'ben', m: 'And the wifi thing — I hotspotted off my phone. I said office wifi because I\'m not supposed to use personal devices for drafts. Not my proudest night.' },
    { s: 'cleo', m: 'Dev, HR at nine. Ben, you and I are talking about hotspots at nine-fifteen.' }
  ],
  festival: [
    { s: 'jae', m: 'This is insane. I had the desk the WHOLE time. Ask literally anyone.' },
    { s: 'ian', m: 'Hana\'s selfie asked for us. Empty chair, your jacket on it, box lid open, 5:20 on the gym clock.' },
    { s: 'jae', m: 'Okay. I took it. Forty thousand won. My phone screen is cracked and my mom said no, and the box was just… open. I was going to put it back after the festival.' },
    { s: 'hana', m: 'I said I couldn\'t see the desk because I saw it was empty and didn\'t say anything. That\'s on me too.' },
    { s: 'ian', m: 'Bring it to Teacher Kim before 6. Say it before she finds it. It\'s better, trust me.' }
  ],
  hotel: [
    { s: 'pat', m: 'I move luggage. I don\'t even have a key to 1204, check the log yourselves.' },
    { s: 'lee', m: 'The door wasn\'t latching since 13:30. And the elevator camera has you on twelve at 13:50 with a cart.' },
    { s: 'pat', m: 'The door was open a hand\'s width. The watch was right there on the nightstand. I\'ve pushed carts for four years and never once been tipped. I don\'t know what I was thinking.' },
    { s: 'oren', m: 'I said I was still in my room because I\'d left my charger there and went back in after checkout. I didn\'t want a lecture about it.' },
    { s: 'lee', m: 'The watch goes to the front desk now, Pat. Then we talk to the manager together.' }
  ],
  guild: [
    { s: 'pix', m: 'So I\'m the villain because someone used my account to send a link? Great detective work.' },
    { s: 'nyx', m: 'Your account was "hacked" at 01:40 but you were raiding under it at 01:50. The raid log has your voice.' },
    { s: 'pix', m: 'I\'m three months behind on rent, okay? It was supposed to be a loan from the guild bank. I was going to put it back before anyone did the monthly count.' },
    { s: 'quill', m: 'And I got the maintenance window wrong. I genuinely thought it was 2 to 3. Sorry for muddying it.' },
    { s: 'oak', m: 'Pix. Rent is a thing you say out loud. We\'d have helped. You know that.' },
    { s: 'nyx', m: 'Gold comes back by Friday or the ticket goes to support. Your call.' }
  ],
  library: [
    { s: 'gus', m: 'I\'ve worked nights here for nine years. You\'re going to take a vending machine\'s word over mine?' },
    { s: 'nora', m: 'Your code disarmed the room at 23:10 and your card bought a coffee by its door at 23:12. The machine isn\'t the problem.' },
    { s: 'gus', m: 'A dealer offered more for that book than I make in a year. I told myself nobody reads it. I was going to say the alarm glitched. It… didn\'t sound as stupid at midnight.' },
    { s: 'sam', m: 'I left at 9:20 for a date and told my advisor I was here till ten. That\'s the whole reason I lied. Not proud.' },
    { s: 'nora', m: 'Where is it, Gus. Right now. Before the dean gets in.' }
  ],
  wedding: [
    { s: 'ivy', m: 'I deliver towels. I\'m not a thief, and I\'m not taking the fall for a party I wasn\'t invited to.' },
    { s: 'fern', m: 'Your staff card opened 1801 at 12:20. Nobody else went in before the groom came back.' },
    { s: 'ivy', m: 'The box was on the desk, open. I thought: one week, pawn it, buy it back before anyone notices. My son\'s tuition is due Monday. I know how it sounds.' },
    { s: 'max', m: 'I said I never saw the rings because I was supposed to be holding them and I\'d left them on the desk. I was embarrassed.' },
    { s: 'remy', m: 'And I showed up at 12:50, not 12:30. I lied so my aunt wouldn\'t know I overslept. Can we have a wedding now?' },
    { s: 'fern', m: 'Ivy, the box. Then nobody says a word until after the cake.' }
  ],
  rooftop: [
    { s: 'gus', m: 'I asked for a VOTE. That\'s what grown-ups do. Why would I creep around in the rain with garden shears?' },
    { s: 'yun', m: 'The fob log has you at 23:40. Nobody else opened that door.' },
    { s: 'gus', m: 'The vote got pushed to next month. Again. The vines were dripping onto my balcony for three summers. I went up to "trim" and I didn\'t stop. I\'m not sorry about the vines. I\'m sorry about you, kid.' },
    { s: 'mo', m: 'I blamed the wind because I\'d left the shed unlocked and didn\'t want that on me. Should\'ve said so this morning.' },
    { s: 'yun', m: 'Seedlings are 3,000 won a tray. You\'re buying ten. And you\'re watering them.' }
  ],
  podcast: [
    { s: 'vi', m: 'I was a GUEST. I came on your show for free and now I\'m the leak? Unbelievable.' },
    { s: 'tom', m: 'You picked up my laptop at 6:30 with the password on it. The master left that laptop at 7:20.' },
    { s: 'vi', m: 'My own channel has had 900 subscribers for two years. I thought if the episode dropped on my side first, it\'d finally move. It was stupid and I knew it while I was uploading.' },
    { s: 'sae', m: 'I said nobody touched the master because I hadn\'t actually checked the log and didn\'t want to admit it in front of Ren.' },
    { s: 'ren', m: 'Take it down, Vi. Then we re-release with your name off the credits.' }
  ]
});
Object.assign(OUTRO.ko, {
  cake: [
    { s: 'mia', m: '제가요? 근거가 뭔데요, 출입 기록요? 그거 맨날 오류 나잖아요.' },
    { s: 'jun', m: '15:39에 탕비실, 15:40에 냉장고. 그건 오류가 아니에요, 미아 씨.' },
    { s: 'mia', m: '네, 알았어요. 마감 때문에 점심도 걸렀는데 거기 그냥 있었어요. 귀퉁이만 먹으려고 했어요. 그러다 귀퉁이가 안 남았어요.' },
    { s: 'theo', m: '참고로 저 딸기라고 한 건 근처에도 안 간 것처럼 보이고 싶어서였어요. 진짜 안 갔고요.' },
    { s: 'jun', m: '새 규칙. 4시 케이크는 제 서랍에서 삽니다.' }
  ],
  vase: [
    { s: 'sol', m: '할머니 나 아니라니까!! 거짓말한 건 다나 아줌마잖아, 다들 봤지' },
    { s: 'rafa', m: '다나 씨는 노크한 걸 숨겼지. 도어락은 안 들어왔다고 해. 솔, 6시 반에 네 비밀번호로 문이 열렸고 수업은 6시에 끝나.' },
    { s: 'sol', m: '…젖은 신발로 들어오다가 미끄러졌어. 그냥 떨어졌어. 화병보다 신발 때문에 더 혼날 줄 알았단 말이야.' },
    { s: 'dana', m: '저는 로 여사님께 돈 좀 빌리러 왔던 거예요. 그걸 온 동네가 읽을까 봐 안 왔다고 했어요.' },
    { s: 'rafa', m: '아무도 안 읽어요. 솔은 접착제. 다나 씨는 내일 오세요, 로 여사님이 차 끓여 놓으신대요.' }
  ],
  draft: [
    { s: 'dev', m: '저 인턴이에요. 저를 뽑아 줄 유일한 걸 왜 제가 유출해요?' },
    { s: 'cleo', m: '기록에 네가 22:31에 사무실 밖에서 열었고, 23:00에 그쪽 페이지가 올라갔으니까.' },
    { s: 'dev', m: '정규직 준다고 했어요. 월급이요. "뭐 만드는지만 보여 달라"고 했어요. 토씨 하나 안 틀리고 올릴 줄은 몰랐어요.' },
    { s: 'ben', m: '와이파이는… 폰 핫스팟 썼어요. 개인 기기로 초안 보면 안 되니까 사무실 와이파이라고 했어요. 자랑스러운 밤은 아니네요.' },
    { s: 'cleo', m: '데브, 9시에 인사팀. 벤, 9시 15분에 나랑 핫스팟 얘기.' }
  ],
  festival: [
    { s: 'jae', m: '말도 안 돼. 나 부스에 계속 있었어. 아무한테나 물어봐.' },
    { s: 'ian', m: '하나 셀카가 대신 대답했어. 빈 의자, 걸려 있는 네 점퍼, 열린 현금함 뚜껑, 체육관 시계 5시 20분.' },
    { s: 'jae', m: '알았어. 내가 가져갔어. 4만 원. 폰 액정 깨졌는데 엄마가 안 된대서, 함이 그냥… 열려 있었어. 축제 끝나고 다시 넣으려고 했어.' },
    { s: 'hana', m: '나도 부스가 안 보인다고 한 건, 비어 있는 거 보고도 아무 말 안 해서야. 그건 내 잘못이기도 해.' },
    { s: 'ian', m: '6시 전에 김 선생님한테 가져가. 선생님이 알기 전에 네가 말해. 그게 나아, 진짜.' }
  ],
  hotel: [
    { s: 'pat', m: '저는 짐 나르는 사람이에요. 1204호 키도 없어요. 기록 직접 보세요.' },
    { s: 'lee', m: '13:30부터 그 문은 안 잠겼어요. 그리고 엘리베이터 카메라에 13:50, 12층, 카트 끌고 있는 팻 씨가 있고요.' },
    { s: 'pat', m: '문이 손 하나만큼 열려 있었어요. 시계가 협탁에 바로 있었고요. 4년 동안 카트 끌면서 팁 한 번 못 받았어요. 무슨 생각이었는지 저도 모르겠어요.' },
    { s: 'oren', m: '제가 방에 있었다고 한 건, 충전기를 두고 와서 체크아웃하고 다시 들어갔거든요. 잔소리 듣기 싫어서요.' },
    { s: 'lee', m: '시계는 지금 프런트로 가요, 팻 씨. 그다음 매니저한테는 같이 가요.' }
  ],
  guild: [
    { s: 'pix', m: '누가 제 계정으로 링크 보냈다고 제가 범인이에요? 대단한 추리네요.' },
    { s: 'nyx', m: '01:40에 "해킹"당한 계정으로 01:50에 레이드 뛰고 있었잖아. 레이드 기록에 네 목소리 있어.' },
    { s: 'pix', m: '월세 세 달 밀렸어요, 됐어요? 길드 금고에서 빌리는 거였어요. 월말 정산 전에 다시 넣으려고 했어요.' },
    { s: 'quill', m: '점검 시간은 제가 틀렸어요. 진짜 2시부터 3시인 줄 알았어요. 흐려 놔서 미안해요.' },
    { s: 'oak', m: '픽스. 월세는 입 밖으로 말하는 거야. 우리가 도왔을 거잖아. 너도 알잖아.' },
    { s: 'nyx', m: '금요일까지 골드 돌려놓거나, 아니면 고객센터 티켓이야. 네가 골라.' }
  ],
  library: [
    { s: 'gus', m: '여기서 야간 9년 했어요. 자판기 말을 내 말보다 믿겠다는 거예요?' },
    { s: 'nora', m: '23:10에 길수 씨 코드로 해제됐고, 23:12에 그 문 옆 자판기에서 길수 씨 카드로 커피를 샀어요. 자판기가 문제가 아니에요.' },
    { s: 'gus', m: '업자가 그 책값으로 내 연봉보다 더 준댔어요. 아무도 안 읽는 책이라고 스스로 달랬죠. 경보 오류였다고 할 생각이었어요. 자정엔… 그렇게 멍청하게 들리지 않았어요.' },
    { s: 'sam', m: '저는 9시 20분에 데이트 때문에 나갔는데 지도교수님한테는 10시까지 있었다고 했거든요. 그래서 거짓말했어요. 떳떳하진 않아요.' },
    { s: 'nora', m: '책 어디 있어요, 길수 씨. 지금요. 학장님 오시기 전에.' }
  ],
  wedding: [
    { s: 'ivy', m: '저는 수건 배달하는 사람이에요. 도둑도 아니고, 초대도 안 받은 파티 뒤집어쓸 생각도 없어요.' },
    { s: 'fern', m: '직원 카드로 12:20에 1801호 문이 열렸어요. 신랑이 돌아오기 전에 들어간 사람은 아영 씨뿐이에요.' },
    { s: 'ivy', m: '상자가 책상 위에 열려 있었어요. 일주일만 맡기고, 아무도 모르게 되찾자. 아들 등록금이 월요일이에요. 어떻게 들리는지 알아요.' },
    { s: 'max', m: '반지 못 봤다고 한 건, 제가 들고 있어야 했는데 책상에 두고 나갔거든요. 창피해서요.' },
    { s: 'remy', m: '그리고 저 12시 반이 아니라 12시 50분에 왔어요. 이모한테 늦잠 잔 거 들킬까 봐요. 이제 결혼식 해도 돼요?' },
    { s: 'fern', m: '아영 씨, 상자요. 그다음엔 케이크 자를 때까지 아무도 한마디 안 하는 거예요.' }
  ],
  rooftop: [
    { s: 'gus', m: '나는 표결을 요구했어요. 어른은 그렇게 해요. 내가 왜 빗속에서 가위 들고 기어 다녀요?' },
    { s: 'yun', m: '출입 기록에 23:40, 구 씨예요. 그 문 연 사람은 구 씨밖에 없어요.' },
    { s: 'gus', m: '표결이 또 다음 달로 밀렸잖아요. 그 덩굴에서 세 여름 내내 우리 베란다로 물이 떨어졌어요. "다듬으러" 올라갔다가 멈추질 못했어요. 덩굴한테는 안 미안해요. 학생한테는 미안하고요.' },
    { s: 'mo', m: '바람 탓한 건 창고 안 잠근 게 내 책임 될까 봐요. 아침에 바로 말했어야 했는데.' },
    { s: 'yun', m: '모종 한 판에 3천 원이에요. 열 판 사세요. 물도 직접 주시고요.' }
  ],
  podcast: [
    { s: 'vi', m: '저 게스트였어요. 공짜로 나와 줬는데 이제 제가 유출범이에요? 기가 막히네요.' },
    { s: 'tom', m: '6시 반에 비번 붙은 내 노트북 가져갔잖아요. 마스터는 7시 20분에 그 노트북에서 나갔고요.' },
    { s: 'vi', m: '제 채널은 2년째 구독자 900명이에요. 제 쪽에서 먼저 풀리면 드디어 좀 움직일 줄 알았어요. 멍청한 짓인 거 올리면서도 알았어요.' },
    { s: 'sae', m: '아무도 마스터 안 건드렸다고 한 건, 사실 기록을 확인도 안 했는데 렌 앞에서 그걸 인정하기 싫어서였어요.' },
    { s: 'ren', m: '내려요, 비. 그다음 크레딧에서 이름 빼고 다시 올립니다.' }
  ]
});
