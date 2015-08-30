var express = require('express');
var fs = require('fs');
var spawn = require('child_process').spawn;
var cors = require('express-cors');

var STREAM_FILE_NAME = 'output.mp4';

var STREAM_HOST = process.env.STREAM_HOST || 'http://10.1.20.44:8080/video';

var ffmpeg;
function startFfmpeg() {
  console.log('starting ffmpeg');
  if (ffmpeg) {
    console.log('ffmpeg is already running, tried to start!');
    return;
  }

  ffmpeg  = spawn('ffmpeg', ['-y', '-i', STREAM_HOST, '-loglevel', 'quiet', '-preset', 'ultrafast', STREAM_FILE_NAME]);
  ffmpeg.on('close', function (code, signal) {
    ffmpeg = null;
    console.log('stopped ffmpeg');
  });

}
function stopFfmpeg (fn) {
  console.log('stopping ffmpeg');
  if (!ffmpeg) {
    console.log('ffmpeg is not running, tried to stop!');
    return;
  }
  ffmpeg.kill('SIGINT');
  ffmpeg.on('close', fn);
}

startFfmpeg();

var app = express();

app.use(cors({ allowedOrigins: ['http://localhost:3000', 'http://bekkpi.local:9000', 'http://192.168.1.92:9000'] }));

app.get('/lookup', function (req, res) {
  res.json({ host: STREAM_HOST });
});

app.get('/replay', function (req, res) {
  console.log('replay');
  stopFfmpeg(function () {
    res.end('ok');
  });

  // TODO ta vare på fil
});

app.get('/continue', function (req, res) {
  console.log('continue');
  startFfmpeg();

  res.end('ok');
});

app.get('/stream', function (req, res) {
  var fileName = __dirname + '/' + STREAM_FILE_NAME;
  res.sendFile(fileName);
});
app.listen(3001);
