class AddLinkedFlagToArticles < ActiveRecord::Migration[5.1]
  def change
    add_column :articles, :linked, :boolean
  end
end