var routePromise = []

$('#viz').on('click',function(){
	clearRoute()
	$(this).toggleClass('not')
	if(!$(this).hasClass('not')){
		mapOptions.visualize = true
		$('.viz').show()
		$('#timeUpdate').text("")
		$('#loading').show()
		visualize()
	}else{
		mapOptions.visualize = false
		$('.viz').hide()
		$('#loading').hide()
	}
})


function visualize(){
	$.ajax({
		method: 'GET',
		url: '/data/day'
	})
	.done(function (routes){
		for(var i=0; i<routes.length; i++){
				r = routes[i]
				var data = { data: [[Number(r.startLat),Number(r.startLon)],[Number(r.endLat),Number(r.endLon)]] }
				routePromise.push(Promise.resolve($.post( "/data", data )))
		}
		Promise.all(routePromise).then(function(geoRoutes){
			var i=0, lastRoute = geoRoutes.length - 1
			console.log("georoutes",geoRoutes)

			$("#loading").hide()

			function draw (route){
				setTimeout(function(){
					i++
					animateDay(JSON.parse(JSON.stringify(route)))
					if(i<=lastRoute && mapOptions.visualize){
						var time = routes[i].time.split(" ")[1]
						$("#timeUpdate").html(time)
						draw(geoRoutes[i])
					}else{
						mapOptions.visualize = false
						if(!$('#viz').hasClass('not'))
							$('#viz').addClass('not')
						d3.selectAll("svg#svgRoute").remove()
					}

				},0)
			}

			draw(geoRoutes[0])
		})
	})
}
