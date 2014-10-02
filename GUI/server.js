var connect     = require('connect'),
    fs          = require('fs'),
    path        = require('path'),
    mime        = require('mime'),
    serveStatic = require('serve-static'),
    compression = require('compression');

var oneDay = 86400000,
    oneYear = oneDay * 365;

var PORT = process.env.PORT || 3000;

connect()
  .use(compression())
  .use(function (req, res, next) {
    var urls = [ '/', '/admin', '/matches', '/signup' ];
    if (urls.indexOf(req.url) !== -1) {
      fs.createReadStream('./dist/index.html').pipe(res);
    }
    else {
      next();
    }
  })
  .use(serveStatic('./dist', { maxAge: oneYear }))
  .listen(PORT, function () {
    console.log(' listening on', PORT);
  });
