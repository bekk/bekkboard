var request = require('supertest');

var app = require('../app');

describe('app', function () {

  it('GET /status', function (done) {

    request(app)
      .get('/status')
      .expect({
        score: {
          a: 0,
          b: 0
        },
        status: 'stopped'
      }, done);
  });
});
