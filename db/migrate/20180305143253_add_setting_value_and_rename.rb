class AddSettingValueAndRename < ActiveRecord::Migration[5.1]
  def change
    add_column :realm_settings, :value, :string
    rename_column :realm_settings, :settings, :setting
  end
end