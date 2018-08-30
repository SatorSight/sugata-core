desc 'Fill titles in articles'
task :fill_titles => :environment do
  FileHelper::upload_lock_enable
  Article.all.each{|a| a.set_title_from_html}
  FileHelper::upload_lock_disable
end