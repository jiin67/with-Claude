# 인수인계: 궤도 제련소 ORBIT FORGE

다른 채팅에서 이 게임을 이어서 작업할 때 이 문서를 먼저 읽어 주세요. 마지막 갱신: 2026-10-27

## 배경
- 목표: 남은 Claude Code 클라우드 크레딧(11월 5일 만료)으로 수입 만들기
- 사용자 요청: 별표류 말고 **심사를 통과할 만한 새 게임**. 후보 중 방치형 우주 채굴로 결정
- **별표류는 별도 채팅에서 관리 중**입니다. 저장소 루트(`index.html`, `js/`, `store/`, `tools/`, 루트 `HANDOFF.md`)는 별표류 것이니 건드리지 마세요. 이 게임은 `games/orbit-forge/` 안에서만 작업합니다.

## 저장소
- `jiin67/with-claude`, 브랜치 `claude/dreamy-bardeen-m2gky0` (2026-10-27에 `main`에서 새로 시작, PR 없음)
- 게임 설명과 구조: `games/orbit-forge/README.md`
- 등록 문구와 이미지: `games/orbit-forge/store/`

## 끝난 일 (첫 플레이 가능 버전)
- 시설 10종, 개량 104개, 혜성, 항성 붕괴(환생)와 유물 6종, 업적 20개, 자리 비움 수익, 튜토리얼
- 한국어·영어 (브라우저 언어 자동, 설정에서 변경), 숫자 표기 만·억·조 / K·M·B / 과학 표기
- CrazyGames v3·Poki v2 광고: 생산 2배 부스트, 자리 비움 수익 2배, 붕괴 후 판 사이 광고
- CrazyGames 계정 저장(Data 모듈). 계정 쪽 진행이 더 많으면 그쪽을 씁니다
- 포털별 zip 빌드(약 90KB, 폰트 내장), 커버 5종과 스크린샷 5장
- PC(1280×760)와 모바일(390×844 터치)에서 Playwright로 전 흐름 테스트, 오류 없음
- 가짜 CrazyGames SDK로 광고·이벤트 순서·계정 저장 확인

**확인 못 한 것**: 진짜 CrazyGames SDK. 이 클라우드 환경에서는 sdk.crazygames.com 접속이 막혀 있습니다.

## 다음 단계
1. 사용자가 직접 플레이해 보고 의견 주기 (재미, 속도, 화면)
2. `node games/orbit-forge/build.mjs crazygames` → `games/orbit-forge/dist/orbitforge-crazygames.zip`
3. CrazyGames 개발자 포털(사용자 계정 `small_eaner`, 로그인 완료) → Submit a game. 값은 아래 표
4. 포털 미리보기에서 광고 버튼(상단 "Watch ad: 2×")이 보이는지, 새로고침 후 진행이 남는지 확인
5. 심사 피드백 반영

| 양식 항목 | 값 |
| --- | --- |
| Game name | ORBIT FORGE — Idle Space Mining |
| 형식 | HTML5, `orbitforge-crazygames.zip` |
| SDK | midgame, rewarded, gameplayStart/Stop, loadingStart/Stop, happytime |
| Progress saving | CrazyGames SDK Data module |
| Category | Clicker (대안 Casual) |
| Tags | idle, incremental, clicker, space, mining, tycoon, prestige |
| Orientation | Landscape, 세로에서도 동작 |
| Mobile | 지원 |
| Languages | English, Korean |
| Controls | Tap/click the asteroid (Space) · tap structures to buy (×1/×10/×100/MAX) · tap comets |
| 설명 | `store/listing.md` English |
| Covers | `store/cover-1920x1080.png`, `cover-800x1200.png`, `cover-800x800.png` |
| Screenshots | `store/screens/1-fleet.png` ~ `5-korean.png` |

## 개선 후보 (심사 피드백이 없을 때)
- 사운드 볼륨 조절, 배경 음악
- 시설을 10개, 25개 모을 때마다 궤도 연출 강화
- 붕괴 회차가 늘면 소행성 종류 변화 (지금은 색만 바뀜)
- 첫 붕괴 전 안내 (지금은 붕괴 탭 설명만 있음)

## 작업 요령
- 수치는 전부 `js/data.js`. 바꾼 뒤 `node games/orbit-forge/tools/sim.mjs 3 150 30 70 110`으로 속도 확인
- 번역 함수는 `tr(key)`, 이름은 `NAMES` (`js/i18n.js`)
- 테스트 훅: 콘솔의 `__of` (`__of.S`가 저장 데이터, `__of.spawnComet()`)
- CSS에서 `display`를 지정한 요소도 `hidden` 속성이 먹도록 `[hidden]{display:none!important}`를 둡니다
