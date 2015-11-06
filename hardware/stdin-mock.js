var EventEmitter = require('events').EventEmitter;
var e = new EventEmitter();

module.exports = e;

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    var line = chunk.replace("\n", "");
    if (line == 'disconnected') {
        e.emit('disconnected');
    }
    else if (line == 'connected') {
        e.emit('connected');
    }
    else if (line == 'winA') {
        for (var i = 0; i<11; i++) {
            e.emit('data', '0');
        }
    }
    else {
        e.emit('data', line);
    }

});

process.stdin.on('end', function () {
    process.exit();
});
