function update(isInit){
	$.ajax({
		method: 'GET',
		url: '/data'
	})
	.done(function (stations){
		if(stations){
			stations.forEach(function (station){
				var radius = getMarkerSize(station[mapOptions.radius])
				var options = {
					icon: icon,
					color: '#7BBE51',
					weight: 2,
					fillColor: '#7BBE51',
					opacity: .8,
					radius: radius,
					data: { id: station.id}
				}
				if(isInit){
					var marker = new L.CircleMarker(new L.LatLng(station.lat, station.lon), options)

					marker.bindPopup(getPopupContent(station))
					marker.on('click',markerClick)

					clusters.addLayer(marker)
				}else{
					var markers = clusters.getLayers()
					markers.forEach(function(m,i){
						if(m.options.data.id === station.id){
							m._popup.setContent(getPopupContent(station))
							m.setRadius(radius)
						}

					})
				}
			})

			if(isInit)
				map.addLayer(clusters)
		}
		window.setTimeout(update,10000)
	})
}
