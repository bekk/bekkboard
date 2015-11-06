var EventEmitter = require('events').EventEmitter;
var e = new EventEmitter();

module.exports = e;

process.stdin.resume();
process.stdin.setEncoding('utf8');

var usage = `
# Usage mock
Start by first writing \`connected\` and then do a long press to
reset by sending in \`4\`.

# Input values
? - Help (this help)
connected - Connect
disconnected - Disconnect
0 - Button click: A Single click
1 - Button click: B Single click
2 - Button click: A Double click
3 - Button click: B Double click
4 - Button click: A Long press
5 - Button click: B Long press
`;

console.log('Mock started. Send `?` to get started');

process.stdin.on('data', function (chunk) {
    var line = chunk.replace("\n", "");
    if (line == '?') {
      console.log(usage);
    }
    else if (line == 'disconnected') {
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
