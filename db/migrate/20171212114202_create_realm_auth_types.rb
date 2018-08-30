class CreateRealmAuthTypes < ActiveRecord::Migration[5.1]
  def change
    create_table :realm_auth_types do |t|
      #to be implemented
    end
    add_reference :realm_auth_types, :realm, foreign_key: true
  end
end
