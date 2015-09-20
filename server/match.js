import { EventEmitter } from 'events';
import util from 'util';
import moment from 'moment';
import 'moment-duration-format';

import MatchSet from './matchset';

module.exports = Match;

function Match (events, a, b, timelimit) {
  var self = this;

  var status = 'stopped',
      winner;

  var matchset = new MatchSet();
  var allSets = [];

  var timeout,
      matchTimeout,
      tickInterval,
      time = timelimit;

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
      allSets.push(matchset);
      var matchScore = self.sets();
      if (matchScore.a >= Match.SetGoal || matchScore.b >= Match.SetGoal) {
        winner = true;
        self.stop();
      } else {
        self.newSet();
      }
    }
    self.emit('change');
  });

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


  self.__defineGetter__("done", function () {
    return timeout === true || winner === true;
  });

  self.json = function () {
    var o = {
      score: self.score(),
      status: self.status(),
      players: self.players(),
      time: self.time(),
      sets: self.sets()
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
