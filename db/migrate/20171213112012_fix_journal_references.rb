class FixJournalReferences < ActiveRecord::Migration[5.1]
  def change
    remove_reference :journals, :image
    remove_reference :bundles, :image
    add_reference :journals, :image, polymorfic: true
    add_reference :bundles, :image, polymorfic: true
  end
end