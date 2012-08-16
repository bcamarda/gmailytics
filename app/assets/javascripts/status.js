var createProfileStatusBox = function (data, html_element) {

  var updateProgressBar = function (startDateString, progressDateString) {
    var startDate = new Date(startDateString);
    var progressDate = new Date(progressDateString);
    var today = new Date();

    var progress = ((progressDate - startDate) / (today - startDate));
    console.log(progress);
    console.log(Math.round(progress * 100) + '%');
    $('.progress .bar').css('width', Math.round(progress * 100) + '%');
  };

  var generateStatusMessageHtml = function(data) {
    var htmlString = "";
    if (data.imap_worker_started_at) {
      if (data.emails_analyzed) {

        htmlString = htmlString + data.emails_analyzed + " Emails Analyzed";
        htmlString = htmlString + ", from " + data.first_email_analyzed_date + " to " + data.last_email_analyzed_date;

        updateProgressBar(data.first_email_analyzed_date, data.last_email_analyzed_date);
        
        if(data.imap_worker_completed_at) {
          htmlString = htmlString + "<br />Analysis Complete!"
        }

      } else {
        htmlString = "Email analysis is starting. Gathering all email ids from the past year...";
      }
    } else {
      htmlString = "Your Profile is in line to be analyzed. Please wait a moment...";
    }
    return htmlString;
  };

	$(html_element).html(generateStatusMessageHtml(data));
	return { 
    "update": function(data) {
      $(html_element).html(generateStatusMessageHtml(data));
    }
  }
};