require 'test_helper'

class ImageTest < ActiveSupport::TestCase
  context 'validators operational' do
    should validate_presence_of :extension
    should validate_presence_of :content_key
    should validate_presence_of :path

    should validate_uniqueness_of :path
  end

  #todo maybe make something with polymorphic relation

  test 'image exists by given path' do
    #todo make this test
  end
end