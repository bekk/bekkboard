var url = "http://localhost:3000";

var updateStatus = function(callback){
	$.get(url + "/status", function(data){
		callback(data);
	});
};

var startGame = function(){
	$.post(url + "/start");
};

var stopGame = function(){
	$.post(url + "/stop");
};

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
		updateStatus(function (status){
			ractiveScore.set('score', status.score);
		});
	}, 1000);
});