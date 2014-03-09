
var Match = require('../match');

describe('match', function () {

  var events;

  beforeEach(function () {
    events = new process.EventEmitter();
  });

  it('returns current score', function () {
    var m = new Match(events);

    m.score().should.deep.equal({
      a: 0,
      b: 0
    });
  });

  it('ups score', function () {
    var m = new Match(events);

    m.start();

    events.emit('score', { point: 'a' });

    m.score().should.deep.equal({
      a: 1,
      b: 0
    });
  });
});
