class AddNotNullDefaultToSentunsentInEmails < ActiveRecord::Migration
  def change
  	change_column :emails, :sentreceived, :string, :not_null => true, :default => :received
  	change_column :emails, :seenunseen, :string, :not_null => true, :default => :unseen
  end
end
