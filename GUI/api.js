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
    startGame: function (fn) {
      fn = fn || function () {};
      return postJson("/start", { a: 'fake a', b: 'fake b' }, fn);
    },
    stopGame: function (fn) {
      fn = fn || function () {};
      return $.post(url + "/stop", fn);
    },
    getPlayers: function (fn) {
      return $.get(url + '/players', fn);
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
})();
