require 'test_helper'

class RealmPaymentTypeTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:realm)
  end

  context 'validators operational' do
    should validate_presence_of :realm
  end
end