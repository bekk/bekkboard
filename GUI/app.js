var url = "http://localhost:3000";

var updateStatus = function(callback){
  $.get(url + "/status", function(data){
    callback(data);
  });
};

var startGame = function(){
  $.post(url + "/start");
};

var stopGame = function(){
  $.post(url + "/stop");
};

$(function(){
  var ractive = new Ractive({
    el: 'score',
    template: '#scoreTemplate',
    data: {
      score: {
        a: 0,
        b: 0
      },
      started: false
    }
  });

  ractive.on({
    action: function(event, action){
      if (action == "start") {
        startGame();
        ractive.set('started', true);
      }
      else if (action == "stop") {
        stopGame();
        ractive.set('started', false);
      }
    }
  });

  setInterval(function(){
    updateStatus(function (status){
      ractive.set('score', status.score);
      ractive.set('started', status.status == "started");
    });
  }, 1000);
});
