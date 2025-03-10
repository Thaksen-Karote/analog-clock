// Theme functionality
function setTheme(themeName) {
    // Update theme buttons
    document.querySelectorAll('.theme-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.theme-${themeName}`).classList.add('active');
    
    // Update body
    document.body.className = `theme-${themeName}`;
    
    // Update clock
    document.querySelector('.clock').className = `clock theme-${themeName}`;
    
    // Update alarm container
    document.querySelector('.alarm-container').className = `alarm-container theme-${themeName}`;

    //update stopwatch container
    document.querySelector('.stopwatch-container').className = `stopwatch-container theme-${themeName}`;
    document.querySelector('.timer-container').className = `timer-container theme-${themeName}`;

}

// ANALOG CLOCK
let selectedTimezone = "Asia/Kolkata"; // Default timezone

function updateClock() {
    let now = new Date(new Date().toLocaleString("en-US", { timeZone: selectedTimezone }));

    let hours = now.getHours() % 12 || 12; 
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    let timeString = 
        String(hours).padStart(2, '0') + ':' + 
        String(minutes).padStart(2, '0') + ':' + 
        String(seconds).padStart(2, '0') + ' ' + ampm;

    document.getElementById("digital-clock").textContent = timeString;

    let secondDegree = (seconds * 6) - 90;
    let minuteDegree = (minutes * 6 + seconds * 0.1) - 90;
    let hourDegree = (hours * 30 + minutes * 0.5) - 90;

    document.getElementById("second-hand").style.transform = `rotate(${secondDegree}deg)`;
    document.getElementById("minute-hand").style.transform = `rotate(${minuteDegree}deg)`;
    document.getElementById("hour-hand").style.transform = `rotate(${hourDegree}deg)`;
}

// Function to change timezone
function setTimezone(timezone) {
    selectedTimezone = timezone;
    const buttons = document.querySelectorAll('.time-zone-button');
    buttons.forEach(button => button.classList.remove('active'));
    const clickedButton = document.querySelector(`[data-tooltip="${timezone}"]`);
    clickedButton.classList.add('active');

    // Update the clock
    updateClock();
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); 

// ANALOG CLOCK END

// ALARM START
function populateTimeDropdowns() {
    const hourSelect = document.getElementById("alarm-hour");
    const minuteSelect = document.getElementById("alarm-minute");

    if (!hourSelect || !minuteSelect) {
        console.error("Dropdown elements not found!");
        return;
    }

    // Clear previous options
    hourSelect.innerHTML = "";
    minuteSelect.innerHTML = "";

    // Add hour options (1-12)
    for (let i = 1; i <= 12; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        hourSelect.appendChild(option);
    }

    // Add minute options (00-59)
    for (let i = 0; i < 60; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i < 10 ? "0" + i : i;
        minuteSelect.appendChild(option);
    }
}

// Initialize time dropdowns
populateTimeDropdowns();

let alarmTime = null;

function setAlarm() {
    let hourSelect = document.getElementById("alarm-hour");
    let minuteSelect = document.getElementById("alarm-minute");
    let period = document.getElementById("alarm-period").value;

    if (!hourSelect || !minuteSelect) {
        console.error("Dropdown elements not found when setting alarm!");
        return;
    }

    let hour = parseInt(hourSelect.value);
    let minute = parseInt(minuteSelect.value);
    
    // Format minute with leading zero for display
    let displayMinute = minute < 10 ? "0" + minute : minute;
    
    alarmTime = {
        hour: hour,
        minute: minute,
        period: period
    };
    
    console.log("Alarm set for:", alarmTime);
    
    document.getElementById("alarm-time-display").innerText = `Alarm set for ${hour}:${displayMinute} ${period}`;
    document.getElementById("cancel-alarm").style.display = "inline-block";
}

function cancelAlarm() {
    alarmTime = null;
    document.getElementById("alarm-time-display").innerText = " ";
    document.getElementById("cancel-alarm").style.display = "none";
}

function checkAlarm() {
    if (!alarmTime) return;

    let now = new Date();
    let currentHours = now.getHours();
    let currentMinutes = now.getMinutes();
    let currentAMPM = currentHours >= 12 ? "PM" : "AM";
    let currentHour12 = currentHours % 12 || 12;
    
    if (currentHour12 === alarmTime.hour && 
        currentMinutes === alarmTime.minute && 
        currentAMPM === alarmTime.period) {
        document.getElementById("alarm-sound").play();
        alert("⏰ Alarm Ringing!");
        cancelAlarm();
    }
}

// Call checkAlarm() every second
setInterval(checkAlarm, 1000);
// ALARM END


// STOP WATCH AND TIMER
let stopwatchInterval;
let stopwatchTime = 0;
let isStopwatchRunning = false;

function updateStopwatchDisplay() {
    let hours = Math.floor(stopwatchTime / 3600);
    let minutes = Math.floor((stopwatchTime % 3600) / 60);
    let seconds = stopwatchTime % 60;
    document.getElementById("stopwatch-display").textContent =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startStopwatch() {
    if (!isStopwatchRunning) {
        isStopwatchRunning = true;
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 1000);
    }
}

function pauseStopwatch() {
    clearInterval(stopwatchInterval);
    isStopwatchRunning = false;
}

function resetStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    updateStopwatchDisplay();
    isStopwatchRunning = false;
}

// TIMER
let timerInterval;
let timerTime = 0;
let isTimerRunning = false;

function populateTimeOptions() {
    let hourSelect = document.getElementById("hours");
    let minuteSelect = document.getElementById("minutes");
    let secondSelect = document.getElementById("seconds");

    for (let i = 0; i <= 24; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i.toString().padStart(2, "0");
        hourSelect.appendChild(option);
    }

    for (let i = 0; i < 60; i++) {
        let optionMin = document.createElement("option");
        let optionSec = document.createElement("option");
        optionMin.value = i;
        optionSec.value = i;
        optionMin.textContent = optionSec.textContent = i.toString().padStart(2, "0");
        minuteSelect.appendChild(optionMin);
        secondSelect.appendChild(optionSec);
    }
}

function updateTimerDisplay() {
    let hours = Math.floor(timerTime / 3600);
    let minutes = Math.floor((timerTime % 3600) / 60);
    let seconds = timerTime % 60;
    document.getElementById("timer-display").textContent =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
    if (!isTimerRunning) {
        let hours = parseInt(document.getElementById("hours").value);
        let minutes = parseInt(document.getElementById("minutes").value);
        let seconds = parseInt(document.getElementById("seconds").value);
        timerTime = hours * 3600 + minutes * 60 + seconds;

        if (timerTime > 0) {
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if (timerTime > 0) {
                    timerTime--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    alert("Timer Done!");
                }
            }, 1000);
        }
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    document.getElementById("hours").value = 0;
    document.getElementById("minutes").value = 0;
    document.getElementById("seconds").value = 0;
    timerTime = 0;
    updateTimerDisplay();
}

populateTimeOptions();
updateStopwatchDisplay();
updateTimerDisplay();








