var Api = (function () {
  var url = "http://localhost:3000";
  return {
    getStatus: function (callback){
      $.get(url + "/status", callback);
    },
    startGame : function(){
      $.post(url + "/start");
    },
    stopGame : function(){
      $.post(url + "/stop");
    }
  };
})();
