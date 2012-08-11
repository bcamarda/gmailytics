  var drawGraphs = function(path) {
    $.getJSON(path, function(data) {
      var graphTwentyFour = createTwentyFourGraph(data.twentyFour);

      setInterval(function() {
        $.getJSON(path, function(data) {
          graphTwentyFour.update(data.twentyFour);    
        });
      }, 2000);
    });
  };