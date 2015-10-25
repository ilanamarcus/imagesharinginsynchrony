var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var fs = require('fs');

var multer = require('multer');
var upload = multer({ dest: './uploads' })

var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/upload', upload.single('imagefile'), function(req, res, next) {
	try {
		var fname=req.body.fname;
		var lname = req.body.lname;
		var dob = req.body.dob;
		var uploaded = req.file.path;
	
		console.log(util.format("%s %s %s %s buffer %s", fname, lname, dob, uploaded, req.file.buffer));
		next();
	} catch (err) {
		console.log(err);
		res.send("There was an error.");
	}
});

router.post('/upload', function(req, res, next) {
	console.log("in next middleware, file path is still " + req.file.path);
	
	var s3 = new AWS.S3({params: {Bucket: 'imagesend'}});
	
	fs.readFile(req.file.path, function(err, buffer){
		var params = {
			Key: util.format("%s:%s:%s:%s", req.body.fname, req.body.lname, req.body.dob, req.body.dest),
			Body: buffer
		};
		
		s3.putObject(params, function(err, data){
			if (err) {
				console.log("error uploaded to AWS: " + err);
			} else {
		
				console.log("supposedly it worked, check AWS");
			}	
		}); 		
	}); 
	
	
	res.render("confirmUploaded");
});

module.exports = router;
