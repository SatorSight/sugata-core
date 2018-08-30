class RealmPaymentType < ApplicationRecord
  include CrudModel
  belongs_to :realm
  validates_presence_of :realm
end