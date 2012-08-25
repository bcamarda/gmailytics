var createTopRecipients = function (data, html_element) {
  var runViz = function (data) {


      var xLabels = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Decgma"];

      var width = 400,
      height = 400,
      padding = 20,
      barWidth = width/data.length;

      svg = d3.select(html_element).append("svg:svg")
      .attr("width", width)
      .attr("height", height);
  
      var xScale = d3.scale.linear()
      .domain([0, data.length - 1])
      .range([0, width - padding * 2]);

      var yScale = d3.scale.linear()
      .domain([0, 100])
      .range([0, height - padding * 2]);


      svg.selectAll("rect1")
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
      .attr("email", function(d) { return "You sent " + d.to1 + " " + d.sent1 + " emails."; });

 
      svg.selectAll("rect2")
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
      .attr("email", function(d) { return "You sent " + d.to2 + " " + d.sent2 + " emails."; });
  

      svg.selectAll("rect3")
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
      .attr("email", function(d) { return "You sent " + d.to3 + " " + d.sent3 + " emails."; });;

       svg.selectAll("rect4")
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
      .attr("email", function(d) { return "You sent " + d.to4 + " " + d.sent4 + " emails."; });
                

	svg.selectAll("rect5")
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
      .attr("email", function(d) { return "You sent " + d.to5 + " " + d.sent5 + " emails."; });;

      $('svg rect').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          return $(this).attr("email");
        }
      });

  }	

  // var width = 400, height = 400, padding = 20;
  //   /***** SVG setup ******/
  //   var svg = d3.select(html_element).append("svg:svg")
  //   .attr("width", width)
  //   .attr("height", height);

  runViz(data);

   return { "update": function(data) { 

      var width = 400,
      height = 400,
      padding = 20,
      barWidth = width/data.length;

      // svg = d3.select(html_element).append("svg:svg")
      // .attr("width", width)
      // .attr("height", height);
  
      var xScale = d3.scale.linear()
      .domain([0, data.length - 1])
      .range([0, width - padding * 2]);

      var yScale = d3.scale.linear()
      .domain([0, 100])
      .range([0, height - padding * 2]);


      svg.selectAll("rect1")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", barWidth - 5)
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { 
            if (d.sent1 === null) {
                  debugger;
            } 
            else {
                  return height - yScale(d.sent1); 
            }
      }) 
      .attr("height", function(d) { return yScale(d.sent1); })
      .attr("fill", "red")
      .attr("email", function(d) { return "You sent " + d.to1 + " " + d.sent1 + " emails."; });

 
      svg.selectAll("rect2")
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
      .attr("email", function(d) { return "You sent " + d.to2 + " " + d.sent2 + " emails."; });
  

      svg.selectAll("rect3")
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
      .attr("email", function(d) { return "You sent " + d.to3 + " " + d.sent3 + " emails."; });;

       svg.selectAll("rect4")
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
      .attr("email", function(d) { return "You sent " + d.to4 + " " + d.sent4 + " emails."; });
                

      svg.selectAll("rect5")
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
      .attr("email", function(d) { return "You sent " + d.to5 + " " + d.sent5 + " emails."; });;

      $('svg rect').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() {
          return $(this).attr("email");
        }
      });
   }

  };
};