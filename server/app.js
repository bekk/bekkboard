var express       = require('express'),
    bodyParser    = require('body-parser'),
    cors          = require('cors'),
    fayeWebsocket = require('faye-websocket'),
    EventEmitter  = require('events').EventEmitter,
    EventSource   = fayeWebsocket.EventSource;

var Match   = require('./match');

module.exports = function (events, db) {

  var Users   = require('./users-db')(db),
      MatchDb = require('./match-db')(db),
      Rating = require('./rating')(db);

  var match;
  var browserEvents = new EventEmitter();

  var app = express();

  app.use(cors());
  app.use(bodyParser.json({
    reviver: require('./json-parse-date')
  }));
  app.use(app.router);
  app.use(logErrors);
  app.use(clientErrorHandler);

  app.get('/status', function (req, res, next) {
    respond(res);
  });

  app.post('/start', function (req, res, next) {
    var body = req.body;

    match = new Match(events, body.a, body.b, Match.LengthSeconds);
    match.on('change', function () {
      sendSseEventScore();
      if (match && match.done) {
        MatchDb.save(match);

        Rating.calculateRating(function (err, ranking){
          if (err) return next(err);
          sendSseEventRankingUpdated(ranking);
        });

        sendSseEventMatch(match);
      }
    });
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

  app.get('/matches', function (req, res, next) {
    MatchDb.all(function (err, matches) {
      if (err) return next(err);
      res.json(matches);
    });
  });

  app.get('/ranking', function (req, res, next) {
    Rating.getRating(function(err, ratings) {
      if (err) return next(err);
      res.json(ratings);
    });
  });

  app.post('/matches/:time/score', function (req, res, next) {
    var score = req.body;
    var time = req.param('time');
    MatchDb.updateScore(time, score, function () {
      res.json(score);
    });
  });

  app.get('/connect', function (req, res, next) {
    res.end('ok');

    sendSseEventScore();

    if (connected) {
      sendSseEventConnected();
    }
    else {
      sendSseEventDisconnected();
    }

    Rating.calculateRating(function (err, ranking){
      if (err) return next(err);
      sendSseEventRankingUpdated(ranking);
    });
  });

  app.close = function () {
    if (match) {
      match.stop();
    }
  };

  function newDefaultMatch () {
    if (match) {
      match.stop();
    }

    match = new Match(events, {name: 'playerA'}, {name: 'playerB'});
    match.on('change', function () {
      sendSseEventScore();
      if (match) {
        sendSseEventMatch(match);
      }
    });

    match.on('set-is-done', function () {
      var filename = match.sound();
      sendSseEventSound(filename);
    });
    match.ready();

    sendSseEventScore();
  }

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

  function sendSseEventConnected() {
    sendSseEvent('connected', {});
  }

  function sendSseEventDisconnected() {
    sendSseEvent('disconnected', {});
  }

  function sendSseEventScore () {
    sendSseEvent('score', match ? match.json() : {});
  }

  function sendSseEventWinner () {
    sendSseEvent('winner');
  }

  function sendSseEventSound (filename) {
    sendSseEvent('sound', filename);
  }

  function sendSseEventMatch (match) {
    sendSseEvent('match', match.json());
  }

  function sendSseEventRankingUpdated (ranking) {
    sendSseEvent('ranking', ranking);
  }

  var connected = false;
  events.on('connected', function () {
    sendSseEventScore();
    sendSseEventConnected();
    connected = true;
  });

  events.on('disconnected', function () {
    sendSseEventScore();
    sendSseEventDisconnected();
    connected = false;
  });

  events.on('restart', newDefaultMatch);

  // sockets
  app.get('/es', function(req, res) {
    if (EventSource.isEventSource(req)) {

      var es = new EventSource(req, res, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        ping:    15, // seconds
        retry:   3   // seconds
      });

      var id = parseInt(es.lastEventId, 10) || 0;
      var sendEvent = function sendEvent (e) {
        es.send(JSON.stringify(e.data), { event: e.type, id: ++id });
      };

      browserEvents.on('browser-event', sendEvent);

      es.on('close', function() {
        es = null;
        browserEvents.removeListener('browser-event', sendEvent);
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
