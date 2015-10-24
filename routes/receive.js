var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var _ = require('underscore');


/* GET users listing. */
router.get('/images', function(req, res, next) {
	//retrieve data from s3
	var s3 = new AWS.S3({params: {Bucket: 'imagesend'}});
	
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
			var dest = nameParts[3];
			
			var row = {
				fname: fname,
				lname: lname,
				dob: dob,
				dest: dest,
				key: img.Key				
			}
			
			imageData.push(row);
		
		});

		res.json(imageData);		
	});  
});

router.get('/', function(req, res, next) {
	res.render('listImages');

});

module.exports = router;
