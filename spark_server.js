var five = require("johnny-five");
var Spark = require("spark-io");
var socket = require('socket.io-client')('http://192.168.0.6:3000');

var board = new five.Board({
  io: new Spark({
    token: process.env.SPARK_TOKEN,
    deviceId: process.env.SPARK_DEVICE_ID
  })
});

board.on("ready", function () {
  var led = new five.Led("D7");

  board.on('blink', function () {
    led.blink();
  });
});

socket.on('connect', function () {
  console.log('connected');
});

socket.on('consensus', function (dir) {
  board.emit('blink', {});
});
