class CreateBundles < ActiveRecord::Migration[5.1]
  def change
    create_table :bundles do |t|
      t.string :name
    end
    add_reference :bundles, :realm, foreign_key: true
  end
end
