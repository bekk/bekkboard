
module.exports = MatchSet;

function MatchSet () {
  var self = this;

  self.sides = { a: 0, b: 0 };

  self.point = function (side) {
    self.sides[side]++;
  };

  self.__defineGetter__("score", function () {
    // return copy
    return {
      a: self.sides.a,
      b: self.sides.b
    };
  });

  // TODO calculate winner
}
