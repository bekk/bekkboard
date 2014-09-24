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

function isDisconnecting (peripheral) {
  return !peripheral || peripheral && peripheral.state === 'disconnecting';
}

/** Enables debug logging */
exports.debug = function () { exports.loggingEnabled = true; };

/**
 * Connects and reconnects to characteristic on service on peripheral.
 * Emitted events: connected, disconnected, data
 */
exports.connect = function connect (peripheralUuid, serviceUuid, characteristicUuid) {

  var emitter = new EventEmitter();

  var shouldReconnect = true;

  process.once('SIGINT', function () {
    shouldReconnect = false;
    noble.stopScanning();

    log('\nshutting down peripherals..');
    var peripherals = noble._peripherals;
    for (var uuid in peripherals) {
      var peripheral = peripherals[uuid];
      if (!isDisconnecting(peripherals)) {
        peripheral.disconnect();
      }
    }

    setTimeout(function () {
      // noble won't shut down cleanly
      process.exit(0);
    }, 1000);
  });

  discoverPeripheral(peripheralUuid)
    .then(function (peripheral) {

      var restarting;

      (function reconnectLoop () {

        peripheral.once('disconnect', restart);

        restarting = false;

        connectToPeripheral(peripheral)
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

            if (!isDisconnecting(peripheral)) {

              // if disconnects occur inside noble, our `peripheral.once('disconnect', restart)
              // listener may have been remove. Check if it's still there, or re-add it before we disconnect
              var hasRestartListener = (peripheral.listeners('disconnect').indexOf(restart) != -1);
              if (!hasRestartListener) {
                peripheral.once('disconnect', restart);
              }
              peripheral.disconnect();
            }
            else {
              restart();
            }
          });

        function restart () {
          if (!shouldReconnect) {
            return;
          }

          if (restarting) {
            log('already restarting, aborting');
            return;
          }

          restarting = true;
          emitter.emit('disconnected');
          setTimeout(reconnectLoop, 300);
        }
      })();
    });

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
        noble.stopScanning();

        log('discovered peripheral', peripheral.uuid);
        resolve(peripheral);
      }
    });
  });
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

// scopes logging
function log () {
  if (exports.loggingEnabled) {
    var args = [].slice.call(arguments);
    console.log.apply(console, ["noble-emitter>"].concat(args));
  }
}
