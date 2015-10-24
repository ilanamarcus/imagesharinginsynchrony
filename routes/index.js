var express = require('express');
var router = express.Router();

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
	
		console.log(util.format("%s %s %s %s", fname, lname, dob, uploaded));
		next();
	} catch (err) {
		console.log(err);
		res.send("There was an error.");
	}
});

router.post('/upload', function(req, res, next) {
	console.log("in next middleware, file path is still " + req.file.path);
	res.send("uploaded file.");

});

module.exports = router;
