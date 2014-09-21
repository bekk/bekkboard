var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter;//require('../hardware/buttonReader');
var app = require('./app')(events);
app.listen(3000);
