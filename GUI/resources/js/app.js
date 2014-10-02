var $ = require('zepto-browserify').$,
    page = require('page');

var API     = require('./api'),
    ES      = require('./es'),
    Admin   = require('./admin'),
    Matches = require('./matches'),
    Score   = require('./score'),
    Signup  = require('./signup');

ES.connect();
ES.on('connected', function () {
  $('.score').addClass('score--connected');
  $('.score').removeClass('score--disconnected');
});
ES.on('disconnected', function () {
  $('.score').addClass('score--disconnected');
  $('.score').removeClass('score--connected');
});

var view, appEl = '.app';

page('/', log, teardown, function () {
  view = new Score({ el: appEl });
});
page('/admin', log, teardown, function () {
  view = new Admin({ el: appEl });
});
page('/matches', log, teardown, function () {
  view = new Matches({ el: appEl });
});
page('/signup', log, teardown, function () {
  view = new Signup({ el: appEl });
});
page('*', log, teardown, function () {
  console.log('Route not found');
});
page();

function log (ctx, next) {
  console.log('url', location.href);
  next();
}

function teardown (ctx, next) {
  if (view) {
    view.teardown();
  }
  next();
}
