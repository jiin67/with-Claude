'use strict';
/* ==========================================================================
   별표류 STARDRIFT — game data
   Everything tunable lives here: ships, weapons, passives, enemies, bosses,
   stages, permanent upgrades and achievements.
   ========================================================================== */

const COL = {
  player: '#7ef0ff', pbullet: '#dffcff', blade: '#a8f6ff', bolt: '#c8ecff', missile: '#ffd27a',
  rail: '#e9f7ff', mine: '#ffe27a', sing: '#b98cff', wing: '#ff9ccf', laser: '#7effd4', disc: '#9fffe0',
  drone: '#ff4fa3', dasher: '#ff7a45', spitter: '#b77bff', splitter: '#3dffb0', mite: '#3dffb0', brute: '#ff3355',
  sniper: '#9fb4ff', bomber: '#ffe66b', warder: '#d8d4ff', phaser: '#8a6bff', brood: '#c23dff', orbiter: '#ff6b9a',
  boss: '#ff4fa3', ebullet: '#ff9ccf', xp1: '#ffc24a', xp2: '#ff8d3a', xp3: '#d4ff5a',
  heal: '#5affb4', chest: '#ffe27a', magnet: '#7ef0ff', elite: '#ffe27a', hazard: '#ff3366'
};

/* --------------------------------------------------------------------------
   Ships
   -------------------------------------------------------------------------- */
const SHIPS = [
  { id: 'scout', name: '정찰기 별똥', role: '균형형', color: '#7ef0ff', hp: 100, speed: 215, cost: 0,
    start: { blaster: 1 }, mods: {},
    desc: '모든 능력이 고른 기본 기체. 펄스 블래스터로 시작한다.' },
  { id: 'lancer', name: '요격기 창살', role: '기동·관통', color: '#ffd27a', hp: 80, speed: 245, cost: 450,
    start: { rail: 1 }, mods: { crit: .06 },
    desc: '빠르지만 장갑이 얇다. 일직선의 적을 모두 꿰뚫는 레일건으로 시작. 치명타 +6%.' },
  { id: 'bastion', name: '방벽함 바위', role: '탱커', color: '#5affb4', hp: 150, speed: 188, cost: 650,
    start: { blaster: 1, orbit: 1, shield: 1 }, mods: { dmg: -.1, armor: 1 },
    desc: '느리지만 단단하다. 궤도 칼날과 반응 보호막을 달고 출격. 받는 피해 -1, 공격력 -10%.' },
  { id: 'resonator', name: '공명기 메아리', role: '범위', color: '#c8a0ff', hp: 90, speed: 212, cost: 900,
    start: { chain: 1 }, mods: { area: .2 },
    desc: '무리를 한꺼번에 지우는 기체. 연쇄 번개로 시작하고 모든 범위 +20%.' },
  { id: 'warden', name: '지휘함 등대', role: '성장', color: '#ff9ccf', hp: 100, speed: 205, cost: 1400,
    start: { wing: 1 }, mods: { xp: .15 },
    desc: '윙맨 드론 둘을 거느린다. 경험치 획득 +15%로 빠르게 성장한다.' }
];

/* --------------------------------------------------------------------------
   Weapons — level-indexed numbers are computed in game.js from these helpers
   -------------------------------------------------------------------------- */
