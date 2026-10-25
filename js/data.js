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
  heal: '#5affb4', chest: '#ffe27a', magnet: '#7ef0ff', elite: '#ffe27a', hazard: '#ff3366', evo: '#ff8af0'
};

/* --------------------------------------------------------------------------
   Ships
   -------------------------------------------------------------------------- */
const SHIPS = [
  { id: 'scout', name: L('정찰기 별똥', 'Scout Meteor'), role: L('균형형', 'Balanced'), color: '#7ef0ff', hp: 100, speed: 215, cost: 0,
    start: { blaster: 1 }, mods: {},
    desc: L('모든 능력이 고른 기본 기체. 펄스 블래스터로 시작한다.', 'A well-rounded starter ship. Launches with the Pulse Blaster.') },
  { id: 'lancer', name: L('요격기 창살', 'Interceptor Lance'), role: L('기동·관통', 'Speed · Pierce'), color: '#ffd27a', hp: 80, speed: 245, cost: 450,
    start: { rail: 1 }, mods: { crit: .06 },
    desc: L('빠르지만 장갑이 얇다. 일직선의 적을 모두 꿰뚫는 레일건으로 시작. 치명타 +6%.', 'Fast but thinly armored. Starts with a Railgun that pierces every enemy in a line. Crit +6%.') },
  { id: 'bastion', name: L('방벽함 바위', 'Bulwark Boulder'), role: L('탱커', 'Tank'), color: '#5affb4', hp: 150, speed: 188, cost: 650,
    start: { blaster: 1, orbit: 1, shield: 1 }, mods: { dmg: -.1, armor: 1 },
    desc: L('느리지만 단단하다. 궤도 칼날과 반응 보호막을 달고 출격. 받는 피해 -1, 공격력 -10%.', 'Slow but sturdy. Launches with Orbit Blades and a Reactive Shield. Damage taken -1, damage -10%.') },
  { id: 'resonator', name: L('공명기 메아리', 'Resonator Echo'), role: L('범위', 'Area'), color: '#c8a0ff', hp: 90, speed: 212, cost: 900,
    start: { chain: 1 }, mods: { area: .2 },
    desc: L('무리를 한꺼번에 지우는 기체. 연쇄 번개로 시작하고 모든 범위 +20%.', 'Wipes out whole swarms. Starts with Chain Lightning, all area +20%.') },
  { id: 'warden', name: L('지휘함 등대', 'Command Beacon'), role: L('성장', 'Growth'), color: '#ff9ccf', hp: 100, speed: 205, cost: 1400,
    start: { wing: 1 }, mods: { xp: .15 },
    desc: L('윙맨 드론 둘을 거느린다. 경험치 획득 +15%로 빠르게 성장한다.', 'Leads two wingman drones. XP gain +15% for fast growth.') }
];

/* --------------------------------------------------------------------------
   Weapons — level-indexed numbers are computed in game.js from these helpers
   -------------------------------------------------------------------------- */
