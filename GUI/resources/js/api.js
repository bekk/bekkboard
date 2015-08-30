var request = require('superagent'),
    $ = require('zepto-browserify').$;


// fix date parsing on serializing json
request.parse['application/json'] = (function () {

  function parseIsoDateToJsDate (key, value) {
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i.test(value))
      return new Date(value);
    return value;
  }

  // automatically parse utc dates in json to js dates
  return function (str) {
    return JSON.parse(str, parseIsoDateToJsDate);
  };
})();

var API = module.exports = (function () {

  var noop = function () {};

  var url = 'http://' + location.hostname + ':3000';

  return {
    Url: url,
    signUp: function (number, name, fn) {
      fn = fn || noop;
      return postJson("/signup", { number: number, name: name }, fn);
    },
    getStatus: function (fn) {
      fn = fn || noop;
      return getJson("/status", fn);
    },
    startGame: function (playerA, playerB, fn) {
      fn = fn || noop;
      return postJson("/start", { a: playerA, b: playerB }, fn);
    },
    stopGame: function (fn) {
      fn = fn || noop;
      return postJson("/stop", {}, fn);
    },
    getPlayers: function (fn) {
      fn = fn || noop;
      return getJson('/players', fn);
    },
    removePlayer: function (number, fn) {
      fn = fn || noop;
      return delJson('/players/' + number, fn);
    },
    connect: function (fn) {
      fn = fn || noop;
      return getJson('/connect', fn);
    },
    getUser: function (number, fn) {
      if (!number) {
        return;
      }
      fn = fn || noop;
      return getJson('/users/' + number, fn);
    },
    getMatches: function (fn) {
      return getJson('/matches', fn);
    },
    updateMatchScore: function (match, score, fn) {
      return postJson('/matches/' + match.date.getTime() + '/score', score, fn);
    },
    getRanking: function (fn) {
      return getJson('/ranking', fn);
    }
    /*
    replay: function (fn) {
      request.get('http://localhost:3001/replay').end(handleResponse(fn));
    },
    continueStream: function (fn) {
      request.get('http://localhost:3001/continue').end(handleResponse(fn));
    },
    getStreamHost: function (fn) {
      request.get('http://localhost:3001/lookup').end(handleResponse(fn));
    }*/
  };

  function getJson (path, fn) {
    return request.get(url + path).end(handleResponse(fn));
  }

  function postJson (path, data, fn) {
    return request.post(url + path).send(data).end(handleResponse(fn));
  }

  function delJson (path, fn) {
    return request.del(url + path).end(handleResponse(fn));
  }

  function handleResponse (fn) {
    return function (res) {
      return fn(res.body);
    };
  }

})();
