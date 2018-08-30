class Article < ApplicationRecord
  belongs_to :issue
  has_and_belongs_to_many :tags
  has_many :comments
  has_many :likes
  has_many :images, as: :parent

  # validates_presence_of :title
  validates_presence_of :html
  validates_presence_of :page_number
  validates_presence_of :issue

  before_destroy do |article|
    article.images.destroy_all
  end

  def set_inactive
    self.active = false
    self.save
  end

  def change_article_chosen(on)
    self.chosen = on.eql?(1.to_s) ? true : false
    self.save
  end

  def change_article_show_in_lists(on)
    self.show_in_lists = on.eql?(1.to_s) ? true : false
    self.save
  end

  def change_article_cover(on)
    self.cover = on.eql?(1.to_s) ? true : false
    self.save
  end

  def change_article_linked(on)
    self.linked = on.eql?(1.to_s) ? true : false
    self.save
  end

  #todo make smth more intelligent
  def text_is_ok
    self.html.length > 50 and self.page_number != 0
  end

  def make_it_jpeg(request)
    # FileUtils.rm_rf('tmp/jpegify/*', secure: true)
    return false unless self.desktop_html

    absolute_path = Rails.root.to_s + '/tmp/jpegify'
    article_html = self.desktop_html
    article_html.gsub! /src="(.*?)"/, 'src="http://' + request.host_with_port + '\1' + '"'
    font_links = article_html.scan(/src:url\((.*?)\)format/i)

    font_links.each do |link|
      link = link.first
      path = 'public' + link

      font = File.open(path).read
      encoded = 'data:application/x-font-woff;charset=utf-8;base64,' << Base64.strict_encode64(font)
      article_html.sub! link, encoded
    end

    article_html.sub! '</style>', '#pf1{position:absolute}</style>'

    html_name = 'temp' + self.id.to_s + '.html'
    pdf_name = 'temp' + self.id.to_s + '.pdf'
    image_path = absolute_path + '/temp' + self.id.to_s + '.jpg'

    is_ubuntu = `cat /etc/*-release | grep ID=debian`.empty?
    command_prefix = is_ubuntu ? '' : 'xvfb-run'

    File.open('tmp/jpegify/' + html_name, 'w'){ |file| file.write(article_html) }
    `cd #{absolute_path}; #{command_prefix} wkhtmltopdf #{html_name} #{pdf_name}`

    unless File.exists?('tmp/jpegify/' + pdf_name)
      return false
    end

    pdf = Magick::Image.read('tmp/jpegify/' + pdf_name){
      self.units = Magick::PixelsPerInchResolution
      self.density = '200'
    }.first
    pdf.write(image_path)

    unless File.exists?(image_path)
      image_path.sub!(self.id.to_s, self.id.to_s + '-0')
    end

    image = Image::create_image(
        image_path,
        self.id,
        :Article,
        :article,
        self.page_number
    )

    self.reload
    self.html = "
      <div class=\"article-full-image-wrapper\">
          <img src=\"#{image.path}\" alt=\"#{self.title}\"/>
      </div>"
    self.save
    image
  end

  def is_correct
    return false if self.page_number < 2
    return false if self.title.blank?
    return false if self.html.blank?
    # return false if self.images.empty?
    return false unless self.some_text_exists

    true
  end

  def some_text_exists
    text_exists = false

    pattern = /<p>(.*?)<\/p>/i
    p_array = self.html.scan(pattern)
    p_array.each do |text|
      text_exists = true if text.first.length > 100
    end
    text_exists
  end

  def is_listing_page
    self.html.to_s.force_encoding('UTF-8').include? '<h1>Содержание</h1>' or self.title.to_s.force_encoding('UTF-8').include? 'Содержание'
  end

  def set_title_from_html
    unless self.html.blank?
      pattern_h1 = /<h1>(.*?)<\/h1>/i
      h1_array = self.html.scan(pattern_h1)

      pattern_h2 = /<h2>(.*?)<\/h2>/i
      h2_array = self.html.scan(pattern_h2)

      h1_array.each do |h|
        if h&.first
          unless h.first.blank?
            self.title = h.first
            self.save
          end
        end
      end

      if self.title.blank?
        h2_array.each do |h|
          if h&.first
            unless h.first.blank?
              self.title = h.first
              self.save
            end
          end
        end
      end
    end
  end
end