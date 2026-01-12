# Technical Architecture: Moment Countdown App

## 1. Technology Stack
- **Framework**: React (bootstrapped with Vite)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context + Hooks
- **Persistence**: Browser LocalStorage (Data stored on phone as requested)
- **Date Handling**: 
  - `dayjs` (General date manipulation)
  - `lunar-javascript` (Lunar date conversion)
- **Icons**: Lucide React
- **Packaging**: Capacitor (for converting the web app to an Android APK)

## 2. Project Structure
```
src/
├── assets/          # Static assets
├── components/      # Reusable UI components
│   ├── EventCard.jsx
│   ├── Layout.jsx
│   └── ...
├── context/         # Global state (EventContext)
├── hooks/           # Custom hooks (useCountdown)
├── pages/           # Route pages
│   ├── Home.jsx
│   ├── AddEditEvent.jsx
│   ├── EventDetail.jsx
│   └── Settings.jsx
├── utils/           # Helper functions
│   ├── dateUtils.js # Lunar/Solar logic
│   └── storage.js   # LocalStorage wrapper
└── App.jsx
```

## 3. Data Model (Event)
```json
{
  "id": "uuid-v4",
  "title": "Anniversary",
  "date": "2023-12-25", // Target date string
  "isLunar": false,     // Boolean: true if date is Lunar
  "type": "birthday",   // 'birthday' | 'anniversary' | 'holiday' | 'other'
  "repeat": "none",     // 'none' | 'yearly' | 'monthly'
  "backgroundImage": "data:image/...", // Base64 string or URL
  "topSticky": false    // Boolean: Pin to top
}
```

## 4. Key Feature Implementation

### A. Date Calculation Logic
- **Countdown**: Calculate difference between `now` and `targetDate`.
- **Repeating Events**: 
  - If `repeat` is 'yearly', calculate the *next* occurrence of the date (e.g., if birthday passed this year, show next year's).
  - Handle Lunar repeating events by converting current Lunar year/month/day to Solar for countdown calculation.

### B. Data Persistence
- Use `localStorage` to save the array of events.
- **Images**: Since this is a pure frontend app, user-uploaded background images will be converted to Base64 strings and stored in LocalStorage (with size limits warning) or IndexedDB if needed. For simplicity in this demo, we'll try Base64 with compression.

### C. APK Packaging
- Use **Capacitor**.
- Steps:
  1. `npm run build` (Generate dist folder)
  2. `npx cap add android`
  3. `npx cap sync`
  4. Open Android Studio to build APK.

## 5. UI/UX Design
- **Home**: List of events sorted by "days remaining". Top section for "Sticky" events.
- **Add/Edit**: Form with DatePicker, Toggle for Lunar/Solar, Category selector.
- **Detail**: Full-screen immersive view with background image, big countdown numbers.