# StudentSync Backend Guide: Google Apps Script & Sheets

This guide provides the complete setup for your Google Sheets backend. This approach allows you to use Google Sheets as a free, reliable REST-style database.

## 1. Data Structure (Google Sheet)
1.  Create a new Google Sheet.
2.  Rename the active sheet (tab) to exactly: `Students`.
3.  Set up the headers in the first row (A1 to E1):
    -   **A1**: `id`
    -   **B1**: `name`
    -   **C1**: `class`
    -   **D1**: `roll`
    -   **E1**: `mobile`

## 2. Google Apps Script Implementation
1.  In your Google Sheet, go to **Extensions** > **Apps Script**.
2.  Delete any existing code in the editor (`Code.gs`).
3.  Copy and paste the code below:

```javascript
/**
 * StudentSync Backend - Google Apps Script
 * Handles CRUD operations via GET and POST requests.
 */

const SHEET_NAME = "Students";
const SS = SpreadsheetApp.getActiveSpreadsheet();

/**
 * READ Operation
 * Triggered by a standard HTTP GET request.
 */
function doGet(e) {
  try {
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

## 3. Deployment Steps (Crucial)
1.  Click the **Deploy** button (top right) > **New Deployment**.
2.  Click the "Select type" (gear icon) and choose **Web app**.
3.  Fill in the details:
    -   **Description**: `StudentSync API v1`
    -   **Execute as**: `Me` (your email)
    -   **Who has access**: `Anyone`
4.  Click **Deploy**.
5.  If prompted, click **Authorize Access**, select your Google account, click **Advanced**, and then click **Go to StudentSync (unsafe)**. Allow the permissions.
6.  **Copy the "Web app" URL**. It should end in `/exec`.

## 4. Troubleshooting & Tips
-   **CORS**: Google Apps Script handles CORS by redirecting requests. The `axios` library used in the app handles this automatically.
-   **New Updates**: Every time you change the script code, you **MUST** create a "New Deployment" (or manage deployment and update the version) to see the changes. Simply saving the script does not update the live API.
-   **Execution as "Me"**: This ensures the script has permission to edit *your* sheet even when a request comes from an anonymous app user.
-   **Privacy**: Do not share the `/exec` URL publicly as "Anyone" can modify your sheet with it. For better security, you can implement a simple token check in the `doPost` function.
