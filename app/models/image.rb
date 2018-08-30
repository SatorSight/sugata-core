class Image < ApplicationRecord
  include FileCrud
  include ImageModel

  UPLOAD_PATH = 'public/uploaded_images'

  def self.create_image_from_zip(file)
    temp_path = Rails.root.to_s + '/' + 'tmp' + '/'
    temp_name = FileHelper::get_free_file_name_in_dir(temp_path)
    temp_file_path = temp_path + temp_name

    File.open(temp_file_path, 'wb') {|f| f.write(file.get_input_stream.read)}
    image = self.create_image(temp_file_path)
    File.delete(temp_file_path)

    image
  end

  # image factory method
  def self.create_image(source_path, parent_id = nil, parent_type = nil, content_key = nil, page_number = nil, model = nil)
    model = self unless model
    extension = File.extname(source_path)
    new_name = FileHelper::get_free_file_name_in_dir(Rails.root.to_s + '/' + UPLOAD_PATH + '/', extension)
    new_path = UPLOAD_PATH + '/' + new_name

    pp 'file not found' + source_path unless File.exists? source_path

    return nil unless File.exists? source_path

    file = File.open(source_path)
    f = File.open(new_path, 'wb')
    f.write(file.read)
    f.close

    image = model.new(
      path: new_path.sub('public', ''),
      parent_id: parent_id,
      parent_type: parent_type,
      extension: extension
    )
    image.page_number = (page_number ? page_number : nil) if image.respond_to? :page_number
    image.content_key = content_key if image.respond_to? :content_key

    image.save
    pp image.errors.messages
    image
  end

  def self.create_preview(klass, params)
    file = params[:cropped_image]
    extension = file.content_type.include?('png') ? '.png' : '.jpg'

    path = File.join('tmp', Time.now.to_f.to_s + extension)
    File.open(path, 'wb') { |f| f.write(file.read) }

    criteria = {
        parent_type: Article.to_s,
        parent_id: params[:article_id]
    }
    klass.where(criteria).destroy_all if klass.exists? criteria

    image = Image::create_image(
        path,
        params[:article_id],
        Article.to_s,
        :article,
        nil,
        klass
    )

    File.delete path if File.exists? path
    image
  end

  # save and attach to object, return image object
  def self.attach_image(object, image_path)
    image = self::create_image(
        image_path,
        object.id,
        object.class.to_s,
        object.class.to_s.downcase.to_sym)
    object.image_id = image.id
    object.save
    image
  end

  def self.clear_unused_images
    images = Image.all
    images_names = []
    images.each do |image|
      image_name = File.basename(image.path)
      images_names.push image_name
    end

    images_in_dir = Dir.glob(UPLOAD_PATH + '/*')
    images_in_dir.each do |image|
      unless images_names.include? File.basename(image)
        File.delete image
      end
    end
  end

  def self.get_images_for_issue(id)
    Issue
        .includes(:articles)
        .find(id)
        .articles.includes(:images)
        .map{|article|
          article.images.map{|image|
            image.content_key == 'article' ? image : nil
          }.compact
        }.compact.flatten
  end

  def self.get_random_free_name(path)
    image_name = '.jpg'
    begin
      image_name = self.randomize_name(image_name)
      new_path = path + image_name
    end while File.exists? new_path
    image_name
  end

  def self.randomize_name(name)
    a = []
    10.times{|i| a.push(i)}
    a = a + ('a'..'z').to_a
    res = a.sample.to_s << name
    res
  end
end
