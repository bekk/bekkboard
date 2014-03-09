// api som eirik kan kalle
// GET /status
// POST /start
// POST /stop
//
// lytt på events
// tell score pr side
var express = require('express');
var cors = require('cors');
var MatchSet = require('./matchset');

module.exports = function (events) {

  var matchset = new MatchSet(events);
  var status = 'stopped';

  var app = express();
  app.use(cors());
  app.get('/status', function (req, res) {
    respond(res);
  });

  app.post('/start', function (req, res) {
    status = 'started';
    respond(res);
  });

  app.post('/stop', function (req, res) {
    status = 'stopped';
    respond(res);
  });

  function respond (res) {
    res.json({
      score: matchset.score,
      status: status
    });
  }

  return app;

};
