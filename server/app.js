// api som eirik kan kalle
// GET /status
// POST /start
// POST /stop
//
// lytt på events
// tell score pr side
var express = require('express');

var MatchSet = require('./matchset');

var app = express();

var events = new process.EventEmitter();
var matchset = new MatchSet(events);

app.get('/status', function (req, res) {
  res.json({
    score: matchset.score,
    status: 'stopped'
  });
});

module.exports = app;
