var noop = function () {};

var SEP = "!",
    END = "~";

var TDC = 'tdc';

// escape characteds used for keys
function escapeKey (key) {
  return String(key).replace(new RegExp(SEP, "g"), "")
                    .replace(new RegExp(END, "g"), "");
}

function trim (str) {
  return str.replace(/^\s+|\s+$/gm,'');
}

function prepKey (prefix, key) {
  return TDC + SEP + prefix + SEP + trim(escapeKey(key)).toLowerCase();
}

module.exports = function (prefix, db) {

  var ret = {};

  ret.save = function (inkey, value, fn) {
    fn = fn || noop;
    var key = prepKey(prefix, inkey);
    console.log('putting', key, value);
    return db.put(key, value, fn);
  };

  ret.get = function (inkey, fn) {
    fn = fn || noop;
    var key = prepKey(prefix, inkey);
    console.log('getting', key);
    return db.get(key, fn);
  };

  ret.all = function (query, fn) {
    fn = fn || noop;
    query = query || '';

    var start = prepKey(prefix, query),
        end   = prepKey(prefix, query) + END;

    var users = [];

    console.log('querying', start, end);

    db.readStream({ start: start, end: end })
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
    return db.del(key, fn);
  };

  return ret;
};