class Listing < ApplicationRecord
  belongs_to :issue
  has_many :images, as: :parent

  validates_presence_of :content

  before_destroy do |listing|
    listing.images.destroy_all
  end
end