'use strict';
/* ==========================================================================
   The apps inside the laptop. Each renders into a window body and reads
   the save (S) plus the story (C). ui.js owns windows, dock and modals.
   ========================================================================== */
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };

const ICONS = {
  notes: '<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="3" fill="#ffd166"/><path d="M8 9h8M8 13h8M8 17h5" stroke="#5a4300" stroke-width="1.8" stroke-linecap="round"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" fill="#5b8cff"/><path d="M4 8l8 5 8-5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  photos: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" fill="#f78fb3"/><circle cx="9" cy="10" r="2" fill="#fff"/><path d="M5 18l5-5 3 3 2-2 4 4" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" fill="#ff5c6c"/><path d="M15 6v9a2.5 2.5 0 11-1.5-2.3V8l-4 1v8a2.5 2.5 0 11-1.5-2.3V7.5L15 6z" fill="#fff"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14l-1 13H6L5 7z" fill="#9aa0b4"/><rect x="3" y="4" width="18" height="3" rx="1.5" fill="#c3c8d9"/><path d="M10 10v7M14 10v7" stroke="#3b3f52" stroke-width="1.6" stroke-linecap="round"/></svg>',
  vault: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#30c48d"/><circle cx="12" cy="12" r="5" stroke="#063d2a" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="#063d2a"/><path d="M12 7v2M12 15v2M7 12h2M15 12h2" stroke="#063d2a" stroke-width="1.6" stroke-linecap="round"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" fill="#1b1e2b" stroke="#4a5068"/><path d="M7 9l3 3-3 3" stroke="#30c48d" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15h5" stroke="#d7dbe8" stroke-width="1.8" stroke-linecap="round"/></svg>',
  messages: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4c-5 0-9 3.1-9 7 0 2.2 1.3 4.1 3.3 5.4L5.5 20l4.3-2.2c.7.1 1.4.2 2.2.2 5 0 9-3.1 9-7s-4-7-9-7z" fill="#30c48d"/></svg>'
};

/* dock order; messages only after the drive is mounted */
function dockApps() {
  const a = ['notes', 'mail', 'photos', 'music', 'trash', 'vault', 'terminal'];
  if (S.mounted) a.push('messages');
  return a;
}

/* ---- helpers ---- */
function receiptHtml() {
  const box = el('div', 'receipt');
  let total = 0;
  for (const [name, price] of RECEIPT) { total += price; const r = el('div'); r.append(el('span', null, name), el('span', null, '₩' + price.toLocaleString())); box.appendChild(r); }
  const t = el('div', 'total'); t.append(el('span', null, 'TOTAL'), el('span', null, '₩' + total.toLocaleString())); box.appendChild(t);
  return box;
}
function bodyWithReceipt(text, target) {
  const parts = text.split('{receipt}');
  target.append(parts[0]);
  if (parts.length > 1) { target.appendChild(receiptHtml()); target.append(parts[1]); }
}
function listDetail(body, items, render, selIdx) {
  const wrap = el('div', 'split'), list = el('div', 'list'), det = el('div', 'detail');
  let sel = selIdx;
  const draw = () => {
    list.innerHTML = ''; det.innerHTML = '';
    items.forEach((it, i) => {
      const b = el('button', 'li' + (i === sel ? ' on' : '')); b.type = 'button';
      b.append(el('b', null, it.title), el('span', null, it.sub || ''));
      b.onclick = () => { sel = i; A.click(); draw(); };
      list.appendChild(b);
    });
    if (sel === undefined) det.appendChild(el('p', 'empty', tr('pick')));
    else render(items[sel], det);
  };
  draw(); wrap.append(list, det); body.appendChild(wrap);
}

