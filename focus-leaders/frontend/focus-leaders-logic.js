import { getFirestore, collection, getDocs, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { auth } from "../../config/firebase-config.js";

const db = getFirestore();

async function loadLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list");
  if (!leaderboardList) return;

  leaderboardList.innerHTML = "Loading...";

  try {
    const usersQuery = query(
      collection(db, "userStats"),
      orderBy("timersFinished", "desc")
    );

    const usersSnap = await getDocs(usersQuery);
    leaderboardList.innerHTML = "";

    let rank = 1;
    const currentUser = auth.currentUser?.email || null;

    usersSnap.forEach((doc) => {
      const data = doc.data();
      const email = data.email ?? "anonymous";
      const score = data.timersFinished ?? 0;

      let medal = "";
      if (rank === 1) medal = "🥇 ";
      else if (rank === 2) medal = "🥈 ";
      else if (rank === 3) medal = "🥉 ";

      const item = document.createElement("li");
      item.classList.add("leaderboard-item");

      const isCurrentUser = currentUser && email === currentUser;
      if (isCurrentUser) {
        item.classList.add("leaderboard-current-user");
      }

      item.innerHTML = `
        <span class="leaderboard-rank">${medal || rank}</span>
        <span class="leaderboard-email">${email}</span>
        <span class="leaderboard-score">${score}</span>
      `;

      leaderboardList.appendChild(item);
      rank++;
    });

  } catch (error) {
    leaderboardList.innerHTML = "Error loading leaderboard";
    console.error("Leaderboard error:", error);
  }
}

loadLeaderboard();

const streakButton = document.getElementById('streak-button');
const streakModal = document.getElementById('streak-modal');
const modalClose = document.querySelector('.modal-close');
const menuButton = document.getElementById("menu-button");
const menuDropdown = document.getElementById("menu-dropdown")

menuButton.addEventListener('click', function() {
    menuDropdown.classList.toggle('active');
});



if (streakButton && streakModal && modalClose) {
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
}

document.addEventListener('click', function(event) {
    if (!event.target.closest('#navbar')) {
        menuDropdown.classList.remove('active');
    }
});

