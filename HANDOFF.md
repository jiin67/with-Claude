# 인수인계: 별표류 CrazyGames 출시

다른 채팅에서 이어서 작업할 때 이 문서를 먼저 읽어 주세요.
마지막 갱신: 2026-10-25 (브랜치 통합 후)

## 목표
남은 Claude Code 클라우드 크레딧(약 $223, 11월 5일 만료)으로 수입을 만드는 것.
방향은 저장소의 브라우저 게임 **별표류 STARDRIFT**를 웹게임 포털에 올려 광고 수익을 받는 것으로 정했습니다.

## 저장소
- GitHub: `jiin67/with-claude`
- 작업 브랜치: `claude/test-fzv3t1` (PR #1, 아직 `main`에 병합 안 됨)
  - 원래 이 문서가 있던 `claude/dreamy-bardeen-m2gky0`의 내용은 모두 여기에 합쳤습니다. 그 브랜치는 더 쓰지 않습니다.
  - 두 세션이 영어 지원과 광고를 따로 만들었는데, 통합할 때 `dreamy-bardeen` 쪽 구현(`i18n.js`의 `tr()`, `portal.js`, `build.mjs`)을 남기고 `test-fzv3t1` 쪽의 무기 진화만 위에 얹었습니다.
- 출시 가이드 전체: `MONETIZATION.md`
- 등록 문구: `store/listing.md`

## 끝난 일
| 항목 | 파일 | 상태 |
| --- | --- | --- |
| 영어 지원 (브라우저 언어 자동 감지, 설정에서 변경) | `js/i18n.js` | 완료, 테스트함 |
| 광고 SDK 연결: CrazyGames v3, Poki v2 | `js/portal.js` | 완료, 가짜 SDK로 테스트함 |
| 판 사이 광고: "다시 출격" 때 (접속 후 첫 판은 제외) | `js/ui.js` `launch()` | 완료 |
| 보상형 광고: 격추 시 부활(한 판 1회), 결과 화면 별가루 2배 | `js/ui.js` `offerRevive()` `doubleByAd()` | 완료 |
| CrazyGames 계정 저장(Data 모듈) 연동 | `js/ui.js` `persist()`, `PORTAL.store` | 완료, 가짜 SDK로 테스트함 |
| 포털별 업로드 zip 빌드 (구글 폰트 내장) | `tools/build.mjs` | 완료 |
| 커버, 아이콘, 스크린샷 | `store/` | 완료 |
| 무기 진화 6종 (최대 레벨 무기 + 짝 강화 → 보물 상자에서 진화), 레벨 업 카드·도감 표시, 영어 번역 | `js/data.js` `EVOLUTIONS`, `js/game.js`, `js/ui.js`, `js/i18n.js` | 완료, 테스트함 |

**테스트하는 방법**
- `index.html?portal=debug`: 가짜 광고로 광고 흐름 확인
- `?lang=en`, `?lang=ko`: 언어 강제
- 콘솔의 `__stardrift`: 자동 조종, 고속 시뮬레이션

**아직 확인 못 한 것**: 진짜 CrazyGames SDK에서의 동작.
이전 세션의 클라우드 환경에서는 sdk.crazygames.com 접속이 막혀 있었습니다.
그래서 같은 API를 흉내 낸 가짜 SDK로만 검증했습니다(init, loadingStart/Stop, gameplayStart/Stop, requestAd midgame/rewarded, data.getItem/setItem).

## 지금 위치
사용자는 CrazyGames 개발자 포털(developer.crazygames.com/games)에 가입하고 로그인까지 마쳤습니다. 아이디는 `small_eaner`입니다.
"My Games" 화면에 등록된 게임은 아직 없습니다. 다음은 **Submit a game**입니다.

Claude는 클라우드 세션에서 사용자 브라우저를 조작할 수 없습니다.
포털 클릭과 업로드는 사용자가 직접 하거나, 사용자 PC에서 도는 세션(Claude Desktop 앱의 브라우저 기능 등)에서 진행해야 합니다.

## 다음 단계

### 1. 업로드 파일 만들기
```bash
node tools/build.mjs crazygames
```
결과물은 `dist/stardrift-crazygames.zip`입니다(약 4.4MB, 파일 232개, 통합 후 다시 빌드해 확인함).
CrazyGames 기준은 첫 다운로드 50MB 이하(모바일 20MB 이하), 파일 1,500개 이하라서 통과합니다.
`dist/`는 git에 올리지 않으니 매번 빌드해야 합니다. 빌드에는 curl과 인터넷이 필요합니다(폰트 다운로드).

### 2. Submit a game 양식 (입력할 값)
양식 항목 이름은 포털 화면에 맞춰 보정하세요. 아래는 준비해 둔 값입니다.

| 항목 | 값 |
| --- | --- |
| Game name | STARDRIFT — Neon Survival Shooter |
| Engine / 형식 | HTML5 |
| 파일 | `dist/stardrift-crazygames.zip` |
| SDK 구현 | Basic: midgame ads, rewarded ads, gameplayStart/Stop, loadingStart/Stop, happytime |
| Progress saving | CrazyGames SDK Data module (브라우저 localStorage에도 함께 저장) |
| Category | Action → Shooting (대안: Arcade) |
| Tags | survivors, bullet heaven, roguelite, shooter, space, neon, upgrade, boss |
| Orientation | Landscape (세로 화면에서도 동작) |
| Mobile | 지원 (화면 드래그로 이동) |
| Languages | English, Korean |
| Controls | Move: WASD / arrow keys / drag · Pick upgrade: 1 2 3 · Reroll: R · Pause: Esc / P · Mute: M |
| Short / long description | `store/listing.md`의 English 부분 |
| Cover: 가로 | `store/cover-1920x1080.png` |
| Cover: 세로 | `store/cover-800x1200.png` |
| Cover: 정사각 | `store/cover-800x800.png` |
| Screenshots | `store/screens/1-boss.png` ~ `6-evolution.png` (1920×1080) |

### 3. 포털의 QA·미리보기 도구에서 확인할 것
- 첫 화면이 뜨고 "Launch Prep → Launch"로 바로 플레이되는지
- 격추 시 "Watch ad to revive" 버튼이 보이고, 광고가 끝나면 부활하는지
- 결과 화면의 "Watch ad: double stardust"
- 두 번째 판부터 "Launch again"을 누를 때 midgame 광고가 요청되는지
- 광고가 나오는 동안 소리가 꺼지는지
- 새로고침 후 진행 상황(별가루)이 남아 있는지

광고 버튼이 아예 안 보이면 SDK 초기화가 실패한 것입니다(`PORTAL.rewarded`가 false).
콘솔에서 `PORTAL`, `CrazyGames.SDK.environment`를 확인하세요.

### 4. 정산 정보
포털의 **Billing** 메뉴에서 결제 정보와 세금 서류를 입력합니다. 한국 거주자는 보통 W-8BEN 양식을 씁니다.

### 5. 그 다음
- 심사 결과가 오면 수정 요청 반영
- itch.io 업로드: `node tools/build.mjs itch`, 방법은 `MONETIZATION.md` 4단계
- Poki 신청 (독점 조건 확인 필요)
- 홍보용 15~30초 플레이 영상 (Playwright `recordVideo`로 자동 녹화 가능)
- 작업 브랜치를 `main`에 병합하면 GitHub Pages(`https://jiin67.github.io/with-Claude/`)에도 반영됩니다

## 난이도 메모
무기 진화를 넣은 뒤 밸런스 시뮬레이터(자동 조종, 기체 5종 순환) 결과입니다.
| 항로 | 진화 전 | 진화 후 |
| --- | --- | --- |
| 잔해 지대 (강화 없음) | 99% | 96% |
| 진홍 성운 (강화 없음) | 19% | 24% |
| 사건의 지평선 (강화 4단계) | 61% | 77% |

사건의 지평선이 쉬워졌습니다. 정예 개체가 상자를 자주 떨어뜨려 진화가 일찍(중앙값 약 230초) 나오기 때문입니다.
되돌리려면 진화를 보스 상자에서만 주거나 해당 항로의 적 체력을 올리면 됩니다. 아직 사용자가 정하지 않았습니다.

## CrazyGames 규정 메모
이전 세션에서 확인한 내용입니다. 공식 문서: docs.crazygames.com/requirements
- 영어 필수. 번역은 정확해야 함
- 외부 링크 금지(다른 게임, 앱스토어 홍보 등). 그래서 후원 링크는 광고 없는 판(itch, web)에서만 보이게 해 둠
- 광고는 SDK로만, 광고 요청 버튼은 플레이 중인 화면에 두지 않음 (부활·2배 버튼은 플레이가 멈춘 화면에만 있음)
- 주사율(144Hz 등)이 달라도 물리가 같아야 함. 게임은 dt 기반이라 문제없음
- PEGI 12 이하 콘텐츠

## 코드 구조 요약
`index.html`이 스크립트를 이 순서로 불러옵니다.
`data.js` → `i18n.js` (영어일 때 데이터 덮어쓰기) → `portal.js` → `audio.js` → `game.js` → `render.js` → `ui.js`
- 번역 함수는 `tr(key, ...args)`입니다. `t`는 지역 변수와 이름이 겹쳐서 쓰지 않습니다.
- 정적 문구는 `data-i18n`, `data-i18n-html`, `data-i18n-aria` 속성으로 채웁니다.
- 빌드 스크립트는 `<script>window.STARDRIFT_PORTAL = '...'</script>`를 넣어 포털을 고정합니다.
