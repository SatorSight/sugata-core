class CreateIssues < ActiveRecord::Migration[5.1]
  def change
    create_table :issues do |t|
      t.integer :number
      t.integer :listing_page
      t.boolean :double_month
      t.boolean :double_number

      t.timestamps
    end
    add_reference :issues, :journal, foreign_key: true
    add_reference :issues, :image, foreign_key: true
    add_reference :issues, :period, foreign_key: true
  end
end