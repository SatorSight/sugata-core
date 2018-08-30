class AddChosenTypeToArticles < ActiveRecord::Migration[5.1]
  def change
    add_column :articles, :chosen, :boolean
  end
end