/* ==========================================================================
   행운 룰렛 — 설정 파일
   가게에 맞게 이 파일만 고치면 됩니다. 다른 파일은 손대지 않아도 돼요.
   ========================================================================== */
window.EVENT_CONFIG = {
  /* 가게 이름과 로고. logoUrl에 이미지 주소를 넣으면 로고 이미지가, 비우면 logoText 글자가 보입니다. */
  brand: '카페 오루',
  logoText: 'ORU',
  logoUrl: '',

  /* 색: primary는 버튼·포인터·강조색, bg는 배경, ink는 글자색 */
  colors: { primary: '#ff6a3d', bg: '#0f1016', ink: '#ffffff' },

  title: '오늘의 행운 룰렛',
  subtitle: '한 번 돌려 보세요',

  /* 상품 목록 (2~8개). weight는 상대 확률 — 전체 합 중 차지하는 비율만큼 나옵니다.
     color는 칸 색이며 비우면 자동으로 정해집니다. "꽝"으로 쓰는 칸은 miss: true 를 붙이면 축하 효과가 없습니다. */
  prizes: [
    { label: '아메리카노 1잔', weight: 5, color: '#ffcf5a' },
    { label: '10% 할인', weight: 20 },
    { label: '쿠키 1개', weight: 10 },
    { label: '다음 기회에', weight: 60, miss: true },
    { label: '사이즈업 무료', weight: 15 },
    { label: '다음 기회에', weight: 40, miss: true }
  ],

  /* 한 기기에서 하루에 참여할 수 있는 횟수 */
  limitPerDay: 1,

  /* 쿠폰 코드 앞머리. 예: ORU-1105-K7Q2 */
  couponPrefix: 'ORU',
  sheetUrl: '',               // 당첨 내역을 구글 시트로 모으려면 shared/README.md 대로 만든 웹 앱 URL 을 넣으세요 (비우면 보내지 않음)

  footer: '쿠폰은 당일에만 유효합니다',
  shareText: '카페 오루 행운 룰렛에서 뽑았어요!',

  /* 화면에 보이는 문구. 필요하면 바꾸세요. */
  text: {
    spin: '돌리기',
    spinning: '돌아가는 중…',
    resultTitle: '축하합니다!',
    missTitle: '아쉬워요',
    coupon: '쿠폰 코드',
    show: '이 화면을 캡처해서 직원에게 보여 주세요',
    close: '닫기',
    done: '오늘은 이미 참여했어요',
    doneSub: '내일 다시 돌려 보세요. 오늘 결과는 아래에 있어요.',
    at: '참여 시각',
    sound: '소리'
  }
};
