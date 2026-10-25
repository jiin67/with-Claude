'use strict';
/* ==========================================================================
   Language: Korean (original) and English.
   Game data in data.js is written in Korean; when the language is English
   this file overwrites its names and descriptions before game.js reads them.
   UI strings go through tr(key, ...args).
   ========================================================================== */
const LANG_KEY = 'stardrift.lang';
const LANG = (() => {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ko' || q === 'en') return q;
    const s = localStorage.getItem(LANG_KEY);
    if (s === 'ko' || s === 'en') return s;
  } catch (e) {}
  return /^ko\b/i.test(navigator.language || '') ? 'ko' : 'en';
})();
document.documentElement.lang = LANG;

function setLang(l) {
  try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
  const u = new URL(location.href); u.searchParams.delete('lang');
  location.replace(u.href);
}

const STR = {
  ko: {
    evoTitle: '무기가 진화합니다', chestTitle: '보물 상자', evoOf: w => w + ' 진화', evoHead: '무기 진화',
    evoRecipe: (w, p) => w + ' 최대 + ' + p, evoUnseen: '보물 상자에서 진화시키면 기록된다.', evoPrefix: n => '진화 ' + n + ' · ',
    evoNext: '다음 보물 상자에서 진화', evoNeedPassive: p => p + '을(를) 얻으면 보물 상자에서 진화',
    evoMaxed: w => w + ' 최대 레벨, 다음 보물 상자에서 진화', evoNeedWeapon: w => w + '을(를) 최대 레벨로 올리면 보물 상자에서 진화',
    /* static page (index.html) */
    title: '별표류 STARDRIFT', logo: '별표류', logoSub: 'STARDRIFT', canvas: '게임 화면', kills: '처치', mute: '소리 켜고 끄기', pause: '일시정지',
    lede: '항로를 잃은 편대. 무리는 끝없이 몰려온다. 무기는 알아서 쏜다. 너는 <em>피하고, 모으고, 고르기만</em> 하면 된다. 별가루를 모아 기체를 늘리고, 사건의 지평선 너머까지 가 보자.',
    play: '출격 준비', hangar: '격납고', records: '기록실', settings: '설정',
    ctlMove: '이동', ctlDrag: '화면 드래그', ctlDragDo: '터치·마우스 이동', ctlPick: '강화 선택', ctlPause: '일시정지',
    prep: '출격 준비', route: '항로', ship: '기체', launch: '출격', back: '뒤로',
    tabMeta: '영구 강화', tabShips: '기체', tabAch: '업적', tabCodex: '도감', tabStats: '통계',
    optSound: '효과음과 음악', optShake: '화면 흔들림', optTips: '다음 출격 때 튜토리얼 다시 보기', optLang: '언어 / Language',
    resetWarn: '저장된 별가루, 해금, 업적, 기록을 모두 지웁니다. 되돌릴 수 없습니다.', reset: '데이터 초기화', resetConfirm: '정말 지우기',
    pickTitle: '강화를 고르세요', luHint: '카드를 누르거나 숫자 키를 누르세요. 무기는 최대 6개까지 달 수 있습니다.',
    resume: '계속', quit: '출격 포기', quitConfirm: '포기하고 귀환',
    again: '다시 출격', toPrep: '출격 준비로', toHangar: '격납고',
    reviveTitle: '격추 직전', reviveSub: '짧은 광고를 보면 내구도 50%로 그 자리에서 다시 싸울 수 있습니다. 한 판에 한 번.',
    reviveAd: '광고 보고 부활', reviveNo: '결과 보기',
    /* runtime */
    achGot: '업적 달성', dust: '별가루',
    lockStage: name => name + ' 클리어 시 열림',
    best: '최고 ', noRecord: '기록 없음', locked: '잠김', cleared: '클리어',
    hp: '내구도', speed: '속도',
    shipLocked: (n, c) => `${n}은(는) 격납고에서 별가루 ${c}로 해금할 수 있습니다.`,
    perLevel: ' (단계마다)', upgrade: '강화', maxed: '최대 단계', owned: '보유 중', unlock: '해금',
    achCount: (d, n) => `업적 ${d} / ${n}`, done: '달성 · ',
    enemies: '적', bosses: '보스', unseen: '아직 만나지 못했다.',
    stRuns: '출격', stKills: '총 처치', stBosses: '보스 격파', stClears: '클리어', stTime: '총 비행 시간',
    stLevel: '최고 레벨', stDust: '누적 별가루', stDeaths: '격추',
    endureAll: '끝까지 버텨라', beatFinal: '최종 보스를 쓰러뜨리면 클리어',
    pKills: '처치', pTime: '생존', pBoss: '보스', pClear: '클리어', pBounty: '현상금',
    unlockNote: (name, endless) => name + (endless ? ' · 무한 공허' : '') + ' 항로가 열렸습니다.',
    overWin: '스테이지 클리어', overQuit: '귀환', overLose: '격추됨', endlessName: '무한 공허',
    subWin: '항로를 돌파했다. 별가루로 기체를 정비하자.', subQuit: '작전을 중단했다. 별가루는 절반만 회수된다.',
    subBoss: (n, info) => n + '에게 당했다. ' + info,
    subEarly: '초반이 가장 어렵다. 결정을 모으며 계속 움직이자.', subMeta: '격납고의 영구 강화로 기체를 튼튼하게 만들어 다시 도전하자.',
    rTime: '생존 시간', rLevel: '레벨', rKills: '처치', rScore: '점수',
    mining: m => `채굴 계약 ×${m}`, quitHalf: '중단 ×0.5', achPrefix: '업적 ',
    doubleAd: '광고 보고 별가루 2배', doubled: '별가루 2배 지급됨', adFail: '광고를 불러오지 못했습니다',
    picksLeft: n => '  ·  선택 ' + n + '회 남음', slots: (n, m) => `무기 ${n} / ${m}`,
    instant: '즉시 효과', newWeapon: '새 무기', newUp: '새 강화', reroll: n => '다시 뽑기 (' + n + '회)',
    subCleared: '항로 돌파', subNext: '다음 보스까지 ', subFinal: '최종 보스까지 ', subBossIn: '보스까지 ', subFight: '보스를 쓰러뜨려라', rage: '광폭',
    tut1: '<b>WASD</b>·방향키, 또는 화면을 <b>드래그</b>해서 움직이세요',
    tut2: '무기는 자동으로 쏩니다. 적이 남긴 <b>금색 결정</b>을 모으세요',
    tut4: '시간이 되면 <b>보스</b>가 옵니다. 화면 가장자리 화살표가 위치를 알려줘요.<br>정해진 시간에 오는 <b>최종 보스</b>를 쓰러뜨리면 클리어!',
    resetT: '초기화', resetB: '저장 데이터를 지웠습니다', resetS: '처음부터 시작합니다',
    bSwarm: '포위망 접근', bSwarmS: '모든 방향에서', bFinal: '최종 보스', bWarn: '경고: 거대 개체', bNear: n => n + ' 접근 중',
    bRage: '광폭화', bRageS: n => n + '의 공격이 빨라진다', bSplit: '분열', bSplitS: '둘 다 쓰러뜨려야 한다',
    bOneLeft: '하나 남았다', bDown: '격파', bClear: '스테이지 클리어', bRevive: '비상 재가동', bReviveS: '한 번 더 싸울 수 있다',
    adPlaying: '광고 재생 중…', support: '개발자 후원하기'
  },
  en: {
    evoTitle: 'Weapon Evolution', chestTitle: 'Treasure Chest', evoOf: w => 'Evolves ' + w, evoHead: 'Weapon Evolutions',
    evoRecipe: (w, p) => w + ' (max) + ' + p, evoUnseen: 'Recorded once you evolve it from a treasure chest.', evoPrefix: n => 'Evolves into ' + n + ' · ',
    evoNext: 'at the next treasure chest', evoNeedPassive: p => 'get ' + p + ', then open a treasure chest',
    evoMaxed: w => w + ' is maxed, evolves at the next treasure chest', evoNeedWeapon: w => 'max ' + w + ', then open a treasure chest',
    title: 'STARDRIFT — Neon Survival Shooter', logo: 'STARDRIFT', logoSub: 'NEON SURVIVAL SHOOTER', canvas: 'Game screen', kills: 'KILLS', mute: 'Toggle sound', pause: 'Pause',
    lede: 'Your squadron is lost and the swarm never stops coming. Your guns fire on their own. All you do is <em>dodge, collect and choose</em>. Gather stardust, build a fleet, and push past the event horizon.',
    play: 'Launch Prep', hangar: 'Hangar', records: 'Archive', settings: 'Settings',
    ctlMove: 'Move', ctlDrag: 'Drag screen', ctlDragDo: 'Touch / mouse move', ctlPick: 'Pick upgrade', ctlPause: 'Pause',
    prep: 'Launch Prep', route: 'Route', ship: 'Ship', launch: 'Launch', back: 'Back',
    tabMeta: 'Upgrades', tabShips: 'Ships', tabAch: 'Achievements', tabCodex: 'Codex', tabStats: 'Stats',
    optSound: 'Sound and music', optShake: 'Screen shake', optTips: 'Show the tutorial on the next run', optLang: 'Language / 언어',
    resetWarn: 'Erases all stardust, unlocks, achievements and records. This cannot be undone.', reset: 'Reset data', resetConfirm: 'Really erase',
    pickTitle: 'Choose an upgrade', luHint: 'Click a card or press a number key. You can carry up to 6 weapons.',
    resume: 'Resume', quit: 'Abandon run', quitConfirm: 'Abandon and return',
    again: 'Launch again', toPrep: 'Launch prep', toHangar: 'Hangar',
    reviveTitle: 'Hull critical', reviveSub: 'Watch a short ad to revive on the spot with 50% hull. Once per run.',
    reviveAd: 'Watch ad to revive', reviveNo: 'See results',
    achGot: 'Achievement', dust: 'stardust',
    lockStage: name => 'Clear ' + name + ' to unlock',
    best: 'Best ', noRecord: 'No record', locked: 'Locked', cleared: 'Cleared',
    hp: 'Hull', speed: 'Speed',
    shipLocked: (n, c) => `Unlock ${n} in the hangar for ${c} stardust.`,
    perLevel: ' (per level)', upgrade: 'Upgrade', maxed: 'Maxed', owned: 'Owned', unlock: 'Unlock',
    achCount: (d, n) => `Achievements ${d} / ${n}`, done: 'Done · ',
    enemies: 'Enemies', bosses: 'Bosses', unseen: 'Not encountered yet.',
    stRuns: 'Runs', stKills: 'Total kills', stBosses: 'Bosses defeated', stClears: 'Clears', stTime: 'Total flight time',
    stLevel: 'Best level', stDust: 'Total stardust', stDeaths: 'Times shot down',
    endureAll: 'Survive as long as you can', beatFinal: 'Defeat the final boss to clear',
    pKills: 'Kills', pTime: 'Survival', pBoss: 'Bosses', pClear: 'Clear', pBounty: 'Bounty',
    unlockNote: (name, endless) => name + (endless ? ' and Endless Void are' : ' is') + ' now open.',
    overWin: 'Stage Clear', overQuit: 'Returned', overLose: 'Shot Down', endlessName: 'Endless Void',
    subWin: 'Route conquered. Spend your stardust to refit the fleet.', subQuit: 'Mission aborted. Only half the stardust was recovered.',
    subBoss: (n, info) => 'Destroyed by ' + n + '. ' + info,
    subEarly: 'The opening is the hardest part. Keep moving and collect crystals.', subMeta: 'Buy permanent upgrades in the hangar and try again.',
    rTime: 'Survived', rLevel: 'Level', rKills: 'Kills', rScore: 'Score',
    mining: m => `Mining contract ×${m}`, quitHalf: 'Aborted ×0.5', achPrefix: 'Achievement ',
    doubleAd: 'Watch ad: double stardust', doubled: 'Stardust doubled', adFail: 'No ad available right now',
    picksLeft: n => '  ·  ' + n + ' picks left', slots: (n, m) => `Weapons ${n} / ${m}`,
    instant: 'Instant', newWeapon: 'New weapon', newUp: 'New upgrade', reroll: n => 'Reroll (' + n + ')',
    subCleared: 'Route cleared', subNext: 'Next boss in ', subFinal: 'Final boss in ', subBossIn: 'Boss in ', subFight: 'Defeat the boss', rage: 'ENRAGED',
    tut1: 'Move with <b>WASD</b> / arrow keys, or <b>drag</b> the screen',
    tut2: 'Your weapons fire automatically. Collect the <b>gold crystals</b> enemies drop',
    tut4: 'When the timer runs down a <b>boss</b> arrives. Arrows at the screen edge show where.<br>Defeat the <b>final boss</b> to clear the stage!',
    resetT: 'Reset', resetB: 'Save data erased', resetS: 'Starting fresh',
    bSwarm: 'Encirclement', bSwarmS: 'From every direction', bFinal: 'Final Boss', bWarn: 'Warning: Giant', bNear: n => n + ' approaching',
    bRage: 'Enraged', bRageS: n => n + ' attacks faster', bSplit: 'Split', bSplitS: 'Destroy both halves',
    bOneLeft: 'One left', bDown: 'Destroyed', bClear: 'Stage Clear', bRevive: 'Emergency Reboot', bReviveS: 'One more chance',
    adPlaying: 'Ad playing…', support: 'Support the developer'
  }
};
function tr(key, ...a) {
  const s = STR[LANG][key] !== undefined ? STR[LANG][key] : STR.ko[key];
  if (s === undefined) return key;
  return typeof s === 'function' ? s(...a) : s;
}
/* fill the static page: data-i18n (text), data-i18n-html, data-i18n-aria */
function applyStaticText() {
  document.title = tr('title');
  for (const e of document.querySelectorAll('[data-i18n]')) e.textContent = tr(e.dataset.i18n);
  for (const e of document.querySelectorAll('[data-i18n-html]')) e.innerHTML = tr(e.dataset.i18nHtml);
  for (const e of document.querySelectorAll('[data-i18n-aria]')) e.setAttribute('aria-label', tr(e.dataset.i18nAria));
}

