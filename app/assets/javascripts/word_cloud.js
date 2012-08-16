var createWordCloudGraph = function (data, html_element) {

  var drawCloud = function (data) {
    d3.layout.cloud().size([width, height])
      .words(data)
      .timeInterval(10)
      .padding(1)
      .rotate(function() { return ~~(Math.random() * 5) * 30 - 60; })
      .fontSize(function(d) { return d.size; })
      .on("end", 
        function (words) {
          var fontSize = d3.scale.log().domain([10,1000]).range([10,100]);
          var fill = d3.scale.category20b();
          $(html_element + ' g').remove();
          svg
            .append("g")
              .attr("transform", "translate(" + height / 2 + "," + width / 2 + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return fontSize(d.size) + "px"; })
              .style("fill", function(d) { return fill(d.text); })
              .attr("frequency", function(d) { return d.size } )
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.text; });
          $(html_element + ' g text').tipsy({ 
            html: true, 
            title: function() { return $(this).attr("frequency") + ' times'; },
            fade: true,
            opacity: 0.8
          });
        }
      )
      .start();
  };

	var width = 400, height = 400;
	var svg = d3.select(html_element).append("svg:svg")
	 .attr("width", width)
	 .attr("height", height)
   .attr("class", 'wordCloud');

  drawCloud(data);

	return { 
    "update": function(data) {
      drawCloud(data);
    }
  }
};