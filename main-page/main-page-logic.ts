const accountButton = document.getElementById("account-button") as HTMLButtonElement;
const streakButton = document.getElementById("streak-button") as HTMLButtonElement;
const leaderboardButton = document.getElementById("leaderboard-button") as HTMLButtonElement;
const pomodoroTitle = document.getElementById("pomodoro-title") as HTMLHeadingElement;
const menuButton = document.getElementById("menu-button") as HTMLButtonElement;
const workButton = document.getElementById("work-button") as HTMLButtonElement;
const shortBreakButton = document.getElementById("short-break-button") as HTMLButtonElement;
const longBreakButton = document.getElementById("long-break-button") as HTMLButtonElement;
const timerTime = document.getElementById("timer-time") as HTMLHeadingElement;
const startStopButton = document.getElementById("start-button") as HTMLButtonElement;
const resetButton = document.getElementById("reset-button") as HTMLButtonElement;

const work_25_minutes: number = 1500;
const break_5_minutes: number = 300;
const break_15_minutes: number = 900;

let timeDuration: number = 1500;
let timeLeft: number = timeDuration; // Time is in seconds
let minutes: number = 25;
let seconds: number = 0;
let isRunning: boolean = false;
let interval: number;

const updateTime = () => {
  minutes = Math.floor(timeLeft / 60);
  seconds = (timeLeft % 60);
  timerTime.innerHTML = 
  `${minutes.toString().length === 1 ? "0" + minutes.toString() : minutes.toString()}:${seconds.toString().length === 1 ? "0" + seconds.toString() : seconds.toString()}`;
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

const resetTimer = () => {
  clearInterval(interval);
  isRunning = false;
  timeLeft = timeDuration;
  updateTime();
  stateSwitch();
}

const timeSwitch = (time: number) => {
  if (isRunning) {
    return;
  }
  timeDuration = time;
  timeLeft = timeDuration;
  updateTime();
}

startStopButton.addEventListener("click", startStopTimer);
resetButton.addEventListener("click", resetTimer);
workButton.addEventListener("click", () => timeSwitch(work_25_minutes));
shortBreakButton.addEventListener("click", () => timeSwitch(break_5_minutes));
longBreakButton.addEventListener("click", () => timeSwitch(break_15_minutes));