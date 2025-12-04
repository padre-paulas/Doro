🍅 Doro

Stay Focused. Get Streaks. Connect.

Doro is a lightweight, gamified Pomodoro timer application built entirely with Vanilla JavaScript and Firebase. It combines personal productivity tracking with social accountability through leaderboards and a community forum.

✨ Features

⏱️ Productivity

Pomodoro Timer: Standard 25/5 intervals (customizable).

Audio Notifications: Sound alerts when a session ends.

Dynamic Title: The browser tab updates with the remaining time.

🎮 Gamification

Streak System: Tracks how many consecutive days you've used the app.

XP & Levels: Earn experience points for every minute of focus.

Global Leaderboard: Compete with other users for the top spot based on focus time.

👥 Community

User Accounts: Secure authentication via Email/Password or Google Sign-In.

Discussion Forum:

Create topics.

Reply to other users.

Real-time updates.

🛠️ Tech Stack

Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+).

Backend-as-a-Service: Firebase.

Firebase Auth: User management and security.

Cloud Firestore: NoSQL database for storing user stats, posts, and leaderboards.

🚀 Getting Started

Follow these instructions to get a copy of the project running on your local machine.

Prerequisites

A code editor (VS Code recommended).

A Google account (to set up Firebase).

A local web server (e.g., Live Server extension for VS Code, or Python http.server).

Installation

Clone the repository

git clone [https://github.com/padre-paulas/Doro](https://github.com/padre-paulas/Doro)
cd doro


Firebase Setup

Go to the Firebase Console.

Create a new project named Doro.

Authentication: Go to Build > Authentication and enable Email/Password (and Google if you implemented it).

Database: Go to Build > Firestore Database and create a database. Start in Test Mode (remember to secure rules later).

Configuration

In your project settings in Firebase, scroll down to "Your apps" and select the Web </> icon.

Register the app (you don't need Firebase Hosting yet).

Copy the firebaseConfig object provided.

Create a file named config.js (or find the existing placeholder) in your js/ folder and paste your keys:

// js/config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


Database Rules (Firestore)
To ensure the leaderboard and forum work, ensure your data structure matches your code. A basic rule set for development:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}


Run the App

Open index.html with your Live Server.

Sign up for an account and start focusing!

📂 Project Structure

doro/
├── index.html        # Main application structure
├── styles/
│   ├── main.css      # Core styling
│   └── components.css # Specific styles for forum/timer
├── js/
│   ├── app.js        # Main logic initialization
│   ├── auth.js       # Firebase Auth logic
│   ├── timer.js      # Pomodoro logic
│   ├── forum.js      # CRUD operations for the forum
│   └── db.js         # Firestore interactions (Leaderboard/Streaks)
└── README.md


🔮 Future Improvements

[ ] Dark/Light mode toggle.

[ ] User profile customization (avatars).

[ ] Mobile responsive adjustments (PWA support).

[ ] "Teams" feature for group studying.

🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License

Distributed under the MIT License. See LICENSE for more information.

📧 Contact

padre-paulas - @padre-paulas - pavlo.nord@gmail.com
Nerekin - @nerekin - cheemscheemsovich@gmail.com

Project Link: https://github.com/padre-paulas/Doro