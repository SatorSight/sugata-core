desc 'Fill flag in articles'
task :fill_show_in_lists => :environment do
  FileHelper::upload_lock_enable
  Article.all.each do |article|
    if article.is_correct
      article.show_in_lists = true
      article.save
    end
  end
  FileHelper::upload_lock_disable
end