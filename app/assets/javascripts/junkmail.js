var createJunkmailGraph = function (data, html_element) {

	var width = 800;
  var height = 525;
  var padding = 40;	

	
    var data_min = d3.min(data, function(d) { return d.email_five; });
    // var data_max = (d3.max(data, function(d) { return (d.email_one + d.email_two + d.email_three + d.email_four + d.email_five) })) * 1.5;
    
    var setY = function(data){

	    var data_max 	= (	(d3.max(data, function(d) { return d.email_one; }))
	    							+		(d3.max(data, function(d) { return d.email_two; }))
	    							+		(d3.max(data, function(d) { return d.email_three; }))
	    							+		(d3.max(data, function(d) { return d.email_four; }))
	    							+		(d3.max(data, function(d) { return d.email_five; }))

	    	);

	    var y = d3.scale.linear()
	    	.domain([data_max, data_min])
	    	.range([0, height]);

	    return y;

    };
    

    var x = d3.time.scale()
    	.domain([(new Date(2011, 7, 1)), (new Date())])
    	.range([0, width]);

    var svg = d3.select(html_element)
      .append("svg:svg")
      .attr("width", width + padding * 2)
      .attr("height", height + padding * 2);

    var lineGroup = svg.append("svg:g")
      .attr("transform", "translate("+ padding + ", " + padding + ")");
   
    lineGroup.append("svg")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", height)
      .attr("width", width);

    var drawLines = function(data, y) {
      var firstEmailsCount = d3.svg.area()
          .x(function(d) { return x(new Date(d.year, d.month)); })
          .y0(height)
          .y1(function(d) { return y(d.email_one)})
          .interpolate("linear");

     	lineGroup.append("svg:path")
     		.transition()
     		.duration(2000)
		    .attr("d", firstEmailsCount(data))
		    .attr("fill", "firebrick")
		    .attr("class", "first");

      var secondEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one)})
        .y1(function(d) { return y(d.email_one + d.email_two)})
        .interpolate("linear");

      lineGroup.append("svg:path")
        .transition()
     		.duration(2000)
        .attr("d", secondEmailsCount(data))
        .attr("fill", "cornflowerblue")
        .attr("class", "second");       

      var thirdEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one + d.email_two)})
        .y1(function(d) { return y(d.email_one + d.email_two + d.email_three)})
        .interpolate("linear");

      lineGroup.append("svg:path")
        .transition()
     		.duration(2000)
        .attr("d", thirdEmailsCount(data))
        .attr("fill", "darkgreen")
        .attr("class", "third");        

      var fourthEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one + d.email_two + d.email_three)}) 
        .y1(function(d) { return y(d.email_one + d.email_two + d.email_three + d.email_four)}) 
        .interpolate("linear"); 

      lineGroup.append("svg:path")
        .transition()
     		.duration(2000)
        .attr("d", fourthEmailsCount(data))
        .attr("fill", "darkorchid")
        .attr("class", "fourth");        

      var fifthEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one + d.email_two + d.email_three + d.email_four)}) 
        .y1(function(d) { return y(d.email_one + d.email_two + d.email_three + d.email_four + d.email_five)}) 
        .interpolate("linear"); 

      lineGroup.append("svg:path")
        .transition()
     		.duration(2000)
        .attr("d", fifthEmailsCount(data))
        .attr("fill", "goldenrod")
        .attr("class", "fifth");
    }

    drawLines(data, setY(data));

	return { 
	  "update": function(data) {
	    setY(data);
	    var y = setY(data);

      var firstEmailsCount = d3.svg.area()
          .x(function(d) { return x(new Date(d.year, d.month)); })
          .y0(height)
          .y1(function(d) { return y(d.email_one)})
          .interpolate("linear");

      var secondEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one)})
        .y1(function(d) { return y(d.email_one + d.email_two)})
        .interpolate("linear");

      var thirdEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one + d.email_two)})
        .y1(function(d) { return y(d.email_one + d.email_two + d.email_three)})
        .interpolate("linear");

      var fourthEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one + d.email_two + d.email_three)}) 
        .y1(function(d) { return y(d.email_one + d.email_two + d.email_three + d.email_four)}) 
        .interpolate("linear"); 

      var fifthEmailsCount = d3.svg.area()
        .x(function(d) { return x(new Date(d.year, d.month)); })
        .y0(function(d) { return y(d.email_one + d.email_two + d.email_three + d.email_four)}) 
        .y1(function(d) { return y(d.email_one + d.email_two + d.email_three + d.email_four + d.email_five)}) 
        .interpolate("linear");        
	    
	    function redrawFirst(){
	    	svg.selectAll("path.first")
	    	.data(data)
	    	.transition()
	    	.duration(2000)
	    	.attr("d", firstEmailsCount(data))
		    .attr("fill", "firebrick");
	    	

	    }
	    function redrawSecond(){
	    	svg.selectAll("path.second")
	    	.data(data)
	    	.transition()
	    	.duration(2000)
	    	.attr("d", secondEmailsCount(data))
		    .attr("fill", "cornflowerblue");


	    }

	    function redrawThird(){
	    	svg.selectAll("path.third")
	    	.data(data)
	    	.transition()
	    	.duration(2000)
	    	.attr("d", thirdEmailsCount(data))
		    .attr("fill", "darkgreen");


	    }

	    function redrawFourth(){
	    	svg.selectAll("path.fourth")
	    	.data(data)
	    	.transition()
	    	.duration(2000)
	    	.attr("d", fourthEmailsCount(data))
		    .attr("fill", "darkorchid");


	    }

	   	function redrawFifth(){
	    	svg.selectAll("path.fifth")
	    	.data(data)
	    	.transition()
	    	.duration(2000)
	    	.attr("d", fifthEmailsCount(data))
		    .attr("fill", "goldenrod");


	    }

	    redrawFirst();
	    redrawSecond();
	    redrawThird();
	    redrawFourth();
	    redrawFifth();

	  }
  }
}