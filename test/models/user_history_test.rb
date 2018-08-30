require 'test_helper'

class UserHistoryTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:user)
  end
end