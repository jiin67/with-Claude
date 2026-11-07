# 실수 복구 버튼이 안 보이던 원인 수정

- 기준 커밋: `jiin67/with-Claude` `4ba971ddbfcd20d3ff2e9d18c3efc1b3577df663` (`games/alibi/`) + 앞선 개정(1~6번 추리 강화, 복수 증거, 오증거 무료, 이어하기, 광고·힌트 구조, 시계 제목·해설)
- 개정일: 2026-11-07
- GitHub에는 push하지 않았다. 로컬 복사본(`~/workspace/games/alibi/`)에서만 작업했다.

## 원인 한 줄 요약

`js/ui.js` `renderMeters()`가 복구 버튼의 표시 조건에 `PORTAL.rewarded`를 걸고 있었다.
보상형 광고를 쓸 수 있는 빌드(CrazyGames/Poki/debug)에서만 버튼이 보였고, 광고 없는
빌드(web/itch, `portal=none`)에서는 실수 2회·사건당 1회 조건이 맞아도 버튼이 아예 안 보였다.
개정본 브라우저 테스트는 Blob 파일로 열려 `?portal=debug`가 적용되지 않아 `PORTAL.rewarded`
가 false였고, 그래서 실수 2회 상태에서도 버튼을 찾을 수 없었다. 버튼 자체
(`index.html`의 `<button id="btnRecoverStrike" hidden>`)와 판정 로직
(`js/game.js` `canRecoverStrike()`/`recoverStrike()`)은 멀쩡했다.

여기에 비동기 타이밍 문제도 겹쳐 있었다. `PORTAL.rewarded`는 포털 SDK가 응답한 뒤에야
정해지는데, 그 전에는 `false`로 보인다. SDK 응답 전에 사건 화면이 떠 있으면 버튼은
숨은 채로 있다가 `PORTAL.ready.then(...)`이 `renderMeters()`를 다시 부를 때야 나타난다.

## 수정 내용

### 1. 버튼 표시 조건에서 `PORTAL.rewarded`를 뺐다 (`js/ui.js` `renderMeters()`)

- 표시 조건은 이제 `R.state === 'play' && canRecoverStrike()`(실수 2회, 사건당 1회)만 본다.
  빌드와 무관하게 조건이 되면 버튼이 보인다.
- SDK 응답 전에는 버튼이 **disabled 상태로 보인다**. 숨기지 않는다.
  이를 위해 `js/portal.js`에 `api.settled` 플래그를 추가했다. SDK가 응답했거나
  실패했으면 `true`가 된다. `none`·`debug` 빌드는 동기적으로 정해지므로 즉시 `true`,
  CrazyGames/Poki는 SDK 초기화 뒤에 `true`가 되고, 기존 `PORTAL.ready.then(...)`
  경로가 `renderMeters()`를 다시 불러 버튼을 갱신한다.

### 2. 빌드별 동작을 나눴다

| 빌드 | 버튼 라벨 | 동작 | 대가 |
| --- | --- | --- | --- |
| 보상형 광고 빌드 (`PORTAL.rewarded` true) | 광고 보고 실수 1회 되돌리기 | 기존대로 광고를 보고 복구 | 광고 1회 |
| 광고 없는 빌드 (`PORTAL.rewarded` false) | 실수 1회 되돌리기 | 광고 없이 바로 복구 (`recoverStrikeFree()`) | 힌트 1회 (`R.hints++`) |
| SDK 응답 전 (`settled` false) | 빌드에 맞는 라벨 | 버튼 표시 + disabled | — (응답 후 활성화) |

- 무광고 복구는 `js/game.js`의 새 함수 `recoverStrikeFree()`가 맡는다. 기존
  `recoverStrike()`(실수 2회 → 1회, 사건당 1회)를 호출한 뒤 `R.hints++`만 한다.
- 대가가 별점에 그대로 반영된다. 기존 별점 규칙은 `실수 0·힌트 0 → ★3`,
  `실수·힌트 각 ≤1 → ★2`, 그 외 ★1이다. 무광고 복구 뒤에는 실수 1회·힌트 최소 1회라
  ★3은 불가능하고 ★2가 상한이다. 힌트를 이미 1회 쓴 상태에서 복구하면 힌트 2회라 ★1이 된다.
- 클릭 핸들러(`js/ui.js`)는 `PORTAL.rewarded`가 false면 광고 호출을 거치지 않고
  `recoverStrikeFree()`로 바로 간다. SDK가 실패해 `rewarded`가 false로 확정된 경우도
  같은 무광고 경로로 떨어진다.

### 3. 버튼 발견 가능성을 높였다

- 버튼이 보일 때 기존 `.pulse` 스타일(`style.css`, 코치 안내가 쓰던 것과 동일)을
  붙여 주황색 펄스로 눈에 띄게 했다. 조건이 풀리면 클래스를 뗀다.
- 실수 2회에 처음 도달하면 토스트로 한 번 안내한다(사건당 1회).
  광고 빌드: "실수 2회예요. 복구 버튼으로 1회를 되돌릴 수 있어요."
  무광고 빌드: "실수 2회예요. 복구 버튼으로 1회를 되돌릴 수 있어요. 힌트 1회 사용."
  토스트는 SDK 응답 뒤(무광고/광고 여부가 확정된 뒤)에만 뜨게 했다. 응답 전에 뜨면
  문구가 틀릴 수 있기 때문이다.

## 바꾼 파일

