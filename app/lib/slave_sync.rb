module SlaveSync
  SHARED_CONTENT_CLASSES = [
      :Operator,
      :RealmSetting,
      :RealmLocale,
      # :User,
      # :UserData,
      # :UserHistory,
      :Period,
      :Bundle,
      :BundleAccess,
      :BundleAccessesBundle,
      :Journal,
      :Listing,
      :Issue,
      :Article,
      :Like,
      :Comment,
      :Image,
      :Logo,
      :AdditionalImage,
      :SmallPreviewImage,
      :BigPreviewImage
  ]

  def self.get_changed_data(params)
    return {} if FileHelper.upload_locked

    last_sync_time = SlaveSyncRequest.where(realm_id: params[:realm_id]).last.updated_at
    data = {}
    SHARED_CONTENT_CLASSES.each do |klass|
      model = klass.to_s.constantize
      #join tables do not have timestamps
      if model.column_names.include? 'updated_at'
        results = model.where('updated_at > ?', last_sync_time).to_a
      else
        results = model.all
      end

      data[klass] = results
    end

    realm_id = params[:realm_id]
    SlaveSyncRequest.new(realm_id: realm_id).save

    data
  end

  def self.get_all_ids
    all_ids = {}
    SHARED_CONTENT_CLASSES.each do |klass|
      model = klass.to_s.constantize
      if model.column_names.include? 'id'
        ids = model.pluck(:id)
        all_ids[klass] = ids
      end
    end

    all_ids
  end

  def self.get_changed_images(ids_json)
    ids = JSON.parse(ids_json)
    images = Image.where(id: ids).to_a

    file_path = '/public/temp/images_for_send.zip'

    FileHelper::create_zip_with_images(file_path, images)
  end
end