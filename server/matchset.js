
module.exports = MatchSet;

function MatchSet () {
  var self = this;

  self.players = { a: 0, b: 0 };

  self.point = function (side) {
    self.players[side]++;
  };

  self.__defineGetter__("score", function () {
    // return copy
    return {
      a: self.players.a,
      b: self.players.b
    };
  });

  // TODO calculate winner
}
