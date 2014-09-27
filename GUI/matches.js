
(function (exports) {

  var Matches = exports.Matches = Ractive.extend({

    template: '#matchesTemplate',

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
    }
  });

})(this);
