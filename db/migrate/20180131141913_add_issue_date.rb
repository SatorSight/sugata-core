class AddIssueDate < ActiveRecord::Migration[5.1]
  def change
    add_column :issues, :content_date, :datetime
  end
end