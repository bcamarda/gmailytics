class AddColumnSlugToProfiles < ActiveRecord::Migration
  def change
  	add_column :profiles, :slug, :integer
  end
end
