var _ = require('lodash');

module.exports = function (db) {

  var PlayersDb = require('./db')('players', db);

  var ret = {};

  ret.add = function (user, fn) {
    var number = user && user.number;
    if (!number) {
      return fn(new Error("player is missing a number: " + user));
    }

    var userCopy = {
      name: user.name,
      number: number,
      registrationTime: new Date()
    };
    PlayersDb.save(number, userCopy, fn);
  };

  ret.del = function (number, fn) {
    if (!number) {
      return fn(new Error("no number for del: " + number));
    }

    PlayersDb.del(number, fn);
  };

  ret.all = function (fn) {
    PlayersDb.all("", function (err, players) {
      if (err) return fn(err);
      var sortedPlayers = players.sort(function (a, b) {
        return a.registrationTime > b.registrationTime;
      });
      fn(null, sortedPlayers);
    });
  };

  return ret;

};
