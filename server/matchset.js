
module.exports = MatchSet;

function MatchSet () {
  var self = this;

  var sides = { a: 0, b: 0 };

  self.point = function (side) {
    sides[side]++;
  };

  self.undoPoint = function (side) {
    var points = sides[side];
    if (points > 0) {
      sides[side]--;
    }
  };

  self.__defineGetter__("score", function () {
    // return copy
    return {
      a: sides.a,
      b: sides.b
    };
  });

  // TODO calculate winner
}
