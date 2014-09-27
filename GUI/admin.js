(function () {

  var Admin = Ractive.extend({
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
      if (admin.get('players.' + i))
        admin.set('players.'+i+'.checked', true);
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
    }
  });

  Admin.isPlayerChecked = function isPlayerChecked (p) {
    return p.checked;
  };

  Admin.byNumber = function byNumber (p) {
    return p.number;
  };

  var admin = window.admin = new Admin({ el: '.admin' });

  ES.on('score', function (data) {
    admin.set('started', data.status == 'started');
  });

  ES.on('players', function (players) {
    // re-check all players from the server
    var checkedPlayersNumbers = admin.checkedPlayersNumbers();
    players.forEach(function (player, index) {
      var wasCheckedPlayer = checkedPlayersNumbers.indexOf(player.number) !== -1;
      if (wasCheckedPlayer) {
        player.checked = true;
      }
    });

    admin.set('players', players);
  });

  ES.on('winner', function (data) {
    admin.uncheckPlayers();
    admin.checkPlayer(0);
    admin.checkPlayer(1);
  });

  admin.on({

    playerClicked: function (event, i) {
      if (admin.get('started')) {
        event.original.preventDefault();
      }

      var clickedPlayerIsNotPlaying = admin.hasTwoCheckedPlayers() && !admin.isPlayerChecked(i);
      if (clickedPlayerIsNotPlaying) {
        event.original.preventDefault();
      }
    },

    start: function () {
      if (!admin.hasTwoCheckedPlayers()) {
        return;
      }
      API.startGame(admin.playerA(), admin.playerB());
    },

    stop: function () {
      API.stopGame();
    },

    remove: function (event, i) {
      API.removePlayer(admin.get('players.'+i).number);
    }
  });
})();
