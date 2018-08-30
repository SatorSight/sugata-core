class DownloadController < ApplicationController
  def index
    file_system_info = `df -h -T | grep -E 'ext4|Type'`

    archives_dir_name = Downloader::PUBLIC_ARCHIVE_DIR
    temp_archives_dir_name = Downloader::TEMP_DIR

    Dir.mkdir archives_dir_name unless File.directory? archives_dir_name
    Dir.mkdir temp_archives_dir_name unless File.directory? temp_archives_dir_name

    existing_archives = Dir[archives_dir_name + '/*.zip']
    existing_archives = existing_archives.map do |archive|
      hash = {}
      hash[:path] = archive.sub('public', '')
      hash[:name] = archive.sub('public/archives/', '')
      hash
    end

    @props = {
        role: current_account.highest_role,
        action: controller_name.to_sym,
        roles: Role.all,
        file_system_info: file_system_info,
        existing_archives: existing_archives,
        # dirs: dirs,
    }
  end

  def create_archive
    from = params[:from]
    to = params[:to]

    from = Date.parse(from) if from
    to = Date.parse(to) if to

    dl = Downloader.new
    dirs = dl.list_matching_dirs(from, to)
    dl.download_files_to_tmp(dirs)

    dl.close
    render json: {ok: 'ok'}
  end

  def delete_archive
    name = params[:name]

    render json: {fail: 'fail'} if name.include? '/'
    archive_path = Downloader::PUBLIC_ARCHIVE_DIR + '/' + name + '.zip'
    FileUtils.rm(archive_path) if File.exists?(archive_path)

    render json: {ok: 'ok'}
  end


end