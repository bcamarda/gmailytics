var createWordCloudGraph = function (data, html_element) {


  function draw(words) {
    var fontSize = d3.scale.log().range([10, 100]);
    var fill = d3.scale.category20b();
    svg
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("fill", function(d) { return fill(d.text.toLowerCase()); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }

	var width = 300, height = 300;
	var svg = d3.select(html_element).append("svg:svg")
	 .attr("width", width)
	 .attr("height", height)
   .attr("class", 'wordCloud');

  d3.layout.cloud().size([300, 300])
    .words(data)
    .timeInterval(10)
    .padding(1)
    .rotate(function() { return ~~(Math.random() * 5) * 30 - 60; })
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();

	return { 
    "update": function(data) {
    $('.wordCloud g').remove();
    d3.layout.cloud().size([300, 300])
      .words(data)
      .timeInterval(10)
      .padding(1)
      .rotate(function() { return ~~(Math.random() * 5) * 30 - 60; })
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

    }
  }
};