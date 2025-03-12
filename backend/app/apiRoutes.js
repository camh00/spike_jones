var express = require('express');
var router = express.Router();
var Collection = require('./models/collection');
var Tracks = require('./models/tracks');
var Image = require('./models/image');
var Video = require('./models/video');

// API endpoint to get songs
router.get('/songs', function(req, res, next) {
  Tracks.find().exec(function(err, tracks) {
    if (err) return next(err);
    res.json(tracks);
  });
});

// API endpoint to get pictures
router.get('/pictures', function(req, res, next) {
  Image.find().exec(function(err, images) {
    if (err) return next(err);
    res.json(images);
  });
});

// API endpoint to get videos
router.get('/videos', function(req, res, next) {
  Video.find().exec(function(err, videos) {
    if (err) return next(err);
    res.json(videos);
  });
});

module.exports = router;