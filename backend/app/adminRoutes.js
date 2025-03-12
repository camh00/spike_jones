var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var multer = require('multer');
var mongoose = require('mongoose');
var User = require('./models/user');
var Collection = require('./models/collection');
var Tracks = require('./models/tracks');
var Video = require('./models/video');
var Image = require('./models/image');
var Sheet = require('./models/sheet');
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');
var path = require('path');
var appDirectory = __dirname + '/';

// setting up the upload handler
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var filetype = file.mimetype;
    var ext = filetype.substring(filetype.indexOf('/') + 1);
    var destination;
    if (ext == 'jpeg' || ext == 'jpg' || ext == 'tiff') {
      destination = appDirectory + '/archive/images/';
    } else if (ext == 'mp3' || ext == 'wav' || ext == 'mpeg') {
      destination = appDirectory + '/archive/music/' + req.body.id;
    } else if (ext == 'zip' || ext == 'rar' || ext == '7z' || ext == 'tar' || ext == 'x-zip-compressed') {
      destination = appDirectory + '/archive/music/' + req.body.collectionID;
    } else if (ext == 'mp4' || ext == 'avi') {
      destination = appDirectory + '/archive/videos/';
    } else if (ext == 'pdf') {
      destination = appDirectory + '/archive/sheets/';
    } else {
      return cb(new Error('Invalid file type ' + ext));
    }
    mkdirp(destination, function (err) {
      if (err) return cb(err);
      cb(null, destination);
    });
  },
  filename: function (req, file, cb) {
    var filetype = file.mimetype;
    var ext = filetype.substring(filetype.indexOf('/') + 1);
    if (ext == 'jpeg' || ext == 'jpg' || ext == 'tiff') {
      if (req.body.collectionID) {
        cb(null, (req.body.collectionID + '.jpeg'));
      } else if (req.newMongoId) {
        cb(null, (req.newMongoId + '.jpeg'));
      }
    } else if (ext == 'mp3' || ext == 'wav' || ext == 'mpeg' || ext == 'mp4' || ext == 'avi' || ext == 'pdf') {
      cb(null, (req.newMongoId + '.' + ext));
    } else if (ext == 'zip' || ext == 'rar' || ext == '7z' || ext == 'tar' || ext == 'x-zip-compressed') {
      cb(null, req.body.collectionID + '.' + ext);
    }
  }
});
var upload = multer({ storage: storage });

