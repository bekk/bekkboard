var fs = require('fs');

var Ractive = require('ractive');

var API = require('../api');

module.exports = Ractive.extend({

  template: fs.readFileSync(__dirname + '/../../templates/matches-template.html', 'utf-8'),

  data: {
    matches: []
  },

  init: function () {
    var self = this;

    self.on({

      edit: function (e) {
        self.set(e.keypath + ".editing", true);
      },

      save: function (e) {
        self.set(e.keypath + '.editing', false);
        var match = e.context;
        var score = {
          a: Number(match.score.a),
          b: Number(match.score.b)
        };
        API.updateMatchScore(match, score);
      }
    });

    API.getMatches(function (allMatches) {
      self.set('matches', allMatches);
    });
  }
});
