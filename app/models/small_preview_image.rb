class SmallPreviewImage < ApplicationRecord
  include FileCrud
  include ImageModel
  extend ImagePreview
end