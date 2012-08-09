class ChangeColumnOnEmailsFromIntegerToString < ActiveRecord::Migration
  def up
  	change_column :emails, :uid, :string
  end

  def down
  	change_column :emails, :uid, :integer
  end
end