const WEAPONS = {
  blaster: { name: L('펄스 블래스터', 'Pulse Blaster'), max: 1, desc: () => L('가장 가까운 적에게 자동으로 연사한다. 분산 발사·관통탄·연사 가속으로 강화된다.', 'Auto-fires at the nearest enemy. Improved by Spread Shot, Piercing Rounds and Rapid Fire.') },
  orbit:   { name: L('궤도 칼날', 'Orbit Blades'), max: 5, desc: l => l === 1 ? L('기체 주위를 도는 칼날 2개. 닿는 적을 계속 벤다.', 'Two blades circle your ship, slicing anything they touch.') : L(`칼날 ${l + 1}개, 피해 +4, 회전 반경 확대.`, `${l + 1} blades, damage +4, wider orbit.`) },
  chain:   { name: L('연쇄 번개', 'Chain Lightning'), max: 5, desc: l => l === 1 ? L('번개가 적 3마리를 연달아 감전시킨다.', 'Lightning arcs through 3 enemies in a row.') : L(`연쇄 ${l + 2}마리, 피해 +8, 재사용 시간 단축.`, `Chains ${l + 2} enemies, damage +8, shorter cooldown.`) },
  nova:    { name: L('충격파', 'Shockwave'), max: 5, desc: l => l === 1 ? L('주변 전체에 충격파를 터뜨려 피해를 주고 밀어낸다.', 'Bursts a shockwave around you that damages and knocks back.') : L('반경 확대, 피해 +12, 재사용 시간 단축.', 'Larger radius, damage +12, shorter cooldown.') },
  missile: { name: L('추적 미사일', 'Homing Missiles'), max: 5, desc: l => l === 1 ? L('적을 쫓아가 폭발하는 미사일. 범위 피해.', 'Missiles chase enemies and explode for area damage.') : L(`한 번에 ${1 + Math.floor(l / 2)}발, 피해 +10, 재사용 시간 단축.`, `${1 + Math.floor(l / 2)} per volley, damage +10, shorter cooldown.`) },
  shield:  { name: L('반응 보호막', 'Reactive Shield'), max: 4, desc: l => l === 1 ? L('피격 1회를 막고 깨질 때 주변을 밀어낸다. 13초마다 재생.', 'Blocks one hit and knocks enemies back when it breaks. Recharges every 13s.') : L(`재생 시간 ${13 - l * 2}초.`, `Recharges in ${13 - l * 2}s.`) },
  rail:    { name: L('레일건', 'Railgun'), max: 5, desc: l => l === 1 ? L('일직선상의 적을 모두 꿰뚫는 고에너지 빔.', 'A high-energy beam that pierces every enemy in a line.') : L(`피해 +14, 재사용 시간 단축${l >= 4 ? ', 빔 2줄' : ''}.`, `Damage +14, shorter cooldown${l >= 4 ? ', 2 beams' : ''}.`) },
  mines:   { name: L('지뢰 살포기', 'Mine Layer'), max: 5, desc: l => l === 1 ? L('지나간 자리에 지뢰를 깐다. 적이 밟으면 폭발.', 'Drops mines along your path. They explode when enemies step on them.') : L(`동시 지뢰 ${6 + l * 2}개, 피해 +15, 폭발 범위 확대.`, `Up to ${6 + l * 2} mines, damage +15, bigger blasts.`) },
  sing:    { name: L('특이점', 'Singularity'), max: 5, desc: l => l === 1 ? L('적 무리 한가운데 작은 블랙홀을 만들어 빨아들이고 갉아먹는다.', 'Opens a small black hole in the swarm that pulls enemies in and grinds them down.') : L('지속 시간·반경·피해 증가, 재사용 시간 단축.', 'Longer duration, larger radius, more damage, shorter cooldown.') },
  wing:    { name: L('윙맨 드론', 'Wingman Drones'), max: 5, desc: l => l === 1 ? L('기체를 따라다니며 사격하는 드론 2기.', 'Two drones follow you and open fire.') : L(`드론 ${[0, 2, 2, 3, 3, 4][l]}기, 피해 +3, 연사 속도 증가.`, `${[0, 2, 2, 3, 3, 4][l]} drones, damage +3, faster fire.`) },
  laser:   { name: L('회전 레이저', 'Sweeping Laser'), max: 5, desc: l => l === 1 ? L('기체 주위를 쓸고 도는 레이저 빔 1줄.', 'One laser beam sweeps around your ship.') : L(`빔 ${[0, 1, 1, 2, 2, 3][l]}줄, 길이 확대, 피해 +3.`, `${[0, 1, 1, 2, 2, 3][l]} beams, longer reach, damage +3.`) },
  disc:    { name: L('회귀 원반', 'Boomerang Disc'), max: 5, desc: l => l === 1 ? L('날아갔다 돌아오는 원반. 오가는 길의 적을 모두 벤다.', 'A disc that flies out and returns, cutting everything in its path both ways.') : L(`원반 ${1 + Math.floor(l / 3)}개, 피해 +7, 재사용 시간 단축.`, `${1 + Math.floor(l / 3)} discs, damage +7, shorter cooldown.`) }
};
const MAX_WEAPONS = 6;

