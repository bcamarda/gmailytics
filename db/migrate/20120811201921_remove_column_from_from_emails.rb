class RemoveColumnFromFromEmails < ActiveRecord::Migration
  def up
  	remove_column :emails, :from
  end

  def down
  	add_column :emails, :from, :string
  end
end
