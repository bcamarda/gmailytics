var createProfileStatusBox = function (data, html_element) {

  var generateStatusMessageHtml = function(data) {
    var htmlString = "";
    if (data.imap_worker_started_at) {
      if (data.emails_analyzed) {

        htmlString = htmlString + data.emails_analyzed + " Emails Analyzed";
        htmlString = htmlString + ", from " + data.first_email_analyzed_date + " to " + data.last_email_analyzed_date;
        
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