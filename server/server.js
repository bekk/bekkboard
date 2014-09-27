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

var levelup = require('level');
var options = { keyEncoding: 'utf-8', valueEncoding: 'json' };
var level = levelup('./database.db', options);

var app = require('./app')(events, level);
var server = app.listen(3000, function () {
  console.log('up on 3000');
});
process.once('SIGINT', function () {
  console.log('\napi got sigint, shutting down');
  server.close();
});
