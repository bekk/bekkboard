var EventEmitter = require('events').EventEmitter;
var serialport = require("serialport");
var SerialPort = serialport.SerialPort
var serialPort = new SerialPort(process.env.DEVICE || "/dev/tty.usbserial-DC008KBF", {
  parser: serialport.parsers.readline("\n"),
  baudrate: 9600
}, false);

var emitter = new EventEmitter();

module.exports = emitter;

serialPort.open(function (error) {
  if (error) {
      emitter.emit('disconnect');
  }
  else {
    emitter.emit('connected');

    serialPort.on('data', function (data) {
      emitter.emit('data', data);
    });

    serialPort.on('error', function () {
      emitter.emit('disconnect');
    });
  }
});
