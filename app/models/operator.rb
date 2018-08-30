class Operator < ApplicationRecord
  include CrudModel
  belongs_to :realm
  belongs_to :realm_payment_type

  validates_presence_of :realm
  validates_presence_of :name
  validates_presence_of :tech_name
end