module ImageModel

  def self.included(base)
    base.include ActiveRecord::Associations
    base.include ActiveRecord::Validations
    base.include ActiveRecord::Callbacks
    # include ActiveModel

    base.belongs_to :parent, polymorphic: true, optional: true

    base.validates_presence_of :extension
    base.validates_presence_of :path
    base.validates_uniqueness_of :path

    base.before_destroy do |image|
      image_path = File.join('public', image.path)
      File.delete(image_path) if File.exist?(image_path)
    end
  end



  def to_s
    self.path
  end
end