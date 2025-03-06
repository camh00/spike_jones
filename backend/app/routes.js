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

var appDirectory = "/home/spikejones/dev/SpikeDB";

// setting up the upload handler
var storage = multer.diskStorage({
  // check if there are any conflicts with track or collectionName
  destination: function (req, file, cb) {
    var filetype = file.mimetype;
    var ext = filetype.substring(filetype.indexOf('/')+1);
    var destination;
    if(ext == 'jpeg' || ext == 'jpg' || ext == 'tiff') {
      destination = appDirectory + '/archive/images/';
    } else if (ext == 'mp3' || ext == 'wav') {
      destination = appDirectory + '/archive/music/' + req.body.id;
    } else if (ext == 'zip') {
      destination = appDirectory + '/archive/music/' + req.body.collectionID;
    } else if (ext == 'mp4' || ext == 'avi') {
      destination = appDirectory + '/archive/videos/';
    } else if (ext == 'pdf') {
      destination = appDirectory + '/archive/sheets/';
    }
    mkdirp(destination, function (err) { // folder must be created
      console.log(destination)
      if (err) return cb(err)
      cb(null, destination);
    });
  },
  filename: function (req, file, cb) {
    var filetype = file.mimetype;
    var ext = filetype.substring(filetype.indexOf('/')+1);
    if (ext == 'jpeg' || ext == 'jpg' || ext == 'tiff') {
      if(req.body.collectionID) {
        console.log('CollectionID found!');
        cb(null, (req.body.collectionID + '.jpeg'));
      } else if (req.newMongoId) {
        console.log('NewMongoId found!');
        console.log(req.newMongoId);
        cb(null, (req.newMongoId + '.jpeg'));
      }
    } else if (ext == 'mp3' || ext == 'wav' || ext == 'mp4' || ext == 'avi' || ext == 'pdf') {
      cb(null, (req.newMongoId + '.' + ext));
    } else if(ext == 'zip') {
      cb(null, req.body.collectionID + '.' + ext);
    }
  }
});
var upload = multer({ storage: storage }); // save new storage to upload function

// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/audio', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    // uncomment to add a new user, comment out in production.
    app.get('/signup', function(req, res) {
      User
        .find()
        .exec()
        .then(function(data) {
          if(req.user.local.email === 'spikeadmin') {
            res.render('signup.ejs', {
              message: req.flash('signupMessage'),
              users: data,
              user : req.user // get the user out of session and pass to template
            });
          } else {
            res.render('index.ejs')
          }
        });
      });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/signup', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // delete a user from the database
    app.post('/deleteUser',
    function(req, res, next) {
      console.log(req.body);
      Promise.all([
        User.find({'_id':req.body.userid}).remove().exec(),
      ]).then(function(data) {
        res.redirect('/signup');
      });
    });

    // =====================================
    // AUDIO PAGE ==========================
    // =====================================

    // load the main audio page
    app.get('/audio', isLoggedIn, function(req, res, next) {
      Promise.all([
        Collection.find().exec(), // pull all data from collections and
        Tracks.find().exec()      // pull all datay from respective tracks
      ]).then(function(data) {
        var collections = data[0];
        var tracks = data[1];
        res.render('audio.ejs', { // passing the returned data to the response body
            collections: collections,
            tracks: tracks,
            user : req.user // get the user out of session and pass to template
        });
      });
    });

    // add a new collection
    app.post('/addCollection',
      function(req, res, next) {
        req.newMongoId = mongoose.Types.ObjectId();
        next();
      },
      upload.single('collectionArt'),
      function(req, res, next) {
        // create a new collection
        var newCollection = new Collection({
          _id: req.newMongoId,
          type:req.body.collectionType,
          name:req.body.collectionName,
          artist:req.body.artist,
          guests:req.body.guests,
          year:req.body.year,
          label:req.body.recordLabel,
          recordNumber:req.body.recordNumber,
          tracks: [],
          download: false,
        });
        newCollection.save(function(err, doc){
          if(err) {
            return next(err);
          } else {
            res.redirect('/audio'); // refresh the page
          }
        });
      }
    );

    // change collection information
    app.post('/updateCollection',
    function(req, res, next) {
      // match the collection via id instead of name so there
      // are no conflicts if the name changes
    	Collection
    		.findOneAndUpdate({
    			_id: req.body.id,
    		},{
    			$set: {
            type: req.body.collectionType,
            name:req.body.collectionName,
        		artist:req.body.artist,
        		guests:req.body.guests,
        		year:req.body.year,
            label:req.body.recordLabel,
        		recordNumber:req.body.recordNumber,
          },
    		},{
    			new: true
    		})
    		.exec(function(err, doc){
          if(err) {
          	return next(err);
          } else {
            // refresh page and put the user on the collection
            // they were currently editing
            res.redirect('/audio#' + req.body.id);
          }
        });
    });

    app.post('/updateArt',
      upload.single('artFile'), // see line 79
      function(req, res, next) {
        // refresh the page
        res.redirect('/audio');
      }
    );

    // delete a collection and all related tracks and files
    app.post('/deleteCollection',
    function(req, res, next) {
      // remove the directory completely, which removes .mp3 and .zip files
      rmdir('/Users/jeffcarbine/dev/SpikeDB/archive/music/' + req.body.collectionID, function(err) {
        if (err) throw err;
      });
      // remove the album art
      var artFile = appDirectory + '/archive/images/' + req.body.collectionID + '.jpeg';
      fs.unlink(artFile);
      // get collection from DB and associated tracks collection
      // and delete them
      Promise.all([
        Collection.find({'_id':req.body.collectionID}).remove().exec(),
        Tracks.find({'collectionID':req.body.collectionID}).remove().exec()
      ]).then(function(data) {
        res.redirect('/audio');
      });
    });

    // add a new track to a collection
    app.post('/addTrack',
      function(req, res, next) {
        req.newMongoId = mongoose.Types.ObjectId();
        next();
      },
      upload.single('audioFile'), // see upload handler (line 79)
      function(req, res, next) {
        // this checks of the tracks already exists or not
        Tracks.count({collectionID: req.body.id}, function (err, count){
          if(count > 0){ // if the tracks already exists
            Tracks
              .findOneAndUpdate({
                collectionID: req.body.id,
              },{
                $push: { // push another track entry onto the tracks array
                  tracks:
                    {
                      _id: req.newMongoId,
                      title: req.body.trackName,
                      composer: req.body.trackComposer,
                      lyrics: req.body.trackLyrics,
                    }
                }
              },{
                new: true
              })
              .exec(function(err, doc){
                if(err) {
                  return next(err);
                } else {
                  res.redirect('/audio');
                }
              });
          } else { // if the tracks does not exist yet for this collection
              var newTracks = new Tracks({ // create it
                collectionID: req.body.id,
                tracks: [{
                  _id: req.newMongoId,
                  title: req.body.trackName,
                  composer: req.body.trackComposer,
                  lyrics: req.body.trackLyrics,
                }]
              });
              newTracks.save(function(err, doc){
                if(err) {
                  return next(err);
                } else {
                  // refresh the page and put the user at the
                  // collection they are modifying
                  res.redirect('/audio#' + req.body.id);
                }
              });
            }

        });
      }
    );

    // update the name, lyrics or file of a track
    app.post('/updateTrack',
      upload.single('audioFile'), // see line 79
      function(req, res, next) {
        Tracks
          .findOneAndUpdate({
            // get the track by ID so there's no conflict if the
            // name of the track changes
            'tracks._id': req.body.trackID,
          },{
            $set: { // update the info
                'tracks.$.title' : req.body.trackName,
                'tracks.$.composer' : req.body.trackComposer,
                'tracks.$.lyrics' : req.body.trackLyrics,
            }
          },{
            new: true
          })
          .exec(function(err, doc){
            if(err) {
              return next(err);
            } else {
              // refresh the page
              res.redirect('/audio');
            }
          });
        });

      // remove track info from DB and delete the file
      app.post('/deleteTrack',
        function(req, res, next) {
          // find the file and delete it
          var trackFile = appDirectory + '/archive/music/' + req.body.collectionID + '/' + req.body.trackID + '.mp3';
          fs.unlink(trackFile);
          // remove the entry from the DB
          Tracks
            .update({
              // get the collection
              'collectionID' : req.body.collectionID
            },{
              $pull: {
                'tracks': {
                  // delete the track with the corresponding ID
                  "_id" : req.body.trackID
                }
              }
            })
            .exec(function(err, doc){
              if(err) {
                return next(err);
              } else {
                res.redirect('/audio');
              }
            });
          });

      // change collection information
      app.post('/addZipFile',
      upload.single('zipFile'),
      function(req, res, next) {
        // match the collection via id instead of name so there
        // are no conflicts if the name changes
        Collection
          .findOneAndUpdate({
            _id: req.body.collectionID,
          },{
            $set: {
              download: true,
            },
          },{
            new: true
          })
          .exec(function(err, doc){
            if(err) {
              return next(err);
            } else {
              // refresh page and put the user on the collection
              // they were currently editing
              res.redirect('/audio#' + req.body.collectionID);
            }
          });
      });

      // change collection information
      app.post('/removeZipFile',
      function(req, res, next) {
        var zipFile = appDirectory + '/archive/music/' + req.body.collectionID + '/' + req.body.collectionID + '.zip';
        fs.unlink(zipFile);
        // match the collection via id instead of name so there
        // are no conflicts if the name changes
        Collection
          .findOneAndUpdate({
            _id: req.body.collectionID,
          },{
            $set: {
              download: false,
            },
          },{
            new: true
          })
          .exec(function(err, doc){
            if(err) {
              return next(err);
            } else {
              // refresh page and put the user on the collection
              // they were currently editing
              res.redirect('/audio#' + req.body.collectionID);
            }
          });
      });




















    // =====================================
    // VIDEO PAGE ==========================
    // =====================================

    app.get('/video', isLoggedIn, function(req, res) {
        Video
          .find()
          .exec()
          .then(function(data) {
            res.render('video.ejs', { // passing the returned data to the response body
                videos: data,
                user : req.user // get the user out of session and pass to template
            });
          });
        });

    // add a new collection
    app.post('/addVideo',
      function(req, res, next) {
        req.newMongoId = mongoose.Types.ObjectId();
        next();
      },
      upload.single('videoFile'),
      function(req, res, next) {
        // create a new video
        var newVideo = new Video({
          _id: req.newMongoId,
          title: req.body.title,
          year: req.body.year,
          people: req.body.people
        });
        newVideo.save(function(err, doc){
          if(err) {
            return next(err);
          } else {
            res.redirect('/video'); // refresh the page
          }
        });
      }
    );

    // change collection information
    app.post('/updateVideo',
    function(req, res, next) {
      // match the collection via id instead of name so there
      // are no conflicts if the name changes
      Video
        .findOneAndUpdate({
          _id: req.body.id,
        },{
          $set: {
            title:req.body.title,
            year:req.body.year,
            people:req.body.people,
          },
        },{
          new: true
        })
        .exec(function(err, doc){
          if(err) {
            return next(err);
          } else {
            // refresh page and put the user on the video
            // they were currently editing
            res.redirect('/video#' + req.body.id);
          }
        });
    });

    // delete a collection and all related tracks and files
    app.post('/deleteVideo',
    function(req, res, next) {
      var videoFile = appDirectory + '/archive/videos/' + req.body.id + '.mp4';
      fs.unlink(videoFile);
      // get collection from DB and associated tracks collection
      // and delete them
      Promise.all([
        Video.find({'_id':req.body.id}).remove().exec(),
      ]).then(function(data) {
        res.redirect('/video');
      });
    });




















    // =====================================
    // IMAGES PAGE =========================
    // =====================================

    app.get('/images', isLoggedIn, function(req, res) {
        Image
          .find()
          .exec()
          .then(function(data) {
            res.render('images.ejs', { // passing the returned data to the response body
                images: data,
                user : req.user // get the user out of session and pass to template
            });
          });
        });

    // add a new collection
    app.post('/addImage',
      function(req, res, next) {
        req.newMongoId = mongoose.Types.ObjectId();
        next();
      },
      upload.single('imageFile'),
      function(req, res, next) {
        // create a new video
        var newImage = new Image({
          _id: req.newMongoId,
          title: req.body.title,
          year: req.body.year,
          people: req.body.people
        });
        newImage.save(function(err, doc){
          if(err) {
            return next(err);
          } else {
            res.redirect('/images'); // refresh the page
          }
        });
      }
    );

    // change collection information
    app.post('/updateImage',
    function(req, res, next) {
      // match the collection via id instead of name so there
      // are no conflicts if the name changes
      Image
        .findOneAndUpdate({
          _id: req.body.id,
        },{
          $set: {
            title:req.body.title,
            year:req.body.year,
            people:req.body.people,
          },
        },{
          new: true
        })
        .exec(function(err, doc){
          if(err) {
            return next(err);
          } else {
            // refresh page and put the user on the video
            // they were currently editing
            res.redirect('/image#' + req.body.id);
          }
        });
    });

    // delete a collection and all related tracks and files
    app.post('/deleteImage',
    function(req, res, next) {
      var imageFile = appDirectory + '/archive/images/' + req.body.id + '.jpeg';
      fs.unlink(imageFile);
      // get collection from DB and associated tracks collection
      // and delete them
      Promise.all([
        Image.find({'_id':req.body.id}).remove().exec(),
      ]).then(function(data) {
        res.redirect('/images');
      });
    });





















    // =====================================
    // SHEETS PAGE =========================
    // =====================================

    app.get('/sheets', isLoggedIn, function(req, res) {
        Sheet
          .find()
          .exec()
          .then(function(data) {
            res.render('sheets.ejs', { // passing the returned data to the response body
                sheets: data,
                user : req.user // get the user out of session and pass to template
            });
          });
        });

    // add a new sheet pdf
    app.post('/addSheet',
      function(req, res, next) {
        req.newMongoId = mongoose.Types.ObjectId();
        next();
      },
      upload.single('sheetFile'),
      function(req, res, next) {
        // create a new sheet
        var newSheet = new Sheet({
          _id: req.newMongoId,
          title: req.body.title,
          year: req.body.year,
        });
        newSheet.save(function(err, doc){
          if(err) {
            return next(err);
          } else {
            res.redirect('/sheets'); // refresh the page
          }
        });
      }
    );

    // change sheet information
    app.post('/updateSheet',
    function(req, res, next) {
      // match the sheet via id instead of name so there
      // are no conflicts if the name changes
      Sheet
        .findOneAndUpdate({
          _id: req.body.id,
        },{
          $set: {
            title:req.body.title,
            year:req.body.year,
          },
        },{
          new: true
        })
        .exec(function(err, doc){
          if(err) {
            return next(err);
          } else {
            // refresh page and put the user on the video
            // they were currently editing
            res.redirect('/sheets#' + req.body.id);
          }
        });
    });

    // delete a sheet
    app.post('/deleteSheet',
    function(req, res, next) {
      var sheetFile = appDirectory + '/archive/sheets/' + req.body.id + '.pdf';
      fs.unlink(sheetFile);
      // get sheet from DB and associated tracks collection
      // and delete them
      Promise.all([
        Sheet.find({'_id':req.body.id}).remove().exec(),
      ]).then(function(data) {
        res.redirect('/sheets');
      });
    });





















    // =====================================
    // API ENDPOINTS========================
    // =====================================
    app.get('/retrieve/collections', function(req, res, next) {
      Promise.all([
        Collection.find().exec(), // pull all data from collections and
        Tracks.find().exec()      // pull all datay from respective tracks
      ]).then(function(data) {
        var collectionData = [];
        var collectionArr = data[0];
        var tracksArr = data[1];
        for(var i=0;i < collectionArr.length; i++) {
          collectionData.push(collectionArr[i]);
          for(var e=0;e < tracksArr.length; e++) {
            if(tracksArr[e].collectionID == collectionArr[i]._id) {
              console.log('They match!');
              console.log(collectionArr[i].tracks);
              console.log(tracksArr[e].tracks);
              Array.prototype.push.apply(collectionArr[i].tracks, tracksArr[e].tracks);
            }
          }
        }
        return collectionData;
        })
        .then(function(collectionData) {
          res.jsonp(collectionData);
        });
      });

    app.get('/retrieve/videos', function(req, res) {
      Video
        .find()
        .exec()
        .then(function(data) {
            res.jsonp(data);
          });
    });

    app.get('/retrieve/images', function(req, res) {
      Image
        .find()
        .exec()
        .then(function(data) {
            res.jsonp(data);
          });
    });

    app.get('/retrieve/sheets', function(req, res) {
      Sheet
        .find()
        .exec()
        .then(function(data) {
            res.jsonp(data);
          });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
