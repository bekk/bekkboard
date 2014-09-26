var _ = require('lodash');
var UsersDb = require('./db')('user');

exports.save = function (user, fn) {
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

exports.all = function (fn) {
  UsersDb.all("", fn);
};

exports.get = function (number, fn) {
  UsersDb.get(number, fn);
};

exports.del = function (number, fn) {
  UsersDb.del(number, fn);
};

