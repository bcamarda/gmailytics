class AddIndexToUidOnEmails < ActiveRecord::Migration
  def change
  	add_index :emails, :uid
  end
end
