var createTwentyFourGraph = function (data, html_element) {
    var runViz = function (data) {
      var yScaleMax, yScale;

      var xLabels = ["7 am", "8 am", "9 am", "10 am", "11 am", "12 pm",
          "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm",
          "7 pm", "8 pm", "9 pm", "10 pm", "11 pm", "12 am",
          "1 am", "2 am", "3 am", "4 am", "5 am", "6 am", ];

      var utcOffset = function() {
        var d = new Date;
        return d.getTimezoneOffset() / 60;
      }();

      var remakeData = function() {
        var temp_data = data.slice();
        for (var i = 0; i < data.length; i++) {
          data[i] = temp_data[(24 + i - utcOffset - 3) % 24];
        }
      }();

      var barWidth = width/data.length;

      /****** X Axes/Scales *******/
      var xScale = d3.scale.linear()
      .domain([0, data.length - 1])
      .range([padding, width - padding]);

      var xScaleOrdinal = d3.scale.ordinal();

      xScaleOrdinal
      .domain(xLabels)
      .rangeBands([27, width - padding]);

      var xAxis = d3.svg.axis().scale(xScaleOrdinal).orient("bottom");

      svg.append("svg:g")
      .attr("transform", "translate(0,363)")
      .attr("fill", "none")
      .call(xAxis);

      svg.selectAll("g text")
      .attr("transform", "rotate(-75)translate(1, -3)")
      .attr("text-anchor", "end")
      .attr("class", "chartText");

      /****** Y Axes/Scales *******/
      function drawYScale() {
        yScaleMax = d3.max(data, function(d) {
          return d.sent + d.received;
        });

        yScale = d3.scale.linear()
        .domain([0, yScaleMax])
        .range([0, height - padding * 2]);
      }

      drawYScale();

      /******* Data viz *******/
      svg.selectAll("rect")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); } )
      .attr("width", barWidth - 5)
      .attr("y", height - padding)
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - padding - yScale(d.sent); } )
      .attr("height", function(d) { return yScale(d.sent); } )
      .attr("fill", "goldenrod")
      .attr("class", "sent")
      .attr("count", function(d) { return Math.floor(d.sent) + " sent"; });

      svg.selectAll("something")
      .data(data)
      .enter()
      .append("svg:rect")
      .attr("x", function(d, i) { return xScale(i); })
      .attr("width", barWidth - 5)
      .attr("y", function(d) { return height - padding - yScale(d.sent); } )
      .attr("height", 0)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - padding - (yScale(d.sent) + yScale(d.received)); }) 
      .attr("height", function(d) { return yScale(d.received); } )
      .attr("fill", "teal")
      .attr("class", "received")
      .attr("count", function(d) { return Math.floor(d.received) + " received"; });

      $('svg rect').tipsy({ 
        gravity: 'w', 
        html: true, 
        title: function() { return $(this).attr("count"); },
        fade: true,
        opacity: 0.8
      });
    }

    var width = 400, height = 400, padding = 40;
    /***** SVG setup ******/
    var svg = d3.select(html_element).append("svg:svg")
    .attr("width", width)
    .attr("height", height);

    runViz(data);

    return { "update": function(data) { 
      var yScaleMax, yScale;

      var utcOffset = function() {
        var d = new Date;
        return d.getTimezoneOffset() / 60;
      }();

      var remakeData = function() {
        var temp_data = data.slice();
        for (var i = 0; i < data.length; i++) {
          data[i] = temp_data[(24 + i - utcOffset - 3) % 24];
        }
      }();

      function drawYScale() {
        yScaleMax = d3.max(data, function(d) {
          return d.sent + d.received;
        });

        yScale = d3.scale.linear()
        .domain([0, yScaleMax])
        .range([0, height - padding * 2]);
      }

      function redraw() {
        svg.selectAll("rect")
        .data(data)
        .transition()
        .duration(2000)
        .attr("y", function(d) { return height - padding - yScale(d.sent); } )
        .attr("height", function(d) { return yScale(d.sent); } )
        .attr("count", function(d) { return Math.floor(d.sent) + " sent"; });
      }

      function redraw2() {
        svg.selectAll("rect.received")
        .data(data)
        .transition()
        .duration(2000)
        .attr("y", function(d) { return height - padding - (yScale(d.sent) + yScale(d.received)); }) 
        .attr("height", function(d) { return yScale(d.received); } )
        .attr("count", function(d) { return Math.floor(d.received) + " received"; });
      }

      drawYScale();
      redraw();
      redraw2();
    }
  };
};
