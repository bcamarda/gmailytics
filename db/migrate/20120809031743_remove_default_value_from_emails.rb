class RemoveDefaultValueFromEmails < ActiveRecord::Migration
  def up
  	change_column :emails, :sentreceived, :string
  	change_column :emails, :seenunseen, :string
  end

  def down
  	change_column :emails, :sentreceived, :string, :not_null => true, :default => :received
  	change_column :emails, :seenunseen, :string, :not_null => true, :default => :unseen
  end
end
