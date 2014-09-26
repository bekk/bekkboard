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

function prepKey (prefix, key) {
  return prefix + BYTE_START + trim(escapeKey(key)).toLowerCase();
}

module.exports = function (prefix) {

  var ret = {};

  ret.save = function (inkey, value, fn) {
    fn = fn || noop;
    var key = prepKey(prefix, inkey);
    console.log('putting', key, value);
    return sub.put(key, value, fn);
  };

  ret.get = function (inkey, fn) {
    fn = fn || noop;
    var key = prepKey(prefix, inkey);
    console.log('getting', key);
    return sub.get(key, fn);
  };

  ret.all = function (query, fn) {
    fn = fn || noop;
    query = query || '';

    var start = prefix + BYTE_START + query,
        end   = prefix + BYTE_START + query + BYTE_END;

    var users = [];

    console.log('querying', start, end);

    sub.createReadStream({ start: start, end: end })
    .on('data', function (entry) {
      var user = entry.value;
      users.push(user);
    })
    .on('close', function () {
      fn(null, users);
    });
  };

  ret.del = function (inkey, fn) {
    fn = fn || noop;
    var key = prepKey(prefix, inkey);
    return sub.del(key, fn);
  };

  return ret;
};
