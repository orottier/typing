var text = document.getElementById('text');
var input = document.getElementById('input');
var output = document.getElementById('output');
var clock = document.getElementById('clock');
var startTime, timer;
var round = 0;

var texts = [
    "Je moet even deze tekst typen okee?",
    "Want je typt als een dikke slak!",
    "Hop hop, geen foutjes maken euj."
];

function firstKeyUp()
{
    input.removeEventListener('keyup', firstKeyUp);
    input.addEventListener('keyup', keyUp);
    keyUp();
    startRound();
}
function keyUp()
{
    var currentText = input.value;
    output.textContent = currentText;
    if (currentText === texts[round]) {
        finishRound();
    }
}

function startRound()
{
    startTime = (new Date()).getTime();
    timer = setInterval(timerStep, 100);
}
function timerStep()
{
    var passed = (new Date()).getTime() - startTime;
    clock.textContent = passed/1000;
}

input.addEventListener('blur', function (event) {
    setTimeout(function () { input.focus(); }, 20);
});

function finishRound()
{
    clearInterval(timer);
    var passed = (new Date()).getTime() - startTime;
    input.removeEventListener('keyup', keyUp);
    input.value = "";
    round++;
    initRound();
}

function initRound()
{
    text.textContent = texts[round];
    input.focus();
    input.addEventListener('keyup', firstKeyUp);
}
initRound();
