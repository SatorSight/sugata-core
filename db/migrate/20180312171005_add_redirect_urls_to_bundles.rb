class AddRedirectUrlsToBundles < ActiveRecord::Migration[5.1]
  def change
    add_column :bundles, :mobile_redirect_url, :string
    add_column :bundles, :card_redirect_url, :string
  end
end
