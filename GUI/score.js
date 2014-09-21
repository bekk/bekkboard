
function ScoreView (el) {
  var self = this,
      interval;

  this.start = function (ms) {
    if (interval) {
      return;
    }
    interval = setInterval(function () {
      Api.getStatus(self.updateScore);
    }, ms);
  };

  this.stop = function () {
    clearInterval(interval);
    interval = null;
  };

  var ractive = new Ractive({
    el: el,
    template: '#scoreTemplate',
    data: {
      score: { a: 0, b: 0 },
      started: false
    }
  });

  ractive.on({
    action: function (event, action){
      if (action == "start") {
        Api.startGame();
        ractive.set('started', true);
      }
      else if (action == "stop") {
        Api.stopGame();
        ractive.set('started', false);
      }
    }
  });

  this.updateScore = function updateScore (data) {
    var winner = data.winner;
    if (winner) {
      ractive.set('winner', winner);
    }
    else {
      ractive.set('score', data.score);
      ractive.set('started', data.status == "started");
    }
  }
}

