var request = require('supertest'),
    level   = require('level-mem');

var server = require('../app');

describe('app', function () {

  var app,
      events;

  beforeEach(function () {
    events = new process.EventEmitter();
    var db = level('db-name-does-not-matter',
      { keyEncoding: 'utf-8', valueEncoding: 'json' });
    app = server(events, db);
  });

  it('GET /status', function (done) {

    request(app)
      .get('/status')
      .expect({}, done);
  });

  it('POST /start', function (done) {

    request(app)
      .post('/start')
      .send({
        a: { name: 'bob' },
        b: { name: 'alice' }
      })
      .expect({
        score: { a: 0, b: 0 },
        players: { a: 'bob', b: 'alice' },
        status: 'started'
      }, done);
  });

  it('ups score on event', function (done) {

    request(app)
      .post('/start')
      .send({
        a: { name: 'bob' },
        b: { name: 'alice' }
      })
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
      .send({
        a: { name: 'bob' },
        b: { name: 'alice' }
      })
      .expect(200, function () {

        request(app)
          .post('/stop')
          .expect({}, done);
      });
  });

  it('signs up users', function (done) {
    request(app)
      .post('/signup')
      .send({ name: 'bob', number: 12341234 })
      .expect(200, function (err, req) {

        request(app)
          .get('/players')
          .expect(200, function (err, req) {

            var player = req.body[0];
            player.should.have.property('name').and.equal('bob');
            player.should.have.property('number').and.equal(12341234);
            done();
          });
      });
  });
});
