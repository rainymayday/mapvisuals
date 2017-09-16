$(function () {
    var width = $("#mapContainer").width();
    var height = 500;

    var arcdata = [
        {
            targetLocation: [100.292530, 5.307970],
            sourceLocation: [103.640949, 1.323385]
        }];

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(0,0)");

    var projection = d3.geo.mercator()
        .center([116.4074, 39.9042])
        .scale(500)
        .translate([width / 3, height / 3]);

    var path = d3.geo.path()
        .projection(projection);

    var defs = svg.append("defs");

    var arrowMarker = defs.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto");

    var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";

    arrowMarker.append("path")
        .attr("d", arrow_path)
        .attr("fill", "tomato")

    var startMarker = defs.append("marker")
        .attr("id", "startPoint")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto");

    startMarker.append("circle")
        .attr("cx", 6)
        .attr("cy", 6)
        .attr("r", 1)

    var zoom = d3.behavior.zoom().on('zoom', function () {
        g.attr('transform', 'translate(' + d3.event.translate.join(',') + ') scale(' + d3.event.scale + ')');
    });

    var g = svg.append("g");

    d3.json("data/panasia1.geojson", function (error, root) {
        if (error)
            return console.error(error);
        console.log(root.features);
        g.append("g")
            .selectAll("path")
            .data(root.features)
            .enter()
            .append("path")
            .attr("stroke", "white")
            .attr("stroke-width", 0.5)
            .attr("fill", "black")
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
                    .attr("fill", "black")
                    .attr("opacity", 0.5);
                d3.select("div.tooltip").transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        d3.csv("data/warehouse.csv", function (error, location) {
            if (error)
                return console.error(error);

            g.selectAll("circle")
                .data(location).enter()
                .append("circle")
                .attr("r", "2.5px")
                // .attr("fill", "green")
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
        });

        // g.append("g")
        //           .attr("class","arcs")
        // 					.selectAll("path")
        // 					.data(arcdata)
        // 					.enter()
        // 					.append("path")
        // 					.style("stroke","purple")
        // 					.attr('d', function(d) {
        // 										return lngLatToArc(d, 'sourceLocation', 'targetLocation', 5);})


        timeForTimeline();


    });


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

            // attr("marker-start","url(#startPoint)")
            // .attr("marker-end","url(#arrow)")
            timeline.style("stroke-dasharray", "1000, 1000")
                .style("stroke", "purple")
                // .style("opacity", 50)
                .transition()
                .delay(500)
                .duration(2000)
                // .styleTween("stroke",function(){
                // 	return d3.interpolate("plum","purple")
                // })
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