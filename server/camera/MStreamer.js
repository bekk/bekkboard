
var spawn = require('child_process').spawn;
var fs = require('fs');
var request = require('request');

var isCapturing = false;
var process;

/**

Require mjpg-streamer installed on the pi

http://blog.miguelgrinberg.com/post/how-to-build-and-run-mjpg-streamer-on-the-raspberry-pi

var options = {
	framerate: x,
	port: 8090,
	
}
var camera = new MStreamer(options);

camera.setResolution("720p") - "480", "720", "1080" only 720 is available on the logitec 310 cam

To start streaming

camera.start();

To start taking images

camera.startTakingImages({
	players: "emil-vs-torgeir",
	interval: 1000, - every 1 second
	maxPhotos: 15 - max 15 images taken
});

*/


//Constructor
var MStreamer = function(args){
	var self = this;

	var isCapturing = false,
		process,
		intervalId;
	//default options
	var options = {
		device : '/dev/video0',
		resolution : 'SVGA',
		framerate : 15,
		port : 8090,
		fileFolder : '/usr/local/mjpg-streamer/',
		imagesFolder: __dirname + "/images/"
	};

	var cmd = options.fileFolder + "mjpg_streamer";

	if(args) {
		this.setOptions(args);
	}

	fs.exists(options.imagesFolder, function(exists) {
		if(!exists) {
			fs.mkdirSync(options.imagesFolder);
		}
	});
	
	// Returns mjpeg-streamer arguments
	var getArgs = function() {
		return [ '-i' ,
		options.fileFolder +'input_uvc.so -r ' + options.resolution + ' -f ' + options.framerate,
		'-o',
		options.fileFolder + 'output_http.so -p ' + options.port + ' -w ./www'
		];
	};

	// Set resolution
	self.setResolution = function(resolution) {
		switch (resolution) {
			case "480p" :
			options.resolution = "640×480";
			break;
			case "720p":
			options.resolution = "1280x720";
			break;
			case "1080p" :
			options.resolution = "1920x1080";
			break;
		}
	};

	// Set fps
	self.setFps = function(fps) {
		options.framerate = fps;
	}


	//Set mjpeg-streamer options
	self.setOptions = function(args) {
		for(var key in args) {
			if(args.hasOwnProperty(key)) {
				if(!options.hasOwnProperty(key)) {
					print(key + " is not a valid property");
					continue;
				}
				options[key] = args[key];
				print(key + " set to: " + args[key]);
			}
		}
	};

	// Take current image from mjpg-streamer and saves it to a folder
	self.takeSnapshot = function(playersPrefix, number, callback) {
		if (!isCapturing) return;

		var path = options.imagesFolder + playersPrefix;

		fs.exists(path, function(exists) {
	        // Create directory if it not exists
	        if(!exists)fs.mkdirSync(path);

	        var filename = path + '/img' + number + ".png";

	        request('http://localhost:' + options.port +'/?action=snapshot').pipe(fs.createWriteStream(filename));

	        print("snapshot taken: " + filename);

	        if(callback)callback(filename);
	    });
	};


	self.startTakingImages = function(params) {
		console.log(params);
		var interval = params.interval || 1000;
		var maxPhotos = params.maxPhotos || 15;

		var x = 0;
		intervalID = setInterval(function () {
			if (++x === maxPhotos) {
				clearInterval(intervalID);
			}
			self.takeSnapshot(params.players, x);
		}, interval);
	};

	self.stopTakingImages = function() {
		if(intervalID) {
			clearInterval(intervalID);
		}
	}

	// Start mjpeg-streamer process
	self.start = function(callback) {
		var _this = this;

		console.log(getArgs());

		if(isCapturing) {
			console.log("already capturing");
			return;
		}

		fs.exists(options.device, function(exists) {
			if(!exists) {
				print("device location not found: " + options.device);
				return;
			}

			process = spawn(cmd, getArgs());
			isCapturing = true;

			process.stdout.on('data', function (data) {
				print("stdout: " + data);
			});

			process.stderr.on('data', function (data) {
				print("stderr: " + data);
			});

			process.on('exit', function (code) {
				stop();
			}); 

			print("started streaming on port: " + options.port);
		});
	};

	// Stop mjpeg-streamer process
	var stop = function() {
		print("Calling STOP");
		if(!isCapturing)  {
			print("not capturing");
			return;
		}
		process.kill('SIGHUP');
		isCapturing = false;

		print("MStreamer stopped");
	};

	var print = function(msg) {
		if(cmd) console.log(cmd + ": " + msg);
		else console.log(msg);
	}
};

module.exports = MStreamer;
