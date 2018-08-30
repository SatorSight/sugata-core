desc 'set updated_at now for all shared entities'
task :set_all_shared_updated_now => :environment do
  SlaveSync::SHARED_CONTENT_CLASSES.each do |klass|
    model = klass.to_s.constantize
    model.all.update_all(updated_at: DateTime.now)
  end
end