class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :article

  validates_presence_of :article
  validates_presence_of :user

  def self.get_likes_for_articles(articles)
    ids = articles.map{|a| a.id}
    self.where(article_id: ids)
  end
end