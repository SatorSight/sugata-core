class RealmAuthType < ApplicationRecord
  belongs_to :realm
  validates_presence_of :realm
end