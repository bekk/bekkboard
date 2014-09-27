var _ = require('lodash');

module.exports = function (db) {

  var MatchDb = require('./db')('match', db);

  var ret = {};
  ret.save = function (match, fn) {
    var now = match.time || new Date();

    var matchCopy = _.extend({}, match.json(), {
      time: now
    });

    MatchDb.save(now.getTime(), matchCopy, fn);
  };

  ret.all = function (fn) {
    MatchDb.all("", function (err, matches) {
      if (err) return fn(err);
      fn(null, matches);
    });
  };

  return ret;
};