/* passives: apply(level) mutates S (run stats) / P (player) */
const PASSIVES = [
  { id: 'multi',  needs: 'blaster', cat: 'weapon', name: L('분산 발사', 'Spread Shot'), max: 4, w: 1,   desc: l => L(`블래스터가 한 번에 ${l + 1}발을 부채꼴로 쏜다.`, `Blaster fires ${l + 1} shots in a fan.`), apply: () => { S.proj++; } },
  { id: 'pierce', needs: 'blaster', cat: 'weapon', name: L('관통탄', 'Piercing Rounds'), max: 3, w: .9,   desc: l => L(`블래스터 탄이 적 ${l}마리를 더 뚫고 지나간다.`, `Blaster shots pierce ${l} more enemies.`), apply: () => { S.pierce++; } },
  { id: 'rate',   needs: 'blaster', cat: 'power', name: L('연사 가속', 'Rapid Fire'), max: 6, w: 1,   desc: () => L('블래스터 발사 속도 +18%.', 'Blaster fire rate +18%.'), apply: () => { S.rate += .18; } },
  { id: 'dmg',    cat: 'power', name: L('과충전 코어', 'Overcharged Core'), max: 8, w: 1.2, desc: () => L('모든 무기 피해 +20%.', 'All weapon damage +20%.'), apply: () => { S.dmg += .2; } },
  { id: 'crit',   cat: 'power', name: L('치명 조준', 'Critical Sight'), max: 5, w: .8, desc: () => L('치명타 확률 +8%. 치명타는 2배 피해.', 'Crit chance +8%. Crits deal double damage.'), apply: () => { S.crit += .08; } },
  { id: 'area',   cat: 'power', name: L('증폭 렌즈', 'Amplifier Lens'), max: 5, w: .8, desc: () => L('칼날·번개·충격파·폭발·빔 범위 +12%.', 'Area of blades, lightning, shockwaves, explosions and beams +12%.'), apply: () => { S.area += .12; } },
  { id: 'cool',   cat: 'power', name: L('냉각 순환기', 'Coolant Loop'), max: 4, w: .8, desc: () => L('블래스터를 뺀 모든 무기 재사용 시간 -8%.', 'Cooldown of every weapon except the Blaster -8%.'), apply: () => { S.cool -= .08; } },
  { id: 'dur',    cat: 'power', name: L('지속 장치', 'Duration Module'), max: 3, w: .6, desc: () => L('특이점·지뢰·레이저 지속 효과 +20%.', 'Singularity, mine and laser duration +20%.'), apply: () => { S.dur += .2; } },
  { id: 'speed',  cat: 'hull', name: L('추진기 개조', 'Thruster Tuning'), max: 5, w: .9, desc: () => L('이동 속도 +9%.', 'Move speed +9%.'), apply: () => { S.speed *= 1.09; } },
  { id: 'hp',     cat: 'hull', name: L('장갑 증설', 'Extra Plating'), max: 6, w: .9, desc: () => L('최대 내구도 +25, 즉시 25 회복.', 'Max hull +25 and repair 25 now.'), apply: () => { P.maxHp += 25; P.hp = Math.min(P.maxHp, P.hp + 25); } },
  { id: 'armor',  cat: 'hull', name: L('복합 장갑판', 'Composite Armor'), max: 3, w: .6, desc: () => L('받는 피해 -2 (최소 1).', 'Damage taken -2 (minimum 1).'), apply: () => { S.armor += 2; } },
  { id: 'regen',  cat: 'hull', name: L('나노 수리', 'Nano Repair'), max: 4, w: .8, desc: () => L('초당 내구도 0.5 자동 회복.', 'Repairs 0.5 hull per second.'), apply: () => { S.regen += .5; } },
  { id: 'magnet', cat: 'hull', name: L('중력 수집기', 'Gravity Collector'), max: 4, w: .8, desc: () => L('경험치 결정 흡수 범위 +40%.', 'XP crystal pickup range +40%.'), apply: () => { S.magnet *= 1.4; } },
  { id: 'growth', cat: 'hull', name: L('학습 회로', 'Learning Circuit'), max: 3, w: .6, desc: () => L('경험치 획득 +12%.', 'XP gain +12%.'), apply: () => { S.xp += .12; } }
];
const FILLERS = [
  { id: 'patch',  cat: 'hull',  name: L('응급 수리', 'Emergency Repair'), max: 99, desc: () => L('내구도를 최대치의 40%만큼 회복.', 'Repair 40% of max hull.'), apply: () => { P.hp = Math.min(P.maxHp, P.hp + P.maxHp * .4); } },
  { id: 'bounty', cat: 'power', name: L('현상금', 'Bounty'), max: 99, desc: () => L('점수 +2,000, 별가루 +15.', 'Score +2,000, stardust +15.'), apply: () => { G.score += 2000; G.bonusDust += 15; } }
];
const CAT = { weapon: [L('무기', 'WEAPON'), '#7ef0ff'], power: [L('강화', 'POWER'), '#ffc24a'], hull: [L('생존', 'HULL'), '#5affb4'], evo: [L('진화', 'EVOLVE'), '#ff8af0'] };

