require 'test_helper'

class BundleTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:realm)
    should have_and_belong_to_many(:users)
    should have_one(:image)
    should have_many(:journals)
  end

  context 'validators operational' do
    should validate_presence_of :realm
    should validate_presence_of :name

    should validate_uniqueness_of :name
  end
end