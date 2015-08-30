var EventEmitter = require('events');
var e = new EventEmitter();

module.exports = e;

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (chunk) {
    var line = chunk.replace("\n", "");
    if (line == 'disconnect') {
        e.emit('disconnect');
    }
    else if (line == 'connect') {
        e.emit('connect');
    }
    else {
        e.emit('data', line);
    }

});

process.stdin.on('end', function () {
    process.exit();
});
