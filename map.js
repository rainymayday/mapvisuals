var width  = window.innerWidth;
var height = window.innerHeight;

var arcdata = [
		{
      targetLocation: [100.292530, 5.307970],
			sourceLocation:[103.640949, 1.323385]
		}  ]

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");

var projection = d3.geo.mercator()
          .center([116.4074, 39.9042])
          .scale(500)
          .translate([width/3,height/3]);
// var projection = d3.geo.albersUsa()
//         				.scale(730.1630554896399)
//         				.translate([width/2, height/2]); //translate to center the map in view
//

var path = d3.geo.path()
        .projection(projection);

var defs = svg.append("defs");

var color = d3.scale.category20();

var arrowMarker = defs.append("marker")
						.attr("id","arrow")
						.attr("markerUnits","strokeWidth")
					  .attr("markerWidth","12")
            .attr("markerHeight","12")
            .attr("viewBox","0 0 12 12")
            .attr("refX","6")
            .attr("refY","6")
            .attr("orient","auto");

var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

arrowMarker.append("path")
			.attr("d",arrow_path)
			.attr("fill","tomato");

var startMarker = defs.append("marker")
      .attr("id","startPoint")
      .attr("markerUnits","strokeWidth")
      .attr("markerWidth","12")
      .attr("markerHeight","12")
      .attr("viewBox","0 0 12 12")
      .attr("refX","6")
      .attr("refY","6")
      .attr("orient","auto");

startMarker.append("circle")
      			.attr("cx",6)
      			.attr("cy",6)
      			.attr("r",2)
      			.attr("fill","tomato");

svg.append("text")
            .text("Y3 real-time demo")
            .attr("x",(width/3))
            .attr("y",50)
            .attr("text-anchor","middle")


d3.json("asia.geojson", function(error, root) {
  if (error)
    return console.error(error);
  console.log(root.features);

  svg.selectAll("path")
    .data( root.features )
    .enter()
    .append("path")
    .attr("stroke","lightgrey")
    .attr("stroke-width",0.5)
    .attr("fill", "black")
    .attr("opacity",0.5)
    .attr("d", path )
		// .attr("fill", function(d,i){
		// 	return color(i);
		// })
    .on("mouseover",function(d,i){
              d3.select(this)
                  .attr("fill","darkgrey");
          })
          .on("mouseout",function(d,i){
              d3.select(this)
                  .attr("fill","black")
                  .attr("opacity",0.5);
          });


  var arcs = svg.append("g")
            .attr("class","arcs");

    arcs.selectAll("path")
      			.data(arcdata)
      			.enter()
      			.append("path")
            .attr("marker-start","url(#startPoint)")
            .attr("marker-end","url(#arrow)")
            .style("stroke-dasharray", "1000, 1000")
            .transition()
            .duration(4000)
            .styleTween("stroke-dashoffset", function() {
           return d3.interpolateNumber(1000, 0);})
           .attr('d', function(d) {
      				return lngLatToArc(d, 'sourceLocation', 'targetLocation', 5); // A bend of 5 looks nice and subtle, but this will depend on the length of your arcs and the visual look your visualization requires. Higher number equals less bend.
      			});


});

function lngLatToArc(d, sourceName, targetName, bend){
		// If no bend is supplied, then do the plain square root
		bend = bend || 1;
		// `d[sourceName]` and `d[targetname]` are arrays of `[lng, lat]`
		// Note, people often put these in lat then lng, but mathematically we want x then y which is `lng,lat`

		var sourceLngLat = d[sourceName],
				targetLngLat = d[targetName];

		if (targetLngLat && sourceLngLat) {
			var sourceXY = projection( sourceLngLat ),
					targetXY = projection( targetLngLat );

			// Uncomment this for testing, useful to see if you have any null lng/lat values
			// if (!targetXY) console.log(d, targetLngLat, targetXY)
			var sourceX = sourceXY[0],
					sourceY = sourceXY[1];

			var targetX = targetXY[0],
					targetY = targetXY[1];

			var dx = targetX - sourceX,
					dy = targetY - sourceY,
					dr = Math.sqrt(dx * dx + dy * dy)*bend;

			// To avoid a whirlpool effect, make the bend direction consistent regardless of whether the source is east or west of the target
			// var west_of_source = (targetX - sourceX) < 0;
			// if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
			return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

		} else {
			return "M0,0,l0,0z";
		}
	}
