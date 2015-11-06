var fs = require("fs");
var GIFEncoder = require('gifencoder');
var encoder = new GIFEncoder(500, 500);
var pngFileStream = require('png-file-stream');

module.exports = Gif;

/**

Usage:
**

var g = new Gif();
g.createGif("emil","torgeir") callback = /gifs/emil-vs-torgeri/emil-vs-torgeir-134124.gif

**
createGif("emil","torgeir") will generate a gif from images located in images/torger-vs-emil folder
and save the .gif file in the gifs folder.

When completed the gif file(relative path) will be returned as well as the players name e.g("emil-vs-torgeir")

The names will allways be in the same order.

**/

function Gif () {
  var self = this;

  var config = {
    "dir" : "images/",
    "prefix" : "frame?.png"
  };


  var imagePath = function(withFolder) {
    return config.dir + "/**/" + config.prefix;
  };

  var filenamePrefixForPlayers = function(playerA, playerB) {
    var firstName, secondName;

    if(playerA < playerB) {
      firstName = playerA;
      secondName = playerB;
    } else {
      firstName = playerB;
      secondName = playerA;
    }

    return firstName + "-vs-" + secondName;
  }


  self.createGif = function (playerA, playerB, callback) {
    
    var playersTitle = filenamePrefixForPlayers(playerA, playerB);
    var fileName = playersTitle + "-" + new Date().getTime()+ ".gif";

    var rs = pngFileStream(imagePath());
    
    rs.pipe(encoder.createWriteStream({ repeat: -1, delay: 500, quality: 5 }))
    .pipe(fs.createWriteStream("./gifs/" + fileName))
    
    rs.on("end", function(end) {
      callback(fileName, playersTitle);
    });
    
  };

}