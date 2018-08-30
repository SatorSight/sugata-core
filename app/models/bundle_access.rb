class BundleAccess < ApplicationRecord
  include CrudModel

  has_and_belongs_to_many :bundles
  belongs_to :operator

  # validates_presence_of :bundle
  validates_presence_of :operator
end