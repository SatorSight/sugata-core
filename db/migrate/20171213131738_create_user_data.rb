class CreateUserData < ActiveRecord::Migration[5.1]
  def change
    create_table :user_data do |t|
    end
    add_reference :user_data, :user, index: true
  end
end
