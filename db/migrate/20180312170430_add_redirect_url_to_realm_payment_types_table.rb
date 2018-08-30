class AddRedirectUrlToRealmPaymentTypesTable < ActiveRecord::Migration[5.1]
  def change
    add_column :realm_payment_types, :redirect_url, :string
  end
end
