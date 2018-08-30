class AddUsersBundleRelation < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :bundle, index: true
  end
end