/* --------------------------------------------------------------------------
   Weapon evolutions — a maxed weapon plus its paired passive turns the next
   treasure chest into an evolution. Numbers are applied in game.js.
   -------------------------------------------------------------------------- */
const EVOLUTIONS = [
  { id: 'galaxy',  weapon: 'orbit',   needs: 'area',  name: L('은하 고리', 'Galaxy Ring'),
    desc: L('칼날 7개가 더 넓게 돈다. 칼날이 커지고 피해 +35%, 같은 적을 더 자주 벤다.', '7 bigger blades circle wider. Damage +35% and they hit the same enemy more often.') },
  { id: 'judge',   weapon: 'chain',   needs: 'crit',  name: L('뇌신의 심판', 'Thunder Judgement'),
    desc: L('번개가 두 갈래로 갈라져 각각 11마리까지 튄다. 피해 +30%, 재사용 시간 -25%.', 'Lightning forks into two bolts, each chaining up to 11 enemies. Damage +30%, cooldown -25%.') },
  { id: 'meteor',  weapon: 'missile', needs: 'cool',  name: L('유성우', 'Meteor Shower'),
    desc: L('사방으로 미사일 6발을 쏟아낸다. 폭발 범위 +50%, 재사용 시간 -30%.', 'Unleashes 6 missiles in every direction. Blast area +50%, cooldown -30%.') },
  { id: 'stellar', weapon: 'rail',    needs: 'dmg',   name: L('항성 관통포', 'Stellar Lance'),
    desc: L('부채꼴로 빔 5줄을 쏜다. 빔이 굵어지고 피해 +20%, 재사용 시간 -15%.', 'Fires a fan of 5 thicker beams. Damage +20%, cooldown -15%.') },
  { id: 'collapse', weapon: 'sing',   needs: 'dur',   name: L('붕괴 항성', 'Collapsing Star'),
    desc: L('블랙홀을 두 곳에 연다. 반경 +40%, 피해 +50%, 끌어당기는 힘 강화, 재사용 시간 -20%.', 'Opens two black holes. Radius +40%, damage +50%, stronger pull, cooldown -20%.') },
  { id: 'warp',    weapon: 'disc',    needs: 'speed', name: L('초공간 원반', 'Warp Disc'),
    desc: L('원반 4개를 사방으로 던진다. 사거리 +40%, 피해 +25%, 재사용 시간 -20%.', 'Throws 4 discs in every direction. Range +40%, damage +25%, cooldown -20%.') }
];

/* --------------------------------------------------------------------------
   Enemies
   -------------------------------------------------------------------------- */
