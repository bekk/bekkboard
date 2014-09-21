
var Match = require('../match');

describe('match', function () {

  var events;

  beforeEach(function () {
    events = new process.EventEmitter();
  });

  it('returns current score', function () {
    var m = new Match(events);

    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('is initially stopped', function () {
    var m = new Match(events);
    m.status().should.equal('stopped');
  });

  it('does not up score when stopped', function () {
    var m = new Match(events);
    m.stop();

    events.emit('score', { side: 'a' });

    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('ups score', function () {
    var m = new Match(events);
    m.start();

    events.emit('score', { side: 'a' });

    m.score().should.deep.equal({ a: 1, b: 0 });
  });

  it('undos score', function () {
    var m = new Match(events);
    m.start();

    events.emit('score', { side: 'a' });
    events.emit('undo', { side: 'a' });

    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('restarts', function () {
    var m = new Match(events);
    m.start();
    events.emit('score', { side: 'a' });
    m.score().should.deep.equal({ a: 1, b: 0 });

    m.stop();
    m.start();
    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('serializes to json', function () {
    var m = new Match(events);
    m.json().should.deep.equal({
      score: { a: 0, b: 0 },
      status: 'stopped'
    });
  });

  it('contains winner in json', function () {
    var m = new Match(events);
    m.start();
    emitScore('a', 11);
    m.json().should.have.property('winner').and.equal('a');
  });

  function emitScore (player, points) {
    while (points--) {
      events.emit('score', { side: player });
    }
  }
});
