class AddColumnUidToEmails < ActiveRecord::Migration
  def change
  	add_column :emails, :uid, :integer
  end
end
