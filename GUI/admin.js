(function (exports) {

  var Admin = exports.Admin = Ractive.extend({

    template: '#adminTemplate',

    data: {
      players: []
    },

    playerA: function () {
      return this.checkedPlayers()[0];
    },

    playerB: function () {
      return this.checkedPlayers()[1];
    },

    checkPlayer: function (i) {
      if (admin.get('players.' + i)) {
        admin.set('players.'+i+'.checked', true);
      }
    },

    uncheckPlayers: function () {
      this.set('players.*.checked', false);
    },

    isPlayerChecked: function (i) {
      return this.get('players.' + i + '.checked');
    },

    hasTwoCheckedPlayers: function () {
      return this.checkedPlayers().length == 2;
    },

    checkedPlayers: function () {
      return this.get('players').filter(Admin.isPlayerChecked);
    },

    checkedPlayersNumbers: function () {
      return this.checkedPlayers().map(Admin.byNumber);
    },

    init: function () {
      var self = this;

      ES.on('score', function (data) {
        self.set('started', data.status == 'started');
      });

      ES.on('players', function (players) {
        // re-check all players from the server
        var checkedPlayersNumbers = self.checkedPlayersNumbers();
        players.forEach(function (player, index) {
          var wasCheckedPlayer = checkedPlayersNumbers.indexOf(player.number) !== -1;
          if (wasCheckedPlayer) {
            player.checked = true;
          }
        });

        self.set('players', players);
      });

      ES.on('winner', function (data) {
        self.uncheckPlayers();
        self.checkPlayer(0);
        self.checkPlayer(1);
      });

      self.on({

        playerClicked: function (event, i) {
          if (self.get('started')) {
            event.original.preventDefault();
          }

          var clickedPlayerIsNotPlaying = self.hasTwoCheckedPlayers() && !self.isPlayerChecked(i);
          if (clickedPlayerIsNotPlaying) {
            event.original.preventDefault();
          }
        },

        start: function () {
          if (!self.hasTwoCheckedPlayers()) {
            return;
          }
          API.startGame(self.playerA(), self.playerB());
        },

        stop: function () {
          API.stopGame();
        },

        remove: function (event, i) {
          API.removePlayer(self.get('players.'+i).number);
        }
      });
    }
  });

  Admin.isPlayerChecked = function isPlayerChecked (p) {
    return p.checked;
  };

  Admin.byNumber = function byNumber (p) {
    return p.number;
  };

})(this);
