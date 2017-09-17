$(function () {
    data = [
        {label: "Singapore", value: 19},
        {label: "China", value: 5},
        {label: "India", value: 13},
        {label: "Malaysia", value: 17},
        {label: "Hong Kong", value: 19},
        {label: "Indonesia", value: 27}
    ];


    var axisMargin = 10,
        margin = 10,
        valueMargin = 10,
        width = $("#barchartContainer").width(),
        height = 250,
        barHeight = (height - axisMargin - margin * 2) * 0.4 / data.length,
        barPadding = (height - axisMargin - margin * 2) * 0.6 / data.length,
        data, bar, svg, scale, xAxis, labelWidth = 0;

    max = d3.max(data, function (d) {
        return d.value;
    });

    svg = d3.select('#barchart')
        .append("svg")
        .attr("width", width)
        .attr("height", height);


    bar = svg.selectAll("g")
        .data(data)
        .enter()
        .append("g");

    bar.attr("class", "bar")
        .attr("cx", 0)
        .attr("transform", function (d, i) {
            return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
        });

    bar.append("text")
        .attr("class", "label")
        .attr("y", barHeight / 2)
        .attr("dy", ".35em") //vertical align middle
        .text(function (d) {
            return d.label;
        }).each(function () {
        labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    });

    scale = d3.scale.linear()
        .domain([0, max])
        .range([0, width - margin * 2 - labelWidth]);


var rect = bar.append("rect")
        .attr("transform", "translate(" + labelWidth + ", 0)")
        .attr("height", barHeight)
        .attr("width", function (d) {
            // return scale(d.value);
            return 0;
        })
        .attr("fill", "lightblue")
        .on("mousemove", function (d) {
           d3.select(this)
               .attr("fill", "yellow")
               .attr("opacity",0.9);
           d3.select("div.tooltip").html(d.label + "<br>" + d.value )
               .style("opacity", ".9")
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 50) + "px");
       })
           .on("mouseout", function (d) {
               d3.select(this)
                   .attr("fill", "lightblue");
               d3.select("div.tooltip").transition()
                   .duration(500)
                   .style("opacity", 0);
           });
risingBar(rect);
//ease function
// "linear-in-out",
//       "quad-in-out",
//       "cubic-in-out",
//       "sin-in-out",
//       "exp-in-out",
//       "circle-in-out",
//       "elastic-in-out",
//       "back-in-out",
//       "bounce-in-out"
function risingBar(var_rect){
  var_rect.attr("fill", "lightblue")
  .transition()
  .duration(4000)
  .ease("exp-in-out")
  .attr("width",function(d){
    return scale(d.value);
  }).each("end",function(d){
    var_rect.attr("width",0);
    risingBar(var_rect);
  });

}

    bar.append("text")
        .attr("class", "value")
        .attr("y", barHeight / 2)
        .attr("dx", -valueMargin + labelWidth) //margin right
        .attr("dy", ".35em") //vertical align middle
        .attr("text-anchor", "end")
        .text(function (d) {
            return (d.value );
        })
        .attr("x", function (d) {
            var width = this.getBBox().width;
            return Math.max(width + valueMargin, scale(d.value));
        });


        svg.append("rect").attr('width', width).attr('height', height)
      .style('stroke', 'black').style('fill', 'none');

});