const WEAPONS = {
  blaster: { name: '펄스 블래스터', max: 1, desc: () => '가장 가까운 적에게 자동으로 연사한다. 분산 발사·관통탄·연사 가속으로 강화된다.' },
  orbit:   { name: '궤도 칼날', max: 5, desc: l => l === 1 ? '기체 주위를 도는 칼날 2개. 닿는 적을 계속 벤다.' : `칼날 ${l + 1}개, 피해 +4, 회전 반경 확대.` },
  chain:   { name: '연쇄 번개', max: 5, desc: l => l === 1 ? '번개가 적 3마리를 연달아 감전시킨다.' : `연쇄 ${l + 2}마리, 피해 +8, 재사용 시간 단축.` },
  nova:    { name: '충격파', max: 5, desc: l => l === 1 ? '주변 전체에 충격파를 터뜨려 피해를 주고 밀어낸다.' : '반경 확대, 피해 +12, 재사용 시간 단축.' },
  missile: { name: '추적 미사일', max: 5, desc: l => l === 1 ? '적을 쫓아가 폭발하는 미사일. 범위 피해.' : `한 번에 ${1 + Math.floor(l / 2)}발, 피해 +10, 재사용 시간 단축.` },
  shield:  { name: '반응 보호막', max: 4, desc: l => l === 1 ? '피격 1회를 막고 깨질 때 주변을 밀어낸다. 13초마다 재생.' : `재생 시간 ${13 - l * 2}초.` },
  rail:    { name: '레일건', max: 5, desc: l => l === 1 ? '일직선상의 적을 모두 꿰뚫는 고에너지 빔.' : `피해 +14, 재사용 시간 단축${l >= 4 ? ', 빔 2줄' : ''}.` },
  mines:   { name: '지뢰 살포기', max: 5, desc: l => l === 1 ? '지나간 자리에 지뢰를 깐다. 적이 밟으면 폭발.' : `동시 지뢰 ${6 + l * 2}개, 피해 +15, 폭발 범위 확대.` },
  sing:    { name: '특이점', max: 5, desc: l => l === 1 ? '적 무리 한가운데 작은 블랙홀을 만들어 빨아들이고 갉아먹는다.' : '지속 시간·반경·피해 증가, 재사용 시간 단축.' },
  wing:    { name: '윙맨 드론', max: 5, desc: l => l === 1 ? '기체를 따라다니며 사격하는 드론 2기.' : `드론 ${[0, 2, 2, 3, 3, 4][l]}기, 피해 +3, 연사 속도 증가.` },
  laser:   { name: '회전 레이저', max: 5, desc: l => l === 1 ? '기체 주위를 쓸고 도는 레이저 빔 1줄.' : `빔 ${[0, 1, 1, 2, 2, 3][l]}줄, 길이 확대, 피해 +3.` },
  disc:    { name: '회귀 원반', max: 5, desc: l => l === 1 ? '날아갔다 돌아오는 원반. 오가는 길의 적을 모두 벤다.' : `원반 ${1 + Math.floor(l / 3)}개, 피해 +7, 재사용 시간 단축.` }
};
const MAX_WEAPONS = 6;

