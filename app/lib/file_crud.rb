module FileCrud
  def self.included(base)
    base.extend ClassMethods
  end

  module ClassMethods
    def write_file(file)
      path = self::get_path(file.original_filename)
      File.open(path, 'wb') { |f| f.write(file.read) }
      path.dup.sub! 'public', ''
    end

    def get_path(name)
      path = File.join('public', 'uploaded_images', name)
      path.gsub! ' ', '_'
      counter = 1
      while File.exists? path and counter < 1000
        path = File.join('public', 'uploaded_images', counter.to_s << name)
        counter += 1
      end
      path
    end
  end
end