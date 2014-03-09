
module.exports = function (events) {
  var self = this;

  self.players = { a: 0, b: 0 };

  events.on("score", function (data) {
    self.players[data.point]++;
  });

  self.__defineGetter__("score", function () {
    // return copy
    return {
      a: self.players.a,
      b: self.players.b
    };
  });

  // TODO calculate winner
};
