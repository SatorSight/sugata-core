class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :msisdn
      t.string :email
      t.string :login
      t.string :password

      t.timestamps
    end
    add_reference :users, :operator, foreign_key: true
  end
end
