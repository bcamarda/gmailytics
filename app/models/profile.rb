class Profile < ActiveRecord::Base
  require 'net/imap'
  require 'mail'
  require 'gmail_xoauth'

  attr_accessible :email, :slug, :oauth_token, :oauth_token_secret, :imap_worker_started_at, :imap_worker_completed_at, :marked_as_deleted

  validates_uniqueness_of :slug

  before_validation :generate_slug

  has_many :emails, :dependent => :destroy

  def self.delete_marked_and_old_unused_profiles
    Profile.all.each do |profile|
      profile.destroy if profile.deleted? && profile.imap_worker_completed_at
    end

    Profile.all.each do |profile|
      profile.destroy if profile.created_at < 1.day.ago && profile.imap_worker_completed_at.nil?
    end
  end
  
  def to_param
    self.slug
  end

  def deleted?
    marked_as_deleted
  end

  def fetch_and_save_emails
    self.update_attributes!(:imap_worker_started_at => Time.now)

    establish_imap_connection

    batched_email_ids = batch_array(@imap.search(['SINCE', '1-Aug-2011']), 200)
    batched_email_ids.each do |batch|
      begin
        batched_emails = @imap.fetch(batch,["ENVELOPE","FLAGS","X-GM-LABELS", "X-GM-MSGID"])
        batched_emails.each_with_index do |email,index|
        
          header = email.attr

          unless bad_email?(header)
            email_params = {}
            
            if header['X-GM-LABELS'].include?(:Sent) 
              email_params[:sentreceived] = :sent
            elsif header['X-GM-LABELS'].include?(:Draft)
              email_params[:sentreceived] = :draft
            else
              email_params[:sentreceived] = :received
            end
            
            header['FLAGS'].include?(:Seen) ? email_params[:seen] = true  : email_params[:seen] = false
            email_params[:uid]      = header['X-GM-MSGID']

            envelope = header['ENVELOPE']
            email_params[:subject]  = envelope.subject.force_encoding("UTF-8")[0..254]
            email_params[:date]     = envelope.date
            email_params[:from_address]     = envelope.from[0]['mailbox'] + '@' + envelope.from[0]['host']
            

            email = self.emails.new(email_params)
            email.save!

            envelope.to.each do |address|  
              email.emails_tos.new(:recipient_type => 'to', :address => (address['mailbox'] + '@' + address['host'])).save!
            end

            unless envelope.cc.nil? || envelope.cc[0]['mailbox'].nil?
              envelope.cc.each do |address|  
                email.emails_tos.new(:recipient_type => 'cc', :address => (address['mailbox'] + '@' + address['host'])).save!
              end
            end

            unless envelope.bcc.nil? || envelope.bcc[0]['mailbox'].nil?
              envelope.bcc.each do |address|  
                email.emails_tos.new(:recipient_type => 'bcc', :address => (address['mailbox'] + '@' + address['host'])).save!
              end
            end
          end
        end
      
      rescue => exception
        audit_imap batch.inspect
        audit_imap exception.message

        establish_imap_connection
      end
    end
    self.update_attributes!(:imap_worker_completed_at => Time.now)
  end

  def get_graph_data(last_email_processed_id)
    @new_emails = get_new_emails(last_email_processed_id)
    @new_emails.empty? ? last_email_processed_id = 0 : last_email_processed_id = @new_emails.last.id

    jsonable_data_hash = {}
    jsonable_data_hash[:lastEmailProcessedId] = last_email_processed_id 

    jsonable_data_hash[:profileStatus] = get_profile_status
    jsonable_data_hash[:twentyFour] = get_24_hour_graph
    jsonable_data_hash[:newEmailSubjectWordFrequency] = get_word_frequency(@new_emails, :subject)
    jsonable_data_hash[:newEmailReceivedWordFrequency] = get_word_frequency(@new_emails, :from_address)
    jsonable_data_hash[:topRecipients] = get_top_recipients   
    jsonable_data_hash[:junkmail] = get_junkmail   

    return jsonable_data_hash
  end

  def get_top_recipients
    # recipients_raw = Profile.find_by_sql(
    #       "SELECT e_t.address, COUNT(*) AS Count, EXTRACT(month FROM e.date) AS Month
    #       FROM emails e, emails_tos e_t 
    #       WHERE e.sentreceived = 'sent' AND e_t.email_id = e.id AND e_t.recipient_type = 'to'
    #       GROUP BY e_t.address, Month 
    #       ORDER BY Month, Count DESC;")
    # recipients = []
    # recipients_raw.each do |r|
    #   recipients << Recipient.new(r.address, r.count.to_i, r.month.to_i) 
    # end    
    # Recipient.get_top(recipients, 5)
  end

  def establish_imap_connection
    @imap = Net::IMAP.new('imap.gmail.com', 993, true)

    @imap.authenticate('XOAUTH', email,
      :consumer_key => 'anonymous',
      :consumer_secret => 'anonymous',
      :token => oauth_token,
      :token_secret => oauth_token_secret
    )

    @imap.select('[Gmail]/All Mail')
 
    monkeypatch_imap_instance(@imap) #Used to add X-GM-LABELS support for Net::IMAP
  end
  
  private

  def generate_slug
    self.slug ||= generate_keystring
  end

  def generate_keystring
    # char_bank = ('a'..'z').to_a + (1..9).to_a - %w(0 o l 1 i)
    # Array.new(string_length,'A').map {char_bank[rand(char_bank.length - 1)]}.join
    18.times.map{ rand(10).to_s }.join.to_i
  end


  def monkeypatch_imap_instance(imap)
    # stolen (borrowed) from https://gist.github.com/2712611
    class << imap.instance_variable_get("@parser")

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
    header['ENVELOPE'].subject.nil? || header['ENVELOPE'].from.nil? || header['ENVELOPE'].to.nil? || 
      header['ENVELOPE'].from[0]['mailbox'].nil? || header['ENVELOPE'].to[0]['mailbox'].nil? || 
      header['ENVELOPE'].from[0]['host'].nil? || header['ENVELOPE'].to[0]['host'].nil? ||
      header['ENVELOPE'].date.nil?
  end

  def get_24_hour_graph
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

  def get_new_emails(last_email_processed_id = 0)
    self.emails.where("emails.id > ?", last_email_processed_id ).order("created_at DESC").limit(1000)
  end

  def get_word_frequency(email_set, property_method)
    common_dict = %w(
    a about after again against all an another any and are as at
    be being been before but by
    can could
    did do don't down
    each 
    few from for fwd
    get got great
    had has have he her here his him himself hers how
    i if im in into is it its
    just
    like
    made me more most my
    new no not
    of off on once one only or other our out over own
    pm
    re
    said she should so some such 
    than that the their them then there these they this those through to too
    under until up 
    very
    was wasnt we were were what when where which while who why will with would wouldnt
    you your) 

    freq_hash = Hash.new(0)
    email_set.each do |email|

      case property_method 
      when :subject
        email.subject.split.each do |word|
          word = word.gsub(/\W/,'')
          freq_hash[word] += 1 unless word.empty? || common_dict.include?(word.downcase)
        end
      when :from_address
        word = email.from_address.split('@').first
        freq_hash[word] += 1 unless word.empty? || common_dict.include?(word.downcase)
      end

    end
    
    word_hash = freq_hash.map { |word, count| { :text => word , :size => count } }
    
    unless word_hash.empty?
      word_hash.sort_by! { |hsh| - hsh[:size] }
      word_hash = word_hash.slice(0, 30)
    end

    word_hash
  end

  def get_profile_status
    status_hash = {}
    if imap_worker_started_at
      status_hash[:imap_worker_started_at] = imap_worker_started_at.strftime("%a %b %d, %Y")
      status_hash[:emails_analyzed] = self.emails.count
      if self.emails.count > 0
        status_hash[:first_email_analyzed_date] = self.emails.first.date.strftime("%a %b %d, %Y")
        status_hash[:last_email_analyzed_date] = self.emails.last.date.strftime("%a %b %d, %Y")
        status_hash[:imap_worker_completed_at] = imap_worker_completed_at.strftime("%a %b %d, %Y") if imap_worker_completed_at
      end
 
    end
    status_hash
  end

  def get_junkmail
    all_junkmail = Profile.find_by_sql([
      "SELECT *
      FROM 
      (
        SELECT emails.from_address, count(*) AS total_count
        FROM emails
        WHERE emails.profile_id = '?' AND emails.seen = false
        GROUP BY emails.from_address
        ORDER BY total_count DESC
        LIMIT 5
      )
      e1
      JOIN 
      (
        SELECT emails.from_address, date_part('year', date) AS year, 
        date_part('month', date) as month, 
        count(*) AS num_count, rank() OVER (PARTITION BY date_part('year', date),
        date_part('month', date) 
        ORDER BY count(*) DESC, from_address ASC)
        FROM emails
        WHERE emails.profile_id = '?' AND emails.seen = false
        GROUP BY emails.from_address, year, month
      ) 
      e2 
      ON e1.from_address = e2.from_address
      ORDER BY e2.year, e2.month, e2.num_count;", self.id, self.id
      ])


    # I am not particularly proud of any of this code, but we need to get it working
    # I'll refactor this later to make it less hideous.

    object_array = [{ year: 2011, month: 7, email_one: 0, email_two: 0, email_three: 0, email_four: 0, email_five: 0}]
    rank_array = []
    unless self.emails.last.nil?
      newest_email = self.emails.last

      recent_date = Date.new(newest_email.date.year.to_i, newest_email.date.month.to_i)

      all_junkmail.each do |email|
        rank_array << email.total_count.to_i
      end



      rank_array.uniq!
      rank_array.sort!
      rank_array.reverse!


      iterating_date = Date.new(2011, 8)
      while iterating_date <= recent_date + 31
        junk_one_total = 0
        junk_two_total = 0
        junk_three_total = 0
        junk_four_total = 0
        junk_five_total = 0

        all_junkmail.each do |email|
          email_date = Date.new(email.year.to_i, email.month.to_i) 
          if email_date <= iterating_date
            case rank_array.index(email.total_count.to_i)
            when 0 then junk_one_total += email.num_count.to_i
            when 1 then junk_two_total += email.num_count.to_i
            when 2 then junk_three_total += email.num_count.to_i
            when 3 then junk_four_total += email.num_count.to_i
            when 4 then junk_five_total += email.num_count.to_i
            end
          end
        end

        if iterating_date > Date.today
          insertion_date = Date.today
        else
          insertion_date = iterating_date
        end
        object_array << { year: insertion_date.year, month: (insertion_date.month - 1), email_one: junk_one_total, email_two: junk_two_total, email_three: junk_three_total, 
          email_four: junk_four_total, email_five: junk_five_total }
        iterating_date = Date.new((iterating_date + 31).year, (iterating_date + 31).month)
      end  
    end
    object_array
  end
  

end
