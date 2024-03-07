(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const testButton = document.getElementById('testButton');
testButton.addEventListener('click', toggleTestState);

// const slider = document.getElementById('avg_update_slider');
// slider.addEventListener('change', avg_update_interval_change)


const _fixedTestTime = 15 * 1000;
var testTime = _fixedTestTime;

var avg_update_interval = cfg.average_download_speed_update_interval;

var speedHistory = [];
var addToSH = 0;
var addToSHIntervalId = null;
var getAverageSpeedHistory = () => { return speedHistory.reduce((p,n)=>p+n) / speedHistory.length; }

const span_dSpd = document.getElementById('dnld-spd');
const span_dAvg = document.getElementById('dnld-avg');
const span_result = document.getElementById('result');
const span_time   = document.getElementById('elapsed-time');

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

function startTest() {
    span_dSpd.textContent = '0.00';
    span_dAvg.textContent = '0.00';
    addToSHIntervalId = setInterval(()=>{
        speedHistory.push(addToSH);
        span_dAvg.innerHTML = '' + getAverageSpeedHistory().toFixed(2);
    }, avg_update_interval * 1000);
    downloadFile(fileUrl)
}

/**
 * 
 * @param {number} newSpd 
 */
function updateDisplay(newSpd) {
    span_dSpd.textContent = '' + newSpd.toFixed(2);
    addToSH = newSpd;
}

async function downloadFile(url = '') {
    var uniqueUrl = url + '?t=' + new Date().getTime();
    const response = await fetch(uniqueUrl);
    const reader = response.body.getReader();
    var receivedLength = 0;
    var startTime = new Date();
    while(true) {
        const {done,value} = await reader.read();
        receivedLength += value?.length || 0;
        var currentTime = new Date();
        var timeElapsed = (currentTime - startTime) / 1000;
        span_time.textContent = timeElapsed.toFixed(3);
        var speed = 8 / 1000000 * (receivedLength / timeElapsed);
        updateDisplay(speed);
        if (done || timeElapsed > testTime) {
            break;
        }
    }
    currentTime = new Date();
    speed = speed.toFixed(2);
    span_result.textContent = `Final Speed: ${speed} MiB/s\napproximate average speed: ${getAverageSpeedHistory().toFixed(2)}\nElapsed Time: ${timeElapsed.toFixed(3)} sec`;
    testButton.textContent = 'Start speed test';
    testActive = false;
    clearInterval(addToSHIntervalId);
}
},{}]},{},[1]);
