desc 'for testing things'
task :temp_task => :environment do

  counter = 0

  Issue.all.each do |issue|
    issue.articles.each do |article|
      if article.html.include? '<h1>Содержание</h1>' or article.title.include? 'Содержание'
        counter += 1
        # pp 'here'
        # pp article.id
        # exit
      end
    end
  end


  pp counter
  pp 'done'
  exit


  # include ArticleFactory

  # a = ArticleFactory.new

  # issues_no_covers = []
  #
  # is = Issue.all
  # is.each do |i|
  #   issue_has_cover = false
  #   articles = i.articles
  #   articles.each do |a|
  #     issue_has_cover = true if a.cover
  #   end
  #   issues_no_covers.push i.id unless issue_has_cover
  # end
  #
  # pp issues_no_covers
  # exit


  #
  # crud_models = ActiveRecord::Base.connection.tables.map do |model|
  #   m = model.classify.constantize rescue nil
  #   m.to_s.tableize if m and m.included_modules.include?(CrudModel)
  # end
  # crud_models.compact!
  # pp crud_models




  #
  #
  #
  # pp crud_models
  #
  # exit
  #
  #
  #
  # pp ActiveRecord::Base.send :subclasses
  #
  # exit
  #
  # crud_models = []
  #
  # Module.constants.select do |constant_name|
  #   constant = eval constant_name.to_s
  #   if not constant.nil? and constant.is_a? Class and constant.superclass == ActiveRecord::Base
  #     crud_models.push constant
  #   end
  # end
  #
  # pp crud_models


  #
  # pdf = Magick::Image.read('tmp/jpegify/temp42373.pdf'){
  #   self.units = Magick::PixelsPerInchResolution
  #   self.density = '200'
  # }.first
  # pdf.write(Rails.root.to_s + '/tmp/ttt/8.jpg')
  #   self.units = Magick::PixelsPerInchResolution
  #   self.density = "600"
  #   self.quality = 100
  # }
  #
  # i = 0



  # pdf.each do |thing|
  #   thing.write(Rails.root.to_s + '/tmp/ttt/2.jpg'){
  #     # self.quality = 100
  #     # self.units = Magick::PixelsPerInchResolution
  #     # self.density = '600'
  #   }
  #   pp thing
  # end

  # pdf.write(Rails.root.to_s + '/tmp/ttt/1.jpg'){self.quality = 100}


  # def remove_excess_styles(path)
  #   html_path = path + '/html_cleaned/source.html'
  #   html_file = File.open(html_path)
  #   html = html_file.read
  #   html_file.close
  #
  #   html.gsub!(/<style.*?sidebar.*?<\/style>/im, '')
  #   html.gsub!(/<style.*?@keyframe.*?<\/style>/im, '')
  #   html.gsub!(/@media print.*?;}.}/im, '')
  #   html.sub!('<!-- Created by pdf2htmlEX (https://github.com/coolwanglu/pdf2htmlex) -->', '')
  #
  #   File.write(html_path, html)
  # end
  #
  # remove_excess_styles('tmp/pdf/decomposed_16/27')
end