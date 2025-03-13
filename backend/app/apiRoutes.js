var express = require('express');
var router = express.Router();
var Collection = require('./models/collection');
var Tracks = require('./models/tracks');
var Image = require('./models/image');
var Video = require('./models/video');

// API endpoint to get songs
router.get('/songs', async function(req, res, next) {
  try {
    const tracks = await Tracks.find().exec();
    res.json(tracks);
  } catch (err) {
    next(err);
  }
});

// API endpoint to get pictures
router.get('/pictures', async function(req, res, next) {
  try {
    const images = await Image.find().exec();
    res.json(images);
  } catch (err) {
    next(err);
  }
});

// API endpoint to get videos
router.get('/videos', async function(req, res, next) {
  try {
    const videos = await Video.find().exec();
    res.json(videos);
  } catch (err) {
    next(err);
  }
});

module.exports = router;