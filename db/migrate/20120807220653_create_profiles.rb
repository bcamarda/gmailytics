class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.string :email
      t.string :password
      t.string :oauth_token
      t.string :oauth_token_secret
      t.timestamps
    end
  end
end
