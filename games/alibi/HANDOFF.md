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
- 사건 23개(난이도 3단계). 변주 사건 3종(사진 단서, 엇갈리는 증거, 거짓말이 결백의 증거)을 플레이 순서 2·4·6번에 배치. 거짓말 표시는 **어긋나는 증거까지 골라야** 인정(찍기 방지). 실수 3회·범인 지목·별 점수·힌트
- 용의자 벡터 얼굴, 범인 지목 뒤 자백 연출(사건마다 4~6줄, 두 언어), 반전 큰 사건을 앞에 두는 순서
- 처음 접속하면 클릭 없이 1번 사건, 다시 오면 사건 목록. PC 가로 화면은 채팅·증거 나란히 배치. 일러스트 썸네일
- 오늘의 사건(연속 일수), 타이머와 최고 기록, 용의자별 주장 보기, 기록 복사
- 첫 사건 단계별 안내, 배경 음악(합성), 거짓말 발견·별 연출
- 사건 검증 도구 `tools/lint-cases.mjs`
- 한국어·영어, CrazyGames·Poki 광고(힌트 보상형, 사건 사이 판 사이 광고), CrazyGames 계정 저장
- PC(가로)·모바일에서 23개 사건 전부 자동 플레이, 실패 경로, 힌트, 오답 지목 테스트 통과, 오류 없음
- 포털별 zip(폰트 포함 시 약 360KB; 폰트 다운로드가 막힌 환경에서는 약 50KB로 나오며 구글 폰트 링크를 대신 씀), 커버 6종, 스크린샷 5장

**확인 못 한 것**: 진짜 CrazyGames SDK(이 환경에서 접속 불가), 사람이 직접 한 플레이.

**네 번째 리뷰 반영**: 창가 사건 "어제→오늘" 수정, 사진 사건 4개에 실제 그림 장면 추가(얼굴 생성기로 용의자 얼굴을 그림에 넣음)와 칩에서 정답 제거(핀의 이름표 → 프로필 사진의 노란 우비), 자전거 사건 소개에서 반전 문장 삭제, 갤러리 이름을 비레오 갤러리로, 썸네일 인물·부제 손질, 결과 화면을 가로에서 두 단(오른쪽에 범인 얼굴 크게).

**세 번째 리뷰 반영**: 가로 배치 기준을 760px 가로형으로 낮춤(821×462 노트북 창도 가로 배치), 안내 말풍선을 채팅 맨 위 고정으로 옮겨 메시지를 가리지 않음, '유출된 초안' 시간 오류 수정(클레오 20:15), 썸네일에 탐정 인물 추가, 얼굴 생성기 변형 확대(얼굴형·머리 9종·모자·안경 3종·수염·주근깨 등), 결과 화면에 범인 얼굴 크게, 설명 '20 cases'. 사물함·드론·화병·축제·빵집·대문·노래방 사건을 변주를 넣어 다시 씀(사진 단서 / 엇갈리는 증거 / 결백의 거짓말). 이제 1:1 구조인 사건은 케이크(튜토리얼이라 의도)뿐. 변주 분포: 사진 단서 4(창가, 축제, 대문, 사물함), 엇갈리는 증거 3(시계, 빵집, 드론), 결백의 거짓말 4(자전거, 화병, 노래방, 사물함).

**두 번째 리뷰에서 남은 지적(이 컨셉으로는 못 고치는 것)**: 글을 읽어야 하는 게임이라 10대 중심 포털에서 이탈이 크고 광고 자리가 적어 수익성이 낮음. 앞쪽 쉬운 사건의 거짓말이 증거와 1:1로 바로 맞닿아 추리보다 대조에 가까움(사진 단서, 엇갈리는 증거 같은 변주는 뒤쪽 사건에만 있음).

## 다음 단계
1. 사용자님이 직접 사건을 플레이 (23개, 약 100분). 억지스러운 거짓말, 증거만으로 범인이 안 좁혀지는 사건이 있으면 알려 주세요.
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
- 사건 추가 (사건당 텍스트 약 60줄, 두 언어). 포털에서 가장 효과 큰 업데이트. `cases-k.js`부터
- 오늘의 사건에 전 세계 공통 순위표 (서버 필요)
- 사건 묶음(시즌)별 잠금 해제

## 작업 요령
- 사건 구조와 공정성 규칙은 `README.md` "사건 추가하기"
- 테스트 훅: 콘솔의 `__al` (`__al.R`이 진행 중 사건, `__al.beginCase(i)`)

## 그림 파이프라인 (2026-11-09)
- 제작 지시서: `art/ART_BRIEF.md` (1차: 사건 1~5, 16명, 장면 5, 자백 영상 10)
- 받은 원본 → `node games/alibi/tools/art-import.mjs <원본폴더>` → `assets/{p,s,v}` 웹용 파일 + `js/art.js` 매니페스트 자동 갱신. 원본 PNG는 커밋하지 않음.
- 게임: 초상화(calm/nervous/confess, 사건 열 때만 로드, 없으면 SVG 얼굴), 사건 개요 위 장면 그림, 범인의 마지막 대사 직전 자백 영상(현재 언어, 건너뛰기, 15초 안전장치). 자막은 `js/confess.js`.
- `build.mjs`가 `assets/`를 모든 빌드에 복사. CrazyGames 기준: 첫 로딩 ≤50MB(모바일 ≤20MB), 전체 ≤250MB.
