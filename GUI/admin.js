function AdminView (el) {

  var selected = [];

  var admin = new Ractive({
    el: el,
    template: '#adminTemplate',
    data: { players: [] }
  });

  ES.on('players', function (players) {
    admin.get('players').forEach(function (player, index) {
      if (player.checked) {
        players[index].checked = true;
      }
    });
    admin.set('players', players);
  });

  admin.observe('players.*.checked', function (newVal, oldVal, keypath) {
    var playerKeypath = keypath.replace('.checked', '');
    // newval is undefined when we add players
    if (typeof newVal !== 'undefined' && !oldVal && selected.length == 2) {
      var shifted = selected.pop();
      admin.set(shifted + '.checked', false);
    }

    if (newVal) {
      selected.push(playerKeypath);
    }
    else {
      selected.splice(selected.indexOf(playerKeypath), 1);
    }
  });

  admin.on({
    start: function (event, action){
        var playerA = admin.get(selected[0]).name;
        var playerB = admin.get(selected[1]).name;
        Api.startGame(playerA, playerB);
        admin.set('started', true);
    },

    stop: function () {
      Api.stopGame();
      admin.set('started', false);
    },

    remove: function (event, i) {
      Api.removePlayer(i);
      event.original.preventDefault();
    }
  });
}
