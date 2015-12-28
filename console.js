var communication = document.getElementById('communication');

function log(type, message)
{
    var now = new Date();
    var line = "";
    line += '[' + now.getHours() + ':' + now.getMinutes() + '] ';
    line += type + ': ' + message;
    line += "\n";
    communication.textContent += line;
}
