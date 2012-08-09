class EmailsTo < ActiveRecord::Base
  attr_accessible :address, :email_id, :recipient_type
  belongs_to :email
end
