var routeControl = L.Routing.control({
	lineOptions: {
		styles: [
			{
				color: 'black',
				weight: 6
			}
		]
	},
	show: true,
	createMarker: function(i, wp){
		console.log("create marker")
		var m = L.marker(wp.latLng,{draggable: false, clickable: true, icon: icon})
		mapOptions.routeMarkers.push(m)
		return m
	},
    waypoints: [],
    routeWhileDragging: true
})
.addTo(map);

$('.routing').on('click',function(){
	$('.routing').each(function(i){
		$(this).toggleClass('not')
		if(!$(this).hasClass('not')){
			if($(this).attr('id')==='routeOn')
				mapOptions.routing = true
			else{
				mapOptions.routing = false
				clearRoute()
			}
		}
	})
})


routeControl.on('routeselected', function(e) {
       console.log("ROUTE",e.route.coordinates)
       var distance = (e.route.summary.totalDistance*0.00062137).toFixed(2)
       mapOptions.routeMarkers.forEach(function (m,i){
       		m.bindPopup(formatRouteContent(e.route))
       })

       $.post( "/data", { data: e.route.coordinates } )
       .done(function (geojson){
       	  console.log("geojson",geojson)
       	  animateRoute(JSON.parse(JSON.stringify(geojson)))
       })
});

function formatRouteContent (route){
	var content = ""
	content += "<h4>Directions</h4><ul><hr>"
	route.instructions.forEach(function (inst,i){
		if(!i){
			content+="<li>"
			content+= "Travel " + inst.direction + " on " + inst.road + " - " +  (inst.distance*0.00062137).toFixed(1) + " mi"
			content+= "</li>"
		}else if (i!==route.instructions.length - 1){
			content+="<li>"
			content+= inst.type + " on " + inst.road +  " - " +  (inst.distance*0.00062137).toFixed(1) + " mi"
			content+= "</li>"
		}
	})
	content+="</ul>"
	content+="<p>Total Distance:  " + (route.summary.totalDistance*0.00062137).toFixed(2) + " mi"
	return content
}

function markerClick (m){
	if(mapOptions.routing){
		var point = m.latlng
		var lat = point.lat
		var lng = point.lng

		if(mapOptions.waypoints.length === 2){
			clearRoute()
		}

		mapOptions.waypoints.push(L.latLng(lat,lng))

		if(mapOptions.waypoints.length === 2){
			routeControl.setWaypoints([mapOptions.waypoints[0],mapOptions.waypoints[1]])
		}
	}
}

function clearRoute (){
	mapOptions.waypoints = []
	mapOptions.routeMarkers = []
	routeControl.setWaypoints([])
    d3.select("svg#svgRoute").remove()
}
