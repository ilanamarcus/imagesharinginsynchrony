var AWS = require('aws-sdk');
var _ = require('underscore');

module.exports = function(){
	var deleteExpiredImages = function(minutesToLive){
		console.log("deleting images older than " + minutesToLive + " minutes...");
		var s3 = new AWS.S3({params: {Bucket: 'imagesend'}});
		s3.listObjects(params, function(err, data){
			if (err) {
				console.log("error retrieving images from s3: " + err);
				console.log("no images deleted");
				next(err);
			} else {
				var now = new Date();
				var nowMinusMinute = now.setMinutes(now.getMinutes()-minutesToLive);
				
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
				} else {
					console.log("No images to delete.");
				}
			}		
		});
	};

	var intervalHandle;
	var start_monitor = function(interval,minutesToLive) {
		intervalHandle = setInterval(deleteExpiredImages, interval, minutesToLive);
	};

	var stop_monitor = function() {
		console.log("clearing the interval...");
		clearInterval(intervalHandle);
		console.log("interval cleared.");
	};

	return {
		start: start_monitor,
		stop: stop_monitor
	}
}();
