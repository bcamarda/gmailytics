class Email < ActiveRecord::Base
  attr_accessible :date, :profile_id, :seenunseen, :sentreceived, :subject, :from

  belongs_to :profile
  has_many :emails_tos
end
