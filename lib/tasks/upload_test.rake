desc 'Upload test archive'
task :upload_test => :environment do
  TEST_ISSUE_ID = 1.to_s.freeze
  TEST_ISSUE_NUMBER = 1.to_s.freeze

  path = File.join('public', 'test_archive.zip')
  images_array = []
  require 'zip'
  Zip::File.open(path) do |zipfile|
    # collect images and write or take them
    zipfile.each do |file|
      if file.name =~ /[^\s]+(\.(?i)(jpg|png|gif|bmp))$/ # is image
        image_name = get_image_name file.name
        image_final_name = TEST_ISSUE_ID + '_' + TEST_ISSUE_NUMBER + '_' + image_name + '.' + get_image_extension(file.name)
        image = make_image(TEST_ISSUE_ID, image_final_name, file)
        image_data = {
            original_image_name: image_name + '.' + get_image_extension(file.name),
            image_new_name: image_final_name,
            image: image
        }
        images_array.push image_data
      end
    end

    articles_array = []
    # take html files and replace image paths with uploaded images
    zipfile.each do |file|
      if file.name =~ /[^\s]+(\.(?i)html)$/ # is html
        html_contents = file.get_input_stream.read
        src_occurences = html_contents.scan /src=".*?"/i
        src_occurences.each do |src|
          img_object = get_image_object(src, images_array)
          html_contents.sub! src, 'src="/uploaded_images/' + img_object[:image_new_name] + '"'
        end

        page_number = Integer(get_folder(file.name))
        article_descriptor = {
            issue: Issue.find(TEST_ISSUE_NUMBER),
            page_number: page_number
        }

        if Article.exists?(article_descriptor)
          article = Article.where(article_descriptor).take
        else
          af = ArticleFactory.new
          af.html = html_contents
          af.page_number = page_number
          af.issue = Issue.find(TEST_ISSUE_NUMBER)
          article = af.create
        end

        articles_array.push article
      end
    end
  end
end

def get_folder(path)
  path[0 ... path.index('/')]
end

def get_image_object(src, images_array)
  images_array.each do |img|
    return img if img and src.include? img[:original_image_name]
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
def make_image(journal_id, image_name, file)
  path = File.join('public', 'uploaded_images', image_name)

  image = Image.new(
    extension: get_image_extension(image_name),
    content_key: :issue,
    parent_type: Issue.to_s,
    path: path.dup.sub!('public', ''),
    parent_id: journal_id
  )

  if image.valid? or File.exists? path
    if File.exists? path
      image = Image.where(path: path).take
    else
      File.open(path, 'wb') {|f| f.write(file.get_input_stream.read)}
      image.save
    end
    image
  else
    pp 'image error'
    pp image.errors.messages
    exit
  end
end