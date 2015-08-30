var EventEmitter = require('events').EventEmitter;

var hardware = module.exports = new EventEmitter();
//var e = nobleEmitter.connect(peripheralUuid, serviceUuid, characteristicUuid);

var e = (process.env.DEVICE) ?
          require('./serialport')(process.env.DEVICE) :
          require('./stdin-mock');

var commands = {
  0: function () {
    emitScore('a');
  },
  1: function () {
    emitScore('b');
  },
  2: function () {
    emitUndo('a');
  },
  3: function () {
    emitUndo('b');
  },
  4: function () {
    hardware.emit('restart');
  }
};

e.on('connected', function () {
  console.log('ble connected');
  hardware.emit('connected');
});

e.on('data', function (data) {
  console.log('data: ', data);
  if(commands[data])
    commands[data]();
  else
    console.log('unknown command "' + data + '"');
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
