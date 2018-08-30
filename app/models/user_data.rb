class UserData < ApplicationRecord
  belongs_to :user

  validates_presence_of :user

  def self.get_data_for_users(users)
    ids = users.map{|u| u.id}
    self.where(id: ids)
  end
end