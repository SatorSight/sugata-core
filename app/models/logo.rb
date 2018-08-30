class Logo < ApplicationRecord

  # extend FileCrud
  include FileCrud

  belongs_to :parent, polymorphic: true, optional: true

  validates_presence_of :extension
  validates_presence_of :path

  validates_uniqueness_of :path

  before_destroy do |image|
    image_path = File.join('public', image.path)
    File.delete(image_path) if File.exist?(image_path)
  end

  def to_s
    self.path
  end
end