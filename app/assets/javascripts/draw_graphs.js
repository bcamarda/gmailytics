var drawGraphs = function(path) {

  $.getJSON(path, function(data) {

  	var boxProfileStatus 	= createProfileStatusBox(data.profileStatus, ".status");
    var graphTwentyFour 	= createTwentyFourGraph(data.twentyFour, ".graphs");
    var graphSubjectWordCloud    = createWordCloudGraph(data.newEmailSubjectWordFrequency, ".subjectWordCloud");
    var graphReceivedWordCloud   = createWordCloudGraph(data.newEmailReceivedWordFrequency, ".receivedWordCloud");
    //var graphTopRecipients = createTopRecipients(data.topRecipients, ".graphs");

    var lastEmailProcessedId = data.lastEmailProcessedId;

    var pollingFunction = setInterval(function() {
      $.getJSON(path + '?last_email_id=' + lastEmailProcessedId, function(data) {
        lastEmailProcessedId = data.lastEmailProcessedId;

        boxProfileStatus.update(data.profileStatus);
        graphTwentyFour.update(data.twentyFour);
        graphSubjectWordCloud.update(data.newEmailSubjectWordFrequency);
        graphReceivedWordCloud.update(data.newEmailReceivedWordFrequency);
        console.log('Polled for updated data');
        
        if (data.profileStatus.imap_worker_completed_at) {
          clearInterval(pollingFunction);
          $('.progress .bar').css('width', '100%');
          console.log('Profile marked as complete. Polling stopped.');
        }   
      });
    }, 4000);
  });
};
