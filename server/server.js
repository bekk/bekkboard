// var EventEmitter = require('events').EventEmitter;
// var events = new EventEmitter;
var hardwareEvents = require('../hardware');
var app = require('./app')(hardwareEvents);
app.listen(3000);
