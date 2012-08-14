class AddMarkedAsDeletedToProfile < ActiveRecord::Migration
  def change
  	add_column :profiles, :marked_as_deleted, :string
  end
end
