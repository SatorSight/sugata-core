class Bundle < ApplicationRecord
  include CrudModel

  has_and_belongs_to_many :users
  belongs_to :realm
  has_one :image, as: :parent, dependent: :destroy

  has_many :journals, dependent: :destroy
  has_many :users, dependent: :destroy
  has_many :issues, through: :journals, source: :issues

  validates_presence_of :name
  validates_presence_of :realm

  validates_uniqueness_of :name

  def self.get_all_bundles_for_realm(realm_id)
    self.where(realm_id: realm_id)
  end
end