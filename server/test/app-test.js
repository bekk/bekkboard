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
      .expect({}, done);
  });

  it('POST /start', function (done) {

    request(app)
      .post('/start')
      .send({ a: 'bob', b: 'alice' })
      .expect({
        score: { a: 0, b: 0 },
        players: { a: 'bob', b: 'alice' },
        status: 'started'
      }, done);
  });

  it('ups score on event', function (done) {

    request(app)
      .post('/start')
      .send({ a: 'bob', b: 'alice' })
      .expect(200, function () {

        events.emit('score', { side: 'a' });

        request(app)
          .get('/status')
          .expect({
            score: { a: 1, b: 0 },
            players: { a: 'bob', b: 'alice' },
            status: 'started'
          }, done);
      });
  });

  it('POST /stop', function (done) {

    request(app)
      .post('/start')
      .send({ a: 'bob', b: 'alice' })
      .expect(200, function () {

        request(app)
          .post('/stop')
          .expect({}, done);
      });
  });

  it('signs up users', function (done) {
    request(app)
      .post('/signup')
      .send({ name: 'bob' })
      .expect(200, function () {

        request(app)
          .get('/players')
          .expect({
            players: [{ name: 'bob' }]
          }, done);
      });
  });
});
