class RemovePasswordColumnFromProfiles < ActiveRecord::Migration
  def up
  	remove_column :profiles, :password
  end

  def down
  	add_column :profiles, :password, :string
  end
end
