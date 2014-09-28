
var levelup = require('level');
var options = { keyEncoding: 'utf-8', valueEncoding: 'json' };
var db = levelup('./database.db', options);
var MatchDb = require('./match-db')(db);

function match (scoreA, scoreB, a, b, date) {
  return {
    json: function () {
      return {
        "score": {
          "a": scoreA,
          "b": scoreB
        },
        "status": "stopped",
        "players": {
          "a": {
            "name": b,
            "number": numbers[b]
          },
          "b": {
            "name": a,
            "number": numbers[a]
          }
        },
        "timeRemaining": "03:43",
        "winner": "eirik",
        "date": date
      }
    }
  };
}

function randScore () {
  return parseInt(Math.random() * 12);
}

var players = ['togeir', 'eirik', 'jonas', 'geir'];
var numbers = {
  'togeir': 123,
  'eirik': 321,
  'jonas': 234,
  'geir': 432 };

function randPlayer () {
  var i = parseInt(Math.random() * players.length);
  return players[i];
}

var date = new Date();
for (var i = 0; i < 1000; i++) {
  date = new Date(date + 1000 * 60 * 60);
  var m = match(randScore(), randScore(), randPlayer(), randPlayer(), date);
  (function (i) {
    MatchDb.save(m, function (err, m) {
      console.log('saved match', i);
    });
  })(i);
}
