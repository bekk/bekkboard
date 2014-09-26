var _ = require('lodash');
var TdcDb = require('./db');

exports.save = function (user, fn) {
  TdcDb.get(user.name, function (err, existingUser) {

    if (err) {
      if (err.notFound) {
        user.games = 1;
        return save(user);
      }
      return fn(err);
    }

    var updatedUser = _.extend(existingUser, user, {
      games: existingUser.games + 1
    });
    save(updatedUser);
  });

  function save (user) {
    TdcDb.save(user, fn);
  }
};

exports.all = function (fn) {
  TdcDb.all(fn);
};

exports.del = function (name, fn) {
  TdcDb.del(name, fn);
};
