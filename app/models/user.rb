class User < ApplicationRecord
  has_and_belongs_to_many :bundles
  belongs_to :operator
  has_many :user_tag_preferences
  has_many :likes
  has_many :comments

  validates_presence_of :operator
end