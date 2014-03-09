
var MatchSet = require('./matchset');

module.exports = Match;

function Match (events) {
  var self = this;

  var _status = 'stopped';

  self.status = function (status) {
    if (status) {
      _status = status;
    }
    return _status;
  };

  self.start = function () {
    _status = 'started';
  };

  self.matchset = new MatchSet();

  events.on("score", function (data) {
    if (_status == 'stopped') {
      return;
    }
    self.matchset.point(data.point);
  });

  self.score = function () {
    return self.matchset.score;
  };
}
