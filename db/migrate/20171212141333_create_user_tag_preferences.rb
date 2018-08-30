class CreateUserTagPreferences < ActiveRecord::Migration[5.1]
  def change
    create_table :user_tag_preferences do |t|
      t.integer :value
    end
    add_reference :user_tag_preferences, :user, foreign_key: true
    add_reference :user_tag_preferences, :tag, foreign_key: true
  end
end
