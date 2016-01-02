var texts = [
    "Je moet even deze tekst typen okee?",
    "Want je typt als een dikke slak!",
    "Hop hop, geen foutjes maken euj."
];

var TextRepository = function() {
    this.index = 0;
    this.ready = false;
    this.totalLines = 0;

    this.receiveData = function(event) {
        console.log(event);
        this.data = JSON.parse(event.target.responseText);
        this.totalLines = this.data.lines.length;
        this.ready = true;
    }

    this.getLine = function() {
        line = this.data.lines[this.index];
        this.index++;
        return line;
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", this.receiveData.bind(this));
    oReq.open("GET", "data/alice.json");
    oReq.send();
}
