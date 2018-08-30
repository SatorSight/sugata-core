require 'test_helper'

class IssueTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:journal)
    should have_one(:image)
    should have_many(:articles)
  end

  context 'validators operational' do
    should validate_presence_of :number
    should validate_presence_of :listing_page
    should validate_presence_of :image
    should validate_presence_of :journal
  end
end