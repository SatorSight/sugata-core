require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:user)
    should belong_to(:article)
  end

  context 'validators operational' do
    should validate_presence_of :user
    should validate_presence_of :article
  end
end
