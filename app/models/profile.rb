class Profile < ActiveRecord::Base
  require 'net/imap'
  require 'mail'
  require 'gmail_xoauth'

  attr_accessible :email, :password, :oauth_token, :oauth_token_secret

  def params_to
    :email
  end

  def fetch_emails
    imap = Net::IMAP.new('imap.gmail.com', 993, true)
    
    # imap.login(email, password)

    imap.authenticate('XOAUTH', email,
      :consumer_key => 'anonymous',
      :consumer_secret => 'anonymous',
      :token => oauth_token,
      :token_secret => oauth_token_secret
    )

    imap.select('[Gmail]/All Mail')
    email_ids = imap.search(['ALL'])
    emails = email_ids.map { |id| Mail.new(imap.fetch(id,'BODY.PEEK[]')[0].attr['BODY[]']) }
    emails
  end

end