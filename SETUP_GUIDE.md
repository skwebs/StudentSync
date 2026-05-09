# StudentSync Setup Guide

## 1. Google Sheets Setup
1. Create a new Google Sheet.
2. Rename the first sheet to **"Students"**.
3. Add headers in Row 1: `id`, `name`, `class`, `roll`, `mobile`.

## 2. Google Apps Script Deployment
1. Open the Sheet, click **Extensions > Apps Script**.
2. Replace the code with the contents of `Code.gs` from this project.
3. Click **Deploy > New Deployment**.
4. Select Type: **Web App**.
5. Description: "StudentSync API".
6. Execute as: **Me**.
7. Who has access: **Anyone** (This is required for the app to access it without OAuth).
8. Click **Deploy**.
9. **IMPORTANT**: Copy the **Web App URL**. It looks like `https://script.google.com/macros/s/.../exec`.

## 3. App Configuration
1. Open `.env` in the project root.
2. Paste your URL: `GOOGLE_APPS_SCRIPT_URL=your_copied_url_here`.

## 4. Local Build (Android)
1. Install dependencies: `npm install`.
2. Generate native code: `npm run prebuild`.
3. Run on device: `npm run android`.
4. Generate Release APK: `npm run apk:arm64`.

## 5. Senior Developer Tips
- **Security**: The Apps Script URL is public. For a production app, consider adding a `secret_key` check in `doPost` and sending it from the app.
- **Caching**: The app currently fetches data on every load. Consider using `react-query` or `SWR` for better state management and caching.
- **Offline Support**: Use `AsyncStorage` to cache the student list locally for offline viewing.
