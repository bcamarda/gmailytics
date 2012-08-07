class Profile < ActiveRecord::Base
  require 'net/imap'
  require 'mail'
  attr_accessible :email, :password

  def params_to
    :email
  end

  def fetch_emails
    imap = Net::IMAP.new('imap.gmail.com', 993, true)
    imap.login(email, password)
    imap.select('INBOX')
    email_ids = imap.search(['ALL'])
    emails = email_ids.map { |id| Mail.new(imap.fetch(id,'RFC822')[0].attr['RFC822']) }
    emails
  end

end