class Journal < ApplicationRecord
  include CrudModel

  has_one :image, as: :parent, dependent: :destroy
  has_one :logo, as: :parent, dependent: :destroy
  has_one :additional_image, as: :parent, dependent: :destroy
  belongs_to :bundle
  belongs_to :period

  has_many :issues, dependent: :destroy

  validates_presence_of :name
  validates_presence_of :url_prefix
  # validates_presence_of :image
  validates_presence_of :period
  validates_presence_of :bundle

  def self.get_all_journals_for_realm(realm_id)
    Realm.find(realm_id).journals
  end
end