class IssuesController < ApplicationController
  include CrudController
  include ArchiveUploaderHelper
  include PdfUploaderHelper

  #todo to model
  def save_articles
    p = JSON.parse(params[:json])
    p['data'].each do |article|
      a = Article.where(issue_id: article['issue_id'], page_number: article['page_number']).take
      if a
        a.title = article['title']
        a.html =  article['html']
        a.page_number = article['page_number']
        a.issue = Issue.find article['issue_id']
      else
        af = ArticleFactory.new
        af.title = article['title']
        af.html = article['html']
        af.page_number = article['page_number']
        af.issue = Issue.find(article['issue_id'])
        a = af.create
      end
      render json: {result: :error, message: a.errors.messages} and return unless a.save

      # saving images
      if article['images']
        unless article['images'].empty?
          article['images'].each do |image|
            image = Image.new(image)
            image.parent_id = a.id
            image.save
          end
        end
      end

    end
    render json: {result: :ok}
  end

  def load_pdf
    FileHelper::upload_lock_enable

    issue_id = params[:issue_id]
    uploader = PdfUploader.new
    issue = Issue.includes(:articles).find(issue_id)

    issue.articles.includes(:images).destroy_all

    pdf_file_input = params[:pdf]
    pdf = uploader.save_file_to_temp pdf_file_input
    contents = uploader.decompose pdf

    Issue::save_articles_from_pdf(contents, issue_id)

    # issue.articles.each{|article| uploader.replace_html_with_new_bg(article)}
    Article.where(issue_id: params[:issue_id]).each{|article|
      uploader.replace_html_with_new_bg(article)
      unless article.text_is_ok
        article.make_it_jpeg(request)
      end

    }
    uploader.clean

    FileHelper::upload_lock_disable

    render json: {result: :ok}
  end

  #todo move method body in model or lib
  def load_archive

    FileHelper::upload_lock_enable

    issue_id = params[:issue_id]
    #todo remove! wtf is this?
    page_number = params[:page_number]
    archive = params[:archive]

    Image.where(content_key: :issue, parent_id: issue_id, parent_type: Issue.to_s).destroy_all

    archive_path = File.join('tmp', archive.original_filename)
    File.open(archive_path, 'wb') {|f| f.write(archive.read)}
    images_array = []

    require 'zip'

    Zip::File.open(archive_path) do |zipfile|
      # collect images and write or take them
      zipfile.each do |file|
        if file.name =~ /[^\s]+(\.(?i)(jpg|png|gif|bmp))$/ # is image

          image = Image::create_image_from_zip(file)
          folder = get_folder(file.name)

          image_data = {
              original_image_name: file.name,
              image: image,
              folder: folder
          }

          images_array.push image_data


        end
      end

      # take html files and replace image paths with uploaded images
      zipfile.each do |file|
        if file.name =~ /[^\s]+(\.(?i)html)$/ # is html
          folder = get_folder(file.name)

          html_contents = file.get_input_stream.read
          src_occurences = html_contents.scan /src="(.*?)"/i

          html_images = []

          src_occurences.each do |src|
            src = src.first

            img_object = find_image_object(src, images_array, folder)
            html_contents.sub! src, img_object[:image].path if img_object
            html_images.push img_object
          end

          page_number = Integer(get_folder(file.name))
          article_descriptor = {
              issue: Issue.find(issue_id),
              page_number: page_number
          }

          Article.where(article_descriptor).take.destroy if Article.exists?(article_descriptor)

          af = ArticleFactory.new
          af.html = html_contents
          af.page_number = page_number
          af.issue = Issue.find(issue_id)
          article = af.create

          # remove listing page
          if article.is_listing_page
            article.destroy
            next
          end

          # article = Article.new(
          #     title: '',
          #     html: html_contents,
          #     page_number: page_number,
          #     issue: Issue.find(issue_id)
          # )

          # article.show_in_lists = true if article.is_correct
          # article.save
          # article.set_title_from_html

          if article
            html_images.each do |image_obj|
              if image_obj
                image = image_obj[:image]
                image.parent_id = article.id
                image.parent_type = Article.to_s
                image.content_key = Article.to_s.downcase.to_sym
                image.page_number = page_number
                image.save
              end

            end
          end

        end
      end
    end

    File.delete(archive_path) if File.exist?(archive_path)

    FileHelper::upload_lock_disable

    render json: {result: :ok}
  end
end