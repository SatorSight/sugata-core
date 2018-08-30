class AddImageToBundles < ActiveRecord::Migration[5.1]
  def change
    add_reference :bundles, :image, index: true
  end
end