class AddServiceIdToBundleAccess < ActiveRecord::Migration[5.1]
  def change
    add_column :bundle_accesses, :service_id, :string
  end
end