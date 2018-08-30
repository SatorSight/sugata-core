class UserHistory < ApplicationRecord
  belongs_to :user

  def self.get_history_for_users(users)
    ids = users.map{|u| u.id}
    self.where(id: ids)
  end
end
