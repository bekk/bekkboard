var Api = (function () {
  var url = "http://localhost:3000";
  return {
    signUp: function (name, fn) {
      $.post(url + "/signup", { name: name }, fn);
    },
    getStatus: function (fn) {
      $.get(url + "/status", fn);
    },
    startGame : function(){
      $.post(url + "/start");
    },
    stopGame : function(){
      $.post(url + "/stop");
    }
  };
})();
