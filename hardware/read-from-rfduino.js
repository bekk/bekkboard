var noble = require('noble');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

process.on('exit',   once(exit));
process.on('SIGINT', once(exit));

function exit () {
  noble.stopScanning();
}

function once (fn) {
  return function () {
    if (!fn.called) {
      fn.call(arguments);
    }
    fn.called = true;
  };
}

f = module.exports = function (uuid) {

  uuid = uuid || "f322742f5c984ebfbbd058086c1798dc";

  var device, emitter = new EventEmitter();

  return new Promise(function (resolve, reject) {

    noble.on('discover', function (peripheral) {
      if (device || peripheral.uuid != uuid) {
        return;
      }
      console.log('found device with peripheral.uuid', uuid);

      device = peripheral;

      console.log('uuid:', peripheral.uuid, 'name:', peripheral.advertisement.localName, 'services:', JSON.stringify(peripheral.advertisement));

      peripheral.connect(function (err) {
        if (err) {
          return reject(err);
        }

        console.log('connected to peripheral.uuid', peripheral.uuid);

        peripheral.on('disconnect', function () {
          console.log('disconnected from peripheral uuid: ' + peripheral.uuid);
          device = null;
        });

        function disconnect () {
          console.log('disconnecting from peripheral uuid', peripheral.uuid);
          peripheral.disconnect(function (err) {
            if (err) {
              return reject(err);
            }
          });
        }

        var uuids = peripheral.advertisement.serviceUuids;
        peripheral.discoverServices(['2220'], function (err, services) {
          if (err) {
            return reject(err);
          }

          var service = services[0];
          console.log('discovered service', service.uuid);

          service.discoverCharacteristics(['2221'], function (err, characteristics) {
            if (err) {
              return reject(err);
            }

            var charact = characteristics[0];
            console.log('discovered characteristics', charact.uuid);

            charact.notify(true, function (err) {
              if (err) {
                return reject(err);
              }
              console.log('subscribing!');
              resolve(emitter);
            });

            charact.on('read', function read (data) {
              emitter.emit('data', data.readInt16LE(0));
            });
          });
        });
      });
    });
  });
};

var p = f().then(function (emitter) {
  emitter.on('data', function (data) {
    console.log('got button', data);
  });
}).error(function (err) {
  console.log('Wtf failed', err);
  process.exit(1);
});
