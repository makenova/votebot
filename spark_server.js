var five = require("johnny-five");
var Spark = require("spark-io");
var socket = require('socket.io-client')('https://okcjs-votebot.herokuapp.com/');

// setup spark core
var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  }),
  repl: false
});

board.on("ready", function () {
  // setup servos
  var left_wheel  = new five.Servo({ pin: "D0", type: 'continuous' }).stop();
  var right_wheel = new five.Servo({ pin: "D1", type: 'continuous' }).stop();

  // respond to move event
  board.on('move', function (dir) {
    console.log(dir);

    if (dir == 'forward'){
      left_wheel.cw(0.9);
      right_wheel.ccw(0.9);
    } else if (dir == 'reverse') {
      left_wheel.ccw(0.9);
      right_wheel.cw(0.9);
    } else if (dir == 'right') {
      left_wheel.cw(0.9);
      right_wheel.cw(0.9);
    } else if (dir == 'left') {
      left_wheel.ccw(0.9);
      right_wheel.ccw(0.9);
    } else if (dir == 'stop') {
      left_wheel.stop();
      right_wheel.stop();
    }

  });
});

socket.on('connect', function () {
  console.log('connected');
});

// respond to ballot consensus
socket.on('consensus', function (dir) {
  board.emit('move', dir);
});
