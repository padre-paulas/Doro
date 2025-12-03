import { auth } from '../../config/firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";


const signUpButton = document.getElementById("sign-up-button");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const signUpGoogleButton = document.getElementById("sign-up-with-google-button");
const logOutButton = document.getElementById("sign-out-button");
const emailElem = document.getElementById("user-email");
  
// if (signUpButton) {
//   const signUp = async () => {
//     console.log(`You are logged in with this email: ${auth?.currentUser?.email}`)
//     try {
//       await createUserWithEmailAndPassword(auth, email.value, password.value);
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const signUpGoogle = async () => {
//     try {
//       await signInWithPopup(auth, googleProvider);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const logOut = async () => {
//     try {
//       await signOut(auth);
//       console.log(auth?.currentUser?.email);
//       window.location.href = 'auth.html';
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   signUpButton.onclick = signUp;
//   signUpGoogleButton.onclick = signUpGoogle;
//   logOutButton.onclick = logOut;
// }

const showUserInfo = () => {
  emailElem.innerHTML = auth?.currentUser?.email;

}
showUserInfo();

onAuthStateChanged(auth, (user) => {
  if (user) {
    showUserInfo();
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

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('#navbar')) {
      menuDropdown.classList.remove('active');
    }
  });
}

// Streak modal functionality
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

// Close modal when clicking outside the content
streakModal.addEventListener('click', function(event) {
  if (event.target === streakModal) {
    streakModal.classList.remove('active');
  }
});

logOutButton.onclick = logOut;

