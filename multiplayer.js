var peer = new Peer({key: 'uwzql1hzgiepnwmi'});
peer.on('open', function(id) {
      document.getElementById('peerKey').textContent = id;
});
var connectButton = document.getElementById('connectButton');
connectButton.addEventListener('click', promptConnect);

function setupDisconnectButton()
{
    connectButton.removeEventListener('click', promptConnect);
    connectButton.style.display = 'none';
}

var conn;
function promptConnect()
{
    var id = prompt('Peer key');
    if (id) {
        conn = peer.connect(id);
        setupDisconnectButton();
        setupPeer(conn);
    }
}

function setupPeer(conn)
{
    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
            log('Remote', data);
        });

        // Send messages
        conn.send('Hello!');

        enableChat();
    });
}


peer.on('connection', function(connection) {
    conn = connection;
    setupDisconnectButton();
    setupPeer(conn);
});
