import { auth, googleProvider, app } from "../../config/firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const db = getFirestore(app);

// DOM elements
const accountButton = document.getElementById("account-button");
const signUpButton = document.getElementById("sign-up-button");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const signUpGoogleButton = document.getElementById("sign-up-with-google-button");

// Update account button link dynamically
const changeLink = (user) => {
  if (user) {
    accountButton.href = 'user-account.html';
  } else {
    accountButton.href = 'auth.html';
  }
};

// Check if Firestore doc exists or create it
const ensureUserDoc = async (user) => {
  const userRef = doc(db, "userStats", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      secondsFocused: 0,
      timersFinished: 0
    });
  }
};

// Email/password signup or login
const signUp = async () => {
  try {
    // Try login first
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    await ensureUserDoc(user);
    changeLink(user);
    return openAccountPage();
  } catch (error) {
    console.log("This is EROROROORORO:", error)
    // if (error.code === "auth/user-not-found") {
      // If user doesn't exist, create account
      try {
        console.log("Did we get here?")
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        await ensureUserDoc(user);
        changeLink(user);
        return openAccountPage();
      } catch (createError) {
        console.error("Error creating user:", createError);
      }
    // } else {
    //   console.error("Login error:", error);
    // }
  }
};

// Google signup/login
const signUpGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await ensureUserDoc(user);
    changeLink(user);
    openAccountPage();
  } catch (error) {
    console.error("Google login error:", error);
  }
};

// Redirect helper
const openAccountPage = () => {
  window.location.href = 'user-account.html';
};

// Update account link on page load
onAuthStateChanged(auth, (user) => {
  changeLink(user);
});

// Event listeners
signUpButton.onclick = signUp;
signUpGoogleButton.onclick = signUpGoogle;