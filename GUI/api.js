var Api = (function () {
  var url = "http://localhost:3000";
  return {
    signUp: function (name, fn) {
      $.ajax({
        type: "post",
        url: url + "/signup",
        data: JSON.stringify({ name: name }),
        contentType: 'application/json',
        dataType: 'json',
        success: fn
      });
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
