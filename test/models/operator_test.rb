require 'test_helper'

class OperatorTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:realm)
  end

  context 'validators operational' do
    should validate_presence_of :realm
    should validate_presence_of :name
    should validate_presence_of :tech_name
  end
end
