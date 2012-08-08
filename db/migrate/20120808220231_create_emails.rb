class CreateEmails < ActiveRecord::Migration
  def change
    create_table :emails do |t|
      t.integer :profile_id
      t.integer :uid
      t.string :subject
      t.timestamp :date
      t.string :sentreceived
      t.string :seenunseen

      t.timestamps
    end
  end
end
