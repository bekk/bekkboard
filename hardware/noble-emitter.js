var Promise = require('bluebird');

var EventEmitter = require('events').EventEmitter;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

var noble = require('noble');
noble.on('stateChange', function stateChange (state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

/** Enables debug logging */
exports.debug = function () { exports.loggingEnabled = true; };

/**
 * Connects and reconnects to characteristic on service on peripheral.
 * Emitted events: connected, disconnected, data
 */
exports.connect = function connect (peripheralUuid, serviceUuid, characteristicUuid) {

  var emitter = new EventEmitter();

  var restarting;
  (function reconnectLoop () {
    restarting = false;

    var peripheral;
    discoverPeripheral(peripheralUuid)
      .then(function (device) {
        peripheral = device.peripheral;
        device.peripheral.once('disconnect', restart);
        return device;
      })
      .then(discoverService(serviceUuid))
      .then(discoverCharacteristics(characteristicUuid))
      .then(function (device) {
        emitter.emit('connected');
        device.subscribe(function (value) {
          emitter.emit('data', value);
        });
      })
      .catch(function (err) {
        log('errored with:', err);
        if (peripheral && peripheral.state !== 'disconnecting') {

          // if disconnects occur inside noble, our `device.peripheral.once('disconnect', restart)
          // listener may have been remove. Check if it's still there, or re-add it before we disconnect
          var hasRestartListener = (peripheral.listeners('disconnect').indexOf(restart) != -1);
          if (hasRestartListener) {
            peripheral.once('disconnect', restart);
          }

          peripheral.disconnect();
        }
        else {
          restart();
        }
      });

    function restart () {
      if (restarting) {
        log('already restarting, aborting');
        return;
      }
      restarting = true;

      emitter.emit('disconnected');
      reconnectLoop();
    }
  })();

  return emitter;
};


/** Discoveres and connects to peripheral with uuid */
function discoverPeripheral (peripheralUuid) {
  return new Promise(function (resolve, reject) {
      log('discovering..');

      noble.on('discover', function discover (peripheral) {
        log('discovering, found:', peripheral.uuid);

        if (peripheral.uuid === peripheralUuid) {
          noble.off('discover', discover);
          log('discovered peripheral', peripheral.uuid);
          resolve(peripheral);
        }
        else {
          noble.off('discover', discover);
          timeout(10000, 'timeout discovering peripheral ' + peripheralUuid, reject);
        }
      });
    })
    .then(connectToPeripheral);
}

/** Connects to a discovered peripheral */
function connectToPeripheral (peripheral) {
  var device = { peripheral: peripheral };

  return new Promise(function (resolve, reject) {

    function connectPeripheral (err) {
      if (err) {
        log('connect to peripheral failed', peripheral.uuid);
        return reject(err);
      }

      log('connected to', peripheral.uuid);
      resolve(device);
    }

    peripheral.once('connect', connectPeripheral);
    peripheral.once('disconnect', function () {
      peripheral.off('connect', connectPeripheral);
      log('disconnected from', peripheral.uuid);
    });
    peripheral.connect();
  });
}

/** Discovers a service with serviceUuid on peripheral */
function discoverService (serviceUuid) {
  return function (device) {
    return new Promise(function (resolve, reject) {
      device.peripheral.discoverServices([serviceUuid], function (err, services) {
        if (err) {
          log('discovering services', serviceUuid, 'failed');
          return reject(err);
        }

        var service = services[0];
        if (!service) {
          return reject(new Error('found no services for uuid: ' + serviceUuid));
        }

        log('discovered service', service.uuid);
        device.service = service;
        resolve(device);
      });
    });
  };
}

/** Discovers characteristics with characteristicUuid on service*/
function discoverCharacteristics (characteristicUuid) {
  return function (device) {
    return new Promise(function (resolve, reject) {
      device.service.discoverCharacteristics([characteristicUuid], function (err, characteristics) {
        if (err) {
          log('discovering characteristic', characteristicUuid, 'failed');
          return reject(err);
        }

        log('discovered characteristics', characteristicUuid);
        var characteristic = characteristics[0];

        var emitter = new EventEmitter();
        function read (data) {
          emitter.emit('ble-data', data);
        }

        characteristic.on('read', read);
        device.peripheral.once('disconnect', function () {
          characteristic.off('read', read);
        });

        device.characteristic = characteristic;
        device.subscribe = function (fn) {
          emitter.on('ble-data', fn);
          device.peripheral.once('disconnect', function () {
            emitter.off('ble-data', fn);
          });
        };

        characteristic.notify(true, function (err) {
          if (err) {
            log('could not subscribe to characteristic', characteristicUuid);
            return reject(err);
          }

          log('subscribing to characteristic', characteristicUuid);
          resolve(device);
        });
      });
    });
  };
}

// stop scanning on exit
process.on('SIGINT', exit);
function exit () {
  log('\nexiting..');
  noble.stopScanning();
  process.exit(0);
}

// scopes logging
function log () {
  if (exports.loggingEnabled) {
    var args = [].slice.call(arguments);
    console.log.apply(console, ["noble-emitter>"].concat(args));
  }
}

// calls fn with error after ms
function timeout (ms, msg, fn) {
  setTimeout(function () {
    fn(new Error(msg));
  }, ms);
}
