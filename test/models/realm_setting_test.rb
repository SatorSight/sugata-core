require 'test_helper'

class RealmSettingTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to :realm
    should validate_presence_of :realm
  end
end