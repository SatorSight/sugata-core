class CreateArticles < ActiveRecord::Migration[5.1]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :html
      t.integer :page_number

      t.timestamps
    end
    add_reference :articles, :issue, foreign_key: true
  end
end
