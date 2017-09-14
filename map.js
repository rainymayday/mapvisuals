var width  = window.innerWidth;
var height = window.innerHeight;

var arcdata = [
		{
      targetLocation: [100.292530, 5.307970],
			sourceLocation:[103.640949, 1.323385]
		}  ]

var marks = [
	{long: 78.963239, lat: 20.821930},
	{long: 117.525544, lat: 38.838788},
	{long: 100.462383, lat: 5.371320}];

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");

var projection = d3.geo.mercator()
          .center([116.4074, 39.9042])
          .scale(500)
          .translate([width/3,height/3]);

var path = d3.geo.path()
        .projection(projection);

var defs = svg.append("defs");

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
			.attr("fill","tomato")

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

svg.append("text")
            .text("Y3 real-time demo")
            .attr("x",(width/3))
            .attr("y",50)
            .attr("text-anchor","middle")

var zoom = d3.behavior.zoom().on('zoom', function() {
						    g.attr('transform', 'translate(' + d3.event.translate.join(',') + ') scale(' + d3.event.scale + ')');
						    //g.selectAll('path').attr('d', path.projection(projection));
						  });

var g = svg.append("g");

d3.json("data/asia.geojson", function(error, root) {
  if (error)
    return console.error(error);
  console.log(root.features);
    g.append("g")
    .selectAll("path")
    .data( root.features )
    .enter()
    .append("path")
    .attr("stroke","white")
    .attr("stroke-width",0.5)
    .attr("fill", "black")
    .attr("opacity",0.5)
    .attr("d", path )
    .on("mouseover",function(d,i){
              d3.select(this)
                  .attr("fill","yellow");
          })
      .on("mouseout",function(d,i){
              d3.select(this)
                  .attr("fill","black")
                  .attr("opacity",0.5);
          })

  var arcs = g.append("g")
            .attr("class","arcs");

    arcs.selectAll("path")
      			.data(arcdata)
      			.enter()
      			.append("path")
						.attr('d', function(d) {
       				return lngLatToArc(d, 'sourceLocation', 'targetLocation', 5);})
            .attr("marker-start","url(#startPoint)")
            .attr("marker-end","url(#arrow)");


g.selectAll(".mark")
						    .data(marks)
						    .enter()
						    .append("image")
						    .attr('class','mark')
						    .attr('width', 20)
						    .attr('height', 20)
						    .attr("xlink:href",'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/24x24/DrawingPin1_Blue.png')
						    .attr("transform", function(d) {return "translate(" + projection([d.long,d.lat]) + ")";});
});

function lngLatToArc(d, sourceName, targetName, bend){
		// If no bend is supplied, then do the plain square root
		bend = bend || 1;

		var sourceLngLat = d[sourceName],
				targetLngLat = d[targetName];

		if (targetLngLat && sourceLngLat) {
			var sourceXY = projection( sourceLngLat ),
					targetXY = projection( targetLngLat );

			var sourceX = sourceXY[0],
					sourceY = sourceXY[1];

			var targetX = targetXY[0],
					targetY = targetXY[1];

			var dx = targetX - sourceX,
					dy = targetY - sourceY,
					dr = Math.sqrt(dx * dx + dy * dy)*bend;

				return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

		} else {
			return "M0,0,l0,0z";
		}
	}

svg.call(zoom);
