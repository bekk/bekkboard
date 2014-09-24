function AdminView (el) {

  var admin = new Ractive({
    el: el,
    template: '#adminTemplate',
    data: {
      players: []
    }
  });

  setInterval(function () {
    Api.getPlayers(function (data) {
      admin.set('players', data.players);
    });
  }, 1000);

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
    }
  });
}