const ED = {
  drone:    { name: L('드론', 'Drone'),    hp: 14,  speed: 82,  r: 11, dmg: 8,  xp: 1,  shape: 'diamond', info: L('곧장 달려든다. 가장 흔한 적.', 'Charges straight at you. The most common enemy.') },
  dasher:   { name: L('대셔', 'Dasher'),    hp: 22,  speed: 64,  r: 12, dmg: 12, xp: 2,  shape: 'tri',     info: L('멈춰서 점선으로 방향을 예고한 뒤 돌진한다.', 'Stops, marks its path with a dotted line, then dashes.') },
  spitter:  { name: L('스피터', 'Spitter'),  hp: 26,  speed: 58,  r: 13, dmg: 8,  xp: 3,  shape: 'hex',     info: L('거리를 두고 탄을 쏜다.', 'Keeps its distance and shoots.') },
  splitter: { name: L('스플리터', 'Splitter'), hp: 46, speed: 52,  r: 17, dmg: 12, xp: 3,  shape: 'ring',    info: L('죽으면 작은 진드기 셋으로 갈라진다.', 'Splits into three small mites when destroyed.') },
  mite:     { name: L('진드기', 'Mite'),  hp: 8,   speed: 120, r: 7,  dmg: 5,  xp: 1,  shape: 'diamond', info: L('작고 빠르다.', 'Small and fast.') },
  brute:    { name: L('브루트', 'Brute'),  hp: 160, speed: 40,  r: 26, dmg: 22, xp: 10, shape: 'square',  kb: .75, info: L('느리고 단단하다. 넉백에 강하다.', 'Slow and tough. Resists knockback.') },
  sniper:   { name: L('저격수', 'Sniper'),  hp: 30,  speed: 60,  r: 12, dmg: 12, xp: 4,  shape: 'needle',  info: L('멀리서 조준선을 그은 뒤 빠른 탄을 쏜다.', 'Draws an aiming line from afar, then fires a fast shot.') },
  bomber:   { name: L('자폭병', 'Bomber'),  hp: 24,  speed: 96,  r: 13, dmg: 34, xp: 3,  shape: 'mine',    info: L('가까이 오면 깜빡이다 폭발한다. 폭발은 다른 적도 휩쓴다.', 'Blinks when close, then explodes. The blast hits other enemies too.') },
  warder:   { name: L('수호자', 'Warder'),  hp: 90,  speed: 46,  r: 18, dmg: 14, xp: 6,  shape: 'cross',   info: L('주변 적이 받는 피해를 절반으로 줄인다. 먼저 잡자.', 'Halves the damage nearby enemies take. Take it out first.') },
  phaser:   { name: L('위상체', 'Phaser'),  hp: 34,  speed: 70,  r: 12, dmg: 10, xp: 4,  shape: 'phase',   info: L('깜빡이는 지점으로 순간이동한다.', 'Teleports to a flashing marker.') },
  brood:    { name: L('산란체', 'Brood'),  hp: 220, speed: 34,  r: 28, dmg: 20, xp: 14, shape: 'blob',    kb: .6, info: L('진드기를 계속 낳는다.', 'Keeps spawning mites.') },
  orbiter:  { name: L('궤도병', 'Orbiter'),  hp: 40,  speed: 120, r: 12, dmg: 10, xp: 5,  shape: 'chevron', info: L('주위를 맴돌며 세 갈래 탄을 쏜다.', 'Circles you and fires three-way shots.') },
  boss:     { name: L('보스', 'Boss'),    hp: 2000, speed: 58, r: 46, dmg: 30, xp: 0,  shape: 'boss',    kb: 1 }
};

/* --------------------------------------------------------------------------
   Bosses — pattern names are implemented in game.js (BOSS_PATTERNS)
   -------------------------------------------------------------------------- */
const BOSSES = {
  hive:    { name: L('하이브 코어', 'Hive Core'),   color: '#ff4fa3', hp: 2000, r: 46, speed: 58, shape: 'boss',    patterns: ['radial', 'spiral', 'fan', 'summon', 'charge'],
             info: L('방사탄·나선탄·조준 부채꼴·소환·돌진을 번갈아 쓴다.', 'Alternates radial bursts, spirals, aimed fans, summons and charges.') },
  twins:   { name: L('쌍둥이 성운', 'Twin Nebula'),   color: '#3dd6ff', hp: 3000, r: 40, speed: 70, shape: 'twin',    patterns: ['crossfire', 'ringwave', 'charge', 'fan'], split: true,
             info: L('체력이 절반이 되면 둘로 갈라진다. 두 개체 모두 쓰러뜨려야 한다.', 'Splits in two at half health. Both halves must fall.') },
  crystal: { name: L('크리스탈 거상', 'Crystal Colossus'), color: '#9fffe0', hp: 4200, r: 54, speed: 36, shape: 'crystal', patterns: ['gapring', 'shardrain', 'stomp', 'gapring'],
             info: L('틈이 있는 고리탄과 떨어지는 파편. 고리의 빈틈으로 빠져나가자.', 'Rings of bullets with a gap, plus falling shards. Slip through the gap.') },
  storm:   { name: L('폭풍의 눈', 'Eye of the Storm'),     color: '#7ea8ff', hp: 5200, r: 50, speed: 44, shape: 'eye',     patterns: ['doublespiral', 'strikes', 'gravity', 'radial'],
             info: L('기체를 끌어당기고 예고된 자리에 번개를 내리꽂는다.', 'Pulls your ship in and strikes marked spots with lightning.') },
  queen:   { name: L('공허의 여왕', 'Void Queen'),   color: '#c23dff', hp: 6800, r: 48, speed: 52, shape: 'queen',   patterns: ['blink', 'voidzones', 'homing', 'summonphase', 'radial'],
             info: L('순간이동하고 바닥에 공허 지대를 만들며 유도탄을 쏜다.', 'Teleports, leaves void zones on the ground and fires homing shots.') },
  engine:  { name: L('종말 기관', 'Doom Engine'),     color: '#ff3355', hp: 9500, r: 58, speed: 30, shape: 'engine',  patterns: ['lasers', 'walls', 'missiles', 'lasers', 'spiral'],
             info: L('회전 레이저와 탄막 벽. 레이저 예고선을 잘 보자.', 'Rotating lasers and bullet walls. Watch the laser warning lines.') }
};

