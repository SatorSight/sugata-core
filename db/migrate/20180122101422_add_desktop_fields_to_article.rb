class AddDesktopFieldsToArticle < ActiveRecord::Migration[5.1]
  def change
    add_column :articles, :desktop_html, :text
    add_column :articles, :desktop_bg, :string
  end
end