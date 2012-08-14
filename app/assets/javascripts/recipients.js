var createTopRecipients = function (data, html_element) {
  var runViz = function (data) {

      var width = 400,
      height = 600,
      padding = 20,
      barWidth = width/data.length;

      svg = d3.select("body").append("svg:svg")
      .attr("width", width)
      .attr("height", height);
  
      xScale = d3.scale.linear()
      .domain([0, data.length - 1])
      .range([0, width - padding * 2]);

      yScale = d3.scale.linear()
      .domain([0, 500])
      .range([0, height - padding * 2]);


      first = svg.selectAll("rect")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", barWidth - 5)
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - yScale(d.sent1); }) 
      .attr("height", function(d) { return yScale(d.sent1); })
      .attr("fill", "red")
      .attr("email", function(d) { return d.to1; });

 
      svg.selectAll("something")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", barWidth - 5)
      .attr("y", function(d) { return height - yScale(d.sent1); })
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - (yScale(d.sent1) + yScale(d.sent2)); }) 
      .attr("height", function(d) { return yScale(d.sent2); } )
      .attr("fill", "teal")
      .attr("class", function(d, i) { return "sent2"; })
      .attr("email", function(d) { return d.to2; });
  

      svg.selectAll("somethingElse")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", barWidth - 5)
      .attr("y", function(d) { return height - yScale(d.sent2) - yScale(d.sent1); })
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - ( yScale(d.sent1) + yScale(d.sent2) + yScale(d.sent3) ); }) 
      .attr("height", function(d) { return yScale(d.sent3); } )
      .attr("fill", "orange")
      .attr("class", function(d, i) { return "sent3"; })
      .attr("email", function(d) { return d.to3; });;

       svg.selectAll(".example_div")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", barWidth - 5)
      .attr("y", function(d) { return height - yScale(d.sent3) - yScale(d.sent2); })
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - ( yScale(d.sent1) + yScale(d.sent2) + yScale(d.sent3) + yScale(d.sent4) ); }) 
      .attr("height", function(d) { return yScale(d.sent4); } )
      .attr("fill", "green")
      .attr("class", function(d, i) { return "sent4"; })
      .attr("email", function(d) { return d.to4; });
                

	svg.selectAll("somethingElse")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", barWidth - 5)
      .attr("y", function(d) { return height - yScale(d.sent4) - yScale(d.sent3); })
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - ( yScale(d.sent1) + yScale(d.sent2) + yScale(d.sent3) + yScale(d.sent4) + yScale(d.sent5) ); }) 
      .attr("height", function(d) { return yScale(d.sent5); } )
      .attr("fill", "purple")
      .attr("class", function(d, i) { return "sent5"; })
      .attr("email", function(d) { return d.to5; });;

      $('svg rect').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          return $(this).attr("email");
        }
      });

  }

  var width = 400, height = 400, padding = 20;
  /***** SVG setup ******/
  var svg = d3.select(html_element).append("svg:svg")
  .attr("width", width)
  .attr("height", height);
	
  runViz(data);

}