class CreateUserBundleJoinTable < ActiveRecord::Migration[5.1]
  def change
    create_join_table :users, :bundles do |t|
      t.index [:user_id, :bundle_id]
      t.index [:bundle_id, :user_id]
    end
  end
end
