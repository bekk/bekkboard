var fs = require('fs');

var $       = require('zepto-browserify').$,
    Ractive = require('ractive');

var ES  = require('../es'),
    API = require('../api');

module.exports = Ractive.extend({

  template: fs.readFileSync(__dirname + '/../../templates/score-template.html', 'utf-8'),

  data: {
    score: { a: 0, b: 0 },
    sets: { a: 0, b: 0 },
    started: false,
    palyeraclass: '',
    playerbclass: '',
    vsinvertedclass: '',
    ranking: [],
    animateA: '',
    animateB: ''
  },

  init: function () {
    var self = this;
    ES.on('score', function (data) {
      self.set('animateA', data && (self.data.score.a !== data.score.a && data.score.a !== 0 ? 'trigger-animate' : ''));
      self.set('animateB', data && (self.data.score.b !== data.score.b && data.score.b !== 0 ? 'trigger-animate' : ''));
      self.set('vsinvertedclass', data && data.sets && ((data.sets.a + data.sets.b) % 2 === 0 ? '' : 'vs-score-inverted'));
      self.set('playeraclass', data && (data.servingPlayer === 'a' ? 'serving-player' : ''));
      self.set('playerbclass', data && (data.servingPlayer === 'b' ? 'serving-player' : ''));
      self.set('showscore', data && (data.status === 'ready' || data.status === 'started' || data.status === 'stopped'));
      self.set('score', data.score);
      self.set('sets', data.sets);
      self.set('winner', data.winner);
      self.set('players', data.players);
      self.set('draw', data.draw);
      self.set('time', data.time);
    });

    ES.on('ranking', function (ranking) {
      self.set('ranking', ranking);
    });

    API.getRanking(function (ranking) {
      self.set('ranking', ranking);
    });
  }
});
