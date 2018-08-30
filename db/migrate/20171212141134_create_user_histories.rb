class CreateUserHistories < ActiveRecord::Migration[5.1]
  def change
    create_table :user_histories do |t|
      #todo history
    end
    add_reference :user_histories, :user, foreign_key: true
  end
end
