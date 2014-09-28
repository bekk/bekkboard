var _ = require('lodash');
var elorating = require('elorating');

var DEFAULT_RATING = 1000;

var mapToRatings = function(newRatings) {
	return _(newRatings).map(function(rating, number){
		return {player: players[number], rating: rating};
	}).sortBy('rating').reverse().value();
};

module.exports = function(db) {
	var MatchDb = require('./match-db')(db);
	var rating = [];

	var calculateRating = function(fn) {
		var newRatings = {};
		var players = {};
		MatchDb.all(function(err, matches){
			if(err){
				return fn(err);
			}
			_(matches).sort('date').forEach(function(match){
				var currentA = newRatings[match.players.a.number] || DEFAULT_RATING;
				var currentB = newRatings[match.players.b.number] || DEFAULT_RATING;
				var expectedScores = elorating.getExpectedScore(currentA, currentB);
				var scoreA = 0.5;
				var scoreB = 0.5;
				if (match.score.a > match.score.b) {
					scoreA = 1;
					scoreB = 0;
				}
				else if (match.score.a < match.score.b) {
					scoreA = 0;
					scoreB = 1;	
				}
				newRatings[match.players.a.number] = elorating.updateRating(currentA, scoreA, expectedScores.Ea);
				newRatings[match.players.b.number] = elorating.updateRating(currentB, scoreB, expectedScores.Eb);
				players[match.players.a.number] = match.players.a;
				players[match.players.b.number] = match.players.b;
			});

			rating = mapToRatings(newRatings);

			fn(null, rating);
		});
	}

	var getRating = function(fn){
		if(rating.length > 0){
			fn(null, rating);
		}
    else {
    	calculateRating(function(err, r){
    		if(err){
    			return fn(err);
    		}
    		fn(null, r);
    	})
    }
	};

	return {
		getRating: getRating,
		calculateRating: calculateRating
	};
};