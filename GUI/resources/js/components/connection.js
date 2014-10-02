var fs = require('fs');

var $       = require('zepto-browserify').$,
    Ractive = require('ractive');

var ES = require('../es');

module.exports = Ractive.extend({

  template: fs.readFileSync(__dirname + '/../../templates/components/connection-template.html', 'utf-8'),

  init: function () {
    var self = this;

    ES.on('connected', function () {
      $(self.find('.connection')).addClass('connection--connected');
      $(self.find('.connection')).removeClass('connection--disconnected');
    });

    ES.on('disconnected', function () {
      $(self.find('.connection')).addClass('connection--disconnected');
      $(self.find('.connection')).removeClass('connection--connected');
    });
  }
});
