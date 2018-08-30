class ContentController < ApplicationController
  def add
    @props = {
        role: current_account.highest_role,
        action: :content_add,
        bundles: Bundle.all,
        data: Issue.find(params[:id]),
        articles: Issue.find(params[:id]).articles,
        id: params[:id],
        images: Image::get_images_for_issue(params[:id]),
        small_previews: SmallPreviewImage::get_for_issue(params[:id]),
        big_previews: BigPreviewImage::get_for_issue(params[:id])
    }

    # pp @props[:images]
    # exit
  end

  def get_article_desktop_html
    render json: {result: :ok, data: Article.find(params[:id]).desktop_html}
  end

  def destroy_article
    Article.find(params[:id]).destroy
    # Article.find(params[:id]).set_inactive
    render json: {result: :ok, data: []}
  end
end