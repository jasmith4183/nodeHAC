var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
// WARNING: app.listen(80) will NOT work here!

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    var num = Math.random() *5
    socket.emit('test', num+'em' );
    socket.on('my other event', (data) => {
        console.log(data);
    });
    socket.on('setPump', (data) => {
        console.log(data);
    });


  
});
