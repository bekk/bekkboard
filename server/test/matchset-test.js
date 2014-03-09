var chai = require('chai');
chai.should();

var EventEmitter = process.EventEmitter;
var MatchSet = require('../matchset');

describe("match set", function () {

  var events;

  beforeEach(function () {
    events = new EventEmitter();
  });

  it('has initial score 0-0', function () {
    var s = new MatchSet(events);
    s.score.should.equal('0-0');
  });

  it('ups score on event', function () {
    var s = new MatchSet(events);

    events.emit('score', {
      point: 'a'
    });

    s.score.should.equal('1-0');
  });
});
