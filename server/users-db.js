var _ = require('lodash');

module.exports = function (db) {

  var UsersDb = require('./db')('user', db);

  var ret = {};

  ret.save = function (user, fn) {
    var number = user && user.number;
    if (!number) {
      return fn(new Error("user is missing a number: " + user));
    }

    UsersDb.get(number, function (err, existingUser) {
      if (err) {
        if (err.notFound) {
          var newUser = {
            number: number,
            name: user.name,
            registrations: 1
          };
          return UsersDb.save(number, newUser, fn);
        }
        return fn(err);
      }

      var updatedUser = {
        number: existingUser.number,
        name: user.name,
        registrations: (existingUser.registrations || 1) + 1
      };
      UsersDb.save(number, updatedUser, fn);
    });
  };

  ret.all = function (fn) {
    UsersDb.all("", fn);
  };

  ret.get = function (number, fn) {
    UsersDb.get(number, fn);
  };

  ret.del = function (number, fn) {
    UsersDb.del(number, fn);
  };

  return ret;

}
