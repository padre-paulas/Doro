import { auth, googleProvider } from "../../config/firebase-config.js";
import {  createUserWithEmailAndPassword, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const signUpButton = document.getElementById("sign-up-button");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const signUpGoogleButton = document.getElementById("sign-up-with-google-button");
const logOutButton = document.getElementById("log-out-button");
  


const signUp = async () => {
  console.log(`You are logged in with this email: ${auth?.currentUser?.email}`)
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
  } catch (error) {
    console.log(error)
  }
}

const signUpGoogle = async () => {

  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log(`You are logged in with Google, here's your name: ${result?.user?.displayName}`)
  } catch (error) {
    console.log(error);
  }
 
}

// const logOut = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     console.log(error)
//   }
// }

signUpButton.onclick = signUp;
signUpGoogleButton.onclick = signUpGoogle;
// logOutButton.onclick = logOut;