module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  router.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  router.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/audio',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // =====================================
  // SIGNUP ==============================
  // =====================================
  router.get('/signup', function (req, res) {
    User.find().exec().then(function (data) {
      if (req.user.local.email === 'spikeadmin') {
        res.render('signup.ejs', {
          message: req.flash('signupMessage'),
          users: data,
          user: req.user
        });
      } else {
        res.render('index.ejs');
      }
    });
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/signup',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // delete a user from the database
  router.post('/deleteUser', function (req, res, next) {
    User.deleteOne({ '_id': req.body.userid }).exec()
      .then(() => {
        res.redirect('/signup');
      })
      .catch(err => {
        return next(err);
      });
  });

  // =====================================
  // AUDIO PAGE ==========================
  // =====================================
  router.get('/audio', isLoggedIn, function (req, res, next) {
    Promise.all([
      Collection.find().exec(),
      Tracks.find().exec()
    ]).then(function (data) {
      var collections = data[0];
      var tracks = data[1];

      // Determine the zip file extension for each collection
      collections.forEach(collection => {
        var zipExtensions = ['zip', 'rar', '7z', 'tar', 'x-zip-compressed'];
        var zipFile = null;
        for (var ext of zipExtensions) {
          if (fs.existsSync(path.join(appDirectory, `archive/music/${collection._id}/${collection._id}.${ext}`))) {
            zipFile = `${collection._id}.${ext}`;
            break;
          }
        }
        collection.zipFile = zipFile;
      });

      res.render('audio.ejs', {
        collections: collections,
        tracks: tracks,
        user: req.user
      });
    }).catch(next);
  });

  router.post('/addCollection', function (req, res, next) {
    req.newMongoId = new mongoose.Types.ObjectId();
    next();
  }, upload.single('collectionArt'), function (req, res, next) {
    var newCollection = new Collection({
      _id: req.newMongoId,
      type: req.body.collectionType,
      name: req.body.collectionName,
      artist: req.body.artist,
      guests: req.body.guests,
      year: req.body.year,
      label: req.body.recordLabel,
      recordNumber: req.body.recordNumber,
      tracks: [],
      download: false,
    });
    newCollection.save()
      .then(() => {
        res.redirect('/audio');
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/updateCollection', function (req, res, next) {
    Collection.findOneAndUpdate({
      _id: req.body.id,
    }, {
      $set: {
        type: req.body.collectionType,
        name: req.body.collectionName,
        artist: req.body.artist,
        guests: req.body.guests,
        year: req.body.year,
        label: req.body.recordLabel,
        recordNumber: req.body.recordNumber,
      },
    }, {
      new: true
    }).exec()
      .then(() => {
        res.redirect('/audio#' + req.body.id);
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/updateArt', upload.single('artFile'), function (req, res, next) {
    res.redirect('/audio');
  });

  router.post('/deleteCollection', function (req, res, next) {
    rmdir(path.join(appDirectory, 'archive/music/', req.body.collectionID), function (err) {
      if (err) throw err;
    });
    var artFile = appDirectory + '/archive/images/' + req.body.collectionID + '.jpeg';
    fs.unlink(artFile, function (err) {
      if (err) return next(err);
      Promise.all([
        Collection.deleteOne({ '_id': req.body.collectionID }).exec(),
        Tracks.deleteMany({ 'collectionID': req.body.collectionID }).exec()
      ]).then(function (data) {
        res.redirect('/audio');
      }).catch(err => {
        return next(err);
      });
    });
  });

  router.post('/addTrack', function (req, res, next) {
    req.newMongoId = new mongoose.Types.ObjectId();
    next();
  }, upload.single('audioFile'), function (req, res, next) {
    Tracks.countDocuments({ collectionID: req.body.id }).then(count => { // Updated to use promises
      if (count > 0) {
        Tracks.findOneAndUpdate({
          collectionID: req.body.id,
        }, {
          $push: {
            tracks: {
              _id: req.newMongoId,
              title: req.body.trackName,
              composer: req.body.trackComposer,
              lyrics: req.body.trackLyrics,
            }
          }
        }, {
          new: true
        }).exec()
          .then(() => {
            res.redirect('/audio');
          })
          .catch(err => {
            return next(err);
          });
      } else {
        var newTracks = new Tracks({
          collectionID: req.body.id,
          tracks: [{
            _id: req.newMongoId,
            title: req.body.trackName,
            composer: req.body.trackComposer,
            lyrics: req.body.trackLyrics,
          }]
        });
        newTracks.save()
          .then(() => {
            res.redirect('/audio#' + req.body.id);
          })
          .catch(err => {
            return next(err);
          });
      }
    }).catch(err => {
      return next(err);
    });
  });

  router.post('/updateTrack', upload.single('audioFile'), function (req, res, next) {
    Tracks.findOneAndUpdate({
      'tracks._id': req.body.trackID,
    }, {
      $set: {
        'tracks.$.title': req.body.trackName,
        'tracks.$.composer': req.body.trackComposer,
        'tracks.$.lyrics': req.body.trackLyrics,
      }
    }, {
      new: true
    }).exec()
      .then(() => {
        res.redirect('/audio');
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/deleteTrack', function (req, res, next) {
    var trackFile = appDirectory + '/archive/music/' + req.body.collectionID + '/' + req.body.trackID + '.mpeg';
    fs.unlink(trackFile, function (err) {
      if (err) return next(err);
      Tracks.updateOne({
        'collectionID': req.body.collectionID
      }, {
        $pull: {
          'tracks': {
            "_id": req.body.trackID
          }
        }
      }).exec()
        .then(() => {
          res.redirect('/audio');
        })
        .catch(err => {
          return next(err);
        });
    });
  });

  router.post('/addZipFile', upload.single('zipFile'), function (req, res, next) {
    Collection.findOneAndUpdate({
      _id: req.body.collectionID,
    }, {
      $set: {
        download: true,
      },
    }, {
      new: true
    }).exec()
      .then(() => {
        res.redirect('/audio#' + req.body.collectionID);
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/removeZipFile', function (req, res, next) {
    var zipFilePattern = new RegExp(`^${req.body.collectionID}\.(zip|rar|7z|tar|x-zip-compressed)$`);
    var zipFileDir = path.join(appDirectory, 'archive/music/', req.body.collectionID);
    fs.readdir(zipFileDir, function (err, files) {
      if (err) return next(err);
      var zipFile = files.find(file => zipFilePattern.test(file));
      if (zipFile) {
        fs.unlink(path.join(zipFileDir, zipFile), function (err) {
          if (err) return next(err);
          Collection.findOneAndUpdate({
            _id: req.body.collectionID,
          }, {
            $set: {
              download: false,
            },
          }, {
            new: true
          }).exec()
            .then(() => {
              res.redirect('/audio#' + req.body.collectionID);
            })
            .catch(err => {
              return next(err);
            });
        });
      } else {
        return next(new Error('Zip file not found'));
      }
    });
  });

  // =====================================
  // VIDEO PAGE ==========================
  // =====================================
  router.get('/video', isLoggedIn, function (req, res) {
    Video.find().exec().then(function (data) {
      res.render('video.ejs', {
        videos: data,
        user: req.user
      });
    });
  });

  router.post('/addVideo', function (req, res, next) {
    req.newMongoId = new mongoose.Types.ObjectId();
    next();
  }, upload.single('videoFile'), function (req, res, next) {
    var newVideo = new Video({
      _id: req.newMongoId,
      title: req.body.title,
      year: req.body.year,
      people: req.body.people
    });
    newVideo.save()
      .then(() => {
        res.redirect('/video');
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/updateVideo', function (req, res, next) {
    Video.findOneAndUpdate({
      _id: req.body.id,
    }, {
      $set: {
        title: req.body.title,
        year: req.body.year,
        people: req.body.people,
      },
    }, {
      new: true
    }).exec()
      .then(() => {
        res.redirect('/video#' + req.body.id);
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/deleteVideo', function (req, res, next) {
    var videoFile = appDirectory + '/archive/videos/' + req.body.id + '.mp4';
    fs.unlink(videoFile, function (err) {
      if (err) return next(err);
      Video.deleteOne({ '_id': req.body.id }).exec()
        .then(() => {
          res.redirect('/video');
        })
        .catch(err => {
          return next(err);
        });
    });
  });

  // =====================================
  // IMAGES PAGE =========================
  // =====================================
  router.get('/images', isLoggedIn, function (req, res) {
    Image.find().exec().then(function (data) {
      res.render('images.ejs', {
        images: data,
        user: req.user
      });
    });
  });

  router.post('/addImage', function (req, res, next) {
    req.newMongoId = new mongoose.Types.ObjectId();
    next();
  }, upload.single('imageFile'), function (req, res, next) {
    var newImage = new Image({
      _id: req.newMongoId,
      title: req.body.title,
      year: req.body.year,
      people: req.body.people,
      location: req.body.location
    });
    newImage.save()
      .then(() => {
        res.redirect('/images');
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/updateImage', upload.single('imageFile'), function (req, res, next) {
    var updateData = {
      title: req.body.title,
      year: req.body.year,
      people: req.body.people,
      location: req.body.location
    };

    if (req.file) {
      updateData.imageFile = req.file.filename;
    }

    Image.findOneAndUpdate({
      _id: req.body.id,
    }, {
      $set: updateData,
    }, {
      new: true
    }).exec()
      .then(() => {
        res.redirect('/images#' + req.body.id);
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/deleteImage', function (req, res, next) {
    var imageFile = appDirectory + '/archive/images/' + req.body.id + '.jpeg';
    fs.unlink(imageFile, function (err) {
      if (err) return next(err);
      Image.deleteOne({ '_id': req.body.id }).exec()
        .then(() => {
          res.redirect('/images');
        })
        .catch(err => {
          return next(err);
        });
    });
  });

  // =====================================
  // SHEETS PAGE =========================
  // =====================================
  router.get('/sheets', isLoggedIn, function (req, res) {
    Sheet.find().exec().then(function (data) {
      res.render('sheets.ejs', {
        sheets: data,
        user: req.user
      });
    });
  });

  router.post('/addSheet', function (req, res, next) {
    req.newMongoId = new mongoose.Types.ObjectId();
    next();
  }, upload.single('sheetFile'), function (req, res, next) {
    var newSheet = new Sheet({
      _id: req.newMongoId,
      title: req.body.title,
      year: req.body.year,
    });
    newSheet.save()
      .then(() => {
        res.redirect('/sheets');
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/updateSheet', function (req, res, next) {
    Sheet.findOneAndUpdate({
      _id: req.body.id,
    }, {
      $set: {
        title: req.body.title,
        year: req.body.year,
      },
    }, {
      new: true
    }).exec()
      .then(() => {
        res.redirect('/sheets#' + req.body.id);
      })
      .catch(err => {
        return next(err);
      });
  });

  router.post('/deleteSheet', function (req, res, next) {
    var sheetFile = appDirectory + '/archive/sheets/' + req.body.id + '.pdf';
    fs.unlink(sheetFile, function (err) {
      if (err) return next(err);
      Sheet.deleteOne({ '_id': req.body.id }).exec()
        .then(() => {
          res.redirect('/sheets');
        })
        .catch(err => {
          return next(err);
        });
    });
  });

  // =====================================
  // API ENDPOINTS========================
  // =====================================
  router.get('/retrieve/collections', function (req, res, next) {
    Promise.all([
      Collection.find().exec(),
      Tracks.find().exec()
    ]).then(function (data) {
      var collectionData = [];
      var collectionArr = data[0];
      var tracksArr = data[1];
      for (var i = 0; i < collectionArr.length; i++) {
        collectionData.push(collectionArr[i]);
        for (var e = 0; e < tracksArr.length; e++) {
          if (tracksArr[e].collectionID == collectionArr[i]._id) {
            Array.prototype.push.apply(collectionArr[i].tracks, tracksArr[e].tracks);
          }
        }
      }
      return collectionData;
    }).then(function (collectionData) {
      res.jsonp(collectionData);
    }).catch(err => {
      return next(err);
    });
  });

  router.get('/retrieve/videos', function (req, res) {
    Video.find().exec().then(function (data) {
      res.jsonp(data);
    }).catch(err => {
      return next(err);
    });
  });

  router.get('/retrieve/images', function (req, res) {
    Image.find().exec().then(function (data) {
      res.jsonp(data);
    }).catch(err => {
      return next(err);
    });
  });

  router.get('/retrieve/sheets', function (req, res) {
    Sheet.find().exec().then(function (data) {
      res.jsonp(data);
    }).catch(err => {
      return next(err);
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  app.use('/', router);
  return router;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}