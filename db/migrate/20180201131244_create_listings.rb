class CreateListings < ActiveRecord::Migration[5.1]
  def change
    create_table :listings do |t|
      t.text :content

      t.timestamps
    end
    add_reference :listings, :issue, foreign_key: true
  end
end