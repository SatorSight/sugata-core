class SlaveApiController < ApplicationController
  skip_before_action :authenticate_account!
  include Auth

  def bridge_token_info
    authentificate params; return if performed?

    auth_service = Auth::AuthService.new
    res = auth_service.bridge_token_info(params)

    render json: res.to_json
  end

  def msisdn_info
    authentificate params; return if performed?

    auth_service = Auth::AuthService.new
    res = auth_service.msisdn_info(params)

    render json: res.to_json
  end

  def get_auth_actions
    authentificate params; return if performed?
    auth_service = Auth::AuthService.new
    render json: auth_service.auth_actions(params)
  end

  def get_changed_data
    authentificate params; return if performed?
    render json: SlaveSync::get_changed_data(params)
  end

  def get_all_ids
    authentificate params; return if performed?
    render json: SlaveSync::get_all_ids
  end

  def get_changed_images
    domain = request.domain
    unless request.port == 80 || request.port == 443
      domain << ':' << request.port.to_s
    end

    #todo move somewhere
    domain ||= '185.22.63.2'

    authentificate params; return if performed?
    render json: {result: :ok, file: domain + SlaveSync::get_changed_images(params[:ids])}
  end

  def get_json_data
    authentificate params; return if performed?

    realm = Realm.find(params[:realm_id])
    data = SlaveGateway::get_json_data_for realm

    render json: data
  end

  def get_zipped_images
    authentificate params; return if performed?

    realm = Realm.find(params[:realm_id])
    images = SlaveGateway::get_images_for_transfer realm

    folder = Rails.root.to_s
    zipfile_name = "/tmp/for_send_#{realm.id}.zip"

    File.delete(zipfile_name) if File.exists? zipfile_name
    require 'zip'
    Zip::File.open(zipfile_name, Zip::File::CREATE) do |zipfile|
      images.each do |filename|
        filename = 'public' << filename
        zipfile.add(filename, File.join(folder, filename))
      end
    end
    send_file zipfile_name
  end

  private

  def authentificate(params)
    realm_id = params[:realm_id]
    secret_key = params[:secret_key]

    unless Realm.where(id: realm_id, secret_key: secret_key).exists?
      render(
          :file => File.join(Rails.root, 'public/403.html'),
          :status => 403,
          :layout => false
      )
    end
  end
end
