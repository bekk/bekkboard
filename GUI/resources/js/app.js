var $ = require('zepto-browserify').$,
    page = require('page'),
    Ractive = require('ractive');

Ractive.components.connection = require('./components/connection');

var API     = require('./api'),
    ES      = require('./es'),
    Admin   = require('./pages/admin'),
    Matches = require('./pages/matches'),
    Score   = require('./pages/score'),
    Signup  = require('./pages/signup');

ES.connect();

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
