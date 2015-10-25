var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require('underscore');

var routes = require('./routes/index');
var receive = require('./routes/receive');

var app = express();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

var AWS = require('aws-sdk');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/receive', receive);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

setInterval(function(){
	var s3 = new AWS.S3({params: {Bucket: 'imagesend'}});
	s3.listObjects(params, function(err, data){
		if (err) {
			console.log("error retrieving images from s3: " + err);
			next(err);
		} 
		
		var now = new Date();
		var nowMinusMinute = now.setMinutes(now.getMinutes()-1);
		
		var toDelete = [];
		_.each(data.Contents, function(img) {
			if (img.LastModified < nowMinusMinute) {
				toDelete.push({Key: img.Key});
			}
		});
		
		if (toDelete.length > 0){
			var deleteParams = {
				 Delete: {
				 	Objects: toDelete
				 }
			};
			s3.deleteObjects(deleteParams, function(err, data){
				if (err) {
					console.log("Error deleting expired images: " + err);
				} else {
					console.log("Successfully deleted " + toDelete.length + " images.");
				}
			});
		}
			
	});

}, 30000);


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
