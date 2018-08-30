class ArticlesController < ApplicationController
  def change_article_chosen
    Article.find(params[:article_id]).change_article_chosen params[:on]
    render json: {result: :ok}
  end

  def change_article_cover
    Article.find(params[:article_id]).change_article_cover params[:on]
    render json: {result: :ok}
  end

  def change_article_linked
    Article.find(params[:article_id]).change_article_linked params[:on]
    render json: {result: :ok}
  end

  def change_article_show_in_lists
    Article.find(params[:article_id]).change_article_show_in_lists params[:on]
    render json: {result: :ok}
  end

  def make_article_html_jpeg
    par = JSON.parse params[:json]
    article_id = par['article_id']

    article = Article.find(article_id)
    image = article.make_it_jpeg(request)
    # pp image

    render json: {result: :ok, data: {image: image.as_json, html: article.html}}
  end
end
