class CreateEmailsTos < ActiveRecord::Migration
  def change
    create_table :emails_tos do |t|
      t.integer :email_id
      t.string :recipient_type
      t.string :address

      t.timestamps
    end
  end
end
