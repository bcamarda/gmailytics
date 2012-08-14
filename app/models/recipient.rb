class Recipient 
	attr_accessor :address, :count, :month

	def initialize(address, count, month)
		@address = address
		@count = count
		@month = month
	end

	def self.get_top(all_recipients, top_number)
		recipients = []
		recipients_per_month = []
		for i in 1..12 do
			all_recipients.each do |r|
				if r.month == i
					recipients_per_month << r
				end 
			end
			recipients << recipients_per_month[0..top_number-1]
			recipients_per_month = []
		end
		
		self.rearrange_data(recipients)
	end

	def self.rearrange_data(recipients)
		new_ar = recipients.map do |recipient_array|	
			hsh = {}
			hsh['month'] = recipient_array.first.month
			recipient_array.each_with_index do |recipient, index|
				hsh.merge!( 
					{
						"sent#{index + 1}" => recipient.count,
						"to#{index + 1}" => recipient.address
					} )
			end
			hsh
		end
		new_ar
	end





end