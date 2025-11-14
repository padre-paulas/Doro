accountButton = document.getElementById("account-button");
streakButton = document.getElementById("streak-button");
leaderboardButton = document.getElementById("leaderboard-button");
pomodoroTitle = document.getElementById("pomodoro-title");
menuButton = document.getElementById("menu-button");
workButton = document.getElementById("work-button");
shortBreakButton = document.getElementById("short-break-button");
longBreakButton = document.getElementById("long-break-button");
timerTime = document.getElementById("timer-time");
startStopButton = document.getElementById("start-button");
//stopButton = document.getElementById("stop-button");
resetButton = document.getElementById("reset-button");

const work_25_minutes = 1500;
const break_5_minutes = 300;
const break_15_minutes = 900;

let timeDuration = 1500;
let timeLeft = timeDuration; // Time is in seconds
let minutes = 25;
let seconds = 0;
let isRunning = false;
let interval;

const updateTime = () => {
  minutes = Math.floor(timeLeft / 60);
  seconds = (timeLeft % 60);
  timerTime.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const stateSwitch = () => {
  if (isRunning) {
    startStopButton.innerHTML = "Stop";
    startStopButton.style.backgroundColor = "rgb(219, 61, 39)";
    
    workButton.classList.remove("main-button");
    shortBreakButton.classList.remove("main-button");
    longBreakButton.classList.remove("main-button"); 
  } else {
    startStopButton.innerHTML = "Start";
    startStopButton.style.backgroundColor = "rgba(41, 195, 46, 1)";
    workButton.classList.add("main-button");
    shortBreakButton.classList.add("main-button");
    longBreakButton.classList.add("main-button"); 
  } 
}

const startStopTimer = () => {
  if (isRunning) {
    clearInterval(interval);
    isRunning = false;
    updateTime();
    stateSwitch();
    return;
  }
  isRunning = true;
  stateSwitch();
  interval = setInterval(() => {
    if (timeLeft <= 0) {
      isRunning = false;
      stateSwitch();
      alert("Time's up!");
      clearInterval(interval);
      timeLeft = timeDuration;
      updateTime();
      return;
    }
    timeLeft--;
    updateTime();
  }, 1000)
}

// const stopTimer = () => {
//   clearInterval(interval);
//   isRunning = false;
//   updateTime();
// }

const resetTimer = () => {
  clearInterval(interval);
  isRunning = false;
  timeLeft = timeDuration;
  updateTime();
  stateSwitch();
}

const timeSwitch = (time) => {
  if (isRunning) {
    return;
  }
  timeDuration = time;
  timeLeft = timeDuration;
  updateTime();
}

startStopButton.addEventListener("click", startStopTimer);
//stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
workButton.addEventListener("click", () => timeSwitch(work_25_minutes));
shortBreakButton.addEventListener("click", () => timeSwitch(break_5_minutes));
longBreakButton.addEventListener("click", () => timeSwitch(break_15_minutes));