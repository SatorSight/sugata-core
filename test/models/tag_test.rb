require 'test_helper'

class TagTest < ActiveSupport::TestCase
  context 'has all associations' do
    should have_one(:image)
    should have_and_belong_to_many(:articles)
    should have_many(:user_tag_preferences)
  end

  context 'validators operational' do
    should validate_presence_of :name
    should validate_presence_of :key

    should validate_uniqueness_of :name
    should validate_uniqueness_of :key
  end
end