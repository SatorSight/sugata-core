class RemoveIssuePeriod < ActiveRecord::Migration[5.1]
  def change
    remove_column :issues, :period_id
  end
end
