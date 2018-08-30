class RealmLocale < ApplicationRecord
  belongs_to :realm
  validates_presence_of :locale_file_path
  validates_presence_of :realm
end