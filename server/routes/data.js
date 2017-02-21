var express = require('express')
var path = require('path')
var router = express.Router()
var data = require('../data/data')
var fs = require('fs')


module.exports = router

router.get('/',function (req, res, next){
	data.getLiveStations()
	.then(function (stations){
		res.send(stations)
	})
	.catch(function (err){
		console.log("Error getting stations", err)
	})
})

router.get('/day', function (req, res,next){
	var data = path.join(__dirname,'../data/citibike-tripdata-1201.csv')
	fs.readFile(path.join(data), function (err, data) {
	  if (err) throw err;
	  // data = data.toString('utf8').split('\r')
		// data = data.toString('utf8').split('\r').split(',')
		data = data.toString('utf8').split('\n')
		console.log(data)
	  var row, routes = []
	  var hour = 0
	  for(var i = 0; i < 5000;i++){
			console.log(i)
			console.log(data[i])
		  	row = data[i].split(",")
		  	if(i!==0){
		  	routes.push({
		  		time: row[1],
		  		startLat: row[5],
		  		startLon: row[6],
		  		endLat: row[9],
		  		endLon: row[10]
		  	})
		  	if(row[1].split(" ")[1].slice(0,2).indexOf(":")==-1)
		  		hour = Number(row[1].split(" ")[1].slice(0,2))
					// 2016-12-01 9:03
		  	else
		  		hour = Number(row[1].split(" ")[1].slice(0,1))
		  }
	  }

	  res.send(routes)

	});
})

router.post('/',function (req,res,next){
	res.send(data.convertToGeoJson(req.body))
})