/* passives: apply(level) mutates S (run stats) / P (player) */
const PASSIVES = [
  { id: 'multi',  needs: 'blaster', cat: 'weapon', name: '분산 발사', max: 4, w: 1,   desc: l => `블래스터가 한 번에 ${l + 1}발을 부채꼴로 쏜다.`, apply: () => { S.proj++; } },
  { id: 'pierce', needs: 'blaster', cat: 'weapon', name: '관통탄', max: 3, w: .9,   desc: l => `블래스터 탄이 적 ${l}마리를 더 뚫고 지나간다.`, apply: () => { S.pierce++; } },
  { id: 'rate',   needs: 'blaster', cat: 'power', name: '연사 가속', max: 6, w: 1,   desc: () => '블래스터 발사 속도 +18%.', apply: () => { S.rate += .18; } },
  { id: 'dmg',    cat: 'power', name: '과충전 코어', max: 8, w: 1.2, desc: () => '모든 무기 피해 +20%.', apply: () => { S.dmg += .2; } },
  { id: 'crit',   cat: 'power', name: '치명 조준', max: 5, w: .8, desc: () => '치명타 확률 +8%. 치명타는 2배 피해.', apply: () => { S.crit += .08; } },
  { id: 'area',   cat: 'power', name: '증폭 렌즈', max: 5, w: .8, desc: () => '칼날·번개·충격파·폭발·빔 범위 +12%.', apply: () => { S.area += .12; } },
  { id: 'cool',   cat: 'power', name: '냉각 순환기', max: 4, w: .8, desc: () => '블래스터를 뺀 모든 무기 재사용 시간 -8%.', apply: () => { S.cool -= .08; } },
  { id: 'dur',    cat: 'power', name: '지속 장치', max: 3, w: .6, desc: () => '특이점·지뢰·레이저 지속 효과 +20%.', apply: () => { S.dur += .2; } },
  { id: 'speed',  cat: 'hull', name: '추진기 개조', max: 5, w: .9, desc: () => '이동 속도 +9%.', apply: () => { S.speed *= 1.09; } },
  { id: 'hp',     cat: 'hull', name: '장갑 증설', max: 6, w: .9, desc: () => '최대 내구도 +25, 즉시 25 회복.', apply: () => { P.maxHp += 25; P.hp = Math.min(P.maxHp, P.hp + 25); } },
  { id: 'armor',  cat: 'hull', name: '복합 장갑판', max: 3, w: .6, desc: () => '받는 피해 -2 (최소 1).', apply: () => { S.armor += 2; } },
  { id: 'regen',  cat: 'hull', name: '나노 수리', max: 4, w: .8, desc: () => '초당 내구도 0.5 자동 회복.', apply: () => { S.regen += .5; } },
  { id: 'magnet', cat: 'hull', name: '중력 수집기', max: 4, w: .8, desc: () => '경험치 결정 흡수 범위 +40%.', apply: () => { S.magnet *= 1.4; } },
  { id: 'growth', cat: 'hull', name: '학습 회로', max: 3, w: .6, desc: () => '경험치 획득 +12%.', apply: () => { S.xp += .12; } }
];
const FILLERS = [
  { id: 'patch',  cat: 'hull',  name: '응급 수리', max: 99, desc: () => '내구도를 최대치의 40%만큼 회복.', apply: () => { P.hp = Math.min(P.maxHp, P.hp + P.maxHp * .4); } },
  { id: 'bounty', cat: 'power', name: '현상금', max: 99, desc: () => '점수 +2,000, 별가루 +15.', apply: () => { G.score += 2000; G.bonusDust += 15; } }
];
const CAT = { weapon: ['무기', '#7ef0ff'], power: ['강화', '#ffc24a'], hull: ['생존', '#5affb4'] };

/* --------------------------------------------------------------------------
   Enemies
   -------------------------------------------------------------------------- */
const ED = {
  drone:    { name: '드론',    hp: 14,  speed: 82,  r: 11, dmg: 8,  xp: 1,  shape: 'diamond', info: '곧장 달려든다. 가장 흔한 적.' },
  dasher:   { name: '대셔',    hp: 22,  speed: 64,  r: 12, dmg: 12, xp: 2,  shape: 'tri',     info: '멈춰서 점선으로 방향을 예고한 뒤 돌진한다.' },
  spitter:  { name: '스피터',  hp: 26,  speed: 58,  r: 13, dmg: 8,  xp: 3,  shape: 'hex',     info: '거리를 두고 탄을 쏜다.' },
  splitter: { name: '스플리터', hp: 46, speed: 52,  r: 17, dmg: 12, xp: 3,  shape: 'ring',    info: '죽으면 작은 진드기 셋으로 갈라진다.' },
  mite:     { name: '진드기',  hp: 8,   speed: 120, r: 7,  dmg: 5,  xp: 1,  shape: 'diamond', info: '작고 빠르다.' },
  brute:    { name: '브루트',  hp: 160, speed: 40,  r: 26, dmg: 22, xp: 10, shape: 'square',  kb: .75, info: '느리고 단단하다. 넉백에 강하다.' },
  sniper:   { name: '저격수',  hp: 30,  speed: 60,  r: 12, dmg: 12, xp: 4,  shape: 'needle',  info: '멀리서 조준선을 그은 뒤 빠른 탄을 쏜다.' },
  bomber:   { name: '자폭병',  hp: 24,  speed: 96,  r: 13, dmg: 34, xp: 3,  shape: 'mine',    info: '가까이 오면 깜빡이다 폭발한다. 폭발은 다른 적도 휩쓴다.' },
  warder:   { name: '수호자',  hp: 90,  speed: 46,  r: 18, dmg: 14, xp: 6,  shape: 'cross',   info: '주변 적이 받는 피해를 절반으로 줄인다. 먼저 잡자.' },
  phaser:   { name: '위상체',  hp: 34,  speed: 70,  r: 12, dmg: 10, xp: 4,  shape: 'phase',   info: '깜빡이는 지점으로 순간이동한다.' },
  brood:    { name: '산란체',  hp: 220, speed: 34,  r: 28, dmg: 20, xp: 14, shape: 'blob',    kb: .6, info: '진드기를 계속 낳는다.' },
  orbiter:  { name: '궤도병',  hp: 40,  speed: 120, r: 12, dmg: 10, xp: 5,  shape: 'chevron', info: '주위를 맴돌며 세 갈래 탄을 쏜다.' },
  boss:     { name: '보스',    hp: 2000, speed: 58, r: 46, dmg: 30, xp: 0,  shape: 'boss',    kb: 1 }
};

