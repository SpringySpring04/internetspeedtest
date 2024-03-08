(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const testButton = document.getElementById('testButton');
testButton.addEventListener('click', toggleTestState);

// const slider = document.getElementById('avg_update_slider');
// slider.addEventListener('change', avg_update_interval_change)

/**
 * @description Maximum time for the speed test. Most network connections will be so fast that the elapsed time may never exceed this value.
 */
const _fixedTestTime = 15 * 1000;
var testTime = _fixedTestTime;

/**
 * @description Absurdly long variable name, pointed out by a user on discord.
 * The value of {@link cfg.average_download_speed_update_interval} is copied into this variable at each call to 
 * {@link toggleTestState}
 */
var avg_update_interval = cfg.average_download_speed_update_interval;

/**
 * @description Keeps track of sampled mbps values to average out the result.
 * The accuracy of this value is inversely proportional to @see avg_update_interval
 * @type {number[]}
 */
var speedHistory = [];
/**
 * @description Temp variable. Is added to {@link speedHistory} every {@link avg_update_interval} seconds.
 */
var addToSH = 0;
/**
 * @description Kind of like a pointer to the JS {@link setInterval} interval object that is created in the {@link startTest} function.
 * It is used in {@link clearInterval} in {@link toggleTestState} to prevent infinite interval / potential memory leak.
 */
var addToSHIntervalId = null;
/**
 * @description Gets the average of all the values in the {@link speedHistory} array.
 * @returns {number}  
 */
var getAverageSpeedHistory = () => { return speedHistory.reduce((p,n)=>p+n) / speedHistory.length; }

/**
 * @description Reference to the download speed span for displaying the current download speed.
 */
const span_dSpd = document.getElementById('dnld-spd');
/**
 * @description Reference to the average download speed span for displaying the average download speed.
 */
const span_dAvg = document.getElementById('dnld-avg');
/**
 * @description Reference to the result span for displaying the final results or other test state status messages.
 */
const span_result = document.getElementById('result');
/**
 * @description Reference to the elapsed time span for displaying the elapsed time.
 */
const span_time   = document.getElementById('elapsed-time');

/**
 * @description Toggles the test state on each press of the button. Initializes and sets a lot of the variables in the program.
 */
function toggleTestState() {
    avg_update_interval = cfg.average_download_speed_update_interval;
    // Starting the test
    if (!testActive) {
        testActive = true;
        speedHistory = [];
        addToSH = 0;
        clearInterval(addToSHIntervalId);
        addToSHIntervalId = null;
        span_result.textContent = '[Test in progress...]';
        testButton.textContent = 'Stop speed test';
        span_time.textContent = '0.00';
        startTest();
    }
    // Ending/Stopping the test
    else {
        testButton.textContent = 'Start speed test';
        testActive = false;
        speedHistory = [];
        addToSH = 0;
        clearInterval(addToSHIntervalId);
        addToSHIntervalId = null;
        span_dSpd.textContent = '0.00';
        span_dAvg.textContent = '0.00';
        span_time.textContent = '0.00';
        span_result.textContent = '[Test stopped]';
        testTime = _fixedTestTime;
    }
}

/**
 * @description Starts the test by creating the average speed interval and beginning the file download.
 */
function startTest() {
    span_dSpd.textContent = '0.00';
    span_dAvg.textContent = '0.00';
    // Starts the average calculation updater, which happens once every avg_update_interval seconds until the test is stopped
    addToSHIntervalId = setInterval(()=>{
        speedHistory.push(addToSH);
        span_dAvg.innerHTML = '' + getAverageSpeedHistory().toFixed(2);
    }, avg_update_interval * 1000);
    downloadFile(fileUrl)
}

/**
 * @description Updates the display for the current speed and also sets the value that will be added to the {@link speedHistory} array for the next interval call to get the average.
 * @param {number} newSpd 
 */
function updateDisplay(newSpd) {
    span_dSpd.textContent = '' + newSpd.toFixed(2);
    addToSH = newSpd;
}

/**
 * @async
 * @description Downloads the given file specified by `url`. The downloaded file is (presumably?) not stored on the user's machine;
 * instead, the statistics for download speed is tracked and sent to the {@link updateDisplay} function.
 * There is a `while(true)` loop here that breaks whenever {@linkcode elapsedTime} exceeds {@linkcode testTime} or when the file download
 * is complete (the latter is more common.)
 * @param {string} url 
 */
async function downloadFile(url = '') {
    // Fetches the url, taking note of the current timestamp
    var uniqueUrl = url + '?t=' + new Date().getTime();
    const response = await fetch(uniqueUrl);
    const reader = response.body.getReader();
    var receivedLength = 0;
    // This is the current/start time for the test (in ms)
    var startTime = new Date();
    // Test loop begins
    while(true) {
        // determine 'done' (file download completed) and 'value' (in this case, a stream of bytes as a Uint8Array)
        const {done,value} = await reader.read();
        receivedLength += value?.length || 0;
        // Get the current time (in ms) and determine its difference with the start time. This gives the elapsed time in ms,
        // which divided by 1000 gives the number of seconds elapsed
        var currentTime = new Date();
        var timeElapsed = (currentTime - startTime) / 1000;
        // Change the text in the 'time' span to the timeElapsed var rounded to the thousandths plance
        span_time.textContent = timeElapsed.toFixed(3);
        // '8 / 1000000 * (receivedLength / timeElapsed)' converts megabytes per second to megabits per second, the more common 
        // network speed measurement
        var speed = 8 / 1000000 * (receivedLength / timeElapsed);
        updateDisplay(speed);
        // Check if file complete finished or maximum test time exceeded
        if (done || timeElapsed > testTime) {
            break;
        }
    }
    // Update the final text displays and stop the tests
    currentTime = new Date();
    speed = speed.toFixed(2);
    span_result.textContent = `Final Speed: ${speed} MiB/s\napproximate average speed: ${getAverageSpeedHistory().toFixed(2)}\nElapsed Time: ${timeElapsed.toFixed(3)} sec`;
    testButton.textContent = 'Start speed test';
    testActive = false;
    clearInterval(addToSHIntervalId);
}
},{}]},{},[1]);
