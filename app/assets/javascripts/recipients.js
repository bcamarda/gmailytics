var data = [
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 50,
		sent2: 50,
		sent3: 50,
		sent4: 50,
		sent5: 50,
		month: 1,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 30,
		sent2: 70,
		sent3: 80,
		sent4: 40,
		sent5: 20,
		month: 2,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 150,
		sent2: 250,
		sent3: 250,
		sent4: 350,
		sent5: 150,
		month: 3,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 240,
		sent2: 220,
		sent3: 250,
		sent4: 280,
		sent5: 290,
		month: 4,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 300,
		sent2: 310,
		sent3: 390,
		sent4: 150,
		sent5: 260,
		month: 5,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 260,
		sent2: 270,
		sent3: 230,
		sent4: 220,
		sent5: 190,
		month: 6,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 460,
		sent2: 420,
		sent3: 480,
		sent4: 410,
		sent5: 300,
		month: 7,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 590,
		sent2: 580,
		sent3: 530,
		sent4: 500,
		sent5: 520,
		month: 8,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 580,
		sent2: 550,
		sent3: 550,
		sent4: 500,
		sent5: 350,
		month: 9,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 440,
		sent2: 420,
		sent3: 450,
		sent4: 480,
		sent5: 390,
		month: 10,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 300,
		sent2: 310,
		sent3: 390,
		sent4: 150,
		sent5: 260,
		month: 11,
		year: 2012
	},
	{
		email1: "phil@fun.org",
		email2: "chad@fun.org",
		email3: "dork@fun.org",
		email4: "loner@fun.org",
		email5: "sullendwarf@fun.org",
		sent1: 260,
		sent2: 270,
		sent3: 230,
		sent4: 220,
		sent5: 190,
		month: 12,
		year: 2012
	}];


var width = 400;
var height = 400;
var padding = 20;
var barWidth = width/data.length;

svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

xScale = d3.scale.linear()
				.domain([0, data.length-1])
				.range([0, width - padding*2]);

yScale = d3.scale.linear()
				.domain([0,100])
				.range([0,height-padding*2]);

svg.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("x", function(d,i) {
					return xScale(i);
				})
				.attr("y", height)
				.attr("width", barWidth-5)
				.attr("height", 0)
				.transition
				.duration(2000)
				.attr("y", function(d) {
					return height - yScale(d.sent1);
				})
				.attr("fill", "red")
				




			function redraw() {
        svg.selectAll("rect")
            .data(data)
          .transition()
            .duration(2000)
            .attr("y", function(d) { return height - yScale(d.sent1); }) 
            .attr("height", function(d) { return yScale(d.sent1); } );
      }

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
      .attr("class", function(d, i) { return "sent2"; });

      function redraw2() {
        svg.selectAll("rect.sent2")
            .data(data)
          .transition()
            .duration(2000)
            .attr("y", function(d) { return height - (yScale(d.sent1) + yScale(d.sent2)); }) 
            .attr("height", function(d) { return yScale(d.sent2); } )
      }

      setInterval(function() {
        data = [];
        createData();
        redraw();
        redraw2();
      }, 2000);	





























