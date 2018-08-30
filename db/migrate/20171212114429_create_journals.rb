class CreateJournals < ActiveRecord::Migration[5.1]
  def change
    create_table :journals do |t|
      t.string :name
      t.string :url_prefix
      t.integer :order
      t.boolean :archived
      t.text :description
      #todo period
      #todo image
      #todo bundle
    end
  end
end
