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
        if (players[index]) {
          players[index].checked = true;
        }
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

    if (newVal && selected.length <= 2) {
      selected.push(playerKeypath);
    }
    else {
      selected.splice(selected.indexOf(playerKeypath), 1);
    }
  });

  admin.on({
    start: function (event, action){
      if (selected.length != 2) {
        return;
      }
      var playerA = admin.get(selected[0]);
      var playerB = admin.get(selected[1]);
      API.startGame(playerA.name, playerB.name);
      admin.set('started', true);
    },

    stop: function () {
      API.stopGame();
      admin.set('started', false);
    },

    remove: function (event, i) {
      API.removePlayer(i);
      admin.splice('players', i, 1);
      var selectedIndex = selected.indexOf(i);
      if (selectedIndex != -1) {
        selected.splice(selectedIndex, 1);
      }
      event.original.preventDefault();
    }
  });
}
