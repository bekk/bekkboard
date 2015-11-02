var EventEmitter = require('events').EventEmitter;
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

module.exports = function (device) {
  var serialPort = new SerialPort(device, {
    parser: serialport.parsers.readline("\n"),
    baudrate: 9600
  }, false);

  var emitter = new EventEmitter();

  serialPort.open(function (error) {
    if (error) {
        emitter.emit('disconnect');
    }
    else {
      emitter.emit('connected');
      serialPort.on('data', function (data) {
        emitter.emit('data', parseInt(data, 10));
      });

      serialPort.on('error', function () {
        emitter.emit('disconnect');
      });
    }
  });

  return emitter;
};
