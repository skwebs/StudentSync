# StudentSync Backend Guide: Google Apps Script & Sheets

This guide provides the complete setup for your Google Sheets backend. This approach allows you to use Google Sheets as a free, reliable REST-style database.

## 1. Google Apps Script Implementation
1.  Create a new Google Sheet.
2.  Go to **Extensions** > **Apps Script**.
3.  Delete any existing code in the editor (`Code.gs`).
4.  Copy and paste the code below:

```javascript
/**
 * StudentSync Backend - Google Apps Script
 * Handles CRUD operations via GET and POST requests.
 */

const SHEET_NAME = "Students";
const SS = SpreadsheetApp.getActiveSpreadsheet();

/**
 * SETUP function: Run this once to initialize the sheet structure.
 * Select 'setup' in the toolbar and click 'Run'.
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

/**
 * READ Operation
 * Triggered by a standard HTTP GET request.
 */
function doGet(e) {
  try {
    const sheet = SS.getSheetByName(SHEET_NAME);
    if (!sheet) return createJsonResponse({ status: "Error", message: "Sheet not found. Run setup() first." });
    
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
    
    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({ status: "Error", message: error.toString() });
  }
}

/**
 * CREATE, UPDATE, DELETE Operations
 * Triggered by an HTTP POST request with a JSON body.
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const sheet = SS.getSheetByName(SHEET_NAME);
    if (!sheet) return createJsonResponse({ status: "Error", message: "Sheet not found. Run setup() first." });
    
    if (action === "addStudent") {
      const id = Utilities.getUuid();
      sheet.appendRow([id, params.name, params.class, params.roll, params.mobile]);
      return createJsonResponse({ status: "Success", message: "Student added", id });
    }
    
    if (action === "updateStudent") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === params.id) {
          // Columns are 1-indexed (A=1, B=2...)
          sheet.getRange(i + 1, 2).setValue(params.name);
          sheet.getRange(i + 1, 3).setValue(params.class);
          sheet.getRange(i + 1, 4).setValue(params.roll);
          sheet.getRange(i + 1, 5).setValue(params.mobile);
          return createJsonResponse({ status: "Success", message: "Student updated" });
        }
      }
      return createJsonResponse({ status: "Error", message: "Student not found" });
    }
    
    if (action === "deleteStudent") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === params.id) {
          sheet.deleteRow(i + 1);
          return createJsonResponse({ status: "Success", message: "Student deleted" });
        }
      }
      return createJsonResponse({ status: "Error", message: "Student not found" });
    }

    return createJsonResponse({ status: "Error", message: "Invalid action" });
  } catch (error) {
    return createJsonResponse({ status: "Error", message: error.toString() });
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 2. Automatic Initialization (NEW)
1.  After pasting the code, look at the toolbar in the Apps Script editor.
2.  Select the **`setup`** function from the dropdown list.
3.  Click **Run**.
4.  This will automatically create the `Students` sheet with the correct headers and formatting. You don't need to create the sheet manually!

## 3. Deployment Steps
1.  Click **Deploy** (top right) > **New Deployment**.
2.  Click the "Select type" (gear icon) and choose **Web app**.
3.  Fill in the details:
    -   **Description**: `StudentSync API v1`
    -   **Execute as**: `Me`
    -   **Who has access**: `Anyone`
4.  Click **Deploy**.
5.  If prompted, click **Authorize Access**, select your account, click **Advanced**, and then click **Go to StudentSync (unsafe)**.
6.  **Copy the "Web app" URL**.

## 4. Tips
-   **New Updates**: Every time you change the script code, you **MUST** create a "New Deployment" to update the live API.
-   **Setup**: If you accidentally delete the `Students` sheet, just run the `setup()` function again to restore the structure.
