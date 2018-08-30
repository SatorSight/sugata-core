class Period < ApplicationRecord
  include CrudModel

  has_many :journals

  validates_presence_of :name
  validates_presence_of :key

  validates_uniqueness_of :name
  validates_uniqueness_of :key
end