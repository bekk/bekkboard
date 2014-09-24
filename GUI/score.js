
function ScoreView (el) {
  var self = this,
      interval;

  this.start = function (ms) {
    if (interval) {
      return;
    }
    interval = setInterval(function () {
      Api
        .getStatus(updateScore)
        .fail(function () {
          console.log('fetching status failed');
        });
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

  function updateScore (data) {
    ractive.set('winner', data.winner);
    ractive.set('players', data.players);
    ractive.set('score', data.score);
    ractive.set('started', data.status == "started");
  }
}

