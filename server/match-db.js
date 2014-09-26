var _ = require('lodash');
var MatchDb = require('./db')('match');

exports.save = function (match, fn) {
  var now = match.time || new Date();

  console.log(now);
  var matchCopy = _.extend({}, match.json(), {
    time: now
  });

  MatchDb.save(now.getTime(), matchCopy, fn);
};

exports.all = function (fn) {
  MatchDb.all("", function (err, matches) {
    if (err) return fn(err);
    fn(null, matches);
  });
};
