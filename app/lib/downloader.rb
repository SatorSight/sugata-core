class Downloader
  require 'net/ftp'

  HOST = 'ftp.buongiorno.ru'.freeze
  PORT = 21
  LOGIN = 'burda'.freeze
  PASSWORD = 'burda1898'.freeze
  INITIAL_DIR = './kiosk_plus'.freeze
  FTP_IMAGES_DIR = './srv/images'.freeze
  TEMP_DIR = 'tmp/archives'.freeze
  IMAGES_DIR = TEMP_DIR + '/images'.freeze
  HTML_DIR = TEMP_DIR + '/html'.freeze
  TEMP_ARCHIVE_PATH = TEMP_DIR + '/converted.zip'
  PUBLIC_ARCHIVE_DIR = 'public/archives'

  def initialize
    self.class.remake_dir TEMP_DIR
    self.class.remake_dir IMAGES_DIR
    self.class.remake_dir HTML_DIR

    @ftp = Net::FTP.new
    @ftp.connect(HOST, PORT)
    @ftp.login(LOGIN, PASSWORD)
    @ftp.chdir(INITIAL_DIR)
  end

  def list_files
    @ftp.list
  end

  def close
    @ftp.close
  end

  def self.normalize_spaces_for(string)
    string.sub!('  ', ' ')
    return self::normalize_spaces_for(string) if string.include?('  ')
    string
  end

  def self.date_from_unix_ls_date_string(string)
    self::normalize_spaces_for string
    DateTime.parse(string)
  end

  def self.date_in_interval(date, from, to)
    return true if     from and     to 		 and date >= from and date <= to
    return true if     from and not to     and date >= from
    return true if not from and     to     and date <= to
    return true unless from or to
    false
  end

  def self.filter_files_with_dates(files, from, to)
    reg = /^(?<type>.{1})(?<mode>\S+)\s+(?<number>\d+)\s+(?<owner>\S+)\s+(?<group>\S+)\s+(?<size>\d+)\s+(?<mod_time>.{12})\s+(?<path>.+)$/
    files.reduce([]) do |result, file|
      match = file.match(reg)
      if self::filter_matched(match)
        result
      else
        unix_date_string = match[:mod_time]
        date = self::date_from_unix_ls_date_string unix_date_string

        result.push match[:path] if self::date_in_interval(date, from, to)
        result
      end
    end
  end

  def self.filter_matched(match)
    %w(json pdf uploadTest test prodTest srv TEST1 Test_2).include? match[:path]
  end

  def list_matching_dirs(from, to)
    require 'net/ftp'

    # file = File.open('tmp/temp.txt')
    # files = file.read
    # files = JSON.parse(files)
    # file.close
    # filtered_files = self::filter_files_with_dates(files, from, to)


    # temp_file = File.new('tmp/temp.txt', 'w')
    # temp_file << files.to_json
    # temp_file.close
    #
    # exit
    files = list_files
    self.class.filter_files_with_dates(files, from, to)
  end

  def change_dir_to_images
    @ftp.chdir(FTP_IMAGES_DIR)
  end

  def self.remake_dir(dir)
    FileUtils.rm_rf dir
    FileUtils.mkdir dir
  end

  def download_images(dirs)
    dirs.each do |dir|
      file_dir = IMAGES_DIR + '/' + dir
      self.class.remake_dir file_dir
      FtpSync.backup(@ftp, dir, file_dir)
    end
  end

  def download_html(dirs)
    dirs.each do |dir|
      file_dir = HTML_DIR + '/' + dir
      self.class.remake_dir file_dir
      FtpSync.backup(@ftp, dir, file_dir)
    end
  end

  def convert
    `cp app/lib/converter.py tmp/archives/ && cd tmp/archives/ && python converter.py`
  end

  def move_archive_from_temp
    new_archive_path = PUBLIC_ARCHIVE_DIR + '/converted_' + Time.now.strftime('%d_%m_%Y') + '.zip'
    new_archive_path = get_free_name(new_archive_path)
    FileUtils.mv(TEMP_ARCHIVE_PATH, new_archive_path)
  end

  def get_free_name(path)
    return path unless File.exists? path
    new_path = path.sub '.zip', '_1.zip'
    if File.exists?(new_path)
      get_free_name(new_path)
    else
      new_path
    end
    # File.exists?(new_path) ? return get_free_name(new_path) : new_path
  end

  def download_files_to_tmp(dirs)
    download_html dirs
    change_dir_to_images
    download_images dirs

    convert
    move_archive_from_temp
  end
end