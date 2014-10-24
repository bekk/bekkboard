var express = require('express');
var fs = require('fs');
var spawn = require('child_process').spawn;
var cors = require('express-cors')


var STREAM_FILE_NAME = 'output.mp4';

var ffmpeg;
function startFfmpeg() {
  console.log('starting ffmpeg');
  if (ffmpeg) {
    console.log('ffmpeg is already running, tried to start!');
    return;
  }

  ffmpeg  = spawn('ffmpeg', ['-y', '-i', 'http://10.1.20.44:8080/video ', '-preset', 'ultrafast', STREAM_FILE_NAME]);
  ffmpeg.on('close', function (code, signal) {
    ffmpeg = null;
    console.log('stopped ffmpeg');
  });

}
function stopFfmpeg () {
  console.log('stopping ffmpeg');
  if (!ffmpeg) {
    console.log('ffmpeg is not running, tried to stop!');
    return;
  }
  ffmpeg.kill('SIGINT');
}

startFfmpeg();

var app = express();

app.use(cors({ allowedOrigins: ['http://localhost:3000'] }));

app.get('/replay', function (req, res) {
  console.log('replay');
  stopFfmpeg();
  // TODO ta vare på fil

  res.end('ok');
});

app.get('/continue', function (req, res) {
  console.log('continue');
  startFfmpeg();

  res.end('ok');
});

app.get('/stream', function (req, res) {
  // res.set({
  //   'Content-Type': 'video/mp4',
  // })
  var fileName = __dirname + '/' + STREAM_FILE_NAME;
  res.sendFile(fileName);
  // fs.createReadStream(fileName).pipe(res);
});
app.listen(3001);
