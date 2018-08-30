class AddOrderToBundles < ActiveRecord::Migration[5.1]
  def change
    add_column :bundles, :order, :integer
  end
end
