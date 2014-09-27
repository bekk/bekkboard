(function ScoreView (el) {

  var Score = Ractive.extend({
    template: '#scoreTemplate',
    data: {
      score: { a: 0, b: 0 },
      started: false
    }
  });

  var score = window.score = new Score({ el: '.score' });

  ES.on('score', function (data) {
    score.set('score',   data.score);
    score.set('winner',  data.winner);
    score.set('players', data.players);
    score.set('started', data.status === "started");
  });
})();
