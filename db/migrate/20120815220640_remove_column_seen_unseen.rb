class RemoveColumnSeenUnseen < ActiveRecord::Migration
  def up
  	remove_column :emails, :seenunseen
  	add_column :emails, :seen, :boolean
  end

  def down
  	add_column :emails, :seenunseen, :string
  	remove_column :emails, :seen
  end
end
