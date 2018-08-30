class AddServiceIdToBundles < ActiveRecord::Migration[5.1]
  def change
    add_column :bundles, :service_id, :string
  end
end
