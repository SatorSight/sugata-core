class CreateSlaveSyncRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :slave_sync_requests do |t|
      t.integer :realm_id

      t.timestamps
    end
  end
end
