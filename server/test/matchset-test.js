var chai = require("chai");
chai.should();

var MatchSet = require("../matchset");

describe("match set", function () {

  it("has initial score 0-0", function () {
    var s = new MatchSet();

    s.score.should.deep.equal({ a: 0, b: 0 });
  });

  it("ups side a's score", function () {
    var s = new MatchSet();

    s.point("a");

    s.score.should.deep.equal({ a: 1, b: 0 });
  });

  it("ups both sides' score", function () {
    var s = new MatchSet();

    s.point('a');
    s.point('b');

    s.score.should.deep.equal({ a: 1, b: 1 });
  });
});
