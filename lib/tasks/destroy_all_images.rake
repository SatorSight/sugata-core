desc 'CAUTION!'
task :destroy_all_images => :environment do
  Image.all.destroy_all
end