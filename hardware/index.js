var nobleEmitter = require('./noble-emitter');

// nobleEmitter.debug();
var env = process.env;

var peripheralUuid     = env.UUID_PERIPHERAL || "f322742f5c984ebfbbd058086c1798dc";
var serviceUuid        = env.UUID_SERVICE    || "2220";
var characteristicUuid = env.UUID_PERIPHERAL || "2221";

var e = nobleEmitter.connect(peripheralUuid, serviceUuid, characteristicUuid);
e.on('disconnected', function () {
  console.log('disconnected');
});
e.on('connected', function () {
  console.log('connected');
});
e.on('data', function (data) {
  console.log('button', data.readInt16LE(0));
});
