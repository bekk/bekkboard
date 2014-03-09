var chai = require("chai");
chai.should();

var EventEmitter = process.EventEmitter;
var MatchSet = require("../matchset");

describe("match set", function () {

  var events;

  beforeEach(function () {
    events = new EventEmitter();
  });

  it("has initial score 0-0", function () {
    var s = new MatchSet(events);
    s.score.should.equal("0-0");
  });

  it("ups a's score on event", function () {
    var s = new MatchSet(events);

    events.emit("score", {
      point: "a"
    });

    s.score.should.equal("1-0");
  });

  it("ups a and b's score on event", function () {
    var s = new MatchSet(events);

    events.emit("score", {
      point: "a"
    });
    events.emit("score", {
      point: "b"
    });

    s.score.should.equal("1-1");
  });
});
