const SHEET_NAME = "Students";
const SS = SpreadsheetApp.getActiveSpreadsheet();

/**
 * SETUP function: Run this once to initialize the sheet structure.
 */
function setup() {
  let sheet = SS.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = SS.insertSheet(SHEET_NAME);
  }
  
  const headers = ["id", "name", "class", "roll", "mobile"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  
  Logger.log("Sheet 'Students' initialized with headers.");
}

function doGet(e) {
  const sheet = SS.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  const sheet = SS.getSheetByName(SHEET_NAME);
  
  if (action === "addStudent") {
    const id = Utilities.getUuid();
    sheet.appendRow([id, params.name, params.class, params.roll, params.mobile]);
    return createResponse("Success", "Student added");
  }
  
  if (action === "updateStudent") {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.id) {
        sheet.getRange(i + 1, 2).setValue(params.name);
        sheet.getRange(i + 1, 3).setValue(params.class);
        sheet.getRange(i + 1, 4).setValue(params.roll);
        sheet.getRange(i + 1, 5).setValue(params.mobile);
        return createResponse("Success", "Student updated");
      }
    }
    return createResponse("Error", "Student not found");
  }
  
  if (action === "deleteStudent") {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === params.id) {
        sheet.deleteRow(i + 1);
        return createResponse("Success", "Student deleted");
      }
    }
    return createResponse("Error", "Student not found");
  }
}

function createResponse(status, message) {
  return ContentService.createTextOutput(JSON.stringify({ status, message }))
    .setMimeType(ContentService.MimeType.JSON);
}
