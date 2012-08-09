class AddIndexToDateOnEmails < ActiveRecord::Migration
  def change
  	add_index :emails, :date
  end
end
