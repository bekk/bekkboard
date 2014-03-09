var events = require('../hardware/buttonReader');
var app = require('./app')(events);
app.listen(3000);
