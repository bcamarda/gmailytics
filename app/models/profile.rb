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
 
    monkeypatch_imap #Used to add X-GM-LABELS support for Net::IMAP

    @imap.search(['ALL']).each do |id|
      header = @imap.fetch(id,['ENVELOPE','FLAGS','X-GM-LABELS'])[0].attr

      email_params = {}
      header['X-GM-LABELS'].include?(:Sent) ? email_params[:sentreceived] = :sent  : email_params[:sentreceived] = :received
      header['FLAGS'].include?(:Seen) ? email_params[:seenunseen] = :seen  : email_params[:seenunseen] = :unseen

      envelope = header['ENVELOPE']
      email_params[:subject]  = envelope.subject
      email_params[:date]     = envelope.date
      email_params[:from]     = envelope.from[0]['mailbox'] + '@' + envelope.from[0]['host'] 

      email = self.emails.create(email_params)

      envelope.to.each do |address|  
        email.emails_tos.create(:recipient_type => 'to', :address => (address['mailbox'] + '@' + address['host']))
      end

      unless envelope.cc.nil?
        envelope.cc.each do |address|  
          email.emails_tos.create(:recipient_type => 'cc', :address => (address['mailbox'] + '@' + address['host']))
        end
      end

      unless envelope.bcc.nil?
        envelope.bcc.each do |address|  
          email.emails_tos.create(:recipient_type => 'bcc', :address => (address['mailbox'] + '@' + address['host']))
        end
      end

    end
      
  end

  private

  def monkeypatch_imap
    # stolen (borrowed) from https://gist.github.com/2712611
    class << @imap.instance_variable_get("@parser")

      # copied from the stdlib net/smtp.rb
      def msg_att
        match(T_LPAR)
        attr = {}
        while true
          token = lookahead
          case token.symbol
          when T_RPAR
            shift_token
            break
          when T_SPACE
            shift_token
            token = lookahead
          end
          case token.value
          when /\A(?:ENVELOPE)\z/ni
            name, val = envelope_data
          when /\A(?:FLAGS)\z/ni
            name, val = flags_data
          when /\A(?:INTERNALDATE)\z/ni
            name, val = internaldate_data
          when /\A(?:RFC822(?:\.HEADER|\.TEXT)?)\z/ni
            name, val = rfc822_text
          when /\A(?:RFC822\.SIZE)\z/ni
            name, val = rfc822_size
          when /\A(?:BODY(?:STRUCTURE)?)\z/ni
            name, val = body_data
          when /\A(?:UID)\z/ni
            name, val = uid_data

          # adding in Gmail extended attributes
          when /\A(?:X-GM-LABELS)\z/ni
            name, val = flags_data
          when /\A(?:X-GM-MSGID)\z/ni
            name, vale = uid_data
          when /\A(?:X-GM-THRID)\z/ni
            name, val = uid_data
          else
            parse_error("unknown attribute `%s'", token.value)
          end
          attr[name] = val
        end
        return attr
      end
    end
  end

end