class Issue < ApplicationRecord
  include CrudModel

  belongs_to :journal
  # belongs_to :period
  has_one :image, as: :parent
  has_many :articles, dependent: :destroy
  has_many :listings, dependent: :destroy

  validates_presence_of :number
  # validates_presence_of :listing_page
  # validates_presence_of :image
  validates_presence_of :journal
  # validates_presence_of :period

  def self.get_issues_articles(issues)
    ids = issues.map{|i| i['id']}
    # ids.map{|id| JSON.parse(Article.where(id: id).to_json)}.compact
    articles = []
    ids.each do |id|

      sql = 'select id from articles where issue_id = ' + id.to_s
      ar = ActiveRecord::Base.connection.execute(sql).values.flatten

      # ar = Article.where(issue_id: id).to_a
      ar.each do |a|
        # articles.push JSON.parse(a.to_json)
        q = Article.find(a)
        articles.push JSON.parse(q.to_json) if q
        q = nil
      end
      ar = nil
      # articles.push JSON.parse(Article.where(issue_id: id).take.to_json) if Article.exists?(issue_id: id)
    end
    articles
    # Article.where(issue_id: ids)
  end

  def self.get_issues_listings(issues)
    ids = issues.map{|i| i['id']}
    # ids.map{|id| JSON.parse(Article.where(id: id).to_json)}.compact
    listings = []
    ids.each do |id|

      sql = 'select id from listings where issue_id = ' + id.to_s
      ar = ActiveRecord::Base.connection.execute(sql).values.flatten

      # ar = Article.where(issue_id: id).to_a
      ar.each do |a|
        # articles.push JSON.parse(a.to_json)
        q = Listing.find(a)
        listings.push JSON.parse(q.to_json) if q
        q = nil
      end
      ar = nil
      # articles.push JSON.parse(Article.where(issue_id: id).take.to_json) if Article.exists?(issue_id: id)
    end
    listings



    # Article.where(issue_id: ids)

    # ids = issues.map{|i| i['id']}

    # listings = []
    # ids.each do |id|
    #   listings.push JSON.parse(Listing.where(issue_id: id).take.to_json) if Listing.exists?(issue_id: id)
    # end
    # listings

    # ids = issues.map{|i| i['id']}
    # # ids.map{|id| JSON.parse(Article.where(id: id).to_json)}.compact
    # listings = []
    # ids.each do |id|
    #   ar = Listing.where(issue_id: id).to_a
    #   ar.each do |a|
    #     listings.push JSON.parse(a.to_json)
    #   end
    #   ar = nil
    #   # articles.push JSON.parse(Article.where(issue_id: id).take.to_json) if Article.exists?(issue_id: id)
    # end
    # listings

    # ids.map{|id| JSON.parse(Listing.where(id: id).to_json)}.compact
    # Listing.where(issue_id: ids)
  end

  def self.save_articles_from_pdf(contents, issue_id)
    contents.each do |article|

      upload_path = 'public/uploaded_images/'

      new_bg_path = nil
      #todo move to Image model
      if article[:bg_image]
        new_bg_path = upload_path + Image::get_random_free_name(upload_path)
        FileUtils.cp article[:bg_image], new_bg_path if File.exists?(article[:bg_image])
      end

      af = ArticleFactory.new
      af.page_number = article[:number]
      af.html = article[:text]
      af.issue = Issue.find(issue_id)
      af.desktop_html = article[:html],
      af.desktop_bg = new_bg_path.sub('public', ''),
      article = af.create

      if new_bg_path
        Image.new(
            extension: File.extname(new_bg_path).sub('.', '').sub('/public', ''),
            content_key: :article_bg,
            path: new_bg_path.sub('public', ''),
            page_number: article[:number],
            parent_id: article.id,
            parent_type: Article.to_s,
        ).save
      end

      if article[:images]
        unless article[:images].empty?
          article[:images].each do |image_path|
            new_image_path = upload_path + Image::get_random_free_name(upload_path)

            FileUtils.cp image_path, new_image_path

            i = Image.new(
              extension: File.extname(new_image_path).sub('.', '').sub('/public', ''),
              content_key: :article,
              path: new_image_path.sub('public', ''),
              page_number: article[:number],
              parent_id: article.id,
              parent_type: Article.to_s,
            )

            i.save
          end
        end
      end
    end
  end

  def self.get_last(limit)
    Issue::includes(:image, :journal).order(id: :desc).limit(limit)
  end

  def self.serialize_for_dashboard(issues)
    issues.map do |issue|
      obj = {}
      obj[:id] = issue.id
      obj[:image_path] = issue.image.path if issue.image
      obj[:content_date] = issue.content_date
      obj[:journal_name] = issue.journal.name
      obj[:number] = issue.number

      obj
    end
  end


end