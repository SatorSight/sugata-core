desc 'pdf parsing test'
task :pdf_parse => :environment do
  # pp Dir.pwd

  def clean_html(path)
    cleaned_dir = path + '/html_cleaned'
    cleaned_path = cleaned_dir + '/source.html'
    Dir.mkdir(cleaned_dir)
    FileUtils.cp(path + '/html/source.html', cleaned_dir)
    FileUtils.cp(path + '/html/bg1.jpg', cleaned_dir)
    html_file = File.open(cleaned_path)
    html = html_file.read
    html_file.close
    html.sub! '<img alt="" src="pdf2htmlEX-64x64.png"/>', ''
    html.sub! 'class="pf ', 'class="'
    html.sub! '<script src="compatibility.js"></script>', ''
    html.sub! '<script src="pdf2htmlEX.min.js"></script>', ''
    html.sub! '<div id="page-container">', '<div>'
    html.sub! '<div id="sidebar">', '<div>'
    html.sub! '<div id="outline">', '<div>'
    html.sub! 'src="', '<div>'
    html.sub! '<div class="loading-indicator">', '<div>'
    html.sub! 'pdf2htmlEX.defaultViewer = new pdf2htmlEX.Viewer({});', ''
    File.write(cleaned_path, html)
  end

  def clean_text(path)
    text_file_path = path + '/source.txt'
    text_file = File.open(text_file_path)
    text = text_file.read

    text = text.gsub(/\n\n/, '%%%')
               .gsub(/\n/, '<br />')
               .gsub(/%%%/, '</p><p>')
               .gsub(/^(.*)$/, '<p>\1</p>')
    text.sub! '<br />', ''

    text_file.close
    File.write(text_file_path, text)
  end

  def get_issue_contents_array(path)
    pages_array = []
    pages_dirs = Dir["#{path}/*"]
    pages_dirs.each do |page_dir|
      page_number = page_dir[page_dir.rindex('/') + 1 .. -1]
      page_text = File.open("#{path}/#{page_number}/source.txt").read
      page_images = Dir["#{path}/#{page_number}/images/*.jpg"]

      bg_image = "#{path}/#{page_number}/html_cleaned/bg1.jpg"
      page_images.push bg_image
      html = File.open("#{path}/#{page_number}/html_cleaned/source.html").read

      page_hash = {
          number: page_number,
          text: page_text,
          images: page_images,
          html: html
      }

      pages_array.push page_hash
    end
    pages_array
  end

  def get_available_temp_folder_path
    path = 'public/temp/decomposed'
    counter = 1
    while File.directory? path and counter < 10000
      new_path = path + '_' + counter.to_s
      return new_path unless File.directory? new_path
      counter += 1
    end
    path
  end

  def drop_images(path)
    Dir.mkdir(path + '/images')
    `cd #{path}; pdfimages -png -j source.pdf images/1`
  end

  def drop_texts(path)
    DocRipper::rip(path + '/source.pdf')
    clean_text path
  end

  def drop_html(path)
    `cd #{path}; pdf2htmlEX --fit-width=1024 --optimize-text=1 --bg-format=jpg --embed ij --dest-dir=html source.pdf`
    clean_html path
  end

  def drop_files(path)
    drop_images path
    drop_texts path
    drop_html path
  end

  #todo remove with uploaded file
  temp_filename = '1.pdf'
  dir_path = get_available_temp_folder_path
  source_path = 'public/temp/' << temp_filename

  Dir.mkdir dir_path
  pages = CombinePDF.load(source_path).pages
  i = 0

  pages.each do |page|
    page_path = "#{dir_path}/#{i}"
    Dir.mkdir(page_path) unless File.exists?(page_path)

    pdf = CombinePDF.new
    pdf << page
    pdf.save("#{page_path}/source.pdf")

    # drop images to /images and text to source.txt and html inside page dir
    drop_files page_path

    i += 1
  end

  issue_contents = get_issue_contents_array(dir_path)
  pp issue_contents

  #clear temp folder
  FileUtils.rm_rf(dir_path, secure: true)
  FileUtils.rm_rf('public/temp/', secure: true)

  # different text ripping algorythm usage
  # data = File.read 'public/temp/decombined_pdf/9.pdf'
  # text = Yomu.read :text, data
end