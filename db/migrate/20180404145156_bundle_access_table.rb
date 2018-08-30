class BundleAccessTable < ActiveRecord::Migration[5.1]
  def change
    create_table :bundle_accesses do |t|
      t.string :name
      t.string :redirect_url

      t.timestamps
    end

    add_reference :bundle_accesses, :operator, index: true
    add_reference :bundle_accesses, :bundle, index: true
  end
end