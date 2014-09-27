var ES = (function () {

  var es;
  var events = {};

  function connect () {
    es = new EventSource(API.Url + '/es');
    es.addEventListener('open', function () {
      attachListeners();
      API.connect();
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
        if (sseData.data && sseData.data !== 'undefined' /* wierd */) {
          fn(JSON.parse(sseData.data));
        }
        else {
          fn();
        }
      }
      catch (e) {
        console.error('failed parsing sseData.data as json:', e, 'data was:', sseData.data);
      }
    });
  }

  return {
    connect: connect,
    on: on
  };
})();
