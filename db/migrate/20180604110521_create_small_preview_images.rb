class CreateSmallPreviewImages < ActiveRecord::Migration[5.1]
  def change
    create_table :small_preview_images do |t|
      t.string :path
      t.integer :parent_id
      t.string :parent_type
      t.string :extension

      t.timestamps
    end
  end
end
