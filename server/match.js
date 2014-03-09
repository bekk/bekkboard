
var MatchSet = require('./matchset');

module.exports = Match;

function Match (events) {
  var self = this;

  var status  = 'stopped';
  var matchset = new MatchSet();

  self.start = function () {
    status = 'started';
  };

  self.stop = function () {
    status = 'stopped';
  };

  self.status = function (newStatus) {
    if (newStatus) {
      status = newStatus;
    }
    return status;
  };

  events.on("score", function (data) {
    if (status == 'stopped') {
      return;
    }
    matchset.point(data.point);
  });

  self.score = function () {
    return matchset.score;
  };

  self.json = function () {
    return {
      score: self.score(),
      status: self.status()
    };
  };
}
