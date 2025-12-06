import { auth, googleProvider, app } from "../../config/firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const db = getFirestore(app);

const accountButton = document.getElementById("account-button");
const signUpButton = document.getElementById("sign-up-button");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const signUpGoogleButton = document.getElementById("sign-up-with-google-button");

const changeLink = (user) => {
  if (user) {
    accountButton.href = 'user-account.html';
  } else {
    accountButton.href = 'auth.html';
  }
};

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

const signUp = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    await ensureUserDoc(user);
    changeLink(user);
    return openAccountPage();
  } catch (error) {
    console.log("This is EROROROORORO:", error)
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
  }
};

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

const openAccountPage = () => {
  window.location.href = 'user-account.html';
};

onAuthStateChanged(auth, (user) => {
  changeLink(user);
});

signUpButton.onclick = signUp;
signUpGoogleButton.onclick = signUpGoogle;