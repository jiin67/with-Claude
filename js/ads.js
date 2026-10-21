'use strict';
/* ==========================================================================
   Ads — CrazyGames HTML5 SDK v3 adapter.
   Off the CrazyGames site (GitHub Pages, file://, ad blockers, the balance
   simulator) the SDK is missing or reports 'disabled', and every call here
   becomes a no-op so the game plays exactly as before.
   ========================================================================== */
const Ads = {
  sdk: null, ready: false, busy: false, playing: false, wantPlay: false,
  async init() {
    try {
      const s = window.CrazyGames && window.CrazyGames.SDK;
      if (!s || this.sdk) return;
      await s.init();
      if (s.environment === 'disabled') return;
      this.sdk = s; this.ready = true;
      /* a run may already be going by the time the SDK answers */
      if (this.wantPlay) { this.playing = false; this.gameplay(true); }
    } catch (e) { this.ready = false; }
  },
  /* tell the portal when the player is actually playing; only state changes are sent */
  gameplay(on) {
    this.wantPlay = on;
    if (!this.ready || this.busy || this.playing === on) return;
    this.playing = on;
    try { on ? this.sdk.game.gameplayStart() : this.sdk.game.gameplayStop(); } catch (e) {}
  },
  happy() { if (this.ready) try { this.sdk.game.happytime(); } catch (e) {} },
  /* audio is muted and gameplay reported stopped while an ad covers the game */
  show(type, done) {
    if (!this.ready || this.busy) { done(false); return; }
    const wasMuted = A.muted, wasPlaying = this.wantPlay;
    this.gameplay(false);
    this.busy = true;
    let settled = false;
    const finish = ok => {
      if (settled) return; settled = true;
      this.busy = false; A.setMuted(wasMuted);
      if (wasPlaying) this.gameplay(true);
      done(ok);
    };
    try {
      this.sdk.ad.requestAd(type, {
        adStarted: () => { A.setMuted(true); },
        adFinished: () => finish(true),
        adError: () => finish(false)
      });
    } catch (e) { finish(false); }
  },
  /* rewarded: onReward runs only when the ad played to the end */
  rewarded(onReward, onFail) { this.show('rewarded', ok => ok ? onReward() : onFail && onFail()); },
  /* midgame: next runs either way, an unfilled or blocked ad never holds the player up */
  midgame(next) { this.show('midgame', () => next()); }
};
(function hookSdk() {
  const tag = document.getElementById('cgsdk');
  if (window.CrazyGames && window.CrazyGames.SDK) Ads.init();
  else if (tag) tag.addEventListener('load', () => Ads.init());
})();
