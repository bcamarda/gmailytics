var drawGraphs = function(path) {
  $.getJSON(path, function(data) {
    var graphTwentyFour = createTwentyFourGraph(data.twentyFour, ".graphs");

    setInterval(function() {
      $.getJSON(path, function(data) {
        graphTwentyFour.update(data.twentyFour);    
      });
    }, 2000);
  });


  $.getJSON(path, function(data) {
  	console.log(data.topRecipients);
  	var graphTopRecipients = createTopRecipients(data.topRecipients, ".graphs");
														 
  	// setInterval(function() {
  	// 	$.getJSON(path, function(data) {
  	// 		graphTopRecipients.update(data.topRecipients);
  	// 	});
  	// }, 2000);
  });

};
