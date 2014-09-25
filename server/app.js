var express       = require('express'),
    bodyParser    = require('body-parser'),
    cors          = require('cors'),
    fayeWebsocket = require('faye-websocket'),
    EventEmitter  = require('events').EventEmitter,
    EventSource   = fayeWebsocket.EventSource;

var Match = require('./match');

module.exports = function (events) {

  var match;
  var users = [];

  var browserEvents = new EventEmitter();

  var app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.get('/status', function (req, res) {
    respond(res);
  });

  app.post('/start', function (req, res) {
    var body = req.body;
    match = new Match(events, body.a, body.b);
    match.on('change', sendSseEventScore);
    match.start();
    respond(res);

    sendSseEventScore();
  });

  app.post('/stop', function (req, res) {
    if (match) {
      match.stop();
      match = null;
    }
    respond(res);

    sendSseEventScore();
  });

  app.post('/signup', function (req, res) {
    var body = req.body;
    users.push({ name: body.name });
    res.end();

    sendSseEventScore();
    sendSseEventPlayers();
  });

  app.get('/players', function (req, res) {
    res.json({ players: users });
  });

  app.del('/player/:index', function (req, res) {
    var index = req.param('index');
    users.splice(index, 1);
    res.end('ok');
    sendSseEventPlayers();
  });

  app.get('/connect', function (req, res) {
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
    sendSseEvent('players', users);
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

  return app;
};
