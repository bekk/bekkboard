var fs = require('fs');

var $ = require('zepto-browserify').$,
    Ractive = require('ractive');

var API = require('./api');

module.exports = Ractive.extend({

  template: fs.readFileSync(__dirname + '/../templates/signup-template.html', 'utf-8'),

  init: function () {

    var $form      = $(this.find('.signup')),
        $confirmed = $(this.find('.signup-field-confirmed')),
        $number    = $(this.find('.signup-field-number')),
        $name      = $(this.find('.signup-field-name'));

    function isInputKey (e) {
      var code  = e.keyCode;
      var number = (code >= 48 && code <= 57);
      var enter = code === 13;
      var bs = code === 8;

      /* var left  = code == 37; */
      /* var right = code == 39; */
      /* var tab   = code == 9; */
      /* var shift = code == 16; */

      return number || enter || bs;
    }

    var lastNumber;
    $number.keyup(function (e) {
      if (!isInputKey(e)) {
        return;
      }

      var number = $number.val();

      if (number === lastNumber) {
        return;
      }

      lastNumber = number;

      $name.val('');
      API.getUser(number, function (user) {
        if (user && user.name) {
          $name.val(user.name);
        }
      });
    });

    $form.submit(function submit (e) {
      var number = $.trim($number.val()),
          name   = $.trim($name.val());

      if (!number || !name) {
        return false;
      }

      $confirmed.addClass('confirmed--flash');
      setTimeout(function () {
        $confirmed.removeClass('confirmed--flash');
      }, 900);

      API.signUp(number, name);
      $number.val("");
      $name.val("");
      $number.focus();
      return false;
    });

    $number.focus();
  }
});
