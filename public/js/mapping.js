var map = L.map('map').setView([40.737575, -73.990573],12)

L.esri.basemapLayer('DarkGray').addTo(map);

$('.available').on('click',function(){
	$('.available').each(function(i){
		$(this).toggleClass('not')
		if(!$(this).hasClass('not')){
			mapOptions.radius = $(this).attr('id')
		}
	})
	update()
})



update(true)
