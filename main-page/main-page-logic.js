var accountButton = document.getElementById("account-button");
var streakButton = document.getElementById("streak-button");
var leaderboardButton = document.getElementById("leaderboard-button");
var pomodoroTitle = document.getElementById("pomodoro-title");
var menuButton = document.getElementById("menu-button");
var workButton = document.getElementById("work-button");
var shortBreakButton = document.getElementById("short-break-button");
var longBreakButton = document.getElementById("long-break-button");
var timerTime = document.getElementById("timer-time");
var startStopButton = document.getElementById("start-button");
var resetButton = document.getElementById("reset-button");
var work_25_minutes = 1500;
var break_5_minutes = 300;
var break_15_minutes = 900;
var timeDuration = 1500;
var timeLeft = timeDuration; // Time is in seconds
var minutes = 25;
var seconds = 0;
var isRunning = false;
var interval;
var updateTime = function () {
    minutes = Math.floor(timeLeft / 60);
    seconds = (timeLeft % 60);
    timerTime.innerHTML =
        "".concat(minutes.toString().length === 1 ? "0" + minutes.toString() : minutes.toString(), ":").concat(seconds.toString().length === 1 ? "0" + seconds.toString() : seconds.toString());
};
var stateSwitch = function () {
    if (isRunning) {
        startStopButton.innerHTML = "Stop";
        startStopButton.style.backgroundColor = "rgb(219, 61, 39)";
        workButton.classList.remove("main-button");
        shortBreakButton.classList.remove("main-button");
        longBreakButton.classList.remove("main-button");
    }
    else {
        startStopButton.innerHTML = "Start";
        startStopButton.style.backgroundColor = "rgba(41, 195, 46, 1)";
        workButton.classList.add("main-button");
        shortBreakButton.classList.add("main-button");
        longBreakButton.classList.add("main-button");
    }
};
var startStopTimer = function () {
    if (isRunning) {
        clearInterval(interval);
        isRunning = false;
        updateTime();
        stateSwitch();
        return;
    }
    isRunning = true;
    stateSwitch();
    interval = setInterval(function () {
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
    }, 1000);
};
var resetTimer = function () {
    clearInterval(interval);
    isRunning = false;
    timeLeft = timeDuration;
    updateTime();
    stateSwitch();
};
var timeSwitch = function (time) {
    if (isRunning) {
        return;
    }
    timeDuration = time;
    timeLeft = timeDuration;
    updateTime();
};
startStopButton.addEventListener("click", startStopTimer);
resetButton.addEventListener("click", resetTimer);
workButton.addEventListener("click", function () { return timeSwitch(work_25_minutes); });
shortBreakButton.addEventListener("click", function () { return timeSwitch(break_5_minutes); });
longBreakButton.addEventListener("click", function () { return timeSwitch(break_15_minutes); });
// accountButton.addEventListener("click", () => changeLink)
