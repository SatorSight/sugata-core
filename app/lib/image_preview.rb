module ImagePreview
  def get_for_issue(issue_id)
    issue = Issue.find(issue_id)
    previews = issue.articles.map do |article|
      preview = self.where(
          parent_type: Article.to_s,
          parent_id: article.id
      ).first

      preview ? {
          article_id: article.id,
          image: preview
      } : nil
    end
    previews.compact
  end
end