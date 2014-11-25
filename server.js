var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// serve static resources from public dir
app.use(express.static(path.join(__dirname, 'public')));

// server index page
app.get('/', function (req, res) {
  res.sendFile(__dirname + 'public/index.html');
});

// Setup a ballot to hold the votes
var ballot = {
  stop: 1,
  forward: 0,
  left: 0,
  right: 0,
  reverse: 0
};

// every 2 seconds tally the votes
setInterval(tallyVotes, 2000);

// tally votes, broadcast result and reset ballot
function tallyVotes () {
  var max = {vote:'', count:0};
  for (var vote in ballot) {
    if (ballot[vote]>=max.count) {
      max.vote = vote;
      max.count = ballot[vote];
    } 
  }

  moveBot(max.vote);
  resetBallot();
}

// reset ballot to 0
function resetBallot () {
  Object.keys(ballot).forEach(function (key) {
    ballot[key] = 0;
  });
  // if no one votes, bot should stop
  ballot['stop'] = 1;
}

// broadcast result of ballot
function moveBot(direction) {
  console.log('moving bot: ' + direction);
  io.emit('consensus', direction);
}

// increment the a vote in the ballot
function incremetBallot (vote) {
    ballot[vote]++;
    console.log(ballot);
}

// setup messaging for socket.io
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

// start server
http.listen(port, function () {
  console.log('listening on port: ' + port);
});
