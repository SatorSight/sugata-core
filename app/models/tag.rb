class Tag < ApplicationRecord
  has_and_belongs_to_many :articles
  has_one :image, as: :parent
  has_many :user_tag_preferences

  validates_presence_of :name
  validates_presence_of :key

  validates_uniqueness_of :name
  validates_uniqueness_of :key
end