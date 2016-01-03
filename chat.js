var Chat = function() {
    this.enableChat = function()
    {
        this.chatEnabled = true;
        this.chatForm.getElementsByTagName('button')[0].disabled = false;
    }

    this.chatSubmit = function(evt)
    {
        evt.preventDefault();
        if (this.chatEnabled) {
            var message = this.chatInput.value;
            conn.send(message);
            log('You', message);
            this.chatInput.value = "";
            this.chatInput.focus();
        }
    }

    this.chatEnabled = false;
    this.chatForm = document.getElementById('chatForm');
    this.chatInput = chatForm.getElementsByTagName('input')[0];
    this.chatForm.addEventListener('submit', this.chatSubmit.bind(this));
}
