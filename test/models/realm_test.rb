require 'test_helper'

class RealmTest < ActiveSupport::TestCase
  context 'has all associations' do
    should have_many(:realm_settings)
    should have_many(:realm_locales)
    should have_many(:realm_auth_types)
    should have_many(:realm_payment_types)
    should have_many(:accounts)
    should have_many(:bundles)
  end

  context 'validators operational' do
    # should validate_uniqueness_of :secret_key
    should validate_uniqueness_of :name
  end

  test 'secret key is unique' do
    Realm.new(secret_key: '123').save
    assert_not Realm.new(secret_key: '123').valid?,
               :'Created realms with equal secret keys'
  end

  test 'saves without name' do
    assert_not Realm.new.save
  end
end