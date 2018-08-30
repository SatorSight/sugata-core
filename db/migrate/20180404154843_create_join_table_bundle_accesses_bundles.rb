class CreateJoinTableBundleAccessesBundles < ActiveRecord::Migration[5.1]
  def change
    create_join_table :bundle_accesses, :bundles do |t|
      t.index [:bundle_access_id, :bundle_id]
      t.index [:bundle_id, :bundle_access_id]
    end
  end
end