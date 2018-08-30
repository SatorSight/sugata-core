class CreateRealms < ActiveRecord::Migration[5.1]
  def change
    create_table :realms do |t|
      t.string :secret_key
    end
  end
end
