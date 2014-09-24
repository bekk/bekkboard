var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var Match = require('./match');

module.exports = function (events) {

  var match;
  var users = [];

  var app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.get('/status', function (req, res) {
    respond(res);
  });

  app.post('/start', function (req, res) {
    var body = req.body;
    match = new Match(events, body.a, body.b);
    match.start();
    respond(res);
  });

  app.post('/stop', function (req, res) {
    if (match) {
      match.stop();
      match = null;
    }
    respond(res);
  });

  app.post('/signup', function (req, res) {
    var body = req.body;
    users.push(body.name);
    res.end();
  });

  app.get('/players', function (req, res) {
    res.json({
      players: users.map(function (name) { return { name: name }; })
    });
  });

  function respond (res) {
    if (match) {
      res.json(match.json());
      return;
    }
    res.json({});
  }

  return app;
};