/* --------------------------------------------------------------------------
   Bosses — pattern names are implemented in game.js (BOSS_PATTERNS)
   -------------------------------------------------------------------------- */
const BOSSES = {
  hive:    { name: '하이브 코어',   color: '#ff4fa3', hp: 2000, r: 46, speed: 58, shape: 'boss',    patterns: ['radial', 'spiral', 'fan', 'summon', 'charge'],
             info: '방사탄·나선탄·조준 부채꼴·소환·돌진을 번갈아 쓴다.' },
  twins:   { name: '쌍둥이 성운',   color: '#3dd6ff', hp: 3000, r: 40, speed: 70, shape: 'twin',    patterns: ['crossfire', 'ringwave', 'charge', 'fan'], split: true,
             info: '체력이 절반이 되면 둘로 갈라진다. 두 개체 모두 쓰러뜨려야 한다.' },
  crystal: { name: '크리스탈 거상', color: '#9fffe0', hp: 4200, r: 54, speed: 36, shape: 'crystal', patterns: ['gapring', 'shardrain', 'stomp', 'gapring'],
             info: '틈이 있는 고리탄과 떨어지는 파편. 고리의 빈틈으로 빠져나가자.' },
  storm:   { name: '폭풍의 눈',     color: '#7ea8ff', hp: 5200, r: 50, speed: 44, shape: 'eye',     patterns: ['doublespiral', 'strikes', 'gravity', 'radial'],
             info: '기체를 끌어당기고 예고된 자리에 번개를 내리꽂는다.' },
  queen:   { name: '공허의 여왕',   color: '#c23dff', hp: 6800, r: 48, speed: 52, shape: 'queen',   patterns: ['blink', 'voidzones', 'homing', 'summonphase', 'radial'],
             info: '순간이동하고 바닥에 공허 지대를 만들며 유도탄을 쏜다.' },
  engine:  { name: '종말 기관',     color: '#ff3355', hp: 9500, r: 58, speed: 30, shape: 'engine',  patterns: ['lasers', 'walls', 'missiles', 'lasers', 'spiral'],
             info: '회전 레이저와 탄막 벽. 레이저 예고선을 잘 보자.' }
};

/* --------------------------------------------------------------------------
   Stages
   pool rows: [type, weight, from minute]
   -------------------------------------------------------------------------- */
