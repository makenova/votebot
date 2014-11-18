var five = require("johnny-five");
var Spark = require("spark-io");
var socket = require('socket.io-client')('https://okcjs-votebot.herokuapp.com/');

var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});

board.on("ready", function () {
  var left_wheel  = new five.Servo({ pin: "D0", type: 'continuous' }).stop();
  var right_wheel = new five.Servo({ pin: "D1", type: 'continuous' }).stop();

  board.on('move', function (dir) {
    console.log(dir);

    if (dir == 'forward'){
      console.log('Forward');
      left_wheel.cw(0.9);
      right_wheel.ccw(0.9);
    } else if (dir == 'reverse') {
      console.log('Reverse');
      left_wheel.ccw(0.9);
      right_wheel.cw(0.9);
    } else if (dir == 'right') {
      console.log('Right');
      left_wheel.cw(0.9);
      right_wheel.cw(0.9);
    } else if (dir == 'left') {
      console.log('Left');
      left_wheel.ccw(0.9);
      right_wheel.ccw(0.9);
    }

  });
});

socket.on('connect', function () {
  console.log('connected');
});

socket.on('consensus', function (dir) {
  board.emit('move', dir);
});
