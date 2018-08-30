class CreateRealmSettings < ActiveRecord::Migration[5.1]
  def change
    create_table :realm_settings do |t|
      t.string :settings
    end
    add_reference :realm_settings, :realm, foreign_key: true
  end
end