/* ---- apps ---- */
const APPS = {
  notes(body) {
    const items = C.notes.map(n => ({ title: n.title, sub: n.body.split('\n')[0], n }));
    listDetail(body, items, (it, det) => { det.appendChild(el('h3', null, it.n.title)); det.append(it.n.body); }, 0);
  },
  mail(body) {
    const items = C.mails.map(m => ({ title: m.subject, sub: m.from, m }));
    listDetail(body, items, (it, det) => {
      det.appendChild(el('h3', null, it.m.subject)); det.appendChild(el('div', 'meta', it.m.from));
      bodyWithReceipt(it.m.body, det);
    }, 0);
  },
  photos(body) {
    const g = el('div', 'photos');
    for (const p of C.photos) {
      const card = el('div', 'photo'), img = el('div', 'img');
      img.style.background = `linear-gradient(135deg, ${p.g[0]}, ${p.g[1]})`;
      card.append(img, el('b', null, p.cap), el('span', null, p.sub)); g.appendChild(card);
    }
    body.appendChild(g);
  },
  music(body) {
    const m = el('div', 'music'), head = el('div', 'head'), info = el('div');
    info.append(el('h3', null, C.musicTitle), el('div', 'muted', C.musicHint));
    head.append(el('div', 'art', '♪'), info); m.appendChild(head);
    let cur = -1, playing = false, prog = 0, timer = null;
    const rows = [], bar = el('i');
    const draw = () => rows.forEach((r, i) => r.classList.toggle('on', i === cur));
    PLAYLIST.forEach(([t, artist, d], i) => {
      const r = el('div', 'track'), tb = el('div');
      tb.append(el('b', null, t), el('small', null, artist));
      r.append(el('span', 'n', String(i + 1)), tb, el('span', 'd', d));
      r.onclick = () => { cur = i; playing = true; prog = 0; A.click(); draw(); status(); };
      rows.push(r); m.appendChild(r);
    });
    const player = el('div', 'player'), btn = el('button', 'btn', '▶'), st = el('span', 'muted', '—'), barBox = el('div', 'bar');
    barBox.appendChild(bar); player.append(btn, barBox, st); m.appendChild(player);
    const status = () => { btn.textContent = playing ? '❚❚' : '▶'; st.textContent = cur < 0 ? '—' : (playing ? tr('playing') : tr('paused')) + ' · ' + PLAYLIST[cur][0]; };
    btn.onclick = () => { if (cur < 0) cur = 0; playing = !playing; A.click(); draw(); status(); };
    timer = setInterval(() => { if (!body.isConnected) { clearInterval(timer); return; } if (playing) { prog = (prog + .4) % 100; bar.style.width = prog + '%'; } }, 100);
    body.appendChild(m);
  },
  trash(body) {
    const items = C.trash.map(t => ({ title: t.name, sub: t.body.split('\n')[0], t }));
    listDetail(body, items, (it, det) => { det.appendChild(el('h3', null, it.t.name)); det.append(it.t.body); }, 0);
  },
  vault(body) {
    const v = C.vault, box = el('div', 'vault');
    box.append(el('h3', null, v.title), el('p', 'muted', v.sub));
    const msg = el('div', 'msg');
    const lockRow = (kind, label, make) => {
      const row = el('div', 'lock' + (S.vault[kind] ? ' ok' : '')), ic = el('div', 'ic', S.vault[kind] ? '✓' : '🔒'), inner = el('div');
      inner.appendChild(el('label', null, label + ' · ' + (S.vault[kind] ? v.ok : v.locked)));
      if (!S.vault[kind]) make(inner, row, ic);
      row.append(ic, inner); return row;
    };
    const textLock = (kind, ph) => (inner, row, ic) => {
      const inp = el('input'); inp.placeholder = ph; inp.autocomplete = 'off'; inp.spellcheck = false;
      if (kind === 'number') { inp.inputMode = 'numeric'; inp.maxLength = 4; } else inp.maxLength = 12;
      const b = el('button', 'btn', v.open), r = el('div', 'row'); r.append(b);
      const go = () => {
        if (!inp.value.trim()) return;
        if (tryVault(kind, inp.value)) { A.ok(); msg.className = 'msg ok'; msg.textContent = ''; APPS.vault.refresh(); }
        else { A.bad(); msg.className = 'msg bad'; msg.textContent = v.wrong; inp.select(); }
      };
      b.onclick = go; inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
      inner.append(inp, r);
    };
    const colorLock = (inner) => {
      const sw = el('div', 'swatches');
      for (const c of COLORS) {
        const b = el('button', 'sw'); b.type = 'button'; b.style.background = c.hex; b.title = c.id; b.setAttribute('aria-label', c.id);
        b.onclick = () => {
          if (tryVault('color', c.id)) { A.ok(); msg.className = 'msg ok'; msg.textContent = ''; APPS.vault.refresh(); }
          else { A.bad(); msg.className = 'msg bad'; msg.textContent = v.wrong; }
        };
        sw.appendChild(b);
      }
      inner.appendChild(sw);
    };
    if (S.vault.open) {
      box.appendChild(el('p', 'msg ok', v.opened));
      const inside = el('div', 'inside');
      for (const [name, text] of v.inside) { const f = el('div', 'file'); f.append(el('b', null, name), text); inside.appendChild(f); }
      box.appendChild(inside);
    } else {
      box.append(lockRow('word', v.word, textLock('word', v.wordPh)), lockRow('number', v.number, textLock('number', v.numberPh)), lockRow('color', v.color, colorLock), msg);
    }
    body.appendChild(box);
  },
  terminal(body) {
    const T = C.terminal, term = el('div', 'term');
    const hist = S.termLog || [];
    const print = (t, cls) => { const d = el('div', cls || ''); d.textContent = t; term.insertBefore(d, line); term.scrollTop = term.scrollHeight; };
    const line = el('div', 'term-line'), prompt = el('span', 'in', '$'), inp = el('input'); inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', 'command');
    line.append(prompt, inp); term.appendChild(line);
    let awaitingKey = false;
    const files = () => Object.assign({}, T.files, S.mounted ? T.echoFiles : {});
    const fileText = n => {
      const f = files()[n]; if (f === undefined) return null;
      return f.replace('{cipher}', CIPHER_TEXT);
    };
    const run = raw => {
      const cmd = raw.trim(); if (!cmd) return;
      print('$ ' + cmd, 'in');
      if (awaitingKey) { awaitingKey = false; prompt.textContent = '$'; if (tryMount(cmd)) { A.ok(); print(T.mounted, 'ok'); dockRefresh(); toast(tr('newApp'), C.apps.messages + ' · ' + C.messages.contact); } else { A.bad(); print(T.badKey, 'err'); } return; }
      const [c, a1, a2] = cmd.split(/\s+/);
      switch ((c || '').toLowerCase()) {
        case 'help': print(T.help); break;
        case 'ls': print(Object.keys(files()).join('\n')); break;
        case 'clear': for (const n of [...term.childNodes]) if (n !== line) n.remove(); break;
        case 'cat': { const t = fileText(a1); if (t === null) print(T.noFile(a1 || '?'), 'err'); else { print(t); if (a1 === 'contact.txt') S.read.contact = true; } break; }
        case 'mount':
          if (S.mounted) print(T.alreadyMounted); else if ((a1 || '').toLowerCase() !== 'echo') print(T.noFile(a1 || '?'), 'err');
          else { awaitingKey = true; prompt.textContent = T.keyPrompt; }
          break;
        case 'decode': {
          const n = parseInt(a2, 10), t = fileText(a1);
          if (t === null) { print(T.noFile(a1 || '?'), 'err'); break; }
          if (!(n >= 0 && n <= 25)) { print(T.badShift, 'err'); break; }
          const enc = a1 === 'cipher.txt' ? CIPHER_TEXT : t;
          print(T.decoded(n) + '\n' + caesar(enc, -n), n === ANSWERS.shift && a1 === 'cipher.txt' ? 'ok' : '');
          if (n === ANSWERS.shift && a1 === 'cipher.txt' && !S.decoded) { S.decoded = true; A.ok(); persist(); if (checkEcho()) setTimeout(checkChapter, 400); }
          break;
        }
        case 'play':
          if (a1 !== 'memo.wav' || !S.mounted) print(fileText(a1) === null ? T.noFile(a1 || '?') : T.notAudio, 'err');
          else { print(T.playing); print(morseOf(MORSE_WORD), 'ok'); if (!S.played) { S.played = true; persist(); if (checkEcho()) setTimeout(checkChapter, 400); } }
          break;
        default: print(T.unknownCmd(c), 'err');
      }
      persist();
    };
    if (!hist.length) print(T.welcome);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); run(inp.value); inp.value = ''; } });
    term.addEventListener('click', () => inp.focus());
    body.appendChild(term);
    setTimeout(() => inp.focus(), 50);
  },
  messages(body) {
    const M = C.messages, chat = el('div', 'chat'), log = el('div', 'log');
    const add = (m, cls) => { const b = el('div', 'bub ' + m.who + (cls ? ' ' + cls : '')); b.textContent = m.t; log.appendChild(b); log.scrollTop = log.scrollHeight; return b; };
    for (const m of S.msgLog) add(m);
    const form = el('form'), inp = el('input'), send = el('button', null, M.send); inp.placeholder = M.ph; inp.autocomplete = 'off';
    form.append(inp, send); chat.append(log, form); body.appendChild(chat);
    let busy = false;
    const showLines = lines => {
      busy = true; inp.disabled = true;
      const step = i => {
        if (i >= lines.length) { busy = false; inp.disabled = false; if (S.done) setTimeout(showEnding, 900); else inp.focus(); return; }
        const m = lines[i];
        if (m.who === 'me') { add(m); step(i + 1); return; }
        const ty = add({ who: 'them', t: '…' }, 'typing');
        setTimeout(() => { ty.remove(); add(m); A.msg(); step(i + 1); }, 650 + Math.min(1400, m.t.length * 28));
      };
      step(0);
    };
    form.onsubmit = e => { e.preventDefault(); if (busy || !inp.value.trim()) return; const v = inp.value; inp.value = ''; showLines(msgAdvance(v)); };
    if (!S.msgLog.length) setTimeout(() => showLines(msgAdvance()), 500);
    else if (C.messages.script[S.msgStep] && C.messages.script[S.msgStep].who !== 'ask' && !S.done) showLines(msgAdvance());
  }
};
APPS.vault.refresh = () => { const w = WIN.vault; if (w) { w.body.innerHTML = ''; APPS.vault(w.body); } checkChapter(); };
