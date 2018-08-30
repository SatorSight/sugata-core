class AddTimestampsToShared < ActiveRecord::Migration[5.1]
  def change
    add_timestamps(:operators, null: true)
    add_timestamps(:realm_settings, null: true)
    add_timestamps(:realm_locales, null: true)
    add_timestamps(:user_data, null: true)
    add_timestamps(:user_histories, null: true)
    add_timestamps(:periods, null: true)
    add_timestamps(:bundles, null: true)
    add_timestamps(:journals, null: true)
  end
end
