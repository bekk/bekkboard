function AdminView (el) {

  var admin = new Ractive({
    el: el,
    template: '#adminTemplate',
    data: {
      players: [],
      selected: []
    }
  });

  ES.on('players', function (players) {
    admin.set('players', players);
  });

  admin.on({
    action: function (event, action){
      if (action == "start") {
        Api.startGame();
        admin.set('started', true);
      }
      else if (action == "stop") {
        Api.stopGame();
        admin.set('started', false);
      }
    },
    select: function (e, index) {
      var selected = admin.get('selected');
      selected.shift();
      selected.push(index);
    },
    remove: function () {

    }
  });
}
