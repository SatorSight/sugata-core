class ArticleFactory
  attr_writer :title,
              :html,
              :page_number,
              :issue,
              :desktop_html,
              :desktop_bg,

  def create
    false unless @html
    false unless @page_number
    false unless @issue

    article = Article.new(
      title: @title || '',
      html: @html,
      page_number: @page_number,
      issue: @issue
    )

    article.desktop_html = @desktop_html if @desktop_html
    article.desktop_bg = @desktop_html if @desktop_bg
    article.set_title_from_html
    article.show_in_lists = true if article.is_correct
    article.save

    article
  end
end
