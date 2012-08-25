class ChangeSlugToLong < ActiveRecord::Migration
  def up
  	change_column :profiles, :slug, :bigint
  end

  def down
  	change_column :profiles, :slug, :integer
  end
end
