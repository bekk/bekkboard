var levelup = require('level');
var sublevel = require('level-sublevel');

var noop = function () {};

var BYTE_START = "\x00",
    BYTE_END   = "\xff";

var PREFIX_TDC = "tdc" + BYTE_START;

var db = levelup('./tdc.db', {
  keyEncoding: 'binary',
  valueEncoding: 'json'
});
var sub = sublevel(db).sublevel(PREFIX_TDC);

// escape characteds used for keys
function escapeKey (key) {
  return key.replace(new RegExp(BYTE_START, "g"), "")
            .replace(new RegExp(BYTE_END,   "g"), "");
}

function trim (str) {
  return str.replace(/^\s+|\s+$/gm,'');
}

function prepKey (key, prefix) {
  prefix = prefix || "";
  return prefix + trim(escapeKey(key)).toLowerCase();
}

exports.save = function (user, fn) {
  fn = fn || noop;

  var number = user.number || '';

  var key = prepKey(number, PREFIX_TDC);
  if (!key) {
    fn(new Error("user: user.number is empty"));
    return;
  }

  return sub.put(key, user, fn);
};

exports.get = function (number, fn) {
  fn = fn || noop;

  var key = prepKey(number, PREFIX_TDC);
  if (!key) {
    fn(new Error("user: number is empty"));
    return;
  }
  return sub.get(key, fn);
};

exports.all = function (fn) {
  fn = fn || noop;

  var start = PREFIX_TDC,
      end   = PREFIX_TDC + BYTE_END;

  var users = [];
  sub.createReadStream({
    start: start, end: end
  })
  .on('data', function (entry) {
    var user = entry.value;
    users.push(user);
  })
  .on('close', function () {
    fn(null, users);
  });
};

exports.del = function (number, fn) {
  fn = fn || noop;
  var key = prepKey(number, PREFIX_TDC);
  if (!key) {
    fn(new Error("user: number is empty"));
    return;
  }
  return sub.del(key, fn);
};
