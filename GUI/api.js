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
      return $.get(url + "/status", fn);
    },
    startGame: function (playerA, playerB, fn) {
      fn = fn || noop;
      return postJson("/start", { a: playerA, b: playerB }, fn);
    },
    stopGame: function (fn) {
      fn = fn || noop;
      return $.post(url + "/stop", fn);
    },
    getPlayers: function (fn) {
      fn = fn || noop;
      return $.get(url + '/players', fn);
    },
    removePlayer: function (number, fn) {
      fn = fn || noop;
      return postDel('/player/' + number, fn);
    },
    connect: function (fn) {
      fn = fn || noop;
      return $.get(url + '/connect', fn);
    },
    getName: function (number, fn) {
      fn = fn || noop;
      return postJson('/number', { number: number }, fn);
    }
  };

  function postJson (path, data, fn) {
    return $.ajax({
      type: "post",
      url: url + path,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: fn
    });
  }

  function postDel (path, fn) {
    return $.ajax({
      type: "delete",
      url: url + path,
      contentType: 'application/json',
      dataType: 'json',
      success: fn
    });
  }
})();
