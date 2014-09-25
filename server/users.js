module.exports = function Users () {

  this.users = [];

  this.push = function (user) {
    if (this.has(user)) return;
    this.users.push(user);
  };

  this.has = function (user) {
    return this.users.indexOf(user) != -1;
  };

  this.remove = function (index) {
    this.users.splice(index, 1);
  };

  this.json = function () {
    return this.users.map(function (user) {
      return { name: user };
    });
  };
};
