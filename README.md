Gmailytics
==========
This is the source code for [Gmailytics](http://www.gmailytics.com), a web app that visualizes your gmail account.

Local Usage
-----------
Gmailytics can be cloned and run locally, for those concerned about privacy. Currently, we use [Delayed Job](https://github.com/collectiveidea/delayed_job/) to run background processes, and use Postgres for our database. The setup steps:

1.  git clone https://github.com/bcamarda/gmailytics.git
2.  bundle
3.  rake db:create
4.  rake db:migrate
5.  rails s
6.  foreman start

History
-------
Gmailytics began as a 4 person final project out of [Dev Bootcamp](http://devbootcamp.com)

Our goals with this project were 2-fold: we wanted to play with large datasets and learn how to use D3.js.  

Here's how it works: you enter your Gmail address in the text field on the front page and proceed to sign in through OAuth.  We will then use IMAP to download the HEADERS of all your emails to gather enough content to create dynamic, interesting graphs.

Here is what we download from each email:
- Subject
- Date
- From
- To*
- Sent/Received
- Read/Unread

*Because emails are frequently addressed to multiple people, we save the email addresses and their address type ("to", "cc", "bcc") on a seperate join table.

Privacy is a large concern.  Each user is directed to a privately-generated individual page that displays their information.  Once there, users will see a bright red button that allows them to delete all of their personal information from our database.

We are always interested in support and feedback.  Please feel free to contact us at "theteam@gmailytics.com".
