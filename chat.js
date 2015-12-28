var chatEnabled = false;
var chatForm = document.getElementById('chatForm');
var chatInput = chatForm.getElementsByTagName('input')[0];

function enableChat()
{
    chatEnabled = true;
    chatForm.getElementsByTagName('button')[0].disabled = false;
}

function chatSubmit(evt)
{
    evt.preventDefault();
    if (chatEnabled) {
        var message = chatInput.value;
        conn.send(message);
        log('You', message);
        chatInput.value = "";
        chatInput.focus();
    }
}

chatForm.addEventListener('submit', chatSubmit);

