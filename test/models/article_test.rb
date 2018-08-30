require 'test_helper'

class ArticleTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:issue)
    should have_many :likes
    should have_many :comments
    should have_and_belong_to_many(:tags)
  end

  context 'validators operational' do
    should validate_presence_of :title
    should validate_presence_of :html
    should validate_presence_of :page_number
    should validate_presence_of :issue
  end
end