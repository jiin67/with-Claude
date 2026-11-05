/* 이벤트 미니게임 키트 — 당첨 내역 받기 (Google Apps Script)
 *
 * 설치 (5분):
 *  1. 구글 시트를 새로 만든다.
 *  2. 메뉴 확장 프로그램 → Apps Script 를 열고, 기본 코드를 지운 뒤 이 파일 전체를 붙여 넣고 저장한다.
 *  3. 오른쪽 위 배포 → 새 배포 → 유형 선택(톱니) → 웹 앱
 *     - 실행 사용자: 나
 *     - 액세스 권한: 모든 사용자
 *     → 배포 → 권한 허용 → 웹 앱 URL 복사
 *  4. 복사한 URL 을 게임의 config.js 안 sheetUrl 에 붙여 넣는다.
 *  5. 브라우저로 그 URL 을 열어 'ok' 가 보이면 준비 끝.
 *
 * 코드를 고친 뒤에는 배포 → 배포 관리 → 새 버전 으로 다시 배포해야 반영된다.
 */

var HEADER = ['시각', '브랜드', '경품', '쿠폰 코드', '결과', '답변', '시간대', '페이지', '브라우저'];

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) { sheet.appendRow(HEADER); sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold'); }
    sheet.appendRow([
      data.time ? new Date(data.time) : new Date(),
      data.brand || '', data.prize || '', data.code || '',
      data.lose ? '꽝' : '당첨',
      data.answers || '',
      data.tz || '', data.page || '', data.ua || ''
    ]);
  } catch (err) {
    /* 잘못된 요청은 조용히 무시한다. 게임 쪽은 응답을 읽지 않는다. */
  }
  return ContentService.createTextOutput('ok');
}

function doGet() {
  return ContentService.createTextOutput('ok');
}
