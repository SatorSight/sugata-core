class CreateJournalReferences < ActiveRecord::Migration[5.1]
  def change
    add_reference :journals, :bundle, foreign_key: true
    add_reference :journals, :period, foreign_key: true
    add_reference :journals, :image, foreign_key: true
  end
end