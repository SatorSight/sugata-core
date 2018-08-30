class LocalesController < ApplicationController
  def index
    realm = current_account.realm
    #todo change relation to one_to_one
    if realm.realm_locales.any?
      locale = realm.realm_locales.first
      path = locale.locale_file_path
      contents = HashWithIndifferentAccess.new(YAML.load(File.read(path)))
      @props = {
          roles: Role.all,
          action: 'locales',
          role: current_account.highest_role,
          contents: contents
      }
    else
      path = File.join('public', 'locales', 'origin.yml')
      contents = HashWithIndifferentAccess.new(YAML.load(File.read(path)))
      @props = {
        roles: Role.all,
        action: 'locales',
        role: current_account.highest_role,
        contents: contents
      }
    end
  end

  def save
    params_decoded = JSON.parse params[:json]
    realm = current_account.realm
    path = File.join('public', 'locales', realm.name.downcase << '.yml')

    File.open(path, 'w') {|f| f.write params_decoded.to_yaml}

    RealmLocale.new(locale_file_path: path, realm: realm).save unless realm.realm_locales.any?

    render :json => {result: :ok}
  end
end