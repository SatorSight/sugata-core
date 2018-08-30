class AddPageNumberToImages < ActiveRecord::Migration[5.1]
  def change
    add_column :images, :page_number, :integer
  end
end