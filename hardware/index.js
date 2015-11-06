var EventEmitter = require('events').EventEmitter;

var hardware = module.exports = new EventEmitter();

var e = (process.env.DEVICE) ?
          require('./serial')(process.env.DEVICE) :
          require('./stdin-mock');

const BUTTON_A_SINGLE = 0;
const BUTTON_B_SINGLE = 1;
const BUTTON_A_DOUBLE = 2;
const BUTTON_B_DOUBLE = 3;
const BUTTON_A_LONG = 4;
const BUTTON_B_LONG = 5;

var commands = {
  [BUTTON_A_SINGLE]: function () {
    emitScore('a'); // single click
  },
  [BUTTON_B_SINGLE]: function () {
    emitScore('b'); // single click
  },
  [BUTTON_A_DOUBLE]: function () {
    emitUndo('a'); // double click
  },
  [BUTTON_B_DOUBLE]: function () {
    emitUndo('b'); // double click
  },
  [BUTTON_A_LONG]: function () {
    hardware.emit('restart'); // long press
  },
  [BUTTON_B_LONG]: function () {
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
