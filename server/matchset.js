
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

  self.__defineGetter__('done', function () {
    return hasWinner();
  });

  function hasWinner () {
    var hasEnough = (sides.a >= MatchSet.WinnerScore ||
                     sides.b >= MatchSet.WinnerScore);
    var hasMoreTwoPointLead = Math.abs(sides.a - sides.b) >= MatchSet.WinningLead;
    return hasEnough && hasMoreTwoPointLead;
  }
}

MatchSet.WinnerScore = 11;
MatchSet.WinningLead = 2;
