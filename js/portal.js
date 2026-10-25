'use strict';
/* ==========================================================================
   Web game portal adapter: ads and gameplay events.
   The portal is chosen by window.STARDRIFT_PORTAL (set by tools/build.mjs)
   or ?portal= in the URL:
     none        plain web / itch.io — no ads
     crazygames  CrazyGames HTML5 SDK v3
     poki        Poki HTML5 SDK v2
     debug       fake ads for testing the flow locally
   Every call is safe when the SDK is missing or blocked: ads then resolve
   as "no ad" and the game carries on.
   ========================================================================== */

/* optional tip-jar link (Ko-fi, Toss, Buy Me a Coffee…) shown on the title
   screen of the ad-free builds. Leave empty to hide it. */
const SUPPORT_URL = '';

const PORTAL = (() => {
  let name = 'none';
  try { name = window.STARDRIFT_PORTAL || new URLSearchParams(location.search).get('portal') || 'none'; } catch (e) {}
  const SDK_URL = {
    crazygames: 'https://sdk.crazygames.com/crazygames-sdk-v3.js',
    poki: 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js'
  };
  let sdk = null, playing = false, busy = false;
  const api = {
    name,
    /* true when this build can show rewarded ads (the reward buttons appear only then) */
    rewarded: false,
    onAd: null, /* (true) when an ad starts, (false) when it ends — the UI mutes and pauses */
    store: null, /* localStorage-like account storage, when the portal has one */
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
        try { sdk.game.loadingStart(); } catch (e) {}
      } else if (name === 'poki') {
        await timeout(loadScript(SDK_URL.poki), 8000);
        sdk = window.PokiSDK;
        await timeout(sdk.init(), 8000);
        api.rewarded = true;
      } else if (name === 'debug') {
        api.rewarded = true;
      }
    } catch (e) {
      /* ad blocker or offline: run as an ad-free build */
      sdk = null; api.store = null; api.rewarded = name === 'debug';
    }
  })();

  /* call once the first screen is interactive */
  api.loaded = () => api.ready.then(() => {
    try {
      if (name === 'crazygames' && sdk) sdk.game.loadingStop();
      if (name === 'poki' && sdk) sdk.gameLoadingFinished();
    } catch (e) {}
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

  /* interstitial at a natural break; resolves when the game may continue */
  api.midgame = async () => {
    await api.ready;
    if (busy || !sdk && name !== 'debug') return;
    busy = true; api.stop();
    try {
      if (name === 'debug') { adStart(); await fakeAd(1.2); }
      else if (name === 'crazygames') {
        await new Promise(res => sdk.ad.requestAd('midgame', { adStarted: adStart, adFinished: res, adError: res }));
      } else if (name === 'poki') await sdk.commercialBreak(adStart);
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
    } catch (e) { ok = false; }
    busy = false; adEnd();
    return ok;
  };
  return api;
})();
