'use strict';
/* ==========================================================================
   Audio — every sound and the music are synthesized with Web Audio.
   ========================================================================== */
const A = {
  c: null, muted: false, last: {}, seq: null, song: 0,
  init() {
    if (this.c) { if (this.c.state === 'suspended') this.c.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    try { this.c = new AC(); } catch (e) { return; }
    const c = this.c;
    this.out = c.createGain(); this.out.gain.value = this.muted ? 0 : .6;
    const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 6;
    this.out.connect(comp); comp.connect(c.destination);
    this.sfx = c.createGain(); this.sfx.gain.value = .8; this.sfx.connect(this.out);
    this.mus = c.createGain(); this.mus.gain.value = .3; this.mus.connect(this.out);
    const len = c.sampleRate, b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.nbuf = b;
  },
  setMuted(m) { this.muted = m; if (this.out) this.out.gain.setTargetAtTime(m ? 0 : .6, this.c.currentTime, .02); },
  gate(k, gap) { if (!this.c || this.muted) return false; const t = this.c.currentTime; if (this.last[k] && t - this.last[k] < gap) return false; this.last[k] = t; return true; },
  tone(f, dur, type = 'square', vol = .2, f2, dest, when) {
    const c = this.c, t = when || c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(dest || this.sfx); o.start(t); o.stop(t + dur + .03);
  },
  noise(dur, vol, freq, ftype = 'lowpass', dest, when) {
    const c = this.c, t = when || c.currentTime;
    const s = c.createBufferSource(); s.buffer = this.nbuf;
    const f = c.createBiquadFilter(); f.type = ftype; f.frequency.value = freq;
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest || this.sfx); s.start(t, Math.random() * .5); s.stop(t + dur + .03);
  },
  shoot()  { if (this.gate('shoot', .075)) this.tone(900 + Math.random() * 100, .05, 'square', .035, 1700); },
  hit()    { if (this.gate('hit', .035)) this.noise(.05, .08, 3200, 'bandpass'); },
  kill()   { if (this.gate('kill', .045)) { this.noise(.16, .16, 1400); this.tone(160 + Math.random() * 40, .14, 'triangle', .12, 50); } },
  big()    { if (this.gate('big', .1)) { this.noise(.6, .4, 600); this.tone(90, .6, 'sawtooth', .18, 30); } },
  boom()   { if (this.gate('boom', .06)) { this.noise(.35, .3, 900); this.tone(110, .3, 'sine', .25, 35); } },
  pick(p)  { if (this.gate('pick', .03)) this.tone(520 * Math.pow(2, Math.min(p, 24) / 12), .07, 'sine', .07); },
  hurt()   { if (this.gate('hurt', .1)) { this.tone(220, .25, 'sawtooth', .2, 70); this.noise(.2, .2, 900); } },
  zap()    { if (this.gate('zap', .08)) this.noise(.12, .14, 5200, 'highpass'); },
  rail()   { if (this.gate('rail', .08)) { this.tone(1800, .18, 'sawtooth', .08, 200); this.noise(.12, .1, 6000, 'highpass'); } },
  nova()   { if (this.gate('nova', .1)) { this.tone(140, .35, 'sine', .25, 40); this.noise(.3, .12, 700); } },
  launch() { if (this.gate('launch', .1)) this.noise(.18, .08, 2400, 'bandpass'); },
  shield() { if (this.gate('shield', .1)) this.tone(1200, .3, 'triangle', .16, 300); },
  warp()   { if (this.gate('warp', .15)) this.tone(300, .3, 'sine', .14, 1400); },
  charge() { if (this.gate('charge', .3)) this.tone(200, .5, 'sawtooth', .1, 900); },
  click()  { if (this.gate('click', .04)) this.tone(1300, .04, 'square', .05); },
  buy()    { if (!this.gate('buy', .1)) return; const t = this.c.currentTime; [0, 7, 12].forEach((s, i) => this.tone(660 * Math.pow(2, s / 12), .14, 'triangle', .12, null, null, t + i * .05)); },
  level()  { if (!this.gate('level', .2)) return; const t = this.c.currentTime; [0, 4, 7, 12, 16].forEach((s, i) => this.tone(440 * Math.pow(2, s / 12), .18, 'triangle', .13, null, null, t + i * .06)); },
  ach()    { if (!this.gate('ach', .3)) return; const t = this.c.currentTime; [0, 5, 9, 12, 17, 21].forEach((s, i) => this.tone(523 * Math.pow(2, s / 12), .22, 'sine', .11, null, null, t + i * .07)); },
  siren()  { if (!this.gate('siren', 1)) return; const t = this.c.currentTime; for (let i = 0; i < 3; i++) this.tone(300, .45, 'sawtooth', .12, 600, null, t + i * .55); },
  heal()   { if (this.gate('heal', .2)) { const t = this.c.currentTime; this.tone(660, .15, 'sine', .14, null, null, t); this.tone(990, .2, 'sine', .14, null, null, t + .08); } },

  /* music: four-bar loops; each stage has its own key and tempo */
  SONGS: [
    { bpm: 116, roots: [55, 43.65, 65.41, 49], chords: [[0, 3, 7, 10], [0, 4, 7, 11], [0, 4, 7, 9], [0, 4, 7, 10]] },
    { bpm: 124, roots: [46.25, 41.2, 55, 49], chords: [[0, 3, 7, 10], [0, 3, 7, 10], [0, 4, 7, 11], [0, 3, 7, 10]] },
    { bpm: 132, roots: [41.2, 43.65, 36.71, 49], chords: [[0, 3, 7, 10], [0, 4, 7, 11], [0, 3, 7, 10], [0, 4, 7, 10]] },
    { bpm: 128, roots: [51.91, 38.89, 46.25, 43.65], chords: [[0, 3, 7, 10], [0, 4, 7, 11], [0, 3, 7, 10], [0, 4, 7, 9]] }
  ],
  startMusic(song) { if (!this.c) return; if (song !== undefined) this.song = song; if (this.seq) return; this.step = 0; this.nt = this.c.currentTime + .08; this.seq = setInterval(() => this.sched(), 30); },
  stopMusic() { clearInterval(this.seq); this.seq = null; },
  sched() { const sg = this.SONGS[this.song] || this.SONGS[0], spb = 60 / sg.bpm / 4; while (this.nt < this.c.currentTime + .12) { this.play(this.step, this.nt, sg); this.nt += spb; this.step = (this.step + 1) % 64; } },
  play(s, t, sg) {
    if (this.muted) return;
    const bar = s >> 4, st = s & 15;
    const heat = (typeof G !== 'undefined' && G) ? Math.min(1, G.t / 240) : 0;
    const boss = (typeof G !== 'undefined' && G) && G.bosses && G.bosses.length;
    if (st % 4 === 0) this.tone(130, .16, 'sine', .45, 38, this.mus, t);
    if (st % 4 === 2) this.noise(.04, .12, 7000, 'highpass', this.mus, t);
    if (boss && st % 2 === 1) this.noise(.03, .07, 9000, 'highpass', this.mus, t);
    if ([0, 3, 6, 8, 11, 14].includes(st)) this.tone(sg.roots[bar] * (st === 8 ? 2 : 1), .2, 'sawtooth', .13, null, this.mus, t);
    if (heat > .35 && st % 2 === 0) {
      const n = sg.chords[bar][(st >> 1) % 4];
      this.tone(sg.roots[bar] * 4 * Math.pow(2, n / 12), .12, 'triangle', .05 * heat, null, this.mus, t);
    }
    if (boss && st === 0) this.tone(sg.roots[bar] * 2, .5, 'square', .05, null, this.mus, t);
  }
};
