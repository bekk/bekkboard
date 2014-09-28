function parseIsoDateToJsDate (key, value) {
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:[.,]\d+)?Z/i.test(value))
    return new Date(value);
  return value;
}

$.ajaxSetup({
  converters: {
    "text json": function (str) {
      // automatically parse utc dates in json to js dates
      return JSON.parse(str, parseIsoDateToJsDate);
    }
  }
});

var API = (function () {

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
  };

  function getJson (path, fn) {
    return json('get', path, null, fn);
  }

  function postJson (path, data, fn) {
    return json('post', path, data, fn);
  }

  function delJson (path, fn) {
    return json('delete', path, null, fn);
  }

  function json (type, path, data, fn) {
    var options = {
      type: type,
      url: url + path,
      contentType: 'application/json',
      dataType: 'json',
      success: function () {
        if (typeof fn == 'function') fn.apply(null, arguments);
      }
    };
    if (data) options.data = JSON.stringify(data);
    return $.ajax(options);
  }
})();
