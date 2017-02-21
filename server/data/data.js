var axios = require('axios')
var geojson = require('geojson')

var cityBikeFeed = 'https://feeds.citibikenyc.com/stations/stations.json'

var getBikeFeed = function(){
	return axios.get(cityBikeFeed)
	.then(function (response) {
		//return geojson.parse(stationParser(response.data),{Point:['lat','lon']})
		return stationParser(response.data)
	  })
	.catch(function (response) {
	    console.log(response)
	  })
}

function stationParser(data){

	return data.stationBeanList.map(function(station){
		var s =  {
			id: station.id,
			stationName: station.stationName,
			lat: station.latitude,
			lon: station.longitude,
			stationStatus: station.statusValue,
			totalDocks: station.totalDocks,
			availableDocks: station.availableDocks,
			availableBikes: station.availableBikes,
			stAddress1: station.stAddress
		}
		return s
	})
}

function parseCoordinates (coords){
	var clean = []
	for(var key in coords){
		clean.push(coords[key])
	}

	return clean.map(function(coord){
		return {lat: coord[0], lng: coord[1]}
	})
}

function convertToGeoJson (data){
	var cleanData = parseCoordinates(data)
	return geojson.parse(cleanData, {Point: ['lat', 'lng']});
}

module.exports = {
	convertToGeoJson: convertToGeoJson,
	getLiveStations: getBikeFeed
}
