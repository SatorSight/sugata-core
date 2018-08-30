class CreateImages < ActiveRecord::Migration[5.1]
  def change
    create_table :images do |t|
      t.string :extension
      t.string :content_key
      t.string :path

      t.integer :parent_id

      t.timestamps
    end
  end
end