/* 당첨 내역을 구글 시트로 보내는 선택 기능.
   config.js 의 sheetUrl 이 비어 있으면 아무것도 하지 않는다.
   게임을 멈추거나 오류를 내지 않도록 전부 try/catch 안에서 돈다. */
(function () {
  var QUEUE_KEY = 'event-kit.report.queue', MAX_QUEUE = 50;

  function cfg() { return (typeof window !== 'undefined' && window.EVENT_CONFIG) || {}; }
  function url() { var u = cfg().sheetUrl; return typeof u === 'string' && u.trim() ? u.trim() : ''; }

  function send(body) {
    /* text/plain 이라 Apps Script 를 향한 CORS 사전 요청이 생기지 않는다. no-cors 라 응답은 읽을 수 없다. */
    return fetch(url(), { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: body });
  }
  function readQueue() { try { var q = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); return Array.isArray(q) ? q : []; } catch (e) { return []; } }
  function writeQueue(q) { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE))); } catch (e) {} }
  function enqueue(body) { var q = readQueue(); q.push(body); writeQueue(q); }

  /* 보내지 못한 것은 다음 페이지 로드 때 다시 보낸다 */
  function retry() {
    try {
      if (!url()) return;
      var q = readQueue(); if (!q.length) return;
      writeQueue([]);
      q.forEach(function (body) { try { send(body).catch(function () { enqueue(body); }); } catch (e) { enqueue(body); } });
    } catch (e) {}
  }

  window.EVENT_REPORT = function (result) {
    try {
      if (!url() || !result) return;
      var c = cfg(), body = JSON.stringify({
        brand: c.brand || '', prize: result.prize || '', code: result.code || '', lose: !!result.lose,
        time: new Date().toISOString(), tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),
        page: location.pathname.split('/').slice(-2).join('/'), ua: navigator.userAgent
      });
      send(body).catch(function () { enqueue(body); });
    } catch (e) {}
  };

  try { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', retry); else retry(); } catch (e) {}
})();
