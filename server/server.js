var EventEmitter = require('events').EventEmitter;
// var events = new EventEmitter();
var events = require('../hardware');

// debug
// events.on('score', function () {
//   console.log.apply(console, ['score'].concat([].slice.call(arguments)));
// });
// events.on('undo', function () {
//   console.log.apply(console, ['undo'].concat(argumentsAsArray));
// });

var app = require('./app')(events);
var server = app.listen(3000, function () {
  console.log('up on 3000');
});
process.once('SIGINT', function () {
  console.log('\napi got sigint, shutting down');
  server.close();
});
