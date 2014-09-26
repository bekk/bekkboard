var _ = require('lodash');
var TdcDb = require('./db');

var PREFIX = 'players';
function key (number) {
  return PREFIX + TdcDb.BYTE_START + number + TdcDb.BYTE_START;
}

exports.add = function (user, fn) {
  var number = user && user.number;
  if (!number) {
    return fn(new Error("player is missing a number: " + user));
  }

  var userCopy = {
    name: user.name,
    number: number
  };
  TdcDb.save(key(number), userCopy, fn);
};

exports.del = function (number, fn) {
  if (!number) {
    return fn(new Error("no number for del: " + number));
  }

  TdcDb.del(key(number), fn);
};

exports.all = function (fn) {
  TdcDb.all(PREFIX, fn);
};
