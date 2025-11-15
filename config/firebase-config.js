import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
// import { getAnalytics } from "firebase/analytics";

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
export const auth = getAuth(app);
// const analytics = getAnalytics(app);