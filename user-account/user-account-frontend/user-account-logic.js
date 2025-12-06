import { auth } from '../../config/firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";


const signUpButton = document.getElementById("sign-up-button");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const signUpGoogleButton = document.getElementById("sign-up-with-google-button");
const logOutButton = document.getElementById("sign-out-button");
const emailElem = document.getElementById("user-email");
const sessionsNumber = document.getElementById("number-sessions");
const hoursFocused = document.getElementById("number-seconds");

const db = getFirestore();

const getInfoFromDB = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "userStats", user.uid);
  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const timersFinished = data.timersFinished ?? 0;
      const numberSeconds = data.secondsFocused ?? 0;
      sessionsNumber.innerHTML = timersFinished.toString();
      hoursFocused.innerHTML = (numberSeconds / 3600).toFixed(2).toString();
    } else {
      console.log("No doc found for the user");
      sessionsNumber.innerHTML = "0";
      hoursFocused.innerHTML = "0";
    }

  } catch (error) {
    console.error(error);
  }
}



const showUserInfo = () => {
  emailElem.innerHTML = auth?.currentUser?.email;
}
showUserInfo();

onAuthStateChanged(auth, (user) => {
  if (user) {
    showUserInfo();
    getInfoFromDB();
  }
})

const logOut = async () => {
  try {
    await signOut(auth);
    console.log(auth?.currentUser?.email);
    window.location.href = 'auth.html';
  } catch (error) {
    console.log(error)
  }
}

const menuButton = document.getElementById('menu-button');
const menuDropdown = document.getElementById('menu-dropdown');

if (menuButton && menuDropdown) {
  menuButton.addEventListener('click', function() {
    menuDropdown.classList.toggle('active');
  });

  document.addEventListener('click', function(event) {
    if (!event.target.closest('#navbar')) {
      menuDropdown.classList.remove('active');
    }
  });
}

var streakModal = document.getElementById('streak-modal');
var streakButton = document.getElementById('streak-button');
var modalClose = document.querySelector('.modal-close');

streakButton.addEventListener('click', function(event) {
  event.preventDefault();
  streakModal.classList.add('active');
});

modalClose.addEventListener('click', function() {
  streakModal.classList.remove('active');
});

streakModal.addEventListener('click', function(event) {
  if (event.target === streakModal) {
    streakModal.classList.remove('active');
  }
});

logOutButton.onclick = logOut;

