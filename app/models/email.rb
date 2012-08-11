class Email < ActiveRecord::Base
  attr_accessible :date, :profile_id, :seenunseen, :sentreceived, :subject, :from_address, :uid

  belongs_to :profile
  has_many :emails_tos
  validates_uniqueness_of :uid, :scope => :profile_id
end
