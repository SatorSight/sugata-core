class AddJournalLogo < ActiveRecord::Migration[5.1]
  def change
    add_column :journals, :logo, :string
  end
end
