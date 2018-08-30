class AddOperatorReferenceToBundle < ActiveRecord::Migration[5.1]
  def change
    add_reference :operators, :realm, index: :true
  end
end
