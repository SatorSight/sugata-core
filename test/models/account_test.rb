require 'test_helper'

class AccountTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:realm)
    should have_and_belong_to_many(:roles)
  end

  context 'validators operational' do
    should validate_presence_of :realm
    should validate_presence_of :login
    should validate_presence_of :password
  end
end