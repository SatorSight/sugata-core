class CreateLikes < ActiveRecord::Migration[5.1]
  def change
    create_table :likes do |t|
      t.timestamps
    end
    add_reference :likes, :user, foreign_key: true
    add_reference :likes, :article, foreign_key: true
  end
end
