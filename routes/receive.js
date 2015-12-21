var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var s3 = new AWS.S3({params: {Bucket: 'imagesend'}});
var _ = require('underscore');
var fs = require('fs');
var util = require('util');


/* GET users listing. */
router.get('/images', function(req, res, next) {
	//retrieve data from s3
	params = {};
	s3.listObjects(params, function(err, data){
		if (err) {
			console.log("error retrieving images from s3: " + err);
			next(err);
		} 
		
		var imageData = [];
		console.log(data.Contents);
		
		_.each(data.Contents, function(img) {
			console.log(img.Key);
			var nameParts = img.Key.split(':');
			var fname = nameParts[0];
			var lname = nameParts[1];
			var dob = nameParts[2];

			var row = [];
			row.push(fname);
			row.push(lname);
			row.push(dob);
			
			row.push(util.format("<a href='/receive/images/%s'>Download File</a>",img.Key));
			
			imageData.push(row);
		
		});

		res.json({"data": imageData});		
	});  
});

router.get('/', function(req, res, next) {
	res.render('listImages');
});

router.get('/images/:key', function(req, res, next) {
	try {
		var img_id = req.params.key;
	
		var filename = './downloads/' + img_id;
		var file = fs.createWriteStream(filename);
		var stream = s3.getObject({Key: img_id}).createReadStream().pipe(file);
		
		stream.on('finish', function(){
			res.download(filename);
		});
	
	} catch (err) {
		console.log(err);
		next(err);
	}
});

module.exports = router;
