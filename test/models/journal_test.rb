require 'test_helper'

class JournalTest < ActiveSupport::TestCase
  context 'has all associations' do
    should have_one(:image)
    should belong_to(:period)
    should belong_to(:bundle)
  end

  context 'validators operational' do
    should validate_presence_of :name
    should validate_presence_of :url_prefix
    should validate_presence_of :image
    should validate_presence_of :period
    should validate_presence_of :bundle
  end
end