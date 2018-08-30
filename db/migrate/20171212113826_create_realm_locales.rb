class CreateRealmLocales < ActiveRecord::Migration[5.1]
  def change
    create_table :realm_locales do |t|
      t.string :locale_file_path
    end
    add_reference :realm_locales, :realm, foreign_key: true
  end
end