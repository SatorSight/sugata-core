class CreateJoinTableAccountRole < ActiveRecord::Migration[5.1]
  def change
    create_join_table :accounts, :roles do |t|
      t.index [:account_id, :role_id]
      t.index [:role_id, :account_id]
    end
  end
end
