class ChangeBundleAccessesRelations < ActiveRecord::Migration[5.1]
  def change
    remove_reference :bundle_accesses, :bundle
  end
end
