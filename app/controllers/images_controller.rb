class ImagesController < ApplicationController
  include ImageCrud

  def load
    image_array = []
    images = params
    images.each do |i, image|
      if i.include? 'image'
        path = Image::write_file image
        img = Image.new
        img.extension = 'jpg'
        img.path = path
        img.parent_id = nil
        img.parent_type = :article.to_s.classify
        img.content_key = :article
        img.page_number = params[:page_number]

        image_array.push img
      end
    end

    render :json => {result: :ok, images: image_array}
  end

  def get_for_issue
    id = params[:id]
    image = Image.where(content_key: :issue, parent_id: id)
    render :json => {result: :ok, data: image}
  end

  def upload_small_preview
    image = Image::create_preview(SmallPreviewImage, params)
    render :json => {result: :ok, data: image}
  end

  def upload_big_preview
    image = Image::create_preview(BigPreviewImage, params)
    render :json => {result: :ok, data: image}
  end
end