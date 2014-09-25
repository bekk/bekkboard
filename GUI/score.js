function ScoreView (el) {

  var score = new Ractive({
    el: el,
    template: '#scoreTemplate',
    data: {
      score: { a: 0, b: 0 },
      started: false
    }
  });

  ES.on('score', function (data) {
    score.set('score',   data.score);
    score.set('winner',  data.winner);
    score.set('players', data.players);
    score.set('started', data.status === "started");
  });
}
