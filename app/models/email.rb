class Email < ActiveRecord::Base
  attr_accessible :uid, :date, :profile_id, :seenunseen, :sentreceived, :subject

  belongs_to :profile
end
