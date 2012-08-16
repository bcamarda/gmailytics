var drawGraphs = function(path) {

  $.getJSON(path, function(data) {

  	var boxProfileStatus 	= createProfileStatusBox(data.profileStatus, ".status");
    var graphTwentyFour 	= createTwentyFourGraph(data.twentyFour, ".graphs");
    var graphWordCloud    = createWordCloudGraph(data.wordCloud, ".graphs");
    var graphJunkmail     = createJunkmailGraph(data.junkmail, ".graphs")
    //var graphTopRecipients = createTopRecipients(data.topRecipients, ".graphs");

    var lastEmailProcessedId = data.lastEmailProcessedId;

    var pollingFunction = setInterval(function() {
      $.getJSON(path + '?last_email_id=' + lastEmailProcessedId, function(data) {
        lastEmailProcessedId = data.lastEmailProcessedId;
        
        boxProfileStatus.update(data.profileStatus);
        graphTwentyFour.update(data.twentyFour);
        graphWordCloud.update(data.wordCloud);
        graphJunkmail.update(data.junkmail)
        console.log('Polled for updated data');
        
        if (data.profileStatus.imap_worker_completed_at) {
          clearInterval(pollingFunction);
          console.log('Profile marked as complete. Polling stopped.')
          console.log(data)
        }   
      });
    }, 2000);
  });
};
