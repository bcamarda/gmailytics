class AddSlugToProfile < ActiveRecord::Migration
  def change
  	add_column :profiles, :slug, :string
  	add_index :profiles, :slug
  end
end
