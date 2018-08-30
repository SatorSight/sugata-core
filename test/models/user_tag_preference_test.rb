require 'test_helper'

class UserTagPreferenceTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:user)
    should belong_to(:tag)
  end

  context 'validators operational' do
    should validate_presence_of :user
    should validate_presence_of :tag
    should validate_presence_of :value
  end
end