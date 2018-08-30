require 'test_helper'

class LikeTest < ActiveSupport::TestCase
  context 'has all associations' do
    should belong_to(:user)
    should belong_to(:article)
  end

  context 'validators operational' do
    should validate_presence_of :user
    should validate_presence_of :article
  end

  test 'can not be liked twice' do
    throw 'Users or articles do not exist' unless User.last and Article.last
    params = { user: User.last, article: Article.last }
    assert Like.new(params).save
    assert_not Like.new(params).valid?
  end
end