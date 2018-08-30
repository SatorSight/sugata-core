class CreateBigPreviewImages < ActiveRecord::Migration[5.1]
  def change
    create_table :big_preview_images do |t|
      t.string :path
      t.integer :parent_id
      t.string :parent_type
      t.string :extension

      t.timestamps
    end
  end
end
