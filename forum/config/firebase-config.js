// Forum-specific Firebase configuration using npm imports
// This file is only used by the forum (Vite-bundled) because it requires npm modules
// Other pages use the shared config/firebase-config.js with CDN imports

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7tz-wS0DAOQBPatghhPOG-aE3pID2my4",
  authDomain: "doro-a3099.firebaseapp.com",
  projectId: "doro-a3099",
  storageBucket: "doro-a3099.firebasestorage.app",
  messagingSenderId: "927214701968",
  appId: "1:927214701968:web:0f8f15652edccd0dea3715",
  measurementId: "G-K953D994BX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
