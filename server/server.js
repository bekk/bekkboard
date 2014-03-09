// TODO trondkla geirsagberg bytt ut denne med deres
// var events = require('ble-event-module');
var events = new process.EventEmitter();

var app = require('./app')(events);
app.listen(3000);
