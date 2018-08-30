class AddLogoToJournal < ActiveRecord::Migration[5.1]
  def change
    add_reference :journals, :logo, index: true
  end
end
