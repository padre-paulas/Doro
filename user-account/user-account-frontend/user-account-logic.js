import { auth } from "../../config/firebase-config.js";
import { createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const signUpButton = document.getElementById("sign-up-button");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");



const signUp = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error)
  }
}

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.log(error)
  }
}

signUpButton.onclick = signUp();
email.onchange = (e) => e.target.value;
password.onchange = (e) => e.target.value;