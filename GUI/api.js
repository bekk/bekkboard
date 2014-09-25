var Api = (function () {
  var url = "http://localhost:3000";

  return {
    signUp: function (name, fn) {
      fn = fn || function () {};
      return postJson("/signup", { name: name }, fn);
    },
    getStatus: function (fn) {
      fn = fn || function () {};
      return $.get(url + "/status", fn);
    },
    startGame: function (playerA, playerB, fn) {
      fn = fn || function () {};
      return postJson("/start", { a: playerA, b: playerB }, fn);
    },
    stopGame: function (fn) {
      fn = fn || function () {};
      return $.post(url + "/stop", fn);
    },
    getPlayers: function (fn) {
      return $.get(url + '/players', fn);
    },
    removePlayer: function (i, fn) {
      return postDel('/player/' + i, fn);
    },
    connect: function (fn) {
      return $.get(url + '/connect', fn);
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
