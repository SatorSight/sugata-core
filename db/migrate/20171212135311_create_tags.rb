class CreateTags < ActiveRecord::Migration[5.1]
  def change
    create_table :tags do |t|
      t.string :name
      t.string :key
      t.boolean :is_hub

      t.timestamps
    end
    add_reference :tags, :image, foreign_key: true
  end
end
