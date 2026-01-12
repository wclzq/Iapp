# Moment Countdown App

A simple and beautiful moment recording and countdown app for Android.

## Features
- Countdown to important days (Birthdays, Anniversaries, Holidays)
- Support for Solar and Lunar calendars
- Custom background images
- Sticky events
- Data stored locally on device

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run in development mode:
   ```bash
   npm run dev
   ```

## How to Build APK (Android)

To package this web application into an Android APK, we will use [Capacitor](https://capacitorjs.com/).

### Prerequisites
- **Node.js** installed.
- **Android Studio** installed on your computer.

### Steps

1. **Initialize Capacitor** (Already done in instructions below, but good to know):
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init
   ```
   *Follow prompts: App name "Moment", App ID "com.moment.countdown"*

2. **Build the Web App**:
   ```bash
   npm run build
   ```

3. **Add Android Platform**:
   ```bash
   npx cap add android
   ```

4. **Sync Project**:
   ```bash
   npx cap sync
   ```

5. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

6. **Build APK in Android Studio**:
   - Wait for Gradle sync to finish.
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once finished, locate the APK file (usually in `android/app/build/outputs/apk/debug/app-debug.apk`) and transfer it to your phone to install.

### Note on Images
Since this app stores data (including images) in `localStorage`, very large images might exceed storage limits. The app restricts uploads to 2MB, but for a production-ready app, using the native filesystem (via Capacitor Filesystem plugin) would be better for heavy image usage.