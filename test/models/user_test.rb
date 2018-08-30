require 'test_helper'

class UserTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:operator)
    should have_and_belong_to_many(:bundles)
    should have_many(:user_tag_preferences)
    should have_many(:likes)
    should have_many(:comments)
  end

  context 'validators operational' do
    should validate_presence_of :operator
  end
end
