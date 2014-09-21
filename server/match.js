
var MatchSet = require('./matchset');

module.exports = Match;

function Match (events) {
  var self = this;

  var status = 'stopped',
      winner;

  var matchset = new MatchSet();

  self.start = function () {
    status = 'started';
    matchset = new MatchSet();
  };

  self.stop = function () {
    status = 'stopped';
  };

  self.status = function (newStatus) {
    if (winner) {
      this.stop();
      return status;
    }
    if (newStatus) {
      status = newStatus;
    }
    return status;
  };

  events.on("undo", function (data) {
    if (status == 'stopped') {
      return;
    }
    matchset.undoPoint(data.side);
  });

  events.on("score", function (data) {
    if (status == 'stopped') {
      return;
    }
    matchset.point(data.side);
    if (matchset.done) {
      winner = true;
    }
  });

  self.score = function () {
    return matchset.score;
  };

  self.json = function () {
    var o = {
      score: self.score(),
      status: self.status()
    };

    if (winner) {
      o.winner = matchset.winner;
    }
    return o;
  };
}
