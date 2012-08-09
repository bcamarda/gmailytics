class Profile < ActiveRecord::Base
  require 'net/imap'
  require 'mail'
  require 'gmail_xoauth'

  attr_accessible :email, :password, :oauth_token, :oauth_token_secret

  has_many :emails

  def fetch_and_save_emails
    @imap = Net::IMAP.new('imap.gmail.com', 993, true)

    @imap.authenticate('XOAUTH', email,
      :consumer_key => 'anonymous',
      :consumer_secret => 'anonymous',
      :token => oauth_token,
      :token_secret => oauth_token_secret
    )

    @imap.select('[Gmail]/All Mail')

    all_email_ids = @imap.search(['ALL'])
    unseen_email_ids = @imap.search(['UNSEEN'])

    @imap.select('[Gmail]/Sent Mail')

    sent_email_ids = @imap.search(['ALL'])
    seen_received_email_ids = all_email_ids - sent_email_ids - unseen_email_ids

    puts "unseen email: #{unseen_email_ids}"
    puts "seen received email: #{seen_received_email_ids}"
    puts "sent email: #{sent_email_ids}"

    fetch_and_save_emails_helper(  seen_received_email_ids,  {:sentreceived => 'received',  :seenunseen => 'seen'})
    fetch_and_save_emails_helper(  unseen_email_ids,         {:sentreceived => 'received',  :seenunseen => 'unseen'})
    fetch_and_save_emails_helper(  sent_email_ids,           {:sentreceived => 'sent',      :seenunseen => 'seen'})

    # If we ever want to grab the full contents of the email, including attachments and body =>
    # emails = email_ids.map { |id| Mail.new(imap.fetch(id,'BODY.PEEK[]')[0].attr['BODY[]']) }
      
  end

  private

  def fetch_and_save_emails_helper(uid_ar, email_params)
      @imap.select('[Gmail]/All Mail')

      uid_ar.each do |id|
        header = @imap.fetch(id,'ENVELOPE')[0].attr['ENVELOPE']

        email_params[:subject]  = header.subject
        email_params[:date]     = header.date

        self.emails.create(email_params)
      end
  end

  def get24hourgraph
    graph = Hash.new(0)
    self.emails.each do |email|
      graph[email.date.hour] += 1
    end
  end

end