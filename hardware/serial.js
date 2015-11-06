var EventEmitter = require('events').EventEmitter;
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

const MAX_RECONNECT_RETRIES = 15;
const TIME_LIMIT_IN_MILLISECONDS = 60 * 1000;

module.exports = function (device) {
  var serialPort = new SerialPort(device, {
    parser: serialport.parsers.readline("\n"),
    baudrate: 9600
  }, false);

  var emitter = new EventEmitter(), isConnected = false;

  serialPort.on('data', function (data) {
    emitter.emit('data', parseInt(data, 10));
  });

  serialPort.on('close', function (data) {
    isConnected = false;
    emitter.emit('disconnect');
    tryReconnectLoop();
  });

  serialPort.on('open', function (data) {
    isConnected = true;
  });

  serialPort.on('error', function () {
    isConnected = false;
    emitter.emit('disconnect');
    tryReconnectLoop();
  });

  function tryReconnectLoop (connectTime = 100, retries = 0) {
    if (isConnected) return;
    if (connectTime >= TIME_LIMIT_IN_MILLISECONDS) {
      connectTime = TIME_LIMIT_IN_MILLISECONDS;
    }

    console.log(`Trying to connect to the serialport. Try number: ${retries}`);

    serialPort.open(function (error) {
      if (!error) {
        return emitter.emit('connected');
      }
      retries++;

      emitter.emit('disconnect');

      if (connectTime < TIME_LIMIT_IN_MILLISECONDS) {
        connectTime *= 1.5;
      }

      return setTimeout(() =>
        tryReconnectLoop(connectTime, retries++), connectTime);
    });
  }

  tryReconnectLoop();
  return emitter;
};
