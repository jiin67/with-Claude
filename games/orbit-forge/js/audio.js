'use strict';
/* Synthesized sound effects (Web Audio, no files). The context starts on the first input. */
const A = {
  c: null, out: null, muted: false, last: {},
  init() {
    if (this.c) { if (this.c.state === 'suspended') this.c.resume(); return; }
    try {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      this.c = new C(); this.out = this.c.createGain(); this.out.gain.value = this.muted ? 0 : .5; this.out.connect(this.c.destination);
    } catch (e) { this.c = null; }
  },
  setMuted(m) { this.muted = m; if (this.out) this.out.gain.setTargetAtTime(m ? 0 : .5, this.c.currentTime, .02); },
  gate(k, gap) { if (!this.c || this.muted) return false; const t = this.c.currentTime; if (this.last[k] && t - this.last[k] < gap) return false; this.last[k] = t; return true; },
  tone(f, d, type = 'sine', v = .2, slide = 0, delay = 0) {
    const c = this.c, t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + d + .02);
  },
  tap() { if (!this.gate('tap', .03)) return; this.tone(520 + Math.random() * 160, .08, 'triangle', .16, .55); this.tone(1400 + Math.random() * 300, .04, 'square', .03); },
  buy() { if (!this.gate('buy', .05)) return; this.tone(660, .07, 'triangle', .14); this.tone(990, .1, 'triangle', .12, 1, .05); },
  upgrade() { if (!this.gate('up', .08)) return; [523, 659, 784, 1046].forEach((f, i) => this.tone(f, .14, 'triangle', .12, 1, i * .055)); },
  comet() { if (!this.gate('comet', .1)) return; this.tone(880, .5, 'sine', .14, 2.2); [1318, 1760, 2093].forEach((f, i) => this.tone(f, .2, 'triangle', .07, 1, .08 + i * .07)); },
  ach() { if (!this.gate('ach', .3)) return; [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, .22, 'sine', .12, 1, i * .09)); },
  collapse() { if (!this.gate('col', .5)) return; this.tone(220, 1.6, 'sawtooth', .12, .2); this.tone(110, 1.8, 'sine', .25, .3); this.tone(1760, 1.2, 'sine', .05, .25, .3); },
  deny() { if (!this.gate('deny', .12)) return; this.tone(180, .1, 'square', .05, .8); }
};
