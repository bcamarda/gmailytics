class AddColumnsBackToEmails < ActiveRecord::Migration
  def change
    add_column :emails, :sentreceived, :string
  	add_column :emails, :seenunseen, :string
  end
end