/* --------------------------------------------------------------------------
   English game data
   -------------------------------------------------------------------------- */
if (LANG === 'en') (() => {
  const ships = {
    scout: ['Scout "Comet"', 'Balanced', 'An all-round starter ship. Launches with the Pulse Blaster.'],
    lancer: ['Interceptor "Lance"', 'Speed · Pierce', 'Fast but thinly armored. Starts with a Railgun that pierces every enemy in a line. Crit +6%.'],
    bastion: ['Bulwark "Boulder"', 'Tank', 'Slow and sturdy. Launches with Orbit Blades and a Reactive Shield. Damage taken -1, damage -10%.'],
    resonator: ['Resonator "Echo"', 'Area', 'Wipes out whole swarms. Starts with Chain Lightning, all area +20%.'],
    warden: ['Command Ship "Beacon"', 'Growth', 'Leads two wingman drones. XP gain +15% for fast growth.']
  };
  for (const s of SHIPS) [s.name, s.role, s.desc] = ships[s.id];

  const w = {
    blaster: ['Pulse Blaster', () => 'Rapid-fires at the nearest enemy. Improved by Spread Shot, Piercing Rounds and Rapid Fire.'],
    orbit: ['Orbit Blades', l => l === 1 ? 'Two blades circle your ship, slicing anything they touch.' : `${l + 1} blades, damage +4, wider orbit.`],
    chain: ['Chain Lightning', l => l === 1 ? 'Lightning arcs through 3 enemies in a row.' : `Chains ${l + 2} enemies, damage +8, shorter cooldown.`],
    nova: ['Shockwave', l => l === 1 ? 'Blasts everything nearby, dealing damage and knocking enemies back.' : 'Larger radius, damage +12, shorter cooldown.'],
    missile: ['Homing Missiles', l => l === 1 ? 'Missiles chase enemies and explode for area damage.' : `${1 + Math.floor(l / 2)} per volley, damage +10, shorter cooldown.`],
    shield: ['Reactive Shield', l => l === 1 ? 'Blocks one hit and repels enemies when it breaks. Regenerates every 13s.' : `Regenerates every ${13 - l * 2}s.`],
    rail: ['Railgun', l => l === 1 ? 'A high-energy beam that pierces every enemy in a line.' : `Damage +14, shorter cooldown${l >= 4 ? ', 2 beams' : ''}.`],
    mines: ['Mine Layer', l => l === 1 ? 'Drops mines along your path. They explode when enemies step on them.' : `${6 + l * 2} mines at once, damage +15, larger blast.`],
    sing: ['Singularity', l => l === 1 ? 'Opens a tiny black hole in the middle of a swarm that pulls enemies in and grinds them down.' : 'Longer duration, bigger radius, more damage, shorter cooldown.'],
    wing: ['Wingman Drones', l => l === 1 ? 'Two drones follow you and shoot.' : `${[0, 2, 2, 3, 3, 4][l]} drones, damage +3, faster fire.`],
    laser: ['Sweep Laser', l => l === 1 ? 'A laser beam sweeps around your ship.' : `${[0, 1, 1, 2, 2, 3][l]} beams, longer reach, damage +3.`],
    disc: ['Boomerang Disc', l => l === 1 ? 'A disc flies out and returns, cutting everything along the way.' : `${1 + Math.floor(l / 3)} discs, damage +7, shorter cooldown.`]
  };
  for (const k in w) [WEAPONS[k].name, WEAPONS[k].desc] = w[k];

  const p = {
    multi: ['Spread Shot', l => `The blaster fires ${l + 1} shots in a fan.`],
    pierce: ['Piercing Rounds', l => `Blaster shots pass through ${l} more enem${l === 1 ? 'y' : 'ies'}.`],
    rate: ['Rapid Fire', () => 'Blaster fire rate +18%.'],
    dmg: ['Overcharged Core', () => 'All weapon damage +20%.'],
    crit: ['Precision Targeting', () => 'Crit chance +8%. Crits deal double damage.'],
    area: ['Amplifier Lens', () => 'Blade, lightning, shockwave, explosion and beam area +12%.'],
    cool: ['Coolant Loop', () => 'Cooldown of every weapon except the blaster -8%.'],
    dur: ['Sustainer', () => 'Singularity, mine and laser duration +20%.'],
    speed: ['Thruster Mod', () => 'Move speed +9%.'],
    hp: ['Armor Plating', () => 'Max hull +25 and heal 25 now.'],
    armor: ['Composite Armor', () => 'Damage taken -2 (minimum 1).'],
    regen: ['Nano Repair', () => 'Regenerate 0.5 hull per second.'],
    magnet: ['Gravity Collector', () => 'Crystal pickup range +40%.'],
    growth: ['Learning Circuit', () => 'XP gain +12%.'],
    patch: ['Emergency Repair', () => 'Restore 40% of max hull.'],
    bounty: ['Bounty', () => 'Score +2,000, stardust +15.']
  };
  for (const u of [...PASSIVES, ...FILLERS]) [u.name, u.desc] = p[u.id];
  CAT.weapon[0] = 'Weapon'; CAT.power[0] = 'Power'; CAT.hull[0] = 'Hull';

  const ev = {
    galaxy: ['Galaxy Ring', '7 bigger blades circle wider. Damage +35% and they hit the same enemy more often.'],
    judge: ['Thunder Judgement', 'Lightning forks into two bolts, each chaining up to 11 enemies. Damage +30%, cooldown -25%.'],
    meteor: ['Meteor Shower', 'Unleashes 6 missiles in every direction. Blast area +50%, cooldown -30%.'],
    stellar: ['Stellar Lance', 'Fires a fan of 5 thicker beams. Damage +20%, cooldown -15%.'],
    collapse: ['Collapsing Star', 'Opens two black holes. Radius +40%, damage +50%, stronger pull, cooldown -20%.'],
    warp: ['Warp Disc', 'Throws 4 discs in every direction. Range +40%, damage +25%, cooldown -20%.']
  };
  for (const v of EVOLUTIONS) [v.name, v.desc] = ev[v.id];
  CAT.evo[0] = 'Evolve';

  const e = {
    drone: ['Drone', 'Charges straight at you. The most common enemy.'],
    dasher: ['Dasher', 'Stops, telegraphs its path with a dotted line, then dashes.'],
    spitter: ['Spitter', 'Keeps its distance and shoots.'],
    splitter: ['Splitter', 'Splits into three mites when destroyed.'],
    mite: ['Mite', 'Small and fast.'],
    brute: ['Brute', 'Slow and tough. Resists knockback.'],
    sniper: ['Sniper', 'Draws an aim line from afar, then fires a fast shot.'],
    bomber: ['Bomber', 'Blinks and explodes when close. The blast hits other enemies too.'],
    warder: ['Warder', 'Halves damage taken by nearby enemies. Kill it first.'],
    phaser: ['Phaser', 'Teleports to a flickering spot.'],
    brood: ['Brood', 'Keeps spawning mites.'],
    orbiter: ['Orbiter', 'Circles you and fires three-way shots.'],
    boss: ['Boss', '']
  };
  for (const k in e) [ED[k].name, ED[k].info] = e[k];

  const b = {
    hive: ['Hive Core', 'Alternates radial shots, spirals, aimed fans, summons and charges.'],
    twins: ['Twin Nebula', 'Splits in two at half health. Both halves must be destroyed.'],
    crystal: ['Crystal Colossus', 'Rings of shots with gaps, and falling shards. Slip through the gaps.'],
    storm: ['Eye of the Storm', 'Pulls your ship in and strikes telegraphed spots with lightning.'],
    queen: ['Void Queen', 'Teleports, spawns void zones on the floor and fires homing shots.'],
    engine: ['Doom Engine', 'Rotating lasers and bullet walls. Watch the laser warning lines.']
  };
  for (const k in b) [BOSSES[k].name, BOSSES[k].info] = b[k];

  const st = {
    1: ['Debris Belt', 'Among the wreckage of a shattered fleet. A good place to learn. Final boss at 8 minutes.'],
    2: ['Crimson Nebula', 'Snipers and warders hide in the red gas. Final boss at 9 minutes.'],
    3: ['Event Horizon', 'The edge of a black hole. Every enemy comes for you. The Doom Engine arrives at 10 minutes.'],
    4: ['Endless Void', 'It never ends. Every 2:30 a boss returns, stronger each lap. How long can you last?']
  };
  for (const s of STAGES) [s.name, s.desc] = st[s.id];

  const m = {
    atk: ['Weapon Refit', 'Damage +8%'], hull: ['Hull Reinforcement', 'Max hull +15'], thrust: ['Thruster Efficiency', 'Move speed +3%'],
    reach: ['Collection Range', 'Crystal pickup range +12%'], learn: ['Training Data', 'XP +6%'], focus: ['Targeting Calibration', 'Crit +3%'],
    reroll: ['Reroll Clearance', '+1 reroll'], revive: ['Emergency Reboot', 'Once per run, revive with 50% hull when shot down'],
    mining: ['Mining Contract', 'Stardust gain +10%']
  };
  for (const x of META) [x.name, x.per] = m[x.id];

  const a = {
    firstboss: ['Giant Slayer', 'Defeat your first boss'], clear1: ['Beyond the Debris', 'Clear Debris Belt'],
    clear2: ['Through the Red Fog', 'Clear Crimson Nebula'], clear3: ['Past the Horizon', 'Clear Event Horizon'],
    endless10: ['Void Dweller', 'Survive 10 minutes in Endless Void'], endless20: ['Timeless', 'Survive 20 minutes in Endless Void'],
    kills1000: ['A Thousand Stars', 'Kill 1,000 enemies in one run'], kills3000: ['Galaxy Sweeper', 'Kill 3,000 enemies in one run'],
    lv30: ['Final Form', 'Reach level 30 in one run'], maxweapon: ['Master Craftsman', 'Max out a weapon'],
    sixguns: ['All Guns Blazing', 'Equip 6 weapons at once'], untouch: ['Untouchable', 'Go 2 minutes without being hit'],
    combo300: ['Chain Reaction', 'Reach a 300 combo'], elites10: ['Elite Hunter', 'Kill 10 elites in one run'],
    clutch: ['Close Call', 'Defeat a boss with 15 hull or less'], boom10: ['Friendly Fire', 'Kill 10 enemies with bomber blasts (total)'],
    warderkill: ['Shield Breaker', 'Kill 50 warders (total)'], allships: ['Fleet Commander', 'Unlock all 5 ships'],
    veteran: ['Veteran Squadron', 'Clear Debris Belt with every ship'], nohp: ['Glass Cannon', 'Clear Crimson Nebula without Armor Plating'],
    runs20: ['No Return', 'Launch 20 runs'], dust5000: ['Stardust Tycoon', 'Earn 5,000 stardust in total'],
    maxmeta: ['Perfect Maintenance', 'Max out every permanent upgrade'], twinsfast: ['Lightning Breakup', 'Defeat the Twin Nebula within 60 seconds']
  };
  for (const x of ACH) [x.name, x.desc] = a[x.id];
})();
