
var MatchSet = require('./matchset');

module.exports = Match;

function Match (events) {
  var self = this;

  self.matchset = new MatchSet();

  events.on("score", function (data) {
    self.matchset.point(data.point);
  });

  self.__defineGetter__("score", function () {
    return self.matchset.score;
  });
}
