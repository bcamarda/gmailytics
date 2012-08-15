class RemoveSlugFromProfiles < ActiveRecord::Migration
  def up
  	remove_column :profiles, :slug
  end

  def down
  	add_column :profiles, :slug, :string
  end
end
