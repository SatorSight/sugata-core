class CreateAdditionalImages < ActiveRecord::Migration[5.1]
  def change
    create_table :additional_images do |t|
      t.string :path
      t.integer :parent_id
      t.string :parent_type
      t.string :extension

      t.timestamps
    end
    add_reference :journals, :additional_image, index: true
  end
end
