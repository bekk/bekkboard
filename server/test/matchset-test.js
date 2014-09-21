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

  it("undos a's score", function () {
    var s = new MatchSet();

    s.point("a");
    s.undoPoint("a");

    s.score.should.deep.equal({ a: 0, b: 0 });
  });

  it('does not undo below 0', function () {
    var s = new MatchSet();

    s.undoPoint("a");
    s.undoPoint("a");

    s.score.should.deep.equal({ a: 0, b: 0 });
  });

  it('lets you win with at 11 points', function () {
    var s = new MatchSet();
    point(s, 'a', 11);
    s.score.should.deep.equal({ a: 11, b: 0 });
    s.done.should.equal(true);
  });

  it('does not let you win without a two point lead', function () {
    var s = new MatchSet();
    point(s, 'a', 11);
    point(s, 'b', 10);
    s.done.should.equal(false);
  });

  it('lets you win a really exciting match!', function () {
    var s = new MatchSet();
    point(s, 'a', 19);
    point(s, 'b', 17);
    s.done.should.equal(true);
  });


  function point (set, player, points) {
    while (points--) {
      set.point(player);
    }
  }

});

