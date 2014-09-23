var EventEmitter = require('events').EventEmitter;

var nobleEmitter = require('./noble-emitter');
nobleEmitter.debug();

var peripheralUuid     = process.env.UUID_PERIPHERAL || "c9d1efa8e51c46dd93d09cdf1ae21e32";
var serviceUuid        = process.env.UUID_SERVICE    || "2220";
var characteristicUuid = process.env.UUID_PERIPHERAL || "2221";

var hardware = module.exports = new EventEmitter();

var e = nobleEmitter.connect(peripheralUuid, serviceUuid, characteristicUuid);
e.on('connected', function () {
  console.log('connected');
});
e.on('data', function (data) {
  var button = data.readInt16LE(0);
  handleButton(button);
});
e.on('disconnected', function () {
  console.log('disconnected');
});

function handleButton (value) {
  switch (value) {
    case 0:
      hardware.emit('score', { side: 'a' });
      break;
    case 1:
      hardware.emit('score', { side: 'b' });
      break;
  }
}

