function animateDay(json){
 // we will be appending the SVG to the Leaflet map pane
 // g (group) element will be inside the svg
 var svg = d3.select(map.getPanes().overlayPane).append("svg").attr("id","svgRoute");

 // if you don't include the leaflet-zoom-hide when a
 // user zooms in or out you will still see the phantom
 // original SVG
 var g = svg.append("g").attr("class", "leaflet-zoom-hide");

 drawVisualization()

 //read in the GeoJSON. This function is asynchronous so
 // anything that needs the json file should be within
 function drawVisualization (collection) {
     collection = json
     
     var featuresdata = collection.features

     //stream transform. transforms geometry before passing it to
     // listener. Can be used in conjunction with d3.geo.path
     // to implement the transform.

     var transform = d3.geo.transform({
         point: projectPoint
     });

     //d3.geo.path translates GeoJSON to SVG path codes.
     //essentially a path generator. In this case it's
     // a path generator referencing our custom "projection"
     // which is the Leaflet method latLngToLayerPoint inside
     // our function called projectPoint
     var d3path = d3.geo.path().projection(transform);


     // Here we're creating a FUNCTION to generate a line
     // from input points. Since input points will be in
     // Lat/Long they need to be converted to map units
     // with applyLatLngToLayer
     var toLine = d3.svg.line()
         .interpolate("linear")
         .x(function(d) {
             return applyLatLngToLayer(d).x
         })
         .y(function(d) {
             return applyLatLngToLayer(d).y
         });


     // From now on we are essentially appending our features to the
     // group element. We're adding a class with the line name
     // and we're making them invisible

     // these are the points that make up the path
     // they are unnecessary so I've make them
     // transparent for now
     var ptFeatures = g.selectAll("circle")
         .data(featuresdata)
         .enter()
         .append("circle")
         .attr("r", 3)
         .attr("class", "waypoints");

     var linePath = g.selectAll(".lineConnect2")
         .data([featuresdata])
         .enter()
         .append("path")
         .attr("class", "lineConnect2");

     // This will be our traveling circle it will
     // travel along our path
     var marker = g.append("circle")
         .attr("r", 1)
         .attr("id", "marker")
         .attr("class", "travelMarker");

     var originANDdestination = [featuresdata[0], featuresdata[featuresdata.length-1]]

     var begend = g.selectAll(".drinks")
         .data(originANDdestination)
         .enter()
         .append("circle", ".drinks")
         .attr("r", 5)
         .style("fill", "red")
         .style("opacity", "0");

     map.on("viewreset", reset);

     // this puts stuff on the map!
     reset();
     transition();

     // Reposition the SVG to cover the features.
     function reset() {
         var bounds = d3path.bounds(collection),
             topLeft = bounds[0],
             bottomRight = bounds[1];

         // for the points we need to convert from latlong
         // to map units
         begend.attr("transform",
             function(d) {
                 return "translate(" +
                     applyLatLngToLayer(d).x + "," +
                     applyLatLngToLayer(d).y + ")";
             });

         ptFeatures.attr("transform",
             function(d) {
                 return "translate(" +
                     applyLatLngToLayer(d).x + "," +
                     applyLatLngToLayer(d).y + ")";
             });

         // again, not best practice, but I'm harding coding
         // the starting point

         marker.attr("transform",
             function() {
                 var y = featuresdata[0].geometry.coordinates[1]
                 var x = featuresdata[0].geometry.coordinates[0]
                 return "translate(" +
                     map.latLngToLayerPoint(new L.LatLng(y, x)).x + "," +
                     map.latLngToLayerPoint(new L.LatLng(y, x)).y + ")";
             });


         // Setting the size and location of the overall SVG container
         svg.attr("width", bottomRight[0] - topLeft[0] + 120)
             .attr("height", bottomRight[1] - topLeft[1] + 120)
             .style("left", topLeft[0] - 50 + "px")
             .style("top", topLeft[1] - 50 + "px");


         // linePath.attr("d", d3path);
         linePath.attr("d", toLine)
         // ptPath.attr("d", d3path);
         g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

     } // end reset

     function transition() {
         linePath.transition()
             .duration(7500)
             .attrTween("stroke-dasharray", tweenDash)
             .each("end", function() {
                 d3.selectAll("path.leaflet-clickable").attr("stroke","#7BBE51")
                // d3.select("svg#svgRoute").remove()
                d3.select(this).remove()
                d3.selectAll('circle').remove()
                 //d3.select(this).call(transition);// infinite loop
             });
     } //end transition

     // this function feeds the attrTween operator above with the
     // stroke and dash lengths
     function tweenDash() {
         return function(t) {
             //total length of path (single value)
             var l = linePath.node().getTotalLength();

             interpolate = d3.interpolateString("0," + l, l + "," + l);
             //t is fraction of time 0-1 since transition began
             var marker = d3.select("#marker");

             var p = linePath.node().getPointAtLength(t * l);

             //Move the marker to that point
             marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker

             return interpolate(t);
         }
     } //end tweenDash

     function projectPoint(x, y) {
         var point = map.latLngToLayerPoint(new L.LatLng(y, x));
         this.stream.point(point.x, point.y);
     } //end projectPoint
 }

 function applyLatLngToLayer(d) {
     var y = d.geometry.coordinates[1]
     var x = d.geometry.coordinates[0]
     return map.latLngToLayerPoint(new L.LatLng(y, x))


 }
}
