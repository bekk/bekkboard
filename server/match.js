var EventEmitter = require('events').EventEmitter,
    util         = require('util'),
    moment       = require('moment'),
    momentFormat = require('moment-duration-format');

var MatchSet = require('./matchset');

module.exports = Match;

function Match (events, a, b, timelimit) {
  var self = this;

  var status = 'stopped',
      winner;

  var matchset = new MatchSet();

  var timeout,
      matchTimeout,
      tickInterval,
      timeRemaining = timelimit,
      timeElapsed;

  self.start = function () {
    status = 'started';
    timeElapsed = 0;
    matchset = new MatchSet();

    if (timelimit) {
      matchTimeout = setTimeout(function () {
        self.timeout();
      }, timelimit * 1000);

      tickInterval = setInterval(function () {
        timeRemaining -= 1; // sec
        self.emit('change');
      }, 1000);
    } else {
      tickInterval = setInterval(function () {
        timeElapsed += 1; // sec
        self.emit('change');
      }, 1000);
    }
  };

  self.timeout = function () {
    timeout = true;
    self.stop();

    self.emit('change');
  };

  self.stop = function () {
    clearTimeout(matchTimeout);
    clearInterval(tickInterval);

    status = 'stopped';
  };

  self.status = function () {
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
      self.stop();
    }
    self.emit('change');
  });

  self.score = function () {
    return matchset.score;
  };

  self.timeRemaining = function () {
    var duration = moment.duration(timeRemaining, 'seconds');
    return duration.format("mm:ss");
  };

  self.timeElapsed = function () {
    var duration = moment.duration(timeElapsed, 'seconds');
    return duration.format("mm:ss");
  };

  self.players = function () {
    return {
      a: { name: a.name, number: a.number },
      b: { name: b.name, number: b.number }
    };
  };

  self.__defineGetter__("done", function () {
    return timeout === true || winner === true;
  });

  self.json = function () {
    var o = {
      score: self.score(),
      status: self.status(),
      players: self.players(),
      timeRemaining: self.timeRemaining(),
      timeElapsed: self.timeElapsed()
    };

    if (timeout) {
      o.draw = true;
    }

    if (winner) {
      o.winner = matchset.winner == "a" ? a.name : b.name;
    }

    return o;
  };
}

Match.LengthSeconds = 4 * 60;

util.inherits(Match, EventEmitter);