const STAGES = [
  { id: 1, name: '잔해 지대', en: 'DEBRIS BELT', len: 480, hp: 1, rate: 1, dmg: 1, xp: 1,
    neb: ['#5b3bff', '#ff4fa3', '#1fb5ff', '#7a2cff'], grid: '150,130,255',
    bosses: [{ t: 180, id: 'hive' }, { t: 480, id: 'twins', final: true }],
    pool: [['drone', 10, 0], ['dasher', 3, .7], ['spitter', 3, 1.4], ['splitter', 2.5, 2.4], ['bomber', 2, 3.2], ['brute', 1, 4.2]],
    desc: '부서진 함대의 잔해 사이. 기본기를 익히기 좋은 곳. 8분 뒤 최종 보스.' },
  { id: 2, name: '진홍 성운', en: 'CRIMSON NEBULA', len: 540, hp: 1.25, rate: 1.08, dmg: 1.05, xp: 1.35,
    neb: ['#ff3355', '#ff7a45', '#c23dff', '#5b1b6f'], grid: '255,120,150',
    bosses: [{ t: 180, id: 'crystal' }, { t: 360, id: 'storm' }, { t: 540, id: 'queen', final: true }],
    pool: [['drone', 8, 0], ['dasher', 3, 0], ['spitter', 3, 1], ['sniper', 2, 1.6], ['bomber', 2.5, 1.5], ['warder', 1.5, 2.5], ['phaser', 2.5, 3], ['splitter', 2, 3.5], ['brute', 1.2, 4.5]],
    desc: '붉은 가스 속에 저격수와 수호자가 숨어 있다. 9분 뒤 최종 보스.' },
  { id: 3, name: '사건의 지평선', en: 'EVENT HORIZON', len: 600, hp: 1.9, rate: 1.22, dmg: 1.2, xp: 1.55,
    neb: ['#1fb5ff', '#3dffb0', '#0b1b4a', '#5b3bff'], grid: '110,220,255',
    bosses: [{ t: 180, id: 'storm' }, { t: 360, id: 'queen' }, { t: 600, id: 'engine', final: true }],
    pool: [['drone', 6, 0], ['phaser', 3, 0], ['orbiter', 2.5, .5], ['sniper', 2.5, 1], ['bomber', 2.5, 1.5], ['warder', 2, 2], ['splitter', 2, 2.5], ['brood', 1.2, 3], ['brute', 1.4, 4], ['dasher', 2, 4.5]],
    desc: '블랙홀 가장자리. 모든 적이 몰려온다. 10분 뒤 종말 기관.' },
  { id: 4, name: '무한 공허', en: 'ENDLESS VOID', len: 0, hp: 1.2, rate: 1.1, dmg: 1.1, xp: 1.2, endless: true,
    neb: ['#7a2cff', '#ff4fa3', '#3dffb0', '#1fb5ff', '#ff7a45'], grid: '200,160,255',
    bosses: [],
    pool: [['drone', 8, 0], ['dasher', 3, .5], ['spitter', 3, 1], ['sniper', 2, 2], ['bomber', 2.5, 2], ['splitter', 2, 2.5], ['phaser', 2, 3], ['orbiter', 2, 3.5], ['warder', 1.5, 4], ['brute', 1.2, 5], ['brood', 1, 6]],
    desc: '끝이 없다. 2분 30초마다 보스가 차례로 강해지며 돌아온다. 얼마나 버틸까.' }
];

/* --------------------------------------------------------------------------
   Permanent upgrades (hangar)
   -------------------------------------------------------------------------- */
