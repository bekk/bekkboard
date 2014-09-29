var AWS = require('aws-sdk'),
  s3 = require('s3'),
  fs = require('fs'),
  bucket_key = "tabletennis",
  games_foler = "games";

var s3 = require('s3');
var awsS3Client = new AWS.S3({ "accessKeyId": "AKIAICPIPDQPCWHFL5WQ", "secretAccessKey": "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"});

var options = {
  s3Client: awsS3Client,
};
var client = s3.createClient(options);

/**
Usage

var s = new S3Manager();

s.uploadToS3(path) - path can be callback from gifCreator.createGif()

**/

function S3Manager () {
  var self = this;

  self.uploadToS3 = function(data) {
    var gifFile = data.folder + "/" + data.filename;

    var params = {
      localFile: gifFile,
      s3Params: {
        Bucket: bucket_key,
        Key: games_foler + "/" + data.players + "/"+ data.filename,
        }
      };

      var uploader = client.uploadFile(params);

      uploader.on("error", function(err) {
        console.log("error" + err);
      });

      uploader.on("end", function() {
        console.log("successfully uploaded " + data.filename)
        fs.unlink(gifFile);
      });

    };

    /* Get list of keys for players prefix(emil-vs-torgeir) - returns ([games/emil-vs-torger/emil-vs-torger-1411732423931.gif], ...) */
    self.getFileKeys = function(playersPrefix, cb) {
      getObjectKeys("mikkel-vs-torgeir", function(keys) {
        cb(keys);
      });
    }

    var getObjectKeys = function(playersPrefix, cb) {
      var params = {
        Bucket: "tabletennis",
        Marker: games_foler + "/" + playersPrefix
      };

      awsS3Client.listObjects(params, function(err, data) {
        var keys = [];
         data.Contents.forEach(function(object) {
            keys.push(object.Key)
         })
         cb(keys);
      });
    }

  }

  module.exports = S3Manager;