/* --------------------------------------------------------------------------
   Stages
   pool rows: [type, weight, from minute]
   -------------------------------------------------------------------------- */
const STAGES = [
  { id: 1, name: L('잔해 지대', 'Debris Belt'), en: 'DEBRIS BELT', len: 480, hp: 1, rate: 1, dmg: 1, xp: 1,
    neb: ['#5b3bff', '#ff4fa3', '#1fb5ff', '#7a2cff'], grid: '150,130,255',
    bosses: [{ t: 180, id: 'hive' }, { t: 480, id: 'twins', final: true }],
    pool: [['drone', 10, 0], ['dasher', 3, .7], ['spitter', 3, 1.4], ['splitter', 2.5, 2.4], ['bomber', 2, 3.2], ['brute', 1, 4.2]],
    desc: L('부서진 함대의 잔해 사이. 기본기를 익히기 좋은 곳. 8분 뒤 최종 보스.', 'Among the wreckage of a shattered fleet. A good place to learn. Final boss at 8 minutes.') },
  { id: 2, name: L('진홍 성운', 'Crimson Nebula'), en: 'CRIMSON NEBULA', len: 540, hp: 1.25, rate: 1.08, dmg: 1.05, xp: 1.35,
    neb: ['#ff3355', '#ff7a45', '#c23dff', '#5b1b6f'], grid: '255,120,150',
    bosses: [{ t: 180, id: 'crystal' }, { t: 360, id: 'storm' }, { t: 540, id: 'queen', final: true }],
    pool: [['drone', 8, 0], ['dasher', 3, 0], ['spitter', 3, 1], ['sniper', 2, 1.6], ['bomber', 2.5, 1.5], ['warder', 1.5, 2.5], ['phaser', 2.5, 3], ['splitter', 2, 3.5], ['brute', 1.2, 4.5]],
    desc: L('붉은 가스 속에 저격수와 수호자가 숨어 있다. 9분 뒤 최종 보스.', 'Snipers and warders hide in the red gas. Final boss at 9 minutes.') },
  { id: 3, name: L('사건의 지평선', 'Event Horizon'), en: 'EVENT HORIZON', len: 600, hp: 1.9, rate: 1.22, dmg: 1.2, xp: 1.55,
    neb: ['#1fb5ff', '#3dffb0', '#0b1b4a', '#5b3bff'], grid: '110,220,255',
    bosses: [{ t: 180, id: 'storm' }, { t: 360, id: 'queen' }, { t: 600, id: 'engine', final: true }],
    pool: [['drone', 6, 0], ['phaser', 3, 0], ['orbiter', 2.5, .5], ['sniper', 2.5, 1], ['bomber', 2.5, 1.5], ['warder', 2, 2], ['splitter', 2, 2.5], ['brood', 1.2, 3], ['brute', 1.4, 4], ['dasher', 2, 4.5]],
    desc: L('블랙홀 가장자리. 모든 적이 몰려온다. 10분 뒤 종말 기관.', 'The edge of a black hole. Every enemy swarms in. The Doom Engine arrives at 10 minutes.') },
  { id: 4, name: L('무한 공허', 'Endless Void'), en: 'ENDLESS VOID', len: 0, hp: 1.2, rate: 1.1, dmg: 1.1, xp: 1.2, endless: true,
    neb: ['#7a2cff', '#ff4fa3', '#3dffb0', '#1fb5ff', '#ff7a45'], grid: '200,160,255',
    bosses: [],
    pool: [['drone', 8, 0], ['dasher', 3, .5], ['spitter', 3, 1], ['sniper', 2, 2], ['bomber', 2.5, 2], ['splitter', 2, 2.5], ['phaser', 2, 3], ['orbiter', 2, 3.5], ['warder', 1.5, 4], ['brute', 1.2, 5], ['brood', 1, 6]],
    desc: L('끝이 없다. 2분 30초마다 보스가 차례로 강해지며 돌아온다. 얼마나 버틸까.', 'It never ends. Every 2:30 a boss returns, stronger each lap. How long can you last?') }
];

