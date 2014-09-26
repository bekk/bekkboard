var levelup = require('level');
var sublevel = require('level-sublevel');

var noop = function () {};

var BYTE_START = exports.BYTE_START = "\x00",
    BYTE_END   = exports.BYTE_END   = "\xff";

var PREFIX_TDC = "tdc" + BYTE_START;

var db = levelup('./tdc.db', { keyEncoding: 'binary', valueEncoding: 'json' });
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

exports.save = function (inkey, value, fn) {
  fn = fn || noop;
  var key = prepKey(inkey, PREFIX_TDC);
  return sub.put(key, value, fn);
};

exports.get = function (inkey, fn) {
  fn = fn || noop;
  var key = prepKey(inkey, PREFIX_TDC);
  return sub.get(key, fn);
};

exports.all = function (query, fn) {
  fn = fn || noop;
  query = query || '';

  var start = PREFIX_TDC + query,
      end   = PREFIX_TDC + query + BYTE_END;

  var users = [];

  sub.createReadStream({ start: start, end: end })
  .on('data', function (entry) {
    var user = entry.value;
    users.push(user);
  })
  .on('close', function () {
    fn(null, users);
  });
};

exports.del = function (inkey, fn) {
  fn = fn || noop;
  var key = prepKey(inkey, PREFIX_TDC);
  return sub.del(key, fn);
};
