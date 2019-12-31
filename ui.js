var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    var num = Math.random() *5
    socket.emit('test', num+'em' );
    socket.on('clientInfo', (data) => {
        console.log(data);
    });
    socket.on('setPump', (data) => {
        console.log(data);
    });


  
});
io.emit('test', 'em' );