/* --------------------------------------------------------------------------
   Permanent upgrades (hangar)
   -------------------------------------------------------------------------- */
const META = [
  { id: 'atk',    name: L('무장 개량', 'Weapon Upgrade'),     max: 5, base: 60,  per: L('공격력 +8%', 'Damage +8%'),        fx: (S, l) => { S.dmg += .08 * l; } },
  { id: 'hull',   name: L('선체 보강', 'Hull Reinforcement'),     max: 5, base: 60,  per: L('최대 내구도 +15', 'Max hull +15'),   fx: (S, l, P) => { P.maxHp += 15 * l; } },
  { id: 'thrust', name: L('추진 효율', 'Thrust Efficiency'),     max: 5, base: 50,  per: L('이동 속도 +3%', 'Move speed +3%'),     fx: (S, l) => { S.speed *= 1 + .03 * l; } },
  { id: 'reach',  name: L('수집 범위', 'Pickup Range'),     max: 4, base: 40,  per: L('결정 흡수 범위 +12%', 'Crystal pickup range +12%'), fx: (S, l) => { S.magnet *= 1 + .12 * l; } },
  { id: 'learn',  name: L('학습 데이터', 'Training Data'),   max: 5, base: 70,  per: L('경험치 +6%', 'XP +6%'),        fx: (S, l) => { S.xp += .06 * l; } },
  { id: 'focus',  name: L('조준 보정', 'Aim Calibration'),     max: 3, base: 90,  per: L('치명타 +3%', 'Crit +3%'),        fx: (S, l) => { S.crit += .03 * l; } },
  { id: 'reroll', name: L('재설정 권한', 'Reroll Access'),   max: 3, base: 120, per: L('다시 뽑기 +1회', '+1 reroll'),    fx: (S, l, P, G) => { G.rerolls += l; } },
  { id: 'revive', name: L('비상 재가동', 'Emergency Reboot'),   max: 1, base: 700, per: L('격추 시 한 번 50% 내구도로 부활', 'Revive once at 50% hull when shot down'), fx: (S, l, P, G) => { G.revives += l; } },
  { id: 'mining', name: L('채굴 계약', 'Mining Contract'),     max: 5, base: 80,  per: L('별가루 획득 +10%', 'Stardust gain +10%'),  fx: () => {} }
];
const metaCost = (m, l) => Math.round(m.base * Math.pow(1.75, l) / 5) * 5;

/* --------------------------------------------------------------------------
   Achievements — check(ctx) is called with { run, save, ev }
   -------------------------------------------------------------------------- */
