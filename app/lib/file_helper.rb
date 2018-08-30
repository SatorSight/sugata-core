module FileHelper
  def self.get_free_file_name_in_dir(dir, extension = '.jpg')
    file_name = extension
    begin
      file_name = self::randomize_name(file_name)
      new_path = dir + file_name
      # pp new_path
      # exit
    end while File.exists? new_path
    file_name
  end

  def self.get_file_name_from_path(path)
    dot_index = path.rindex '.'
    slash_index = path.rindex '/'
    slash_index ? path[slash_index + 1 ... dot_index] : path[1 ... dot_index]
  end

  def self.randomize_name(name)
    a = []
    10.times{|i| a.push(i)}
    a = a + ('a'..'z').to_a
    a.sample.to_s << name
  end

  def self.get_src_array_from_html(html)
    html.scan /src=["'](.*?)["']/i rescue []
  end

  def self.create_zip_with_images(file_path, data)
    folder = Rails.root.to_s
    zipfile_name = folder + file_path

    File.delete(zipfile_name) if File.exists? zipfile_name
    require 'zip'
    Zip::File.open(zipfile_name, Zip::File::CREATE) do |zipfile|
      data.each do |object|
        full_file_path = folder + '/public' + object.path
        zipfile.add(File.basename(full_file_path), full_file_path)
      end
    end

    file_path.sub!('/public', '')
    file_path
  end

  def self.lock_path
    File.join('tmp') + '/upload_lock.lock'
  end

  def self.upload_lock_enable
    File.new(self.lock_path, 'w').close unless File.exist?(self.lock_path)
  end

  def self.upload_lock_disable
    File.delete(self.lock_path)
  end

  def self.upload_locked
    File.exist?(self.lock_path)
  end
end