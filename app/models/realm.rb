class Realm < ApplicationRecord
  include CrudModel

  has_many :realm_settings, dependent: :destroy
  has_many :realm_locales, dependent: :destroy
  has_many :operators, dependent: :destroy

  has_many :realm_auth_types, dependent: :destroy
  has_many :realm_payment_types, dependent: :destroy

  has_many :accounts, dependent: :destroy

  has_many :bundles, dependent: :destroy
  has_many :journals, through: :bundles, source: :journals
  has_many :issues, through: :journals, source: :issues

  has_many :users, through: :bundles

  has_secure_token :secret_key

  validates_presence_of :name
  validates_uniqueness_of :name
  # validates_uniqueness_of :secret_key
end