const ACH = [
  { id: 'firstboss', name: L('거인 사냥꾼', 'Giant Hunter'), desc: L('보스를 처음으로 격파', 'Defeat your first boss'), reward: 60 },
  { id: 'clear1', name: L('잔해를 넘어', 'Beyond the Debris'), desc: L('잔해 지대 클리어', 'Clear the Debris Belt'), reward: 120 },
  { id: 'clear2', name: L('붉은 안개 속에서', 'Through the Red Mist'), desc: L('진홍 성운 클리어', 'Clear the Crimson Nebula'), reward: 250 },
  { id: 'clear3', name: L('지평선 너머', 'Past the Horizon'), desc: L('사건의 지평선 클리어', 'Clear the Event Horizon'), reward: 500 },
  { id: 'endless10', name: L('공허의 거주자', 'Void Dweller'), desc: L('무한 공허에서 10분 생존', 'Survive 10 minutes in the Endless Void'), reward: 300 },
  { id: 'endless20', name: L('시간을 잊은 자', 'Timeless'), desc: L('무한 공허에서 20분 생존', 'Survive 20 minutes in the Endless Void'), reward: 600 },
  { id: 'kills1000', name: L('천 개의 별', 'A Thousand Stars'), desc: L('한 판에 적 1,000마리 처치', 'Destroy 1,000 enemies in one run'), reward: 100 },
  { id: 'kills3000', name: L('은하 청소부', 'Galactic Sweeper'), desc: L('한 판에 적 3,000마리 처치', 'Destroy 3,000 enemies in one run'), reward: 250 },
  { id: 'lv30', name: L('완전체', 'Fully Evolved'), desc: L('한 판에 레벨 30 달성', 'Reach level 30 in one run'), reward: 120 },
  { id: 'maxweapon', name: L('장인의 손길', "Master's Touch"), desc: L('무기 하나를 최고 레벨까지 강화', 'Upgrade a weapon to max level'), reward: 80 },
  { id: 'sixguns', name: L('전 포문 개방', 'All Guns Blazing'), desc: L('무기 6개를 동시에 장착', 'Equip 6 weapons at once'), reward: 100 },
  { id: 'untouch', name: L('스치지도 마', 'Untouchable'), desc: L('2분 동안 한 번도 맞지 않기', 'Go 2 minutes without taking a hit'), reward: 120 },
  { id: 'combo300', name: L('연쇄 반응', 'Chain Reaction'), desc: L('콤보 300 달성', 'Reach a 300 combo'), reward: 100 },
  { id: 'elites10', name: L('정예 사냥', 'Elite Hunt'), desc: L('한 판에 정예 개체 10마리 처치', 'Destroy 10 elites in one run'), reward: 120 },
  { id: 'clutch', name: L('구사일생', 'Close Call'), desc: L('내구도 15 이하에서 보스 격파', 'Defeat a boss with 15 hull or less'), reward: 150 },
  { id: 'boom10', name: L('아군 오사', 'Friendly Fire'), desc: L('자폭병 폭발로 적 10마리 처치 (누적)', 'Destroy 10 enemies with bomber blasts (total)'), reward: 80 },
  { id: 'warderkill', name: L('방패 깨기', 'Shield Breaker'), desc: L('수호자 50마리 처치 (누적)', 'Destroy 50 warders (total)'), reward: 80 },
  { id: 'allships', name: L('함대 사령관', 'Fleet Commander'), desc: L('기체 5종 모두 해금', 'Unlock all 5 ships'), reward: 300 },
  { id: 'veteran', name: L('베테랑 편대', 'Veteran Squadron'), desc: L('모든 기체로 잔해 지대 클리어', 'Clear the Debris Belt with every ship'), reward: 500 },
  { id: 'nohp', name: L('유리 대포', 'Glass Cannon'), desc: L('장갑 증설 없이 진홍 성운 클리어', 'Clear the Crimson Nebula without Extra Plating'), reward: 300 },
  { id: 'runs20', name: L('귀환 없는 항해', 'No Way Home'), desc: L('20번 출격', 'Launch 20 runs'), reward: 100 },
  { id: 'dust5000', name: L('별가루 부자', 'Stardust Tycoon'), desc: L('별가루 누적 5,000 획득', 'Earn 5,000 stardust in total'), reward: 200 },
  { id: 'maxmeta', name: L('완벽한 정비', 'Perfect Maintenance'), desc: L('모든 영구 강화를 최대로', 'Max out every permanent upgrade'), reward: 1000 },
  { id: 'twinsfast', name: L('번개 같은 이별', 'Lightning Breakup'), desc: L('쌍둥이 성운을 60초 안에 격파', 'Defeat the Twin Nebula within 60 seconds'), reward: 200 }
];
