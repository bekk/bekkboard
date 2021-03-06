var _ = require('lodash');

module.exports = function (db) {

  var MatchDb = require('./db')('match', db);

  var ret = {};

  ret.get = function (time, fn) {
    MatchDb.get(time, fn);
  };

  ret.save = function (match, fn) {
    MatchDb.save(match.date, match.json(), fn);
  };

  ret.updateScore = function (time, score, fn) {
    MatchDb.get(time, function (err, match) {
      if(err) return fn(err);

      match.score.a = score.a;
      match.score.b = score.b;

      MatchDb.save(time, match, function (err, match) {
        if (err) return fn(err);
        fn(null, score);
      });
    });
  };

  ret.all = function (fn) {
    MatchDb.all("", function (err, matches) {
      if (err) return fn(err);
      fn(null, matches);
    });
  };

  return ret;
};
