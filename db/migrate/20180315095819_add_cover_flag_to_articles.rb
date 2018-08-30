class AddCoverFlagToArticles < ActiveRecord::Migration[5.1]
  def change
    add_column :articles, :cover, :boolean
  end
end
