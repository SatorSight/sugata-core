class AddPaymentTypesColumns < ActiveRecord::Migration[5.1]
  def change
    add_column :realm_payment_types, :name, :string
  end
end
