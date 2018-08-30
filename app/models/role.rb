class Role < ApplicationRecord
  has_and_belongs_to_many :accounts

  validates_presence_of :name
  validates_presence_of :key

  validates_uniqueness_of :name
  validates_uniqueness_of :key

  def name
    read_attribute(:name)
  end
end