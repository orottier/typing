var communication = document.getElementById('communication');

function log(type, message)
{
    var now = new Date();
    var line = "";
    line += '[' + pad(now.getHours(), 2) + ':' + pad(now.getMinutes(), 2) + '] ';
    line += type + ': ' + message;
    line += "\n";
    communication.textContent += line;
}

function pad(num, size){ return ('000000000' + num).substr(-size); }
