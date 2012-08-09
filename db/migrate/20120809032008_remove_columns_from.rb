class RemoveColumnsFrom < ActiveRecord::Migration
  def up
  	remove_column :emails, :sentreceived
  	remove_column :emails, :seenunseen
  end

  def down
  	add_column :emails, :sentreceived, :string
  	add_column :emails, :seenunseen, :string
  end
end
