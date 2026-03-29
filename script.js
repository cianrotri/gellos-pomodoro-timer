// TO DO LIST 
    
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const taskWarning = document.getElementById("task-warning");
const MAX_TASKS = 8;

function createTaskItem(taskText) {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const span = document.createElement("span");
    span.textContent = taskText;
    span.addEventListener("click", () => {
        li.classList.toggle("completed");
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
        li.remove()
        if (taskList.children.length < MAX_TASKS) {
        taskWarning.style.display = "none"; // hide warning if below max
        }
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
}

addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;
    if (taskList.children.length >= MAX_TASKS) {
        taskWarning.style.display = "block";
        return;
    }

    const taskItem = createTaskItem(text);
    taskList.appendChild(taskItem);
    taskInput.value = "";
    taskWarning.style.display = "none";
});

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTaskBtn.click();
});

//FOR MODE SWITCHING 

let mode = "custom"; // "custom" or "pomodoro"
let pomodoroPhase = "focus"; // "focus" or "break"

const POMODORO_FOCUS = 45 * 60; // 45 min
const POMODORO_BREAK = 15 * 60;  // 15 min

const customModeBtn = document.querySelector(".custom-mode-btn");
const pomodoroModeBtn = document.querySelector(".pomodoro-mode-btn");

customModeBtn.addEventListener("click", () => {
    mode = "custom";
    resetTimer();
});

pomodoroModeBtn.addEventListener("click", () => {
    mode = "pomodoro";
    pomodoroPhase = "focus";
    setPomodoroTime(POMODORO_FOCUS);
});

function setPomodoroTime(totalSeconds) {
    clearInterval(timerInterval);
    isRunning = false;

    timerHours = Math.floor(totalSeconds / 3600);
    timerMinutes = Math.floor((totalSeconds % 3600) / 60);
    timerSeconds = totalSeconds % 60;

    updateDisplay();
}

// TIMER 

let timerHours = 0;
let timerMinutes = 0;
let timerSeconds = 0;
let timerInterval = null;
let isRunning = false;

const hoursDisplay = document.getElementById("hours");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const resetBtn = document.querySelector(".reset-btn");
const breakBtn = document.querySelector(".break-btn");
const alarmSound = document.getElementById("alarm-sound");

function updateDisplay() {
    hoursDisplay.textContent = String(timerHours).padStart(2, "0");
    minutesDisplay.textContent = String(timerMinutes).padStart(2, "0");
    secondsDisplay.textContent = String(timerSeconds).padStart(2, "0");
}

function startBreakCountdown() {
    clearInterval(timerInterval); // stop any existing timer
    isRunning = true;

    timerInterval = setInterval(() => {
        if (timerSeconds === 0) {
            if (timerMinutes === 0) {
                if (timerHours === 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    alarmSound.play();
                    alert("Break's over! Back to focus.");
                    return;
                } else {
                    timerHours--;
                    timerMinutes = 59;
                    timerSeconds = 59;
                }
            } else {
                timerMinutes--;
                timerSeconds = 59;
            }
        } else {
            timerSeconds--;
        }
        updateDisplay();
    }, 1000);
}


function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timerInterval = setInterval(() => {

        if (mode === "custom") {
            // your original stopwatch behavior
            timerSeconds++;
            if (timerSeconds === 60) {
                timerSeconds = 0;
                timerMinutes++;
            }
            if (timerMinutes === 60) {
                timerMinutes = 0;
                timerHours++;
            }

        } else if (mode === "pomodoro") {
            // countdown behavior
            if (timerSeconds === 0) {
                if (timerMinutes === 0) {
                    if (timerHours === 0) {
                        // SWITCH PHASE
                        alarmSound.play();

                        if (pomodoroPhase === "focus") {
                            pomodoroPhase = "break";
                            alert("Break time!");
                            setPomodoroTime(POMODORO_BREAK);
                        } else {
                            pomodoroPhase = "focus";
                            alert("Back to focus!");
                            setPomodoroTime(POMODORO_FOCUS);
                        }

                        return;
                    } else {
                        timerHours--;
                        timerMinutes = 59;
                        timerSeconds = 59;
                    }
                } else {
                    timerMinutes--;
                    timerSeconds = 59;
                }
            } else {
                timerSeconds--;
            }
        }

        updateDisplay();
    }, 1000);
}


function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;

    if (mode === "pomodoro") {
        pomodoroPhase = "focus";
        setPomodoroTime(POMODORO_FOCUS);
    } else {
        timerHours = 0;
        timerMinutes = 0;
        timerSeconds = 0;
        updateDisplay();
    }
}

function breakTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    
    let totalFocusSeconds = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    let breakSeconds = Math.ceil(totalFocusSeconds * 0.4);

    timerHours = Math.floor(breakSeconds / 3600);
    timerMinutes = Math.floor((breakSeconds % 3600) / 60);
    timerSeconds = breakSeconds % 60;
    updateDisplay();

    startBreakCountdown();
}

let audioUnlocked = false;

startBtn.addEventListener("click", () => {
    if (!audioUnlocked) {
        alarmSound.play().then(() => {
            alarmSound.pause();
            alarmSound.currentTime = 0;
        }).catch(() => {});
        audioUnlocked = true;
    }

    startTimer();
});

pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
breakBtn.addEventListener("click", breakTimer);
