class CreateAccounts < ActiveRecord::Migration[5.1]
  def change
    create_table :accounts do |t|
      t.string :login
      t.string :password

      t.timestamps
    end
    add_reference :accounts, :realm, foreign_key: true
  end
end
