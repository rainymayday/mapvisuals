$(function () {
    var width = $("#mapContainer").width();
    var height = 700;
    var projection,path,arcs;

    var arcdata = [
        {   targetLocation: [100.470143, 5.334135],
            sourceLocation: [103.709366, 1.35295]},
      {targetLocation: [100.777442,13.746792],
        sourceLocation: [103.709366, 1.35295]},
    {targetLocation:[105.836448,21.028504],
      sourceLocation:[121.004309, 31.325468]},
  {targetLocation:[107.056198,-6.274306],
    sourceLocation:[100.777442, 13.746792]},
  {targetLocation:[121.089982,14.607196],
    sourceLocation:[100.777442, 13.746792]
  },
  {
    targetLocation:[100.777442, 13.746792],
      sourceLocation:[113.596485, 23.178301]
  }
];

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)")
        .attr("id","mapsvg");



    var zoom = d3.behavior.zoom().on('zoom', function () {
        g.attr('transform', 'translate(' + d3.event.translate.join(',') + ') scale(' + d3.event.scale + ')');
    });

    var g = svg.append("g");

    d3.json("data/panasia1.geojson", function (error, root) {
        if (error)
            return console.error(error);
        console.log(root.features);
        // var center = d3.geo.centroid(root)
        var center = [90.4074, 38.9042];
        var scale  = 490;
        var offset = [width/3, height/3];
        //104.4074, 36.9042
        projection = d3.geo.mercator()
            .center(center)
            .scale(scale)
            .translate(offset);

        path = d3.geo.path()
            .projection(projection);

          // reference triangle
        // g.append("rect").attr('width', width).attr('height', height)
        // .style('stroke', 'black').style('fill', 'none');

        g.append("g")
            .selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .attr("fill", "DarkSteelBlue")
            .attr("opacity", 0.5)
            .attr("d", path)
            .on("mousemove", function (d) {
                d3.select(this)
                    .attr("fill", "yellow");
                d3.select("div.tooltip").transition()
                    .duration(200)
                    .style("opacity", .9);
                d3.select("div.tooltip").html(d.properties.SOVEREIGNT)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("fill", "DarkSteelBlue")
                    .attr("opacity", 0.5);
                d3.select("div.tooltip").transition()
                    .duration(500)
                    .style("opacity", 0);
            });
          arcs = g.append("g")
                .attr("class", "arcs")
                .selectAll("path")
                .data(arcdata)
                .enter()
                .append("path")
                .attr('d', function (d) {
                    return lngLatToArc(d, 'sourceLocation', 'targetLocation', 5);
                });


        d3.csv("data/warehouse.csv", function (error, location) {
            if (error)
                return console.error(error);

            var marks = g.selectAll("circle")
                .data(location).enter()
                .append("circle")
                .attr("r", "2.5px")
                .attr("transform", function (d) {
                    return "translate(" + projection([d.Long, d.Lat]) + ")";
                })
                .on("mouseover", function (d) {
                    d3.select("div.tooltip").transition()
                        .duration(20)
                        .style("opacity", .9);
                    d3.select("div.tooltip").html(d.Country + "<br>" + d.Address)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                });

                shinyDots(marks);
                    // .duration(200)
                    // .style("fill","yellow");
        });

        timeForTimeline();

    });
    function shinyDots(var_marks){
    var_marks.transition()
    .duration(2000)
    .style("fill","SpringGreen")
    .each("end",function(d){
      var_marks.style("fill","YellowGreen");
      shinyDots(var_marks);
    });
    }

    function timeForTimeline() { // har
        var timeline = g.append("g")
            .attr("class", "arcs")
            .selectAll("path")
            .data(arcdata)
            .enter()
            .append("path")
            .attr('d', function (d) {
                return lngLatToArc(d, 'sourceLocation', 'targetLocation', 5);
            });

        repeat();
        function repeat() {
            timeline.style("stroke-dasharray", "1000, 1000")
                .style("stroke", "purple")
                .transition()
                .delay(500)
                .duration(2000)
                .style("stroke", "plum")
                .styleTween("stroke-dashoffset", function () {
                    return d3.interpolateNumber(1000, 0);
                })
                .each("end", repeat);
        };

    };

    function lngLatToArc(d, sourceName, targetName, bend) {
        bend = bend || 1;

        var sourceLngLat = d[sourceName],
            targetLngLat = d[targetName];

        if (targetLngLat && sourceLngLat) {
            var sourceXY = projection(sourceLngLat),
                targetXY = projection(targetLngLat);

            var sourceX = sourceXY[0],
                sourceY = sourceXY[1];

            var targetX = targetXY[0],
                targetY = targetXY[1];

            var dx = targetX - sourceX,
                dy = targetY - sourceY,
                dr = Math.sqrt(dx * dx + dy * dy) * bend;

            return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;

        } else {
            return "M0,0,l0,0z";
        }
    }




    svg.call(zoom);
});
