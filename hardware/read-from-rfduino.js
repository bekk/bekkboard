var noble = require('noble');

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  console.log('uuid', peripheral.uuid);
  console.log('name:', peripheral.advertisement.localName);
  console.log('services:', JSON.stringify(peripheral.advertisement));

  peripheral.connect(function (error) {
    if (error) throw error;

    var uuids = peripheral.advertisement.serviceUuids;
    peripheral.discoverServices(uuids, function (err, services) {
      if (err) throw err;
      var service = services[0];
      service.discoverCharacteristics([], function (err, characteristics) {
        if (err) throw err;
        var charact = characteristics[0];
        charact.read(function read (err, data) {
          if (err) throw err;
          console.log('data:', data);
          charact.read(read);
        });
      });
    });
  });
});
