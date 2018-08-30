class AddActiveToArticle < ActiveRecord::Migration[5.1]
  def change
    add_column :articles, :active, :boolean, default: true
  end
end
