'use strict';
/* ==========================================================================
   LAST LOGIN — story, apps and puzzles.
   Answers are shared; text comes in Korean and English.
   Chain of puzzles:
     1 lock screen PIN           (calendar widget: Mina's birthday, MMDD)
     2 vault: word / number / color
         word   = first letters of the vault playlist      ORCHID
         number = café receipt minus the tip               7700
         color  = the car that followed her                teal
     3 terminal: mount ECHO with the year Mina turns ten   2029
         decode cipher.txt with shift = songs on playlist  6
         play memo.wav, Morse                              HARU
     4 messages: who followed / where to meet              HARU / PIER
   ========================================================================== */

const ANSWERS = {
  pin: ['1103'],
  word: ['ORCHID'],
  number: ['7700'],
  color: 'teal',
  mountKey: ['2029'],
  shift: 6,
  who: ['HARU', '하루'],
  where: ['PIER', 'OLD PIER', 'THE OLD PIER', '부두', '옛 부두', '오래된 부두', '낡은 부두']
};
const CIPHER_PLAIN = 'MEET ME AT THE OLD PIER AFTER DARK. TRUST NO ONE FROM THE LAB. THEY KNOW ABOUT THE ORCHID.';
const MORSE_WORD = 'HARU';
const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' };
const COLORS = [
  { id: 'red', hex: '#e5484d' }, { id: 'amber', hex: '#f5a524' }, { id: 'green', hex: '#30a46c' },
  { id: 'teal', hex: '#12a594' }, { id: 'violet', hex: '#8e4ec6' }, { id: 'black', hex: '#1c1c1f' }
];
const PLAYLIST = [
  ['Open Skies', 'Lumen Hall', '3:42'], ['Rain on Glass', 'Nocturne 9', '4:05'], ['Cold Harbor', 'The Wintering', '3:18'],
  ['Hollow Moon', 'Ada Vey', '5:01'], ['Ivory', 'Lumen Hall', '2:57'], ['Drift', 'Nocturne 9', '4:30']
];
const RECEIPT = [['Americano', 4500], ['Lemon scone', 3200], ['Tip', 1000]];

