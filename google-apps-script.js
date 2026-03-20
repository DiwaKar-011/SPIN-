/**
 * Cypherverse — Spider Hackathon
 * Google Apps Script to receive team data and write it to Google Sheets
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire script
 * 4. Click "Deploy" > "New deployment"
 * 5. Choose "Web app"
 * 6. Set "Execute as" = Me
 * 7. Set "Who has access" = Anyone
 * 8. Click "Deploy" and copy the Web App URL
 * 9. Paste the URL into script.js (replace the GOOGLE_SCRIPT_URL placeholder)
 */

const SHEET_NAME = 'Registrations'; // Name of the tab in your Google Sheet

// We keep doPost just in case, but switch main logic to a reusable function
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return processData(data);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet is now fully equipped to save data, which bypasses browser CORS entirely!
 */
function doGet(e) {
  if (e.parameter.data) {
    try {
      // Decode the URL data parameter
      const data = JSON.parse(e.parameter.data);
      return processData(data);
    } catch (error) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // If someone just visits the URL
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Cypherverse Sheets API is live!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Core saving logic
function processData(data) {
  const sheet = getOrCreateSheet();

  sheet.appendRow([
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), // Timestamp (IST)
    data.teamName || '',
    data.teamNumber || '',
    data.domain || '',
    data.problemId || '',
    data.problemTitle || '',
    data.problemDesc || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Get or create the target sheet tab
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['Timestamp', 'Team Name', 'Team Number', 'Domain', 'Problem ID', 'Problem Title', 'Problem Description'];
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e').setFontColor('#dc2626').setFontWeight('bold').setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}
