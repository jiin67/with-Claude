# 인수인계: 마지막 접속 LAST LOGIN

다른 채팅에서 이어서 작업할 때 이 문서를 먼저 읽어 주세요. 마지막 갱신: 2026-11-02

## 배경
- 목표: 남은 Claude Code 클라우드 크레딧(11월 5일 만료)으로 수입 만들기
- 그동안의 경과: 별표류(슈팅)와 궤도 제련소(방치형)는 도형 그래픽이라 사용자님이 "옛날 게임 같다"고 판단. 그림 없이도 현대적으로 보이도록 **노트북 화면 자체를 무대로 쓰는 방탈출**로 방향을 바꿈
- **별표류는 별도 채팅에서 관리 중**이고 저장소 루트는 별표류 것입니다. 이 게임은 `games/last-login/` 안에서만 작업하세요. `games/orbit-forge/`는 보류 상태로 두면 됩니다.

## 저장소
- `jiin67/with-claude`, 브랜치 `claude/dreamy-bardeen-m2gky0` (PR 없음)
- 게임 설명과 구조: `games/last-login/README.md`
- 등록 문구와 이미지: `games/last-login/store/`

## 끝난 일
- 4챕터 퍼즐 9개, 노트북 앱 8개(메모, 메일, 사진, 음악, 휴지통, 금고, 터미널, 메시지), 엔딩
- 한국어·영어, 3단계 힌트(1단계 무료, 2·3단계 보상형 광고), 챕터 2·3 뒤 판 사이 광고
- CrazyGames·Poki SDK 연결, CrazyGames 계정 저장
- PC(1280×800)와 모바일(390×844 터치)에서 Playwright로 처음부터 엔딩까지 자동 플레이, 오류 없음
- 가짜 CrazyGames SDK로 광고·이벤트·저장 확인
- 포털별 zip(약 380KB), 커버 6종, 스크린샷 5장

**확인 못 한 것**: 진짜 CrazyGames SDK(이 환경에서는 접속 불가), 그리고 **사람이 직접 한 플레이**. 퍼즐 난이도는 아직 아무도 검증하지 않았습니다.

## 다음 단계
1. **사용자님이 직접 끝까지 플레이** (약 30분). 막힌 곳, 불공정하게 느낀 퍼즐, 힌트가 부족한 곳을 적어 주세요. 이게 가장 중요합니다.
2. 피드백 반영
3. `node games/last-login/build.mjs crazygames` → `games/last-login/dist/lastlogin-crazygames.zip`
4. CrazyGames 포털(계정 `small_eaner`) Submit a game. 값은 아래 표
5. 미리보기에서 힌트 2단계 버튼이 "Watch ad for a hint"로 바뀌는지, 새로고침 후 진행이 남는지 확인

| 양식 항목 | 값 |
| --- | --- |
| Game name | LAST LOGIN — Laptop Escape Room |
| 형식 | HTML5, `lastlogin-crazygames.zip` |
| SDK | midgame, rewarded, gameplayStart/Stop, loadingStart/Stop, happytime |
| Progress saving | CrazyGames SDK Data module |
| Category | Puzzle → Escape (대안 Adventure) |
| Tags | escape room, puzzle, mystery, point and click, detective, story |
| Orientation | Landscape, 세로에서도 동작 |
| Mobile | 지원 |
| Languages | English, Korean |
| Controls | Click/tap apps in the dock · type answers · press ? for a hint |
| 설명 | `store/listing.md` English |
| Covers | `store/cover-1920x1080.png`, `cover-800x1200.png`, `cover-800x800.png` |
| Screenshots | `store/screens/1-lock.png` ~ `4-terminal.png` |

## 개선 후보
- 퍼즐 추가로 플레이 시간 늘리기 (사진 앱에 숨은 단서, 휴지통 복구 퍼즐 등)
- 메시지 앱에 선택지 분기와 두 번째 엔딩
- 배경 음악 (지금은 효과음만)
- 다음 에피소드 고리: 엔딩에서 "하루의 휴대폰"으로 이어지는 속편 예고

## 작업 요령
- 정답과 퍼즐 사슬은 `js/content.js` 맨 위 `ANSWERS`
- 번역 함수 `tr(key)`, 이야기 텍스트는 `C` (`CONTENT[LANG]`)
- 테스트 훅: 콘솔의 `__ll` (`__ll.S` 저장 데이터, `__ll.openApp('terminal')`)
- 자동 플레이 스크립트는 이 세션 스크래치에만 있으니, 필요하면 `README`의 퍼즐 표를 보고 다시 쓰면 됩니다
