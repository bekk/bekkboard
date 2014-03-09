var express = require('express');
var cors = require('cors');

var Match = require('./match');

module.exports = function (events) {

  var match = new Match(events);

  var app = express();

  app.use(cors());

  app.get('/status', function (req, res) {
    respond(res);
  });

  app.post('/start', function (req, res) {
    match.start();
    respond(res);
  });

  app.post('/stop', function (req, res) {
    match.stop();
    respond(res);
  });

  function respond (res) {
    res.json({
      score:  match.score(),
      status: match.status()
    });
  }

  return app;
};
