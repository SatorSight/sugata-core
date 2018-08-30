class BigPreviewImage < ApplicationRecord
  include FileCrud
  include ImageModel
  extend ImagePreview
end