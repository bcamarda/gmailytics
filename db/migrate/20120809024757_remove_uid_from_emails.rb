class RemoveUidFromEmails < ActiveRecord::Migration
  def up
  	remove_column :emails, :uid
  end

  def down
  	add_column :emails, :uid, :integer
  end
end
