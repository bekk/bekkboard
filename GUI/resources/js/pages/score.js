var fs = require('fs');

var $       = require('zepto-browserify').$,
    Ractive = require('ractive');

var ES  = require('../es'),
    API = require('../api');

module.exports = Ractive.extend({

  template: fs.readFileSync(__dirname + '/../../templates/score-template.html', 'utf-8'),

  data: {
    score: { a: 0, b: 0 },
    started: false,
    ranking: [],
    streaming: true
  },

  init: function () {
    var self = this;
    ES.on('score', function (data) {
      self.set('score', data.score);
      self.set('winner', data.winner);
      self.set('players', data.players);
      self.set('draw', data.draw);
      self.set('timeRemaining', data.timeRemaining);
      self.set('started', data.status === "started");
    });

    ES.on('ranking', function (ranking) {
      self.set('ranking', ranking);
    });

    API.getRanking(function (ranking) {
      self.set('ranking', ranking);
    });

    API.continueStream();

    var videoTimeout;

    var SPACE = 32;
    $(document).keypress(function (e) {
      if (e.keyCode !== SPACE) return;

      if (videoTimeout) {
        clearTimeout(videoTimeout);
        videoTimeout = null;
      }

      var shouldStream = !self.get('streaming');
      if (shouldStream) {
        API.continueStream();
        self.set('streaming', shouldStream);
      }
      else {
        API.replay();
        videoTimeout = setTimeout(function () {
          self.set('streaming', shouldStream);

          var video = self.find('video');

          var REPLAY_TIME = 4;
          function currentTime () {
            var duration = video.duration;
            if (duration < REPLAY_TIME) {
              return 0;
            }
            else {
              return duration - REPLAY_TIME;
            }
          }

          video.onloadeddata = function () {
            video.playbackRate = 0.4;
            video.currentTime = currentTime();
            video.play();

            var i = 0;
            video.onended = function () {
              console.log('on end', i);
              video.currentTime = currentTime();
              video.play();

              i++;
              if (i === 2) {
                API.continueStream();
                self.set('streaming', true);
              }
            };
          };

        }, 1000);
      }
    });
  }
});
