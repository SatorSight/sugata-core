class UserTagPreference < ApplicationRecord
  belongs_to :tag
  belongs_to :user

  validates_presence_of :value
  validates_presence_of :user
  validates_presence_of :tag
end
