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

function doPost(e) {
  try {
    // Parse the incoming JSON body
    const data = JSON.parse(e.postData.contents);

    const sheet = getOrCreateSheet();

    // Append the row with all submitted data
    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), // Timestamp (IST)
      data.teamName     || '',
      data.teamNumber   || '',
      data.domain       || '',
      data.problemId    || '',
      data.problemTitle || '',
      data.problemDesc  || ''
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * doGet is required so the script can respond to GET requests
 * (used for testing the deployment)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Cypherverse Sheets API is live!' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Get or create the target sheet tab
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    // Create a new sheet tab if it doesn't exist
    sheet = ss.insertSheet(SHEET_NAME);

    // Add header row with formatting
    const headers = [
      'Timestamp',
      'Team Name',
      'Team Number',
      'Domain',
      'Problem ID',
      'Problem Title',
      'Problem Description'
    ];
    sheet.appendRow(headers);

    // Style the header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e');
    headerRange.setFontColor('#dc2626');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);

    // Freeze header row
    sheet.setFrozenRows(1);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}
