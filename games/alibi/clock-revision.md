# 시계 사건 제목·해설 개정 내역 (`clock`, `js/cases-i.js`)

- 기준 커밋: `jiin67/with-Claude` `4ba971ddbfcd20d3ff2e9d18c3efc1b3577df663` (`games/alibi/`)
- 개정일: 2026-11-07
- 범위: 제목·intro·solve만. 범인·거짓말·증거·채팅 메시지는 바꾸지 않았다. `id: 'clock'`도 바꾸지 않았다 (저장·`ORDER`·자백 대사가 id로 연결됨).
- 전제: 앞선 개정에서 이라의 거짓말은 이미 "8시 48분에 나갔어요. 로비 카메라에 8시 48분에 나가는 게 찍혀 있어요" 형태로 바뀌어 있다. 해설은 그 개정과 모순되지 않게 썼다.

## 확인한 사실 (지은 것 없음)

도난 시간대는 intro와 facts에 명시되어 있다: **20:50–21:10**. 그 안의 사실만으로 해설을 썼다.

- 로비 카메라 정지 화면, 표시 시각 **20:48**: 이라가 정문으로 나가는 모습.
- 출입 기록: 이라 퇴장 **21:03** · 수키 입장 21:25. 데스크 콘솔: 벤이 20:56 택배 기사 등록, 21:00 전화 응대.
- IT 메모: "월요일 정전 이후 카메라 시계가 15분 느림. 두 대 모두."
- 집중실 문 센서: **20:55, 21:01** 열림.
- 후문 카메라(같은 녹화기), 표시 시각 20:35–20:38: 벤이 커피를 들고 후문 밖에 서 있음.
- 이라의 거짓말(`ev: [1, 2]`, 출입 기록 + IT 메모): lie 설명문은 이미 "출입 기록에 이라의 퇴장은 21:03이다. 카메라의 20:48은 같은 순간이다. 녹화기가 15분 느리니 화면의 20:48이 실제 21:03이다"로, 개정된 문장과 일치한다. **lie 설명문은 건드리지 않았다.**
- 자백 대사(outro, `js/cases-i.js` 내): 수키가 "그 카메라 월요일부터 15분 느려요… 그 화면의 8시 48분이 9시 3분이에요"라고 밝힌다. 지목 뒤에 나오는 대사라 트릭 공개가 문제되지 않으며, 새 해설과도 일치한다. **자백 대사는 건드리지 않았다.**

## 제목 후보와 선택

조건: "15분", "느린", "시계" 같은 트릭 단서가 들어가지 않을 것. 장소·상황은 드러나도 됨. 한·영이 짝을 이룰 것.

| 후보 | KO / EN | 판단 |
|---|---|---|
| 1 | 사라진 노트북 / The Missing Laptop | 중립적이고 직관적이지만, 이미 "사라진 케이크", "사라진 전기자전거"가 있어 "사라진 ○○"이 세 번째 반복이 된다. |
| 2 | **집중실의 노트북 / The Laptop in the Quiet Room** | **선택.** 사라진 물건과 장소를 드러낼 뿐 트릭은 전혀 암시하지 않는다. intro의 "집중실"과도 이어진다. EN 28자, KO 8자로 기존 제목(EN 20자, KO 7자)보다 길지만, 제목은 `textContent`로 들어가고 `.top .tt b`에 말줄임·고정 높이가 없어 줄바꿈으로 표시된다. |
| 3 | 두 개의 기록 / Two Records | "기록이 엇갈린다"는 것 자체를 암시해, 제목만으로 갈등 구조를 알려준다. 탈락. |

## Before / After

### 제목

| | Before | After |
|---|---|---|
| KO | 15분 느린 시계 | **집중실의 노트북** |
| EN | Fifteen Minutes Slow | **The Laptop in the Quiet Room** |

### intro

기존 intro의 마지막 문장("둘 중 하나만 맞다 / Only one of them is right")은 사실과도 어긋난다. 보정 후 두 기록은 모두 맞고, 카메라 시각만 15분 늦을 뿐이다. 그래서 "하나만 맞다"는 오해를 부르는 문장을 고쳤다. 트릭 자체(느린 시계)는 intro에 언급하지 않았다.

| | Before | After |
|---|---|---|
| KO | 20:50에서 21:10 사이에 집중실의 노트북이 사라졌다. 카메라는 이렇게 말하고, 출입 기록은 저렇게 말한다. 둘 중 하나만 맞다. | 20:50에서 21:10 사이에 집중실의 노트북이 사라졌다. 카메라와 출입 기록은 서로 다른 이야기를 한다. 둘 다 맞는 것처럼 보인다. |
| EN | A laptop vanished from the quiet room between 20:50 and 21:10. The camera says one thing, the badge log says another. Only one of them is right. | A laptop vanished from the quiet room between 20:50 and 21:10. The camera and the badge log tell different stories — and both look right. |

### 해설 (solve)

기존 해설은 계산(20:48 → 21:03)을 적고 있었지만, "이라의 주장이 왜 거짓말인지"를 직접 말하지 않았다. 새 해설은 첫 문장에서 이라의 주장("8시 48분에 나갔다")을 짚고, 20:48 + 15분 = 21:03이라는 계산을 한 문장으로 명시한 뒤, 21:03이 도난 시간대(20:50–21:10) 안이고 집중실 문이 열린 21:01의 2분 뒤라는 점을 잇는다. 벤(20:56에 데스크 복귀, 문 열리기 전)과 수키(21:25 도착, 도난 뒤)를 정리하고, 마지막 문장으로 "노트북이 사라질 때 안에 남아 있던 사람은 이라뿐"이라 범인 좁히기를 닫는다. 분량은 기존 대비 EN +19.8%, KO +20.9%로 ±30% 이내다.

