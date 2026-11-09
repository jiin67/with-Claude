# ALIBI 아트 제작 지시서 — 1차 (앞 5개 사건)

심사자가 처음 몇 분 안에 보는 사건 1~5의 용의자 16명, 장면 5장, 자백 영상 10개(한·영)를 만듭니다.
만든 파일은 아래 **파일 이름 규칙**대로 저장해서 주세요. 압축과 게임 연결은 Claude가 합니다.

---

## 1. 공통 스타일

**목표 느낌**: AI 숏드라마 등장인물 같은 미형 캐릭터. 맑은 피부, 큰 눈, 부드러운 시네마틱 조명.
**구분 원칙**: 다들 예쁘면 헷갈리므로 사람마다 **머리 색·옷·소품·대표 색**을 확실히 다르게 둡니다. 아래 표의 "고정 요소"는 모든 표정·영상에서 바뀌면 안 됩니다.

**공통 스타일 프롬프트** (모든 초상화 앞에 붙이기)

```
Beautiful stylized portrait in the look of a modern Korean web-drama, semi-realistic,
flawless soft skin, large expressive eyes, delicate features, soft cinematic key light,
gentle rim light, shallow depth of field, softly blurred background, head and shoulders,
centered, facing camera, vertical 2:3, highly detailed, clean, no text, no watermark
```

**미성년자 캐릭터**(솔 12살)는 위 문장 대신 아래를 씁니다. 나이에 맞는 평범한 아이로, 미형·화장·성숙한 연출 금지.

```
Friendly stylized portrait of an ordinary 12-year-old child, age-appropriate, natural
childlike proportions, casual clothes, soft warm lighting, wholesome family-show look,
head and shoulders, centered, vertical 2:3, no makeup, no text, no watermark
```

**피해야 할 것**: 글자·로고·브랜드, 실제 연예인 닮은꼴, 노출, 무기, 피.

---

## 2. 표정 3종과 만드는 순서

1. **calm** (평상시) 먼저 생성 → 마음에 드는 1장을 **캐릭터 기준 이미지**로 확정
2. 기준 이미지를 참조(이미지-투-이미지 / 캐릭터 참조 / Kling 페이스락)해서 나머지 표정 생성

| 표정 | 프롬프트에 덧붙일 문장 | 누구 |
|---|---|---|
| calm | `relaxed neutral expression, slight polite smile` | 16명 전원 |
| nervous | `nervous expression, eyes glancing to the side, tight lips, a bead of sweat` | 16명 전원 |
| confess | `guilty defeated expression, eyes downcast, teary, ashamed half-smile` | 범인 5명만 |

→ 초상화 총 **37장** (16 × 2 + 범인 5)

---

## 3. 캐릭터 16명

★ = 범인 (confess 표정과 자백 영상 필요)

### 사건 1 · 사라진 케이크 (사무실 탕비실, 오후 4시)
| id | 이름 | 역할 | 고정 요소 (프롬프트) |
|---|---|---|---|
| jun | 준 Jun | 영업 담당, 남, 20대 | `young man, neat side-parted black hair, navy suit with no tie, white shirt, ID lanyard, confident` · 대표색 네이비 |
| mia ★ | 미아 Mia | 디자이너, 여, 20대 | `young woman, pastel pink bob with straight bangs, oversized cream knit cardigan, pencil tucked behind ear, round gold earrings` · 대표색 핑크 |
| theo | 테오 Theo | 개발자, 남, 20대 | `young man, messy ash-brown wavy hair, black hoodie, over-ear headphones around neck, sleepy eyes` · 대표색 그레이 |

배경: `bright modern office kitchen, fridge, afternoon window light`

