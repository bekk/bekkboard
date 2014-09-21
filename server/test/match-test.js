
var Match = require('../match');

describe('match', function () {

  var events, m;

  beforeEach(function () {
    events = new process.EventEmitter();
    m = new Match(events, 'alice', 'bob');
  });

  it('returns current score', function () {
    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('is initially stopped', function () {
    m.status().should.equal('stopped');
  });

  it('does not up score when stopped', function () {
    m.stop();

    events.emit('score', { side: 'a' });

    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('ups score', function () {
    m.start();

    events.emit('score', { side: 'a' });

    m.score().should.deep.equal({ a: 1, b: 0 });
  });

  it('undos score', function () {
    m.start();

    events.emit('score', { side: 'a' });
    events.emit('undo', { side: 'a' });

    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('restarts', function () {
    m.start();
    events.emit('score', { side: 'a' });
    m.score().should.deep.equal({ a: 1, b: 0 });

    m.stop();
    m.start();
    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('serializes to json', function () {
    m.json().should.deep.equal({
      score: { a: 0, b: 0 },
      players: { a: 'alice', b: 'bob' },
      status: 'stopped'
    });
  });

  it('contains winner in json', function () {
    m.start();
    emitScore('a', 11);
    m.json().should.have.property('winner').and.equal('a');
  });

  it('stops match when there is a winner', function () {
    m.start();
    emitScore('a', 11);
    m.json().should.have.property('status').and.equal('stopped');
  });

  function emitScore (player, points) {
    while (points--) {
      events.emit('score', { side: player });
    }
  }
});
