var getScore = function(){
	return {
		a: Math.floor((Math.random()*11)+1),
		b: Math.floor((Math.random()*11)+1)
	}
}

$(function(){
	var ractiveScore = new Ractive({
		el: 'score',
		template: '#scoreTemplate',
		data: {
			score: {
				a: 0,
				b: 0
			}
		}
	});

	setInterval(function(){
		var score = getScore();
		ractiveScore.set('score', score);
	}, 1000);
});