### 사건 2 · 창가 자리 (비 오는 카페, 오후 4시 20분)
| id | 이름 | 역할 | 고정 요소 |
|---|---|---|---|
| noa | 노아 Noa | 바리스타, 남, 20대 | `young man, short bleached platinum hair, black barista apron over white tee, rolled sleeves, silver ear cuff` · 대표색 블랙 |
| finn ★ | 핀 Finn | 단골손님, 남, 20대 | `young man, tousled auburn hair slightly wet from rain, light freckles, bright yellow raincoat with hood down` · 대표색 노랑 (**노란 우비는 사건 단서라 꼭 유지**) |
| mara | 마라 Mara | 매니저, 여, 20대 후반 | `young woman, long straight black hair in a low ponytail, crisp white shirt, black vest, small gold name pin, poised and strict` · 대표색 버건디 |

배경: `cozy cafe on a rainy afternoon, window with raindrops, warm lights`

### 사건 3 · 깨진 화병 (아파트 복도, 저녁)
| id | 이름 | 역할 | 고정 요소 |
|---|---|---|---|
| rafa | 라파 Rafa | 택배 기사, 성별 중립, 20대 | `androgynous young adult, short dark undercut, red courier cap and red work jacket, handheld parcel scanner` · 대표색 레드 |
| sol ★ | 솔 Sol | 손자, **12살 남자아이** | (미성년자 문장 사용) `12-year-old boy, short black hair, white taekwondo uniform with yellow belt under an open puffer jacket, wet sneakers` · 대표색 화이트 |
| dana | 다나 Dana | 옆집 이웃, 여, 30대 | `woman in her early thirties, soft wavy chestnut hair, cozy lavender home cardigan, holding a mug` · 대표색 라벤더 |

배경: `quiet apartment hallway in the evening, warm ceiling light`

### 사건 4 · 집중실의 노트북 (공유 오피스, 밤 9시)
| id | 이름 | 역할 | 고정 요소 |
|---|---|---|---|
| ira ★ | 이라 Ira | 회원, 여, 20대 후반 | `young woman, sleek black hair in a high bun, sharp winged eyeliner, charcoal blazer over black turtleneck, large tote bag on shoulder` · 대표색 차콜 |
| ben | 벤 Ben | 야간 안내 데스크, 남, 20대 | `young man, soft dark curly hair, round wire glasses, beige sweater vest over shirt, paper coffee cup` · 대표색 브라운 |
| suki | 수키 Suki | 청소 담당, 여, 20대 | `young woman, short silver pixie cut, light blue cleaning staff uniform, one wireless earbud, yellow rubber gloves` · 대표색 하늘색 |

배경: `coworking space at night, dim desk lamps, glass meeting room`

### 사건 5 · 사라진 전기자전거 (원룸 건물 복도, 밤 10시)
| id | 이름 | 역할 | 고정 요소 |
|---|---|---|---|
| dae | 대현 Dae | 린의 룸메이트, 남, 20대 초반 | `young man, fluffy black hair, round gentle face, grey crewneck sweatshirt, backpack strap` · 대표색 회색 |
| lin | 린 Lin | 자전거 주인, 성별 중립, 20대 | `androgynous young adult, mint green shoulder-length hair, sporty cycling windbreaker, holding a bike helmet` · 대표색 민트 |
| owen ★ | 오웬 Owen | 배달 기사, 남, 20대 | `young man, spiky dark hair, orange delivery rider jacket, insulated delivery backpack straps, helmet pushed up on head` · 대표색 오렌지 |
| piper | 파이퍼 Piper | 건물 관리인, 성별 중립, 30대 | `androgynous adult in their thirties, short copper hair, denim work shirt, tool belt, big ring of keys` · 대표색 데님 |

배경: `apartment building hallway at night, bike rack, fluorescent light`

---

## 4. 사건 장면 5장 (16:9, 1920×1080)

공통 꼬리말: `cinematic establishing shot, no people, moody soft light, highly detailed, no text, 16:9`