| | Before | After |
|---|---|---|
| KO | 녹화기가 15분 느리다. 이라가 나가는 20:48 화면은 실제로 21:03이고, 출입 기록과 정확히 일치한다. 집중실 문이 21:01에 열린 2분 뒤다. 벤은 커피를 사러 잠깐 나갔지만(느린 시계의 20:35는 실제 20:50) 20:56에는 데스크에서 택배 기사를 등록하고 있었고, 수키는 노트북이 사라진 뒤인 21:25에 도착했다. | **이라는 8시 48분에 나갔다고 했지만, 그 20:48은 느린 녹화기의 시각이다. 15분을 더하면 21:03으로 출입 기록과 정확히 일치하고, 도난 시간대(20:50–21:10) 안이며 집중실 문이 열린 21:01의 2분 뒤다.** 벤은 커피를 사러 잠깐 나갔지만 20:56에는 데스크에 돌아와 있었고, 수키는 노트북이 사라진 뒤인 21:25에 도착했다. **노트북이 사라질 때 안에 남아 있던 사람은 이라뿐이다.** |
| EN | The recorder runs 15 minutes slow, so the 20:48 still of Ira leaving is really 21:03, exactly what the badge log says, two minutes after the quiet-room door opened at 21:01. Ben did slip out for a coffee (20:35 on the slow clock is 20:50) but was back at the desk signing in a courier at 20:56, and Suki arrived at 21:25, after the laptop was gone. | **Ira said she was out by 8:48, but that 20:48 timestamp is on the slow recorder: add 15 minutes and it is 21:03, exactly what the badge log says — inside the 20:50–21:10 window, two minutes after the quiet-room door opened at 21:01.** Ben slipped out for a coffee but was back at the desk by 20:56, before the door opened, and Suki arrived at 21:25, after the laptop was gone. **Only Ira was still inside when it vanished.** |

핵심 추가 문장 (KO): "이라는 8시 48분에 나갔다고 했지만, 그 20:48은 느린 녹화기의 시각이다. 15분을 더하면 21:03으로 출입 기록과 정확히 일치하고, 도난 시간대(20:50–21:10) 안이며 집중실 문이 열린 21:01의 2분 뒤다."

## 함께 고친 곳

- `README.md` 사건 목록 22번 행: 제목만 새 제목으로 교체. "엇갈리는 증거"라는 내부 분류 설명은 개발자 문서라 그대로 두었다.
- `store/listing.md` (스토어 등록 문구, 플레이어 노출 문구): "a slow camera clock" → "a disputed camera timestamp", "느린 카메라 시계" → "엇갈리는 카메라 기록"으로 교체. 스토어 문구에서도 트릭을 선공개하지 않게 했다.
- 고치지 않은 곳: `early-cases-revision.md`에 남은 구 제목은 그 문서가 작성 당시의 개정 기록이라 그대로 두었다. `HANDOFF.md`의 "(시계, 빵집, 드론)"도 내부 인수인계 문서의 변주 분류라 그대로 두었다.

## 검증

- `node tools/lint-cases.mjs` → **✓ 23 cases ok**
- `node --check js/cases-i.js` 통과.
- `game.js`를 Node VM에 올려 clock 사건을 한·영 양쪽으로 끝까지 플레이 (`/tmp/clock-verify.mjs`, 임시 스크립트라 저장소에 남기지 않음): **24/24 항목 통과**. 이라 거짓말이 `ev` 1(출입 기록)과 2(IT 메모) 둘 다로 인정됨, 벤 거짓말 인정, 거짓말 전부 찾기, 이라 지목 → ★3, 오지목 → 0. 새 제목에 스포일러 단어 없음, id `clock` 유지, intro에 "하나만 맞다"류 문장 없음, solve에 20:48·21:03·20:50·21:01 포함 확인.
- 제목 표시: 목록·사건 헤더·결과 화면 모두 `textContent`로 들어가며, `.top .tt b`에 말줄임이나 고정 높이가 없어 새 제목(EN 28자)도 줄바꿈으로 표시된다. 코드상 확인이며, 실제 화면 렌더링은 브라우저에서 직접 확인하지 않았다.

## 남은 리스크

1. **사람 손으로 한 플레이테스트가 아직 없다.** 새 제목이 트릭을 충분히 숨기는지, 새 해설이 처음 읽는 사람에게도 "왜 거짓말인지"를 납득시키는지는 실제 플레이로 확인이 필요하다.
2. **intro의 "둘 다 맞는 것처럼 보인다"**는 여전히 "기록이 엇갈린다"는 힌트다. 제목보다는 약한 수준이지만, 완전히 중립적인 intro를 원하면 이 문장도 더 줄여야 한다.
3. **자백 대사와 해설이 같은 계산을 반복한다.** 지목 뒤 자백에서 수키가 15분 느림을 밝히고, 해설이 다시 설명한다. 기존 구조 그대로이며, 의도된 반복(자백은 드라마, 해설은 정리)이다.
