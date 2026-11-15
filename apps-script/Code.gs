// Hesap lead collector: writes each landing-page lead to a Google Sheet.
// Setup (one time, in your Google account):
// 1. Create a Google Sheet. Copy its ID from the URL: docs.google.com/spreadsheets/d/<ID>/edit
// 2. Extensions > Apps Script, paste this file, set SHEET_ID below.
// 3. Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone > Deploy.
// 4. Copy the Web app URL (ends with /exec) and send it to the developer.
const SHEET_ID = 'PASTE_SHEET_ID_HERE';
const SHEET_NAME = 'Leads';
const HEADERS = ['Vaqt', 'Ism', 'Telefon', 'Telegram', 'Biznes', 'Joylashuv', 'Oyiga nasiya', 'Maqsad', 'Variant', 'UTM', 'Referrer'];

function doPost(e) {
  const d = JSON.parse(e.postData.contents || '{}');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  sh.appendRow([
    new Date(), d.name || '', d.phone || '', d.telegram || '', d.business || '', d.location || '',
    d.count || '', d.intent || '', d.variant || '', JSON.stringify(d.utm || {}), d.referrer || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
