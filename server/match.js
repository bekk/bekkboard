
var MatchSet = require('./matchset');

module.exports = Match;

function Match (events) {
  var self = this;

  var _status  = 'stopped';
  var matchset = new MatchSet();

  self.start = function () {
    _status = 'started';
  };

  self.stop = function () {
    _status = 'stopped';
  };

  self.status = function (status) {
    if (status) {
      _status = status;
    }
    return _status;
  };

  events.on("score", function (data) {
    if (_status == 'stopped') {
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
