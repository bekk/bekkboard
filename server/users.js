var _ = require('lodash');
var TdcDb = require('./db');

var PREFIX = 'user';
function key (number) {
  return PREFIX + TdcDb.BYTE_START + number + TdcDb.BYTE_START;
}

exports.save = function (user, fn) {
  var number = user && user.number;
  if (!number) {
    return fn(new Error("user is missing a number: " + user));
  }

  TdcDb.get(key(number), function (err, existingUser) {
    if (err) {
      if (err.notFound) {
        var newUser = {
          number: number,
          name: user.name,
          registrations: 1
        };
        return TdcDb.save(key(number), newUser, fn);
      }
      return fn(err);
    }

    var updatedUser = {
      number: existingUser.number,
      name: user.name,
      registrations: (existingUser.registrations || 1) + 1
    };
    TdcDb.save(key(number), updatedUser, fn);
  });
};

exports.all = function (fn) {
  TdcDb.all(PREFIX, fn);
};

exports.get = function (number, fn) {
  TdcDb.get(key(number), fn);
};

exports.del = function (number, fn) {
  TdcDb.del(key(number), fn);
};

