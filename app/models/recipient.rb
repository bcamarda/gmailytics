class Recipient 
	attr_accessor :address, :count, :month

	def initialize(address='', count=0, month=0)
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
		recipients_with_empties = self.add_empty_recipients(recipients)
		self.rearrange_data(recipients_with_empties)
	end

	def self.rearrange_data(recipients)

		new_ar = recipients.map do |recipient_array|	
			next if recipient_array.empty?
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


	def self.create_empty_array
		recipients_empty = []
		for i in 1..12 do
			for j in 1..5 do
				recipients_empty << Recipient.new('', 0, i)
			end
		end
		recipients_empty 
	end

	def self.add_empty_recipients(recipients_array)
		for i in 0..11 do
			if recipients_array[i] == []
				array_of_empties = []
				for j in 1..5 do 
					array_of_empties << Recipient.new('', 0, i)
				end
				recipients_array[i] = array_of_empties
			end
		end
		recipients_array
	end


end







