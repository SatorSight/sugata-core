class AddPaymentTypeToOperator < ActiveRecord::Migration[5.1]
  def change

    add_reference :operators, :realm_payment_type, index: true

  end
end