| 파일 | 프롬프트 |
|---|---|
| cake | `modern office kitchen, fridge door slightly open, empty cake box with chocolate crumbs on the counter, 4pm sunlight` |
| window | `cozy cafe window seat on a rainy afternoon, empty glass tip jar on the counter, raindrops on the window` |
| vase | `apartment hallway in the evening, a shattered blue ceramic vase on the floor by a front door, wet footprints` |
| clock | `coworking quiet room at night, empty desk with a dangling laptop charger, security camera on the wall` |
| bike | `apartment building hallway at night, bike rack with one empty slot and a cut cable lock on the floor` |

※ 창가 사건의 **단서 사진**(시계·팁 통·노란 우비)은 정답 논리가 걸려 있어서 이번엔 기존 그림을 유지합니다.

---

## 5. 자백 영상 10개 (범인 5명 × 한·영)

- 원본: 각 범인의 **confess 초상화**로 이미지-투-비디오
- 형식: **세로 9:16, 720p 이상, 6~9초**, 해당 언어 립싱크 음성
- 공통 동작 프롬프트: `character looks away, then back at the camera and confesses, guilty and embarrassed, subtle head and shoulder movement, blinking, natural lip sync, static camera, same face and outfit as the reference`

| 범인 | 목소리 톤 | English | 한국어 |
|---|---|---|---|
| 미아 Mia | 억울하다가 체념, 살짝 웃음 | Fine. I skipped lunch, and it was just sitting there. I only meant to take a corner… then there was no corner left. | 네, 알았어요. 점심도 걸렀는데 그냥 거기 있었어요. 귀퉁이만 먹으려고 했는데… 귀퉁이가 안 남았어요. |
| 핀 Finn | 낮고 부끄러움 | Rent went up and I was forty short. I figured nobody counts a jar of coins. I'll bring it all back tomorrow. | 월세가 올랐는데 4만 원이 모자랐어요. 동전 통은 아무도 안 셀 줄 알았어요. 내일 다 돌려놓을게요. |
| 솔 Sol | 울먹이는 아이 목소리 | I came in with wet shoes and slipped. It just fell! I thought you'd be madder about the shoes… | 젖은 신발로 들어오다가 미끄러졌어. 그냥 떨어진 거야! 신발 때문에 더 혼날 줄 알았단 말이야… |
| 이라 Ira | 차갑다가 무너짐 | Fine. I'm three months behind on rent, and my client bailed. It was going on a resale site tonight. | 알았어요. 월세 석 달 밀렸는데 클라이언트가 날랐어요. 오늘 밤 중고로 팔 생각이었어요. |
| 오웬 Owen | 다급하고 지친 | My battery died mid-shift, and a cancelled order kills my rating. The bike was right there. I know. I know. | 배달 중에 배터리가 죽었고, 취소하면 평점이 날아가요. 자전거가 바로 거기 있었어요. 알아요. 알아요. |

---

## 6. 파일 이름 규칙

PNG(또는 JPG), MP4 원본 그대로 주세요. 크기·압축은 Claude가 맞춥니다.

```
portraits/<사건>-<id>-<표정>.png     예) portraits/cake-mia-calm.png
                                         portraits/cake-mia-confess.png
scenes/<사건>.png                   예) scenes/vase.png
video/<사건>-<언어>.mp4             예) video/bike-ko.mp4, video/bike-en.mp4
```

사건 id: `cake` `window` `vase` `clock` `bike` · 언어: `en` `ko`

**전체 목록 (52개)**
- 초상화 37: 16명 × calm·nervous + mia·finn·sol·ira·owen × confess
- 장면 5: cake·window·vase·clock·bike
- 영상 10: 위 5개 사건 × en·ko

일부만 먼저 줘도 됩니다. 들어온 것부터 게임에 넣고, 없는 캐릭터는 기존 얼굴 아이콘이 그대로 나옵니다.
**추천 시작**: 사건 1(케이크) 3명의 calm 3장 → 그림체 확인 후 나머지 진행.
