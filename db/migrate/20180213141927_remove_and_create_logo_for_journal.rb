class RemoveAndCreateLogoForJournal < ActiveRecord::Migration[5.1]
  def change
    remove_column :journals, :logo
  end
end
