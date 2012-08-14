var drawGraphs = function(path) {
  $.getJSON(path, function(data) {

  	var boxProfileStatus 	= createProfileStatusBox(data.profileStatus, ".status");
    var graphTwentyFour 	= createTwentyFourGraph(data.twentyFour, ".graphs");
    var graphWordCloud    = createWordCloudGraph(data.wordCloud, ".graphs");
    //var graphTopRecipients = createTopRecipients(data.topRecipients, ".graphs");

    var pollingFunction = setInterval(function() {
      $.getJSON(path + '?last_email_at=' + data.profileStatus.last_email_at, function(data) {
        boxProfileStatus.update(data.profileStatus);
        graphTwentyFour.update(data.twentyFour);
        graphWordCloud.update(data.wordCloud);
        console.log('Polled for updated data');
        
        if (data.profileStatus.imap_worker_completed_at) {
          clearInterval(pollingFunction);
          console.log('Profile marked as complete. Polling stopped.')
        }   
      });
    }, 2000);
  });
};
