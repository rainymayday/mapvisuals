$(function () {
    data = [
        {label: "Category 1", value: 19},
        {label: "Category 2", value: 5},
        {label: "Category 3", value: 13},
        {label: "Category 4", value: 17},
        {label: "Category 5", value: 19},
        {label: "Category 6", value: 27}
    ];


    var axisMargin = 20,
        margin = 40,
        valueMargin = 20,
        width = $("#barchartContainer").width(),
        height = 350,
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


    bar.append("rect")
        .attr("transform", "translate(" + labelWidth + ", 0)")
        .attr("height", barHeight)
        .attr("width", function (d) {
            return scale(d.value);
        })
        .attr("fill", "lightblue");


    bar.append("text")
        .attr("class", "value")
        .attr("y", barHeight / 2)
        .attr("dx", -valueMargin + labelWidth) //margin right
        .attr("dy", ".35em") //vertical align middle
        .attr("text-anchor", "end")
        .text(function (d) {
            return (d.value + "%");
        })
        .attr("x", function (d) {
            var width = this.getBBox().width;
            return Math.max(width + valueMargin, scale(d.value));
        });


    bar.selectAll("rect").on("mousemove", function (d) {
        d3.select(this)
            .attr("fill", "yellow");
        d3.select("div.tooltip").html(d.label + "<br>" + d.value + "%")
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

});