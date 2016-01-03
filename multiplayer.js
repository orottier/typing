var PeerHelper = function() {
    this.peer = new Peer({key: 'uwzql1hzgiepnwmi'});
    var that = this;
    this.dataStreamInterval = null;

    this.peer.on('open', function(id) {
        document.getElementById('peerKey').textContent = id;
    });

    this.setupDisconnectButton = function()
    {
        this.connectButton.removeEventListener('click', this.promptConnect.bind(this));
        this.connectButton.style.display = 'none';
    }

    this.conn = null;
    this.promptConnect = function()
    {
        var id = prompt('Peer key');
        if (id) {
            this.conn = this.peer.connect(id);
            this.setupDisconnectButton();
            this.setupPeer();
        }
    }

    this.sendGameState = function() {
        this.send('GameState', game.distance);
    }

    this.setupPeer = function()
    {
        var conn = this.conn;
        this.conn.on('open', function() {
            // Receive messages
            conn.on('data', function(data) {
                if (data.type == 'GameState') {
                    game.opponentState(data.data);
                } else {
                    log(data.type + ' - Remote', data.data);
                }
            });

            // Send messages
            that.send('Peer', 'Hello!');

            chat.enableChat();
            game.addOpponent();
            that.dataStreamInterval = setInterval(that.sendGameState.bind(that), 1000);
        });
    }

    this.send = function(type, data) {
        this.conn.send({type: type, data: data});
    }

    this.peer.on('connection', function(conn) {
        that.conn = conn;
        that.setupDisconnectButton();
        that.setupPeer();
    });

    this.peer.on('error', function(err) {
        console.log(err);
    })

    this.connectButton = document.getElementById('connectButton');
    this.connectButton.addEventListener('click', this.promptConnect.bind(this));
}
