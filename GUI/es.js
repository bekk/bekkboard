var ES = (function () {

  var es;
  var events = {};

  function connect () {
    es = new EventSource('http://localhost:3000/es');
    es.addEventListener('open', function () {
      attachListeners();
      Api.connectSse();
    });
  }

  function attachListeners () {
    for (var type in events) {
      var listeners = events[type] || [];
      for (var i = 0; i < listeners.length; i++) {
        es.addEventListener(type, listeners[i]);
      }
    }
  }

  function on (type, fn) {
    events[type] = events[type] || [];
    events[type].push(function (sseData) {
      try {
        var data = JSON.parse(sseData.data);
        fn(data);
      }
      catch (e) {
        console.error('failed parsing sseData.data as json');
      }
    });
  }

  return {
    connect: connect,
    on: on
  };
})();
