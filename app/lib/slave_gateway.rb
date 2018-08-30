module SlaveGateway

  def self.get_json_data_for(realm)
    bundles = realm.bundles
    journals = realm.journals
    issues = realm.issues
    articles = Issue::get_issues_articles(issues)
    likes = Like::get_likes_for_articles(articles)
    comments = Comment::get_likes_for_articles(articles)
    settings = realm.realm_settings
    users = realm.users
    user_data = UserData::get_data_for_users(users)
    user_history = UserHistory::get_history_for_users(users)
    operators = realm.operators
    locale = realm.realm_locales
    periods = Period.all
    listings = Issue::get_issues_listings(issues)

    data = {
        bundles: bundles,
        journals: journals,
        issues: issues,
        articles: articles,
        likes: likes,
        comments: comments,
        settings: settings,
        users: users,
        user_data: user_data,
        user_history: user_history,
        operators: operators,
        locale: locale,
        periods: periods,
        listings: listings
    }

    image_ids = self::get_images_for data
    data[:images] = Image.where(id: image_ids)

    data
  end

  def self.get_images_for_transfer(realm)
    bundle_images = self::get_images_from_objects(realm.bundles)
    journal_images = self::get_images_from_objects(realm.journals)
    issue_images = self::get_images_from_objects(realm.issues)

    images = bundle_images + journal_images + issue_images

    listings = Issue::get_issues_listings(realm.issues)
    listings.each do |listing|
      content = JSON.parse listing.content
      content.each do |c|
        images.push c['image'] unless c['image'].blank?
      end
    end

    images
  end

  private

  def self.get_images_from_objects(objects)
    objects.map{|o| o.image_id.blank? ? nil : o.image.path}.compact
  end

  def self.get_images_for(data)
    images_ids = []
    data.each do |key, entity|
      entity.each do |object|
        if object.respond_to? :image_id
          unless object.image_id.nil?
            images_ids.push object.image_id
          end
        end
      end
    end
    Image.where(id: images_ids)
  end
end