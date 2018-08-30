class AddParentTypeToImage < ActiveRecord::Migration[5.1]
  def change
    add_column :images, :parent_type, :string
  end
end
