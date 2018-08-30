class AddNameToRealm < ActiveRecord::Migration[5.1]
  def change
    add_column :realms, :name, :string
  end
end