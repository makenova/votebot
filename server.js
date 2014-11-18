var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', function (req, res) {
  res.sendFile(__dirname + '/style.css');
});

var ballot = {
  forward: 0,
  left: 0,
  right: 0,
  reverse: 0
};

function incremetBallot (vote) {
    ballot[vote]++;
    console.log(ballot);

    if (ballot[vote] >= 3) {
      io.emit('consensus', vote);
      moveBot(vote);
      Object.keys(ballot).forEach(function (key) {
        ballot[key] = 0;
      });
    }
    return;
}

function moveBot(direction) {
  console.log('moving bot: ' + direction);
}

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('vote', function (msg) {
    console.log('vote: ' + msg);
    incremetBallot(msg);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

http.listen(port, function () {
  console.log('listening on port: ' + port);
});