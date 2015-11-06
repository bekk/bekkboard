// var EventEmitter = require('events').EventEmitter;
// var events = new EventEmitter();

// debug
// events.on('score', function () {
//   console.log.apply(console, ['score'].concat([].slice.call(arguments)));
// });
// events.on('undo', function () {
//   console.log.apply(console, ['undo'].concat(argumentsAsArray));
// });

import events from '../hardware';
import levelup from 'level';
import Camera from './camera/camera';

var options = { keyEncoding: 'utf-8', valueEncoding: 'json' };
// var level = levelup('./database.db', options);

var app = require('./app')(events);
var server = app.listen(3000, function () {
  console.log('server listening on 3000');
});
process.once('SIGINT', function () {
  console.log('\napi got sigint, shutting down');
  app.close();
  server.close();
});

var camera = new Camera();
camera.start();

setTimeout(() => {
  camera.takeSnapshot("test", 10, function(err, file) {
    console.log("Taking photo", file);
  })
}, 1000)