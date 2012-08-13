var drawGraphs = function(path) {
  $.getJSON(path, function(data) {
    var graphTwentyFour = createTwentyFourGraph(data.twentyFour);

    setInterval(function() {
      $.getJSON(path, function(data) {
        graphTwentyFour.update(data.twentyFour);    
      });
    }, 2000);
  });


  $.getJSON(path, function(data)) {
  	var graphTopRecipients = createTopRecipients(data.topRecipients);

  	setInterval(function() {
  		$.getJSON(path, function(data) {
  			graphTopRecipients.update(data.topRecipients);
  		});
  	}, 2000);
  });

});
