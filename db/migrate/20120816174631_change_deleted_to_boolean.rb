class ChangeDeletedToBoolean < ActiveRecord::Migration
  def up
  	remove_column :profiles, :marked_as_deleted
  	add_column :profiles, :marked_as_deleted, :boolean, :default => false
  end

  def down
  	remove_column :profiles, :marked_as_deleted
  	add_column :profiles, :marked_as_deleted, :string
  end
end
