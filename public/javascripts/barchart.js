$(function(){
  function updateSvg(d) {

      var axisMargin = 10,
          margin = 10,
          valueMargin = 10,
          width = $("#barchartContainer").width(),
          height = 350,
          bar, svg, scale, xAxis, labelWidth = 0;


      svg = d3.select('#barchart')
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        var max_value = d3.max(d, function (data) {
            return data.value;
        });
        var barHeight = (height - axisMargin - margin * 2) * 0.4 / d.length;
        var barPadding = (height - axisMargin - margin*2) * 0.6 / d.length;

        bar = svg.selectAll("g")
            .data(d)
            .enter()
            .append("g");

        bar.attr("class", "bar")
                .attr("cx", 0)
                .attr("transform", function (d, i) {
                    return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                });
                var x_label = bar.append("text")
                      .attr("class", "label")
                      .attr("y", barHeight / 2)
                      .attr("dy", ".35em")
                      .attr("fill","white") //vertical align middle
                      .text(function (d) {
                          return d.label;
                      }).style("font-size",12).each(function () {
                      labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
                  });

                  scale = d3.scale.linear()
                      .domain([0, max_value])
                      .range([0, width - margin * 2 - labelWidth]);
                defs = svg.append("defs")

                          //Create two separate gradients for the main and mini bar - just because it looks fun
                createGradient("gradient-rainbow-main", "60%");
                var rect = bar.append("rect")
                        .attr("transform", "translate(" + labelWidth + ", 0)")
                        .attr("height", barHeight)
                        .attr("width", function (d) {
                            // return scale(d.value);
                            return 0;
                        })
                        .attr("fill", "url(#gradient-rainbow-main)")
                        .on("mousemove", function (d) {
                           d3.select(this)
                              //  .attr("fill", "yellow")
                               .style("opacity",0.6);
                           d3.select("div.tooltip").html(d.label + "<br>" + commafy(d.value) )
                               .style("opacity", .9)
                               .style("left", (d3.event.pageX) + "px")
                               .style("top", (d3.event.pageY - 50) + "px");
                       })
                           .on("mouseout", function (d) {
                               d3.select(this)
                                   .style("opacity",1);
                               d3.select("div.tooltip").transition()
                                   .duration(500)
                                   .style("opacity", 0);
                           });
                          //  .attr("fill","url(#gradient-rainbow-main)");
                risingBar(rect);
                var value_label = bar.append("text")
                                     .attr("class", "value")
                                     .attr("y", barHeight / 2)
                                     .attr("dx", -valueMargin + labelWidth) //margin right
                                     .attr("dy", ".35em") //vertical align middle
                                     .attr("text-anchor", "end")
                                     .style("font-size",10)
                                     .text(function (d) {
                                       return (commafy(d.value) );
                                     })
                                     .attr("x", function (d) {
                                       var width = this.getBBox().width;
                                       return Math.max(width + valueMargin, scale(d.value));
                                     }).attr("opacity",0);
                showlabel(value_label);


  function risingBar(var_rect){
    var_rect.attr("fill", "url(#gradient-rainbow-main)")
    .transition()
    .duration(4000)
    .ease("exp-in-out")
    .attr("width",function(d){
      return scale(d.value);
    })
    .each("end",function(d){
      var_rect.attr("width",0);
      risingBar(var_rect);
    });

  }


  // value_label.transition().duration
  function showlabel(val_label){
    val_label.transition()
    .duration(4000)
    .attr("opacity",1)
    .each("end",function(d){
      val_label.attr("opacity",0);
      showlabel(val_label);
    });

  }
  // value_label.transition().duration(4000).attr("opacity",1);
  var gradient = svg.append("defs")
    .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

  gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0c0")
      .attr("stop-opacity", 1);

  gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#c00")
      .attr("stop-opacity", 1);

  // rect.attr("fill","url(#gradient-rainbow-main)");
  // svg.append("rect").attr('width', width).attr('height', height)
  //       .style('stroke', 'black').style('fill', 'none');

  function createGradient(idName, endPerc) {

            var coloursRainbow = [ "#682D8E","#B9E3F5"];

            defs.append("linearGradient")
              .attr("id", idName)
              .attr("gradientUnits", "userSpaceOnUse")
              .attr("x1", "0%").attr("y1", "0%")
              .attr("x2", endPerc).attr("y2", "0%")
              .selectAll("stop")
              .data(coloursRainbow)
              .enter().append("stop")
              .attr("offset", function(d,i) { return i/(coloursRainbow.length-1); })
              .attr("stop-color", function(d) { return d; });
          }

  function commafy( num ) {
              var str = num.toString().split('.');
              if (str[0].length >= 4) {
                  str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
              }
              if (str[1] && str[1].length >= 4) {
                  str[1] = str[1].replace(/(\d{3})/g, '$1 ');
              }
              return str.join('.');
          }
  }

  function intervalUpdate(){
    $.get("/bar.json",function(data){
      $('#barchart').html('');
      updateSvg(data);
    })
  }
intervalUpdate();
  setInterval(function () {
intervalUpdate();
  }, 10000);

});