const META = [
  { id: 'atk',    name: '무장 개량',     max: 5, base: 60,  per: '공격력 +8%',        fx: (S, l) => { S.dmg += .08 * l; } },
  { id: 'hull',   name: '선체 보강',     max: 5, base: 60,  per: '최대 내구도 +15',   fx: (S, l, P) => { P.maxHp += 15 * l; } },
  { id: 'thrust', name: '추진 효율',     max: 5, base: 50,  per: '이동 속도 +3%',     fx: (S, l) => { S.speed *= 1 + .03 * l; } },
  { id: 'reach',  name: '수집 범위',     max: 4, base: 40,  per: '결정 흡수 범위 +12%', fx: (S, l) => { S.magnet *= 1 + .12 * l; } },
  { id: 'learn',  name: '학습 데이터',   max: 5, base: 70,  per: '경험치 +6%',        fx: (S, l) => { S.xp += .06 * l; } },
  { id: 'focus',  name: '조준 보정',     max: 3, base: 90,  per: '치명타 +3%',        fx: (S, l) => { S.crit += .03 * l; } },
  { id: 'reroll', name: '재설정 권한',   max: 3, base: 120, per: '다시 뽑기 +1회',    fx: (S, l, P, G) => { G.rerolls += l; } },
  { id: 'revive', name: '비상 재가동',   max: 1, base: 700, per: '격추 시 한 번 50% 내구도로 부활', fx: (S, l, P, G) => { G.revives += l; } },
  { id: 'mining', name: '채굴 계약',     max: 5, base: 80,  per: '별가루 획득 +10%',  fx: () => {} }
];
const metaCost = (m, l) => Math.round(m.base * Math.pow(1.75, l) / 5) * 5;

/* --------------------------------------------------------------------------
   Achievements — check(ctx) is called with { run, save, ev }
   -------------------------------------------------------------------------- */
const ACH = [
  { id: 'firstboss', name: '거인 사냥꾼', desc: '보스를 처음으로 격파', reward: 60 },
  { id: 'clear1', name: '잔해를 넘어', desc: '잔해 지대 클리어', reward: 120 },
  { id: 'clear2', name: '붉은 안개 속에서', desc: '진홍 성운 클리어', reward: 250 },
  { id: 'clear3', name: '지평선 너머', desc: '사건의 지평선 클리어', reward: 500 },
  { id: 'endless10', name: '공허의 거주자', desc: '무한 공허에서 10분 생존', reward: 300 },
  { id: 'endless20', name: '시간을 잊은 자', desc: '무한 공허에서 20분 생존', reward: 600 },
  { id: 'kills1000', name: '천 개의 별', desc: '한 판에 적 1,000마리 처치', reward: 100 },
  { id: 'kills3000', name: '은하 청소부', desc: '한 판에 적 3,000마리 처치', reward: 250 },
  { id: 'lv30', name: '완전체', desc: '한 판에 레벨 30 달성', reward: 120 },
  { id: 'maxweapon', name: '장인의 손길', desc: '무기 하나를 최고 레벨까지 강화', reward: 80 },
  { id: 'sixguns', name: '전 포문 개방', desc: '무기 6개를 동시에 장착', reward: 100 },
  { id: 'untouch', name: '스치지도 마', desc: '2분 동안 한 번도 맞지 않기', reward: 120 },
  { id: 'combo300', name: '연쇄 반응', desc: '콤보 300 달성', reward: 100 },
  { id: 'elites10', name: '정예 사냥', desc: '한 판에 정예 개체 10마리 처치', reward: 120 },
  { id: 'clutch', name: '구사일생', desc: '내구도 15 이하에서 보스 격파', reward: 150 },
  { id: 'boom10', name: '아군 오사', desc: '자폭병 폭발로 적 10마리 처치 (누적)', reward: 80 },
  { id: 'warderkill', name: '방패 깨기', desc: '수호자 50마리 처치 (누적)', reward: 80 },
  { id: 'allships', name: '함대 사령관', desc: '기체 5종 모두 해금', reward: 300 },
  { id: 'veteran', name: '베테랑 편대', desc: '모든 기체로 잔해 지대 클리어', reward: 500 },
  { id: 'nohp', name: '유리 대포', desc: '장갑 증설 없이 진홍 성운 클리어', reward: 300 },
  { id: 'runs20', name: '귀환 없는 항해', desc: '20번 출격', reward: 100 },
  { id: 'dust5000', name: '별가루 부자', desc: '별가루 누적 5,000 획득', reward: 200 },
  { id: 'maxmeta', name: '완벽한 정비', desc: '모든 영구 강화를 최대로', reward: 1000 },
  { id: 'twinsfast', name: '번개 같은 이별', desc: '쌍둥이 성운을 60초 안에 격파', reward: 200 }
];
