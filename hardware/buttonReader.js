var serialPort = require('serialport');
serialPort.list(function (err, ports) {
	ports.forEach(function (port){
		console.log(port.comName);
		console.log(port.pnpId);
		console.log(port.manufacturer);
	});
});

var SerialPort = serialPort.SerialPort;

var sp = new SerialPort("/dev/cu.usbmodem1a121", {
	baudrate: 38400,
	parser: serialPort.parsers.readline("\n")
});

var events = new process.EventEmitter();

sp.on("open", function () {
  console.log('open');
  sp.on('data', function(data) {
    console.log('data received: ' + data);
    switch(data){
    	case 0:
    	events.emit("score", {point: "a"});
    	break;
    	case 1:
    	events.emit("score", {point: "b"});
    	break;
    }
  });
  sp.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});
module.exports = events;