class AddColumnAndIndexToEmails < ActiveRecord::Migration
  def change
  	add_column :emails, :from_address, :string
  	add_index :emails, :from_address
  	add_index :emails_tos, :address
  end
end
