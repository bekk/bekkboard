var express       = require('express'),
    bodyParser    = require('body-parser'),
    cors          = require('cors'),
    fayeWebsocket = require('faye-websocket'),
    EventEmitter  = require('events').EventEmitter,
    EventSource   = fayeWebsocket.EventSource;

var Match   = require('./match'),
    Users   = require('./users'),
    Players = require('./players');

module.exports = function (events) {

  var match;
  var browserEvents = new EventEmitter();

  var app = express();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(app.router);
  app.use(logErrors);
  app.use(clientErrorHandler);

  app.get('/status', function (req, res, next) {
    respond(res);
  });

  app.post('/start', function (req, res, next) {
    var body = req.body;
    match = new Match(events, body.a, body.b);
    match.on('change', sendSseEventScore);
    match.start();
    respond(res);

    sendSseEventScore();
  });

  app.post('/stop', function (req, res, next) {
    if (match) {
      match.stop();
      match = null;
    }
    respond(res);

    sendSseEventScore();
  });

  app.post('/signup', function (req, res, next) {
    var user = req.body;

    Users.save(user, function (err) {
      if (err) return next(err);
    });

    Players.add(user, function (err) {
      if (err) return next(err);
      sendSseEventPlayers();
    });

    res.json(user);
  });

  app.get('/users', function (req, res, next) {
    Users.all(function (err, users) {
      if (err) return next(err);
      res.json(users);
    });
  });

  app.get('/users/:number', function (req, res, next) {
    var number = req.param("number");
    Users.get(number, function (err, user) {
      if (err && err.notFound) return res.json({});
      if (err) return next(err);
      res.json(user);
    });
  });

  app.get('/players', function (req, res, next) {
    Players.all(function (err, players) {
      if (err) return next(err);
      res.json(players);
    });
  });

  app.del('/players/:number', function (req, res, next) {
    var number = req.param('number');
    Players.del(number, function (err) {
      if (err) return next(err);
      sendSseEventPlayers();
      res.end('ok');
    });
  });

  app.get('/connect', function (req, res, next) {
    res.end('ok');

    sendSseEventScore();
    sendSseEventPlayers();
  });

  function respond (res) {
    if (match) {
      res.json(match.json());
      return;
    }
    res.json({});
  }

  function sendSseEvent (type, data) {
    browserEvents.emit('browser-event', { type: type, data: data });
  }
  function sendSseEventScore () {
    sendSseEvent('score', match ? match.json() : {});
  }
  function sendSseEventPlayers () {
    Players.all(function (err, players) {
      sendSseEvent('players', players);
    });
  }

  events.on('connected', function () {
    sendSseEventScore();
  });
  events.on('disconnected', function () {
    sendSseEventScore();
  });

  // sockets
  app.get('/es', function(req, res) {
    if (EventSource.isEventSource(req)) {

        var es = new EventSource(req, res, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        ping:    15, // seconds
        retry:   1   // seconds
      });

      var id = parseInt(es.lastEventId, 10) || 0;
      var sendEvent = function sendEvent (e) {
        es.send(JSON.stringify(e.data), { event: e.type, id: ++id });
      };

      browserEvents.on('browser-event', sendEvent);

      es.on('close', function() {
        es = null;
        browserEvents.off('browser-event', sendEvent);
      });
    }
  });

  function logErrors (err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

  function clientErrorHandler (err, req, res, next) {
    res.status(500).send({ error: err });
  }

  return app;
};
