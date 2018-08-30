desc 'Import all data from old version'
task :import_contents => :environment do
  import_process = ImportHelper::ImportHelper.new
  import_process.run
end