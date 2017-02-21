var clusters, markerOptions, icon

var DataMarker = L.CircleMarker.extend({
	options:{
		data: {}
	}
})

icon = L.AwesomeMarkers.icon({
	icon: 'bicycle',
	prefix: 'fa',
	markerColor: 'black'
})

markerOptions = {
	icon: icon
}

clusters = new L.MarkerClusterGroup({ polygonOptions: { color: '#000', weight: 1, opacity: .7, fillOpacity: 0.1 } })

function getPopupContent(station){
	var content = ''
	content += "<h4>" + station.stationName + "</h4><hr>"
	content += "Available Bikes: " + station.availableBikes
	content += "<br>Available Docks: " + station.availableDocks
	content += "<br>Updated: " + new Date()
	return content
}

function getMarkerSize (available){
	if (!available) return 2
	if(available > 0 && available <= 5) return 3
	else if(available > 5 && available <= 10) return 5
	else return 7

}
