module ArchiveUploaderHelper

  #todo refactor methods arguments

  def get_folder(path)
    path[0 ... path.index('/')]
  end

  def find_image_object(src, images_array, folder)
    images_array.each do |img|
      if folder == img[:folder]
        only_name = img[:original_image_name]
        return img if img[:image] and src.include? only_name
      end
    end
    false
  end

  def get_image_name(path)
    dot_index = path.rindex '.'
    slash_index = path.rindex '/'
    slash_index ? path[slash_index + 1 ... dot_index] : path[1 ... dot_index]
  end

  def get_image_extension(path)
    dot_index = path.rindex '.'
    path[dot_index + 1 .. 100]
  end

  # write file or take existing
  def make_image(article_id, image_name, file, page_number)
    # prepend random character (a-z|0-9) to image name
    # while the file exists
    begin
      image_name = randomize_image_name(image_name)
      path = File.join('public', 'uploaded_images', image_name)
    end while File.exists? path

    image = Image.new(
        extension: get_image_extension(image_name),
        content_key: :article,
        parent_type: Article.to_s,
        path: path.dup.sub!('public', ''),
        parent_id: article_id,
        page_number: page_number
    )

    if image.valid?
      File.open(path, 'wb') {|f| f.write(file.get_input_stream.read)}
      image.save
    else
      pp '--------------error'
      pp image.errors.messages
    end
    image_name
  end

  def randomize_image_name(image_name)
    a = []
    10.times{|i| a.push(i)}
    a = a + ('a'..'z').to_a
    a.sample.to_s << image_name
  end
end