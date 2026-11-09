'use strict';
/* ==========================================================================
   Web game portal adapter: ads and gameplay events.
   The portal is chosen by window.GAME_PORTAL (set by build.mjs)
   or ?portal= in the URL:
     none        plain web / itch.io — no ads
     crazygames  CrazyGames HTML5 SDK v3
     poki        Poki HTML5 SDK v2
     gamedistribution  GameDistribution HTML5 SDK (game id from
                 window.GD_GAME_ID, set by build.mjs); plays a pre-roll
                 once the first screen is up, as GD requires
     debug       fake ads for testing the flow locally
   Every call is safe when the SDK is missing or blocked: ads then resolve
   as "no ad" and the game carries on.
   ========================================================================== */

const PORTAL = (() => {
  let name = 'none';
  try { name = window.GAME_PORTAL || new URLSearchParams(location.search).get('portal') || 'none'; } catch (e) {}
  const SDK_URL = {
    crazygames: 'https://sdk.crazygames.com/crazygames-sdk-v3.js',
    poki: 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js',
    gamedistribution: 'https://html5.api.gamedistribution.com/main.min.js'
  };
  /* GameDistribution reports ad state through one event callback:
     SDK_GAME_PAUSE / SDK_GAME_START bracket every ad, and
     SDK_REWARDED_WATCH_COMPLETE is the only proof a reward was earned */
  let gdReady = null, gdRewardEarned = false, gdResume = null;
  function gdEvent(ev) {
    switch (ev && ev.name) {
      case 'SDK_READY': if (gdReady) gdReady(); break;
      case 'SDK_GAME_PAUSE': adStart(); break;
      case 'SDK_GAME_START': adEnd(); if (gdResume) { const r = gdResume; gdResume = null; r(); } break;
      case 'SDK_REWARDED_WATCH_COMPLETE': gdRewardEarned = true; break;
    }
  }
  /* show one GD ad and wait until the game may continue. showAd's promise
     can settle before SDK_GAME_START fires, so wait for whichever comes last,
     with a ceiling so a stuck ad never freezes the game. */
  function gdShow(type) {
    return new Promise(res => {
      let adDone = false, resumed = false, finished = false;
      const finish = () => { if (finished) return; finished = true; res(); };
      gdResume = () => { resumed = true; if (adDone) finish(); };
      const after = () => { adDone = true; setTimeout(() => { if (!resumed) finish(); }, 1500); if (resumed) finish(); };
      setTimeout(finish, 60000);
      try {
        const p = type ? sdk.showAd(type) : sdk.showAd();
        if (p && typeof p.then === 'function') p.then(after, () => { resumed = true; finish(); });
        else after();
      } catch (e) { finish(); }
    });
  }
  let sdk = null, playing = false, busy = false;
  /* interstitial budget: at most 6 midgame ads per session, at least 90 s apart.
     Past the cap (or inside the cooldown) midgame() silently skips and the game
     carries on — an ad must never block play. Counts only ads actually shown
     (a 'none' build never reaches the counter). Applies to debug fake ads too,
     so the cap can be tested locally with ?portal=debug. */
  const MIDGAME_MAX_PER_SESSION = 6;
  const MIDGAME_MIN_INTERVAL_MS = 90 * 1000;
  let midgameCount = 0, lastMidgameAt = 0;
  const api = {
    name,
    /* true when this build can show rewarded ads (the reward buttons appear only then) */
    rewarded: false,
    /* true once the portal SDK has answered (or failed): until then `rewarded`
       is still unknown, so the UI shows reward buttons disabled, never hidden */
    settled: false,
    onAd: null, /* (true) when an ad starts, (false) when it ends — the UI mutes and pauses */
    store: null, /* localStorage-like account storage, when the portal has one */
    country: null, /* ISO country code from the portal, when it tells us */
    ready: null
  };

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
  const adStart = () => { if (api.onAd) api.onAd(true); };
  const adEnd = () => { if (api.onAd) api.onAd(false); };

  api.ready = (async () => {
    try {
      if (name === 'crazygames') {
        await timeout(loadScript(SDK_URL.crazygames), 8000);
        sdk = window.CrazyGames && window.CrazyGames.SDK;
        await timeout(sdk.init(), 8000);
        api.rewarded = sdk.environment !== 'disabled';
        if (sdk.data && sdk.environment !== 'disabled') api.store = sdk.data;
        try { const si = sdk.user && sdk.user.systemInfo; const info = si && typeof si.then === 'function' ? await si : si; if (info && info.countryCode) api.country = String(info.countryCode).toUpperCase(); } catch (e) {}
        try { sdk.game.loadingStart(); } catch (e) {}
      } else if (name === 'poki') {
        await timeout(loadScript(SDK_URL.poki), 8000);
        sdk = window.PokiSDK;
        await timeout(sdk.init(), 8000);
        api.rewarded = true;
      } else if (name === 'gamedistribution') {
        window.GD_OPTIONS = { gameId: window.GD_GAME_ID || '', onEvent: gdEvent };
        const ready = new Promise(res => { gdReady = res; });
        await timeout(loadScript(SDK_URL.gamedistribution), 8000);
        await timeout(ready, 8000);
        sdk = window.gdsdk;
        if (!sdk || typeof sdk.showAd !== 'function') throw new Error('gdsdk missing');
        /* rewarded ads only when the portal has one to give */
        try { await timeout(sdk.preloadAd('rewarded'), 5000); api.rewarded = true; } catch (e) { api.rewarded = false; }
      } else if (name === 'debug') {
        api.rewarded = true;
      }
    } catch (e) {
      /* ad blocker or offline: run as an ad-free build */
      sdk = null; api.store = null; api.rewarded = name === 'debug';
    }
    api.settled = true;
  })();

  /* call once the first screen is interactive */
  api.loaded = () => api.ready.then(() => {
    try {
      if (name === 'crazygames' && sdk) sdk.game.loadingStop();
      if (name === 'poki' && sdk) sdk.gameLoadingFinished();
    } catch (e) {}
    /* GameDistribution requires a pre-roll before play; it counts toward the
       midgame budget so the next interstitial waits the usual cooldown */
    if (name === 'gamedistribution' && sdk && !busy) {
      busy = true; midgameCount++; lastMidgameAt = Date.now();
      return gdShow().then(() => { busy = false; adEnd(); });
    }
  });
  api.start = () => {
    if (playing) return; playing = true;
    try {
      if (name === 'crazygames' && sdk) sdk.game.gameplayStart();
      if (name === 'poki' && sdk) sdk.gameplayStart();
    } catch (e) {}
  };
  api.stop = () => {
    if (!playing) return; playing = false;
    try {
      if (name === 'crazygames' && sdk) sdk.game.gameplayStop();
      if (name === 'poki' && sdk) sdk.gameplayStop();
    } catch (e) {}
  };
  /* a moment worth celebrating (stage clear, new record) */
  api.happy = () => { try { if (name === 'crazygames' && sdk) sdk.game.happytime(); } catch (e) {} };

  /* debug: a full-screen stand-in for a video ad */
  function fakeAd(seconds) {
    return new Promise(res => {
      const d = document.createElement('div');
      d.style.cssText = 'position:fixed;inset:0;z-index:99;display:grid;place-items:center;background:#000d;color:#fff;font:700 20px system-ui';
      d.textContent = tr('adPlaying');
      document.body.appendChild(d);
      setTimeout(() => { d.remove(); res(true); }, seconds * 1000);
    });
  }

  /* how much of the interstitial budget this session has used (for the UI / tests) */
  api.midgameStats = () => ({ count: midgameCount, max: MIDGAME_MAX_PER_SESSION, cooldownMs: MIDGAME_MIN_INTERVAL_MS, lastAt: lastMidgameAt });

  /* interstitial at a natural break; resolves when the game may continue */
  api.midgame = async () => {
    await api.ready;
    if (busy || !sdk && name !== 'debug') return;
    const now = Date.now();
    if (midgameCount >= MIDGAME_MAX_PER_SESSION) return;
    if (lastMidgameAt && now - lastMidgameAt < MIDGAME_MIN_INTERVAL_MS) return;
    midgameCount++; lastMidgameAt = now;
    busy = true; api.stop();
    try {
      if (name === 'debug') { adStart(); await fakeAd(1.2); }
      else if (name === 'crazygames') {
        await new Promise(res => sdk.ad.requestAd('midgame', { adStarted: adStart, adFinished: res, adError: res }));
      } else if (name === 'poki') await sdk.commercialBreak(adStart);
      else if (name === 'gamedistribution') await gdShow();
    } catch (e) {}
    busy = false; adEnd();
  };

  /* rewarded ad; resolves true only when the player earned the reward */
  api.reward = async () => {
    await api.ready;
    if (busy || !api.rewarded) return false;
    busy = true; api.stop();
    let ok = false;
    try {
      if (name === 'debug') { adStart(); ok = await fakeAd(2); }
      else if (name === 'crazygames') {
        ok = await new Promise(res => sdk.ad.requestAd('rewarded', { adStarted: adStart, adFinished: () => res(true), adError: () => res(false) }));
      } else if (name === 'poki') ok = !!(await sdk.rewardedBreak(adStart));
      else if (name === 'gamedistribution') {
        gdRewardEarned = false;
        await gdShow('rewarded');
        ok = gdRewardEarned;
        /* queue the next rewarded ad; if none comes back, hide reward buttons */
        sdk.preloadAd('rewarded').then(() => { api.rewarded = true; }, () => { api.rewarded = false; });
      }
    } catch (e) { ok = false; }
    busy = false; adEnd();
    return ok;
  };
  return api;
})();
