# 별표류로 수익 내기: 출시 가이드

게임 쪽 준비는 끝나 있습니다. 아래 단계 중 **계정 만들기, 업로드, 정산 정보 입력은 본인이 직접** 해야 합니다.
모든 단계는 무료입니다.

## 미리 알아 둘 점
- 웹게임 수익은 **광고 수익 배분**이 대부분입니다. 사람들이 게임을 할 때 광고가 나오고, 포털이 광고 수익 일부를 개발자에게 줍니다.
- 수익은 플레이 수에 따라 크게 달라집니다. 처음 내는 인디 게임은 한 달에 몇 달러에서 시작하는 경우가 흔합니다.
  포털 추천을 받거나 입소문이 나면 크게 늘 수 있지만 보장되지는 않습니다.
- 그래서 **여러 곳에 동시에** 올리는 게 유리합니다. 단, 포털마다 독점 조건이 있을 수 있으니 약관을 꼭 읽으세요.

## 1단계: 패키지 만들기
PC에 [Node.js](https://nodejs.org)를 설치한 뒤 저장소 폴더에서 실행합니다.

```bash
node tools/build.mjs
```

`dist/` 폴더에 업로드용 zip 4개가 생깁니다.

| 파일 | 올릴 곳 | 광고 |
| --- | --- | --- |
| `stardrift-crazygames.zip` | CrazyGames | 판 사이 광고 + 보상형 광고 |
| `stardrift-poki.zip` | Poki | 판 사이 광고 + 보상형 광고 |
| `stardrift-itch.zip` | itch.io | 없음 (후원 받기) |
| `stardrift-web.zip` | 내 사이트, GitHub Pages | 없음 |

광고가 들어가는 곳은 이렇습니다. 플레이를 방해하지 않도록 판 사이와 플레이어가 원할 때만 나옵니다.
- **판 사이 광고**: "다시 출격"을 누를 때. 접속 후 첫 판은 광고 없이 바로 시작합니다. 실제 빈도는 포털이 조절합니다.
- **보상형 광고 1**: 격추되면 "광고 보고 부활" 버튼이 나옵니다. 한 판에 한 번, 내구도 50%로 부활합니다.
- **보상형 광고 2**: 결과 화면의 "광고 보고 별가루 2배" 버튼.

광고 흐름은 `index.html?portal=debug`로 열면 가짜 광고로 미리 확인할 수 있습니다.

## 2단계: CrazyGames (가장 먼저 추천)
전 세계 이용자가 많고 개인 개발자도 받아 주는 웹게임 포털입니다.

1. developer.crazygames.com에서 개발자 계정 만들기
2. 새 게임 등록 → 엔진은 **HTML5**, `stardrift-crazygames.zip` 업로드
3. 이미지는 `store/` 폴더, 설명과 태그는 `store/listing.md`에서 복사
4. 개발자 포털의 미리보기(QA 도구)에서 광고와 게임이 잘 도는지 확인 후 제출
5. 심사를 통과하면 보통 일부 이용자에게 먼저 공개되고, 반응이 좋으면 노출이 늘어납니다
6. 정산을 받으려면 결제 정보와 세금 서류를 입력해야 합니다. 한국 거주자는 보통 **W-8BEN** 양식을 작성합니다.

## 3단계: Poki
노출 효과가 큰 대신 심사가 까다로워 일부 게임만 받습니다. 그래도 신청은 무료입니다.

1. developers.poki.com에서 게임 제출
2. 받아 주면 `stardrift-poki.zip`을 올리고 Poki 담당자의 안내를 따릅니다
3. Poki는 독점 계약을 요구할 수 있습니다. 조건을 읽고 CrazyGames와 둘 중 하나를 고르세요.

## 4단계: itch.io (오늘 바로 가능)
심사가 없어서 몇 분이면 공개됩니다. 광고 대신 **"원하는 만큼 내기"(Pay what you want)** 로 후원을 받습니다.

1. itch.io 가입 → Upload new project
2. Kind of project: **HTML**, `stardrift-itch.zip` 업로드 → "This file will be played in the browser" 체크
3. Viewport는 1280 × 720, "Mobile friendly"와 "Fullscreen button" 체크
4. Pricing: **No payments** 대신 **Donate** 또는 기본 0원의 "Pay what you want"
5. 커버 이미지 `store/cover-630x500-itch.png`, 스크린샷 `store/screens/`
6. 정산: Payment 설정에서 PayPal 또는 Stripe 연결

### 후원 링크 넣기 (선택)
Ko-fi, Buy Me a Coffee, 토스 후원 링크 등이 있다면 `js/portal.js` 맨 위의 `SUPPORT_URL`에 넣고 다시 빌드하세요.
광고가 없는 판(itch, web)의 첫 화면에 "개발자 후원하기" 버튼이 나옵니다.

## 5단계: 사람들에게 알리기
포털 노출만 기다리기보다 첫 플레이어를 직접 모으면 포털 알고리즘 평가에도 도움이 됩니다.
- **짧은 영상**: 보스전이나 무기가 화면을 가득 채우는 장면 15~30초를 유튜브 쇼츠, 틱톡, 인스타 릴스에 올리고 링크 걸기
- **커뮤니티**: Reddit r/WebGames, r/incremental_games(성장 요소), r/IndieGaming. 국내는 게임 커뮤니티의 인디/자작 게시판
- **기록 자랑**: 무한 공허 생존 시간 같은 숫자는 공유하기 좋습니다

## 무엇이 준비되어 있나
| 항목 | 위치 |
| --- | --- |
| 영어 지원 (브라우저 언어 자동 감지, 설정에서 변경) | `js/i18n.js` |
| 광고 SDK 연결 (CrazyGames v3, Poki v2) | `js/portal.js` |
| 업로드용 패키지 빌드 (폰트 내장, 외부 요청 최소화) | `tools/build.mjs` |
| 커버, 아이콘, 스크린샷 | `store/` |
| 등록 문구 (영어·한국어), 태그 | `store/listing.md` |

광고 차단기가 켜져 있거나 SDK를 불러오지 못하면 광고 버튼이 숨겨지고 게임은 그대로 돌아갑니다.
