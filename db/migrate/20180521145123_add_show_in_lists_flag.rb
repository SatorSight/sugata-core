class AddShowInListsFlag < ActiveRecord::Migration[5.1]
  def change
    add_column :articles, :show_in_lists, :boolean
  end
end