import { auth } from '../../config/firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const signOutButton = document.getElementById("sign-out-button");

const logOut = async () => {
  try {
    await signOut(auth);
    console.log(`current user email: ${auth?.currentUser?.email}`);
  } catch (error) {
    console.log(error)
  }
}

signOutButton.onclick = logOut;