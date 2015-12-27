var text = document.getElementById('text');
var output = document.getElementById('output');
var clock = document.getElementById('clock');
var results = document.getElementById('results');
var startTime, timer;
var round = 0;
var typed;

var texts = [
    "Je moet even deze tekst typen okee?",
    "Want je typt als een dikke slak!",
    "Hop hop, geen foutjes maken euj."
];

function firstKeyUp(evt)
{
    document.removeEventListener('keypress', firstKeyUp);
    document.addEventListener('keypress', keyUp);
    keyUp(evt);
    startRound();
}
function keyUp(evt)
{
    evt.preventDefault();
    if (evt.keyCode === 8) {
        typed = typed.substr(0, Math.max(0, typed.length-1));
    } else {
        typed += evt.key;
    }
    output.textContent = typed;
    if (typed === texts[round]) {
        finishRound();
    }
    return false;
}

function startRound()
{
    startTime = (new Date()).getTime();
    timer = setInterval(timerStep, 100);
}
function timerStep()
{
    var passed = (new Date()).getTime() - startTime;
    clock.textContent = (passed/1000).toFixed(1);
}

function finishRound()
{
    clearInterval(timer);
    var passed = (new Date()).getTime() - startTime;
    var cpm = texts[round].length / passed * 1000 * 60;
    document.removeEventListener('keypress', keyUp);
    results.textContent += "#" + (round+1) + ": " + cpm.toFixed(0) + " cpm - " + texts[round].length + " characters in " + (passed/1000).toFixed(2) + " seconds.\n";
    round++;
    initRound();
}

function initRound()
{
    typed = "";
    output.textContent = typed;
    text.textContent = texts[round];
    document.addEventListener('keypress', firstKeyUp);
}
initRound();
