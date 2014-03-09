
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

    events.emit('score', { point: 'a' });

    m.score().should.deep.equal({ a: 0, b: 0 });
  });

  it('ups score', function () {
    var m = new Match(events);
    m.start();

    events.emit('score', { point: 'a' });

    m.score().should.deep.equal({ a: 1, b: 0 });
  });

  it('serializes to json', function () {
    var m = new Match(events);
    m.json().should.deep.equal({
      score: { a: 0, b: 0 },
      status: 'stopped'
    });
  });
});
