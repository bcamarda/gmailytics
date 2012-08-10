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

    batched_email_ids = batch_array(@imap.search(['SINCE', '1-Aug-2011']), 100)

    

    batched_email_ids.each do |batch|
      batched_emails = @imap.fetch(batch,['ENVELOPE','FLAGS','X-GM-LABELS', 'X-GM-MSGID'])

      puts batch.inspect
      
      batched_emails.each_with_index do |email,index|
        puts index
        header = email.attr

        unless bad_email?(header)
          email_params = {}
          header['X-GM-LABELS'].include?(:Sent) ? email_params[:sentreceived] = :sent  : email_params[:sentreceived] = :received
          header['FLAGS'].include?(:Seen) ? email_params[:seenunseen] = :seen  : email_params[:seenunseen] = :unseen
          email_params[:uid]      = header['X-GM-MSGID']

          envelope = header['ENVELOPE']
          email_params[:subject]  = envelope.subject[0..254]
          email_params[:date]     = envelope.date
          email_params[:from]     = envelope.from[0]['mailbox'] + '@' + envelope.from[0]['host']
          

          email = self.emails.create(email_params)

          envelope.to.each do |address|  
            email.emails_tos.create(:recipient_type => 'to', :address => (address['mailbox'] + '@' + address['host']))
          end

          unless envelope.cc.nil? || envelope.cc[0]['mailbox'].nil?
            envelope.cc.each do |address|  
              email.emails_tos.create(:recipient_type => 'cc', :address => (address['mailbox'] + '@' + address['host']))
            end
          end

          unless envelope.bcc.nil? || envelope.bcc[0]['mailbox'].nil?
            envelope.bcc.each do |address|  
              email.emails_tos.create(:recipient_type => 'bcc', :address => (address['mailbox'] + '@' + address['host']))
            end
          end
        end
      end
    end
      
  end

  def get24hourgraph
    hourly_array = (0..23).map { {"sent" => 0, "received" => 0 } }
    self.emails.each do |email|
      if email[:sentreceived] == "sent"
        hourly_array[email.date.hour]["sent"] += 1
      else
        hourly_array[email.date.hour]["received"] += 1
      end
    end
    hourly_array
  end

  private
  def fetch_and_save_emails_helper(uid_ar, email_params)
      @imap.select('[Gmail]/All Mail')

      uid_ar.each do |id|
        header = @imap.fetch(id,'ENVELOPE')[0].attr['ENVELOPE']

        email_params[:subject]  = header.subject
        email_params[:date]     = header.date
        email_params[:uid]      = id

        self.emails.create(email_params)
      end
  end

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
            name, val = uid_data
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

  def batch_array(ar, batch_size)
    #batch_array([1,2,3,4,5,6,7], 3) => [[1,2,3],[4,5,6],[7]]
    ar2 = []
    memo = []
    ar.each_with_index do |el,index|
      if index % batch_size == 0
        memo = [ el ]
      else
        memo << el
      end

      if ((index % batch_size) == (batch_size - 1)) || index == ar.count - 1
        ar2 << memo
      end
    end
    ar2
  end

  def bad_email?(header)
    header['ENVELOPE'].subject.nil? || header['ENVELOPE'].from.nil? || header['ENVELOPE'].to.nil? || header['ENVELOPE'].from[0]['mailbox'].nil? || header['ENVELOPE'].to[0]['mailbox'].nil?
  end
end