- `js/portal.js` — `api.settled` 플래그 추가 (`ready` 완료 시 `true`)
- `js/game.js` — `recoverStrikeFree()` 추가, `recoverStrike()` 주석 수정
- `js/ui.js` — `renderMeters()` 표시 조건·라벨·disabled·pulse·안내 토스트,
  `btnRecoverStrike` 클릭 핸들러 이중 경로, `recoverAnnounced` 플래그
- `js/i18n.js` — `recoverStrikeFree`·`recoverDoneFree`·`recoverHint`·`recoverHintFree` (한·영)
- `README.md` — 광고 표의 실수 복구 행, 광고 없는 빌드 문단
- `alibi-revised-single.html` — 새 코드로 다시 묶은 단일 파일 번들 (인라인 스크립트 18개 순서 유지)
- `monetization-revision.md` — 아래 "수익 구조 문서에 덧붙인 내용" 참조

## 검증

- `node tools/lint-cases.mjs` → `✓ 23 cases ok`
- `node --check` → 수정한 `js/portal.js`, `js/game.js`, `js/ui.js`, `js/i18n.js` 전부 통과
- `js/game.js` + `js/portal.js`를 Node VM에 올려 스텁 환경에서 자동 검증
  (`/tmp/recover-verify.mjs`, 임시 스크립트로 저장소에 남기지 않음) — **31개 항목 전부 통과**:
  - (a) 보상형 빌드: 실수 2회 → `canRecoverStrike()` true → `recoverStrike()`로
    실수 2→1, 힌트 0 유지, 두 번 복구 불가, 해결 시 ★2
  - (b) 무광고 빌드: 실수 2회 → `recoverStrikeFree()`로 실수 2→1, 힌트 0→1,
    두 번 복구 불가, 해결 시 ★2 (★3 불가)
  - (b2) 힌트 1회 사용 뒤 무광고 복구 → 힌트 2회, 해결 시 ★1
  - (c) 표시 조건: 실수 0·1회·복구 뒤·실패 시 숨김, 2회일 때만 표시.
    라벨은 광고 빌드 `recoverStrike` / 무광고 빌드 `recoverStrikeFree`,
    `settled=false`면 disabled, `settled=true`면 활성화, `settled` 없는 스텁은
    확정된 것으로 취급
  - (d) 깨끗한 플레이는 여전히 ★3
  - portal: `?portal=none` → `settled=true`·`rewarded=false`,
    `?portal=debug` → `settled=true`·`rewarded=true`, 쿼리 없음 → `rewarded=false`
  - 참고: 첫 실행에서 debug 항목 1개가 실패했는데, 원인은 VM 하네스에
    `URLSearchParams`가 없어 포털 이름 판별이 `none`으로 떨어진 하네스 문제였다.
    하네스에 `URLSearchParams`를 넣어 다시 돌리니 31개 전부 통과했다. 실제
    브라우저에는 `URLSearchParams`가 있어 해당하지 않는다.
- 단일 파일 번들 재생성 확인: 인라인 스크립트 18개, `recoverStrikeFree`·
  `recoverHintFree`·`api.settled = true` 포함 확인

## 남은 리스크 / 다음 작업 후보

1. **DOM 동작은 브라우저에서 직접 확인하지 않았다.** 검증은 `game.js`/`portal.js`
   판정 로직과 표시 조건의 불리언 로직까지만 커버한다. 실제 화면에서 버튼이 미터 행에
   어떻게 보이는지(작은 ghost 버튼 + pulse), 토스트가 뜨는지, SDK 응답 전 disabled
   상태가 보이는지는 브라우저 플레이로 한 번 눌러봐야 한다. 특히 Blob 파일 테스트는
   `?portal=debug`를 붙일 수 없어 무광고 경로로만 확인된다.
2. **무광고 복구의 대가(힌트 1회)는 버튼을 누르기 전에 토스트로 한 번 안내되지만,
   버튼 라벨 자체에는 대가가 안 적혀 있다.** 라벨은 "실수 1회 되돌리기" 그대로다.
   대가는 안내 토스트·복구 완료 토스트·README에 명시했다. 라벨에 대가를 직접 적는
   것이 낫다고 판단되면 `recoverStrikeFree` 문구를 바꾸면 된다.
3. **SDK 응답 전에 실수 2회에 도달하면 버튼이 disabled로 보인다.**
   SDK 초기화가 8초 타임아웃까지 걸리면 그 사이 버튼을 누를 수 없다. 실수 2회에
   도달하는 데 보통 그보다 오래 걸리므로 실제 영향은 작다.
4. **실수 없이 이어하기(`btnResResumeAd`)는 여전히 광고 빌드에서만 보인다.**
   이번 수정 범위는 실수 복구 버튼뿐이라 건드리지 않았다. 무광고 빌드에는 무료
   이어하기(실수 1회부터)가 이미 있다.

## 수익 구조 문서에 덧붙인 내용

`monetization-revision.md` 끝에 아래 단락을 추가했다.

> 2026-11-07 추가 — 실수 복구 버튼 표시 조건 수정: 복구 버튼이 `PORTAL.rewarded`
> 에만 보이던 탓에 광고 없는 빌드(web/itch)와 Blob 테스트에서는 실수 2회에도 버튼이
> 안 보였다. 이제 버튼은 모든 빌드에서 실수 2회·사건당 1회 조건에 보이며, 광고
> 빌드에서는 광고를 보고, 광고 없는 빌드에서는 힌트 1회를 써서 복구한다 (★3 불가).
> SDK 응답 전에는 disabled 상태로 보인다. 자세한 내용은 `recover-button-fix.md` 참조.
