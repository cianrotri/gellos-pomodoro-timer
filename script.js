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
        timerSeconds++;
        if (timerSeconds === 60) {
            timerSeconds = 0;
            timerMinutes++;
        }
        if (timerMinutes === 60) {
            timerMinutes = 0;
            timerHours++;
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
    timerHours = 0;
    timerMinutes = 0;
    timerSeconds = 0;
    focusMinutes = 0;
    isRunning = false;
    updateDisplay();
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
