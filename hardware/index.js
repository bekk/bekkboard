var EventEmitter = require('events').EventEmitter;

var hardware = module.exports = new EventEmitter();
//var e = nobleEmitter.connect(peripheralUuid, serviceUuid, characteristicUuid);

var e = require('./serialport');

e.on('connected', function () {
  console.log('ble connected');
  hardware.emit('connected');
});
e.on('data', function (data) {
  handleButton(data == 0 ? 'a' : 'b');
  console.log(data);
});
e.on('disconnected', function () {
  console.log('ble disconnected');
  hardware.emit('disconnected');
});

function emitScore (side) {
  hardware.emit('score', { side: side });
}

function emitUndo (side) {
  hardware.emit('undo', { side: side });
}

var undoLimit = 2;
var undoTimeout = 300;

var timers = {};
var counters = {};

function handleButton (side) {
  if (counters[side] && counters[side] >= undoLimit) {
    if (timers[side]) {
      clearTimeout(timers[side]);
      timers[side] = null;
    }
    counters[side] = 0;
    emitUndo(side);
  } else {
    if (!counters[side]) {
      counters[side] = 0;
    }
    counters[side] += 1;
    if (!timers[side]) {
      timers[side] = setTimeout(function () {
        emitScore(side);
        timers[side] = null;
        counters[side] = 0;
      }, undoTimeout);
    }
  }
}
