import { EventEmitter } from 'events';
import util from 'util';
import moment from 'moment';
import 'moment-duration-format';

import MatchSet from './matchset';

module.exports = Match;

function Match (events, a, b, timelimit) {
  var self = this;

  var status = 'stopped',
      winner,
      servingPlayer = 'not set';

  var matchset = new MatchSet();
  var allSets = [],
      points = [];

  var timeout,
      matchTimeout,
      tickInterval,
      time = timelimit;

  self.ready = function () {
    status = 'ready';
    self.emit('change');
  };

  self.start = function () {
    status = 'started';
    if (timelimit) {
      time = timelimit;
    } else {
      time = 0;
    }

    matchset = new MatchSet();

    if (timelimit) {
      matchTimeout = setTimeout(function () {
        self.timeout();
      }, timelimit * 1000);

      tickInterval = setInterval(function () {
        time -= 1; // sec
        self.emit('change');
      }, 1000);
    } else {
      tickInterval = setInterval(function () {
        time += 1; // sec
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

  self.lastPointIsFromSide = function (side) {
    return points[points.length - 1] === side;
  };

  self.hasPreviouslyPlayedSet = function () {
    return allSets.length > 0;
  };

  events.on("undo", function (data) {
    if (status == 'stopped') {
      return;
    }

    if (points.length == 0) {
      return;
    }

    if (self.shouldInvertSide()) {
      data.side = invertSide(data.side);
    }

    var isLastScoredPointInPreviousSet = !matchset.hasScored() && self.hasPreviouslyPlayedSet();
    
    if (isLastScoredPointInPreviousSet) {
      data.side = invertSide(data.side);
    }

    if (!self.lastPointIsFromSide(data.side)) {
      return;
    }

    if (isLastScoredPointInPreviousSet) {
      matchset = allSets.pop();
      servingPlayer = (servingPlayer === 'a') ? 'b' : 'a';
    }

    points.pop();
    matchset.undoPoint(data.side);
    self.emit('change');
  });

  events.on("score", function (data) {
    if (status === 'stopped') {
      return;
    } else if (status === 'ready') {
      servingPlayer = data.side;
      self.start();
      return;
    }

    if (self.shouldInvertSide()) {
      data.side = invertSide(data.side);
    }

    points.push(data.side);
    matchset.point(data.side);

    if (matchset.done) {
      allSets.push(matchset);
      var matchScore = self.sets();
      if (matchScore.a >= Match.SetGoal || matchScore.b >= Match.SetGoal) {
        winner = true;
        self.stop();
      } else {
        self.newSet();
      }
      servingPlayer = (servingPlayer === 'a') ? 'b' : 'a';
      self.emit("set-is-done");
    }
    self.emit('change');
  });

  self.findCurrentServer = function () {
    var sum = matchset.score.a + matchset.score.b;
    var compare = (sum > 20) ? sum : Math.floor(sum / 2);

    if (compare % 2 == 0) {
      return servingPlayer;
    } else if (servingPlayer == 'a') {
      return 'b';
    } else {
      return 'a';
    }
  };

  self.newSet = () => {
    matchset = new MatchSet();
  };

  self.score = function () {
    return matchset.score;
  };

  self.time = function () {
    var duration = moment.duration(time, 'seconds');
    return duration.format("mm:ss");
  };

  self.players = function () {
    return {
      a: { name: a.name, number: a.number },
      b: { name: b.name, number: b.number }
    };
  };

  self.sets = () => allSets.reduce((prev, current) => {
    return {
      a: prev.a + (current.winner === 'a' ? 1 : 0),
      b: prev.b + (current.winner === 'b' ? 1 : 0)
    };
  }, {a:0, b:0});

  self.shouldInvertSide = function () {
    var currentSets = self.sets();
    return (currentSets.a + currentSets.b) % 2 !== 0;
  };

  function invertSide (side) {
    return (side === 'a' ? 'b' : 'a');
  }

  self.__defineGetter__("done", function () {
    return timeout === true || winner === true;
  });


  self.sound = function () {
    var matchScore = self.sets();
    var didAWinAllSets = (matchScore.a >= Match.SetGoal && matchScore.b === 0);
    var didBWinAllSets = (matchScore.a === 0 && matchScore.b >= Match.SetGoal);
    if (didAWinAllSets || didBWinAllSets) {
      return "flawless.wav";
    }

    var isStartOfNewSet = allSets.length > 0 && matchset.score.a === 0 && matchset.score.b === 0;
    if (isStartOfNewSet || winner) {
      var previousSet = allSets[allSets.length-1];
      if (previousSet.score.a === 0  || previousSet.score.b === 0) {
        return "unstoppable.wav";
      }
    }

    return;
  };

  self.json = function () {
    var o = {
      score: self.score(),
      status: self.status(),
      players: self.players(),
      time: self.time(),
      sets: self.sets(),
      servingPlayer: self.findCurrentServer()
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
Match.SetGoal = 2;

util.inherits(Match, EventEmitter);
