class SettingsController < ApplicationController
  include Settings

  def index

    realm = current_account.realm
    settings_names = Settings::all
    setting_values = RealmSetting.where(realm: realm)

    @props = {
        resource: controller_name.to_sym,
        role: current_account.highest_role,
        action: controller_name.to_sym,
        data: {
          settings_names: settings_names,
          setting_values: setting_values
        },
        roles: Role.all
    }
  end

  def update
    realm = current_account.realm
    settings = JSON.parse(params[:json])
    settings.each do |setting|
      criteria = {realm: realm, setting: setting['name']}
      if RealmSetting.exists?(criteria)
        rs = RealmSetting.where(criteria).take
      else
        rs = RealmSetting.new
        rs.setting = setting['name']
      end
      rs.value = setting['value']
      rs.realm = realm
      rs.save
    end

    render json: {result: :ok}
  end
end