var fs = require('fs');

var $       = require('zepto-browserify').$,
    Ractive = require('ractive');

var ES  = require('../es'),
    API = require('../api');

module.exports = Ractive.extend({

  template: fs.readFileSync(__dirname + '/../../templates/score-template.html', 'utf-8'),

  data: {
    score: { a: 0, b: 0 },
    started: false,
    ranking: [],
    streaming: true
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

    ES.on('ranking', function (ranking) {
      self.set('ranking', ranking);
    });

    API.getRanking(function (ranking) {
      self.set('ranking', ranking);
    });

    var SPACE = 32;
    $(document).keypress(function (e) {
      if (e.keyCode !== SPACE) return;

      var shouldStream = !self.get('streaming');
      if (shouldStream) {
        API.continueStream();
        self.set('streaming', shouldStream);
      }
      else {
        API.replay();
        setTimeout(function () {
          self.set('streaming', shouldStream);
        }, 1000);
      }
    });
  }
});