const CONTENT = {
  ko: {
    owner: '윤서연', ownerShort: '윤 S.', device: '서연의 노트북', dateLine: '2026년 10월 14일 화요일',
    lockNote: 'PIN은 미나가 태어난 날. 월일 네 자리. 절대 안 잊는다.',
    lockWidget: { title: '다가오는 일정', items: [['11월 3일', '미나 7번째 생일 🎂'], ['11월 7일', '연구소 보안 감사']] },
    lockNotifs: [['하루', '메일 봤어? 프린터 확인해 봐'], ['연구소 HR', '출입 권한 변경 안내']],
    wrongPin: '잘못된 PIN입니다', unlocked: '잠금 해제',
    apps: { notes: '메모', mail: '메일', photos: '사진', music: '음악', trash: '휴지통', vault: '금고', terminal: '터미널', messages: '메시지' },
    notes: [
      { title: '잊어버리면', body: '금고 자물쇠 세 개.\n\n단어: 재생 목록이 말해 준다. 첫 글자부터.\n숫자: 오루에서 낸 돈. 팁은 빼고.\n색: 집까지 날 따라온 차의 색. 하루라면 안다.\n\n(금고 안에 다음 열쇠가 있다. 터미널.)' },
      { title: '일지 10/12', body: '오늘도 청록색 차가 집 앞에 서 있었다. 세 번째다.\n번호판은 못 봤다. 연구소 주차장에서 본 차 같은데 확신이 없다.\n\n미나한테는 아무 말도 하지 않았다. 할 수 없다.' },
      { title: '일지 10/13', body: '백업은 끝냈다. 드라이브 이름은 ECHO. 열쇠는 숫자 하나뿐이다. 미나가 열 살이 되는 해.\n\n내가 돌아오지 못하면, 이 노트북을 여는 사람이 대신 가 주길.' },
      { title: '미나 숙제 — 모스 부호', body: 'A .-   B -...   C -.-.   D -..   E .   F ..-.   G --.\nH ....   I ..   J .---   K -.-   L .-..   M --   N -.\nO ---   P .--.   Q --.-   R .-.   S ...   T -   U ..-\nV ...-   W .--   X -..-   Y -.--   Z --..\n\n(미나야, 점은 짧게 선은 길게. 글자 사이는 한 칸 띄우기!)' }
    ],
    mails: [
      { from: '카페 오루', subject: '영수증 #4471', body: '윤서연 님, 오늘도 감사합니다.\n\n{receipt}\n\n다음에 또 뵙겠습니다.' },
      { from: '하루', subject: '차 뽑았어', body: '드디어 차 받았어! 네가 말한 대로 청록색으로 했어. 주말에 태워 줄게.\n\n그리고… 요즘 연구소 분위기 이상한 거 너도 느끼지? 조심해.\n\n— 하루' },
      { from: '연구소 HR', subject: '출입 권한 변경 안내', body: '윤서연 연구원님,\n\n보안 정책 변경으로 10월 15일부터 B동 지하 실험실 출입 권한이 해제됩니다. 문의는 보안팀으로 연락 바랍니다.' },
      { from: '(발신자 없음)', subject: '그만', body: '파는 걸 멈춰. 네 딸을 생각해.' }
    ],
    photos: [
      { cap: '미나, 바닷가', sub: '지난여름. 모래성이 파도에 쓸려 가서 울었다.', g: ['#f6d365', '#fda085'] },
      { cap: '창가의 난초', sub: '3년째 꽃을 피운다. 연구실에서 데려온 아이.', g: ['#a18cd1', '#fbc2eb'] },
      { cap: '연구소, 밤 11시', sub: '불 켜진 곳은 우리 방뿐.', g: ['#0f2027', '#2c5364'] },
      { cap: '옛 부두', sub: '여기서 생각이 제일 잘 된다.', g: ['#355c7d', '#c06c84'] }
    ],
    musicTitle: '재생 목록 · 금고용', musicHint: '6곡 · 23분',
    trash: [
      { name: 'orchid_v3.pdf', body: '[삭제된 파일 — 복구 불가]' },
      { name: '초안.txt', body: '하루에게.\n네가 아니길 바란다. 하지만 청록색 차는 네 차뿐이' },
      { name: 'IMG_2291.jpg', body: '[손상된 이미지]' }
    ],
    vault: {
      title: '금고', sub: '자물쇠 세 개를 모두 풀면 열립니다.',
      word: '단어', number: '숫자', color: '색',
      wordPh: '여섯 글자', numberPh: '네 자리', open: '열기', locked: '잠김', ok: '풀림',
      wrong: '맞지 않습니다', opened: '금고가 열렸습니다',
      inside: [['mount.key', '열쇠: 미나가 열 살이 되는 해'], ['메모', '드라이브 이름은 ECHO. 터미널에서 mount echo. 그다음은 네 몫이다.']]
    },
    terminal: {
      welcome: 'ECHO 셸 v2.1 — help 를 입력하세요',
      help: '명령어:\n  ls                 파일 목록\n  cat <파일>         파일 읽기\n  mount echo         ECHO 드라이브 연결\n  decode <파일> <n>  글자를 n칸 되돌려 해독\n  play <파일>        음성 메모 재생\n  clear              화면 지우기',
      files: { 'readme.txt': 'ECHO 드라이브는 암호화되어 있다.\n연결하려면: mount echo\n열쇠는 금고 안에 있다.', 'mount.key': '열쇠: 미나가 열 살이 되는 해' },
      echoFiles: {
        'cipher.txt': '암호문 (글자를 밀어 두었다. 금고 재생 목록의 곡 수만큼):\n\n{cipher}',
        'memo.wav': '[음성 메모 — play memo.wav]',
        'contact.txt': '여기까지 읽었다면 메시지 앱을 열어라.\n내가 먼저 말을 걸 것이다. 질문에 답해라.'
      },
      keyPrompt: '열쇠(숫자)를 입력하세요: ', mounted: 'ECHO 연결됨. ls 로 확인하세요.', badKey: '열쇠가 맞지 않습니다.', alreadyMounted: '이미 연결되어 있습니다.',
      noFile: n => `${n}: 그런 파일이 없습니다`, playing: '재생 중… (소리 대신 받아 적은 것)', decoded: n => `${n}칸 되돌림:`, badShift: '사용법: decode <파일> <숫자>', notAudio: '음성 파일이 아닙니다',
      unknownCmd: c => `${c}: 알 수 없는 명령어. help 를 입력하세요`
    },
    messages: {
      contact: '알 수 없는 번호', ph: '메시지 입력…', send: '보내기',
      script: [
        { who: 'them', t: '누구세요?' },
        { who: 'them', t: '내 노트북을 열었군요. 연구소 사람이면 지금 꺼요.' },
        { who: 'them', t: '아니라는 걸 증명해요. 집까지 나를 따라온 사람은 누구죠?' },
        { who: 'ask', key: 'who', wrong: '틀렸어요. 노트북을 제대로 본 게 맞아요?' },
        { who: 'them', t: '…맞아요. 하루였어요. 믿고 싶지 않았는데.' },
        { who: 'them', t: '마지막 질문. 어두워진 뒤에 만나자고 한 곳은?' },
        { who: 'ask', key: 'where', wrong: '아니에요. 암호문을 다시 읽어 봐요.' },
        { who: 'them', t: '좋아요. 믿을게요.' },
        { who: 'them', t: '난 무사해요. 미나도요. 하지만 돌아갈 순 없어요.' },
        { who: 'them', t: '창가의 난초를 가져다줘요. 화분 바닥에 전부 들어 있어요.' },
        { who: 'them', t: '부두에서 봐요. — 서연' }
      ]
    },
    ending: {
      title: '마지막 접속', sub: '윤서연은 살아 있다.',
      body: '당신은 노트북을 덮었다. 창가의 난초 화분을 들어 올리자 바닥에 테이프로 붙인 작은 드라이브가 있었다.\n\n연구소가 숨기려던 것은 이제 당신 손에 있다. 부두까지는 20분.',
      stats: { time: '걸린 시간', hints: '사용한 힌트', wrong: '틀린 횟수' },
      again: '처음부터 다시', share: '기록 복사'
    },
    chapters: ['잠금 화면', '금고', 'ECHO 드라이브', '메시지'],
    hints: {
      pin: ['잠금 화면 위젯의 일정을 보세요.', '생일은 11월 3일. PIN은 월일 네 자리예요.', '1103'],
      word: ['음악 앱의 재생 목록을 열어 보세요.', '곡 제목의 첫 글자를 순서대로 읽으세요.', 'ORCHID'],
      number: ['메일에 카페 영수증이 있어요.', '합계에서 팁을 빼세요.', '7700'],
      color: ['메모의 일지와 하루의 메일을 같이 보세요.', '집 앞에 서 있던 차의 색이에요.', '청록(teal)'],
      mount: ['금고 안 mount.key와 잠금 화면의 일정을 떠올리세요.', '2026년에 7살이면, 열 살은?', '2029'],
      cipher: ['금고 재생 목록은 몇 곡이었나요?', 'decode cipher.txt 6', '옛 부두(OLD PIER)에서 만나자는 내용이에요.'],
      morse: ['메모 앱에 모스 부호 표가 있어요.', 'play memo.wav 로 들은 부호를 표에서 한 글자씩 찾으세요.', 'HARU'],
      who: ['터미널의 음성 메모가 이름을 말해요.', '휴지통의 초안도 같은 사람을 가리켜요.', 'HARU'],
      where: ['해독한 암호문에 장소가 있어요.', '사진 앱에도 같은 장소가 있어요.', 'PIER']
    }
  },
  en: {
    owner: 'Dr. Seoyeon Yun', ownerShort: 'Yun S.', device: "Seoyeon's MacBook", dateLine: 'Tuesday, October 14, 2026',
    lockNote: "PIN = the day Mina was born. Month then day, four digits. I never forget.",
    lockWidget: { title: 'Upcoming', items: [['Nov 3', "Mina's 7th birthday 🎂"], ['Nov 7', 'Institute security audit']] },
    lockNotifs: [['Haru', 'did you get my mail? check the printer'], ['Institute HR', 'Access change notice']],
    wrongPin: 'Wrong PIN', unlocked: 'Unlocked',
    apps: { notes: 'Notes', mail: 'Mail', photos: 'Photos', music: 'Music', trash: 'Trash', vault: 'Vault', terminal: 'Terminal', messages: 'Messages' },
    notes: [
      { title: 'If I forget', body: 'Three locks on the vault.\n\nWord: the playlist spells it. First letters.\nNumber: what I paid at Oru, not counting the tip.\nColor: the car that followed me home. Haru would know.\n\n(The next key is inside the vault. Terminal.)' },
      { title: 'Journal 10/12', body: 'The teal car was outside the house again tonight. Third time.\nCouldn\'t read the plate. It looks like one from the institute lot, but I\'m not sure.\n\nI haven\'t told Mina anything. I can\'t.' },
      { title: 'Journal 10/13', body: 'Backup done. The drive is called ECHO. The key is a single number: the year Mina turns ten.\n\nIf I don\'t come back, whoever opens this laptop — go in my place.' },
      { title: "Mina's homework — Morse", body: 'A .-   B -...   C -.-.   D -..   E .   F ..-.   G --.\nH ....   I ..   J .---   K -.-   L .-..   M --   N -.\nO ---   P .--.   Q --.-   R .-.   S ...   T -   U ..-\nV ...-   W .--   X -..-   Y -.--   Z --..\n\n(Mina: dots are short, dashes are long. Leave a space between letters!)' }
    ],
    mails: [
      { from: 'Café Oru', subject: 'Receipt #4471', body: 'Thank you for visiting, Dr. Yun.\n\n{receipt}\n\nSee you next time.' },
      { from: 'Haru', subject: 'Got the car', body: 'Finally picked it up! Went with teal, like you suggested. I\'ll take you for a drive this weekend.\n\nAlso… you feel it too, right? Something\'s off at the institute. Be careful.\n\n— Haru' },
      { from: 'Institute HR', subject: 'Access change notice', body: 'Dr. Yun,\n\nDue to a security policy change, your access to the Building B basement lab will be revoked from October 15. Contact the security team with any questions.' },
      { from: '(no sender)', subject: 'Stop', body: 'Stop digging. Think of your daughter.' }
    ],
    photos: [
      { cap: 'Mina at the beach', sub: 'Last summer. She cried when the waves took the sandcastle.', g: ['#f6d365', '#fda085'] },
      { cap: 'The orchid on the sill', sub: 'Three years of blooming. I brought it home from the lab.', g: ['#a18cd1', '#fbc2eb'] },
      { cap: 'Institute, 11 pm', sub: 'Only our window still lit.', g: ['#0f2027', '#2c5364'] },
      { cap: 'The old pier', sub: 'I think best here.', g: ['#355c7d', '#c06c84'] }
    ],
    musicTitle: 'Playlist · for the vault', musicHint: '6 songs · 23 min',
    trash: [
      { name: 'orchid_v3.pdf', body: '[Deleted file — cannot be recovered]' },
      { name: 'draft.txt', body: 'Haru,\nI hope it isn\'t you. But the only teal car I know is yo' },
      { name: 'IMG_2291.jpg', body: '[Corrupted image]' }
    ],
    vault: {
      title: 'Vault', sub: 'Open all three locks.',
      word: 'Word', number: 'Number', color: 'Color',
      wordPh: 'six letters', numberPh: 'four digits', open: 'Open', locked: 'Locked', ok: 'Open',
      wrong: 'That\'s not it', opened: 'The vault is open',
      inside: [['mount.key', 'key: the year Mina turns ten'], ['note', 'The drive is called ECHO. In Terminal: mount echo. The rest is up to you.']]
    },
    terminal: {
      welcome: 'ECHO shell v2.1 — type help',
      help: 'Commands:\n  ls                 list files\n  cat <file>         read a file\n  mount echo         connect the ECHO drive\n  decode <file> <n>  shift letters back by n\n  play <file>        play a voice memo\n  clear              clear the screen',
      files: { 'readme.txt': 'The ECHO drive is encrypted.\nTo connect: mount echo\nThe key is in the vault.', 'mount.key': 'key: the year Mina turns ten' },
      echoFiles: {
        'cipher.txt': 'Encrypted (letters shifted forward by the number of songs on the vault playlist):\n\n{cipher}',
        'memo.wav': '[voice memo — play memo.wav]',
        'contact.txt': 'If you have read this far, open Messages.\nI will speak first. Answer the questions.'
      },
      keyPrompt: 'Enter key (number): ', mounted: 'ECHO mounted. Try ls.', badKey: 'Wrong key.', alreadyMounted: 'Already mounted.',
      noFile: n => `${n}: no such file`, playing: 'Playing… (transcribed, since you can\'t hear it)', decoded: n => `Shifted back by ${n}:`, badShift: 'Usage: decode <file> <number>', notAudio: 'Not an audio file',
      unknownCmd: c => `${c}: unknown command. Type help`
    },
    messages: {
      contact: 'Unknown number', ph: 'Message…', send: 'Send',
      script: [
        { who: 'them', t: 'Who is this?' },
        { who: 'them', t: 'You opened my laptop. If you\'re from the institute, close it now.' },
        { who: 'them', t: 'Prove you\'re not. Who followed me home?' },
        { who: 'ask', key: 'who', wrong: 'Wrong. Did you actually look through the laptop?' },
        { who: 'them', t: '…Yes. It was Haru. I didn\'t want to believe it.' },
        { who: 'them', t: 'Last question. Where did I say to meet after dark?' },
        { who: 'ask', key: 'where', wrong: 'No. Read the cipher again.' },
        { who: 'them', t: 'Okay. I\'ll trust you.' },
        { who: 'them', t: 'I\'m safe. So is Mina. But I can\'t come back.' },
        { who: 'them', t: 'Bring the orchid from the windowsill. Everything is under the pot.' },
        { who: 'them', t: 'See you at the pier. — Seoyeon' }
      ]
    },
    ending: {
      title: 'Last Login', sub: 'Dr. Yun is alive.',
      body: 'You close the laptop. Under the orchid pot on the windowsill, taped to the bottom, is a small drive.\n\nWhatever the institute wanted buried is in your hands now. The pier is twenty minutes away.',
      stats: { time: 'Time', hints: 'Hints used', wrong: 'Wrong answers' },
      again: 'Play again', share: 'Copy result'
    },
    chapters: ['Lock screen', 'The vault', 'The ECHO drive', 'Messages'],
    hints: {
      pin: ['Look at the calendar widget on the lock screen.', 'The birthday is Nov 3. The PIN is month then day, four digits.', '1103'],
      word: ['Open the playlist in the Music app.', 'Read the first letter of each song title, in order.', 'ORCHID'],
      number: ['There is a café receipt in Mail.', 'Take the total and subtract the tip.', '7700'],
      color: ['Read the journal in Notes together with Haru\'s mail.', 'The color of the car parked outside the house.', 'Teal'],
      mount: ['Remember mount.key from the vault and the calendar on the lock screen.', 'If she is 7 in 2026, when is she 10?', '2029'],
      cipher: ['How many songs were on the vault playlist?', 'decode cipher.txt 6', 'It says to meet at the OLD PIER.'],
      morse: ['There is a Morse chart in Notes.', 'Run play memo.wav and look up each group of dots and dashes.', 'HARU'],
      who: ['The voice memo in Terminal spells a name.', 'The draft in Trash points at the same person.', 'HARU'],
      where: ['The decoded cipher names a place.', 'The same place is in Photos.', 'PIER']
    }
  }
};
