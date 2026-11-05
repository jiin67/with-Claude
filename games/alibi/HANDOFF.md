# 인수인계: 알리바이 ALIBI

다른 채팅에서 이어서 작업할 때 이 문서를 먼저 읽어 주세요. 마지막 갱신: 2026-11-05 (오후)

## 배경
- 사용자가 "더 정교하고 새로운 컨셉의 게임"을 요청해 만든 네 번째 게임. 마지막 접속(노트북 방탈출)과 같은 방식으로 **휴대폰 UI 자체를 무대**로 써서 그림 없이도 현대적으로 보이게 했습니다.
- 저장소 안 게임: 별표류(루트, 별도 채팅에서 관리), `games/orbit-forge`(보류), `games/last-login`(완성), `games/alibi`(이 게임). 이 게임은 `games/alibi/` 안에서만 작업하세요.

## 저장소
- `jiin67/with-claude`, 브랜치 `claude/dreamy-bardeen-m2gky0`
- 규칙·사건 목록·구조: `games/alibi/README.md`
- 등록 문구와 이미지: `games/alibi/store/`

## 끝난 일
- 사건 16개(난이도 3단계), 거짓말 표시·실수 3회·범인 지목·별 점수·힌트
- 오늘의 사건(연속 일수), 타이머와 최고 기록, 용의자별 주장 보기, 기록 복사
- 첫 사건 단계별 안내, 배경 음악(합성), 거짓말 발견·별 연출
- 사건 검증 도구 `tools/lint-cases.mjs`
- 한국어·영어, CrazyGames·Poki 광고(힌트 보상형, 사건 사이 판 사이 광고), CrazyGames 계정 저장
- PC·모바일에서 16개 사건 전부 자동 플레이, 실패 경로, 힌트, 오답 지목 테스트 통과, 오류 없음
- 포털별 zip(약 360KB), 커버 6종, 스크린샷 5장

**확인 못 한 것**: 진짜 CrazyGames SDK(이 환경에서 접속 불가), 사람이 직접 한 플레이.

## 다음 단계
1. 사용자님이 직접 사건을 플레이 (16개, 약 70분). 억지스러운 거짓말, 증거만으로 범인이 안 좁혀지는 사건이 있으면 알려 주세요.
2. `node games/alibi/build.mjs crazygames` → `games/alibi/dist/alibi-crazygames.zip`
3. CrazyGames 포털 Submit a game. 값은 아래 표

| 양식 항목 | 값 |
| --- | --- |
| Game name | ALIBI — Catch the Lie |
| 형식 | HTML5, `alibi-crazygames.zip` |
| SDK | midgame, rewarded, gameplayStart/Stop, loadingStart/Stop, happytime |
| Progress saving | CrazyGames SDK Data module |
| Category | Puzzle (대안 Casual) |
| Tags | detective, deduction, mystery, puzzle, logic, story |
| Orientation | Portrait 우선, 가로에서도 동작 (가운데 휴대폰 프레임) |
| Mobile | 지원 |
| Languages | English, Korean |
| Controls | Tap a message → Mark as a lie · tabs: Chat / Evidence / Suspects · ? for a hint |
| 설명 | `store/listing.md` English |
| Covers | `store/cover-1920x1080.png`, `cover-800x1200.png`, `cover-800x800.png` |
| Screenshots | `store/screens/1-chat.png` ~ `4-cases.png` |

## 개선 후보
- 사건 추가 (사건당 텍스트 약 60줄, 두 언어). 포털에서 가장 효과 큰 업데이트. `cases-f.js`부터
- 오늘의 사건에 전 세계 공통 순위표 (서버 필요)
- 사건 묶음(시즌)별 잠금 해제

## 작업 요령
- 사건 구조와 공정성 규칙은 `README.md` "사건 추가하기"
- 테스트 훅: 콘솔의 `__al` (`__al.R`이 진행 중 사건, `__al.beginCase(i)`)
