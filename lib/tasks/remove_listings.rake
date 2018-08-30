desc 'remove articles with listings'
task :remove_listings => :environment do
  Issue.all.each do |issue|
    issue.articles.each do |article|
      if article.html.include? '<h1>Содержание</h1>' or article.title.include? 'Содержание'
        article.destroy
      end
    end
  end
end