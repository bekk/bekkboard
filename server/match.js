var EventEmitter = require('events').EventEmitter;
var MatchSet = require('./matchset');
var util = require('util');

module.exports = Match;

function Match (events, a, b) {
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
    self.emit('change');
  });

  events.on("score", function (data) {
    if (status == 'stopped') {
      return;
    }
    matchset.point(data.side);
    if (matchset.done) {
      winner = true;
    }
    self.emit('change');
  });

  self.score = function () {
    return matchset.score;
  };

  self.players = function () {
    return { a: a, b: b };
  };

  self.json = function () {
    var o = {
      score: self.score(),
      status: self.status(),
      players: self.players()
    };

    if (winner) {
      o.winner = matchset.winner == "a" ? a : b;
    }

    return o;
  };
}
util.inherits(Match, EventEmitter);
