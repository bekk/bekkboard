var request = require('supertest');

var server = require('../app');

describe('app', function () {

  var app,
      events;

  beforeEach(function () {
    events = new process.EventEmitter();
    app = server(events);
  });

  it('GET /status', function (done) {

    request(app)
      .get('/status')
      .expect({
        score: { a: 0, b: 0 },
        status: 'stopped'
      }, done);
  });

  it('POST /start', function (done) {

    request(app)
      .post('/start')
      .expect({
        score: { a: 0, b: 0 },
        status: 'started'
      }, done);
  });

  it('ups score on event', function (done) {
    request(app)
      .post('/start')
      .expect(200, function () {

        events.emit('score', { point: 'a' });

        request(app)
          .get('/status')
          .expect({
            score: { a: 1, b: 0 },
            status: 'started'
          }, done);
      });
  });

  it('POST /stop', function (done) {
    request(app)
      .post('/start')
      .expect(200, function () {

        request(app)
          .post('/stop')
          .expect({
            score: { a: 0, b: 0 },
            status: 'stopped'
          }, done);
      });
  });
});
