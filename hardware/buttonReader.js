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

var undoLimit = 2;
var undoTimeout = 500;

var timers = {}
var counters = {}

function emitScore(side){
  console.log("Emitting score for " + side);
  events.emit("score", {side: side});
}

function emitUndo(side){
  console.log("Emitting undo for " + side);
  events.emit("undo", {side: side});
}

function handleButton (side) {
  //emitScore(side);
  if(counters[side] && counters[side] >= undoLimit){
    if(timers[side]){
      clearTimeout(timers[side]);
      timers[side] = null;
    }
    counters[side] = 0;
    emitUndo(side);
  } else {
    if(!counters[side])
      counters[side] = 0
    counters[side] += 1;
    if(!timers[side])
      timers[side] = setTimeout(function(){
        emitScore(side);
        timers[side] = null;
        counters[side] = 0;
      }, undoTimeout);
  }
}

function handleData (data) {
  console.log("Switching data: " + data);
  switch(data){
    case "0":
    handleButton("a");
    break;
    case "1":
    handleButton("b");
    break;
    default:
    console.log("unknown data: " + data);
    break;
  }
}

sp.on("open", function () {
  console.log('open3');
  sp.on('data', function(data) {
      handleData(data);
    
  });
});
module.exports = events;