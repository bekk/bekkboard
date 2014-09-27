(function (exports) {

  var Score = exports.Score = Ractive.extend({

    template: '#scoreTemplate',

    data: {
      score: { a: 0, b: 0 },
      started: false
    },

    init: function () {
      var self = this;
      ES.on('score', function (data) {
        self.set('score', data.score);
        self.set('winner', data.winner);
        self.set('players', data.players);
        self.set('draw', data.draw);
        self.set('timeRemaining', data.timeRemaining);
        self.set('started', data.status === "started");
      });
    }
  });

})(this);
