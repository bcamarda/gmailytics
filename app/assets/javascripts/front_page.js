var frontPage = function() {
  /********** Seed Data *****************/
  var randomEmailCount = function(min, max) {
    if ( arguments.length === 0 ) {
      min = 40;
      max = 50;
      return Math.floor((Math.random() * max)) + min;
    } else {
      return Math.floor((Math.random() * max)) + min;
    }
  };

  var data = [];
  var createData = function() {      // currently simulates random data 
    for (var i = 0; i < 23; i++) {
      if (i < 12) {
        data.push( {
          "sent": randomEmailCount(i*2 + 40, i*2 + 50),
          "received": randomEmailCount(i*2 + 40, i*2 + 50)
        })
      } else {
        data.push( {
          "sent": randomEmailCount(40 - i*2, 50 - i * 2),
          "received": randomEmailCount(40 - i*2 , 60 - i*2)
        })
      }
    }
  };

  /********** End Seed Data **************/

  createData();

  /***** SVG setup ******/
  var width = 400,
      height = 400,
      padding = 20,
      barWidth = width/data.length;

  var svg = d3.select(".graphs").append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  /****** X Axes/Scales *******/
  var xScale = d3.scale.linear()
    .domain([0, data.length - 1])
    .range([0, width - padding * 2]);

  var xRange = ["8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm",
      "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm", "11 pm", "12 am", "1 am",
      "2 am", "3 am", "4 am", "5 am", "6 am", "7 am"];


  var xScaleOrdinal = d3.scale.ordinal();

  xScaleOrdinal
    .domain(xRange)
    .rangeRoundBands([0, width]);

  var xAxis = d3.svg.axis().scale(xScaleOrdinal).orient("bottom");

  svg.append("svg:g")
    .attr("transform", "translate(0,0")
    .call(xAxis);

  svg.selectAll("g text")
    .attr("transform", "rotate(60)translate(15, 10)")
    .attr("class", "chartText");

  /****** Y Axes/Scales *******/
  var yScale;
  var drawYScale = function() {
    yScaleMax = d3.max(data, function(d) {
      return d.sent + d.received;
    });

    yScale = d3.scale.linear()
      .domain([0, yScaleMax])
      .range([0, height - padding * 2]);
  };

  drawYScale();

  /******** Data Viz ********/
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("width", barWidth - 5)
    .attr("y", height)
    .attr("height", 0)
    .transition()
    .duration(2000)
    .attr("y", function(d) { return height - yScale(d.sent); }) 
    .attr("height", function(d) { return yScale(d.sent); } )
    .attr("fill", "goldenrod");

  function redraw() {
    svg.selectAll("rect")
      .data(data)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - yScale(d.sent); }) 
      .attr("height", function(d) { return yScale(d.sent); } );
  }

  svg.selectAll("something")
    .data(data)
    .enter()
    .append("svg:rect")
    .attr("x", function(d, i) { return xScale(i); })
    .attr("width", barWidth - 5)
    .attr("y", function(d) { return height - yScale(d.sent); })
    .attr("height", 0)
    .transition()
    .duration(2000)
    .attr("y", function(d) { return height - (yScale(d.sent) + yScale(d.received)); }) 
    .attr("height", function(d) { return yScale(d.received); } )
    .attr("fill", "teal")
    .attr("class", function(d, i) { return "received"; });

  function redraw2() {
    svg.selectAll("rect.received")
      .data(data)
      .transition()
      .duration(2000)
      .attr("y", function(d) { return height - (yScale(d.sent) + yScale(d.received)); }) 
      .attr("height", function(d) { return yScale(d.received); } )
  }

  setInterval(function() {
    data = [];
    createData();
    drawYScale();
    redraw();
    redraw2();
  }, 2000);
};
