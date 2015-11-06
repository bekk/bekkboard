module.exports = function (db) {

  var UsersDb = require('./db')('user', db);

  var ret = {};

  ret.save = function (user, fn) {
    var id = user && user.id;
    if (!id) {
      return fn(new Error("user is missing a id: " + user));
    }

    UsersDb.get(id, function (err, existingUser) {
      if (err) {
        if (err.notFound) {
          var newUser = {
            id: id,
            name: user.name,
            rating: 0,
            registrations: [new Date()]
          };
          return UsersDb.save(id, newUser, fn);
        }
        return fn(err);
      }

      var updatedUser = {
        id: existingUser.id,
        name: user.name,
        registrations: (existingUser.registrations || []).concat(new Date())

      };
      UsersDb.save(id, updatedUser, fn);
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

};
