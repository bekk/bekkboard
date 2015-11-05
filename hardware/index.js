var EventEmitter = require('events').EventEmitter;

var hardware = module.exports = new EventEmitter();

var e = (process.env.DEVICE) ?
          require('./serial')(process.env.DEVICE) :
          require('./stdin-mock');

var commands = {
  0: function () {
    emitScore('a'); // single click
  },
  1: function () {
    emitScore('b'); // single click
  },
  2: function () {
    emitUndo('a'); // double click
  },
  3: function () {
    emitUndo('b'); // double click
  },
  4: function () {
    hardware.emit('restart'); // long press
  },
  5: function () {
    hardware.emit('restart'); // long press
  }
};

e.on('connected', function () {
  console.log('ble connected');
  hardware.emit('connected');
});

e.on('data', function (data) {
  console.log('data: ', data);
  if (commands[data])
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
