module ImportHelper
  class ImportHelper
    CURRENT_REALM_ID = 1

    IMPORT_DIR = '/tmp/export'.freeze

    ISSUES_CONTENT_DIR = IMPORT_DIR + '/issues'.freeze
    ISSUES_HTML_DIR = ISSUES_CONTENT_DIR + '/html'.freeze
    ISSUES_IMAGES_DIR = ISSUES_CONTENT_DIR + '/images'.freeze

    RESTRUCTED_DIR = ISSUES_CONTENT_DIR + '/restructured'

    IMAGES_DIR = IMPORT_DIR + '/images'.freeze

    BUNDLES_FILE = IMPORT_DIR + '/bundles.json'.freeze
    JOURNALS_FILE = IMPORT_DIR + '/journals.json'.freeze
    ISSUES_FILE = IMPORT_DIR + '/issues.json'.freeze
    LISTINGS_FILE = IMPORT_DIR + '/listings.json'.freeze
    ARTICLES_FILE = IMPORT_DIR + '/articles.json'.freeze

    def initialize
      @issue_id_indent = 0
      @journal_id_indent = 0
      @bundle_id_indent = 0
    end

    def run

      # pp '----------'
      # pp 'sure?'
      # pp '----------'
      # exit

      # restructurize
      #load_bundles
      #load_journals
      #load_issues
      #load_articles
      #load_listings
      set_issues_titles
      fix_postgres
    end

    def get_items(file)
      json_file = File.open(file)
      json = json_file.read

      items = JSON.parse json

      json_file.close
      items
    end

    def set_issues_titles
      @issue_id_indent = 0
      listings = Listing.all
      listings.each do |listing|
        data = JSON.parse(listing.content)

        data.each do |p|
          page_number = p['page']

          article = Article.where(
              issue_id: listing.issue_id + @issue_id_indent,
              page_number: page_number
          ).take

          if article
            if article.title.blank?
              article.title = p['text']
              article.save
            end
          end
        end
      end
    end

    def load_listings
      Listing.destroy_all

      listings = get_items(LISTINGS_FILE)
      listings.each do |listing|
        listing_images = []

        data = listing['data']
        data.each do |listing_element|
          image = listing_element['image']
          unless image.blank?
            i = Image.create_image(image)
            listing_images.push i
            listing_element['image'] = i.path
          end
        end

        l = Listing.new(
          content: data.to_json,
          issue: Issue.find(listing['issue_id'] + @issue_id_indent)
        )
        l.save

        listing_images.each do |image|
          image.parent = l
          image.content_key = :listing
          image.parent_type = Listing.to_s
          image.save
        end
      end
    end

    def load_bundles
      bundles = get_items(BUNDLES_FILE)
      Bundle.where(realm_id: CURRENT_REALM_ID).destroy_all
      @bundle_id_indent = next_id(Bundle)

      bundles.each do |bundle|
        b = Bundle.new(
            id: bundle['id'] + @bundle_id_indent,
            realm: Realm.find(CURRENT_REALM_ID),
            name: bundle['name']
        )
        b.save

        unless bundle['image'].blank?
          Image::attach_image(b, bundle['image'])
        end
      end
    end

    def load_journals
      journals = get_items(JOURNALS_FILE)
      Journal.destroy_all
      @journal_id_indent = next_id(Journal)

      journals.each do |journal|
        period_id = journal == 'Еженедельный' ? 2 : 1
        period = Period.find(period_id)

        j = Journal.new(
            id: journal['id'] + @journal_id_indent,
            bundle: Bundle.find(journal['bundle_id'] + @bundle_id_indent),
            name: journal['name'],
            description: journal['description'],
            url_prefix: journal['url'],
            order: journal['order'],
            archived: journal['archived'],
            period: period
        )
        j.save

        unless journal['image'].blank?
          Image::attach_image(j, journal['image'])
        end
      end
    end

    def load_issues
      issues = get_items(ISSUES_FILE)
      Issue.destroy_all
      @issue_id_indent = next_id(Issue)

      issues.each do |issue|
        i = Issue.new(
            id: issue['id'] + @issue_id_indent,
            number: issue['number'],
            listing_page: issue['listing'],
            double_month: issue['double_month'],
            double_number: issue['double_number'],
            journal_id: issue['category_id'] + @journal_id_indent,
            created_at: issue['added']['date'],
            updated_at: issue['added']['date'],
            content_date: issue['date']['date']
        )
        i.save

        unless issue['image'].blank?
          Image::attach_image(i, issue['image'])
        end
      end
    end

    def load_articles
      # Article.destroy_all
      issues = get_items(ARTICLES_FILE)
      issues.each do |i|
        issue = Issue.find(i['issue_id'])
        unless issue.articles.any?
          issue_html_dir = RESTRUCTED_DIR + '/' + i['path'] + '/html'

          html_files = Dir.glob(issue_html_dir + '/*.html')
          html_files.sort!
          page_counter = 1
          html_files.each do |html_file_name|
            html_file_name = File.basename(html_file_name)
            html_path = issue_html_dir + '/' + html_file_name
            html_file = File.open(html_path)
            html = html_file.read rescue ''
            html_file.close

            if html.encoding.to_s.eql? 'UTF-8'
              src_replacements = []
              src_occurences = FileHelper::get_src_array_from_html(html)

              images = []
              src_occurences.each do |src|
                src = src.first
                path = src.sub('/uploaded_images', RESTRUCTED_DIR)
                unless path.include? 'base64'
                  image = Image::create_image(path)
                  if image
                    images.push image

                    replacement = {
                        from: src,
                        to: image.path
                    }

                    src_replacements.push replacement
                  end
                end
              end

              src_replacements.each do |replacement|
                html.gsub!(replacement[:from], replacement[:to])
              end

              af = ArticleFactory.new
              af.html = html
              af.page_number = page_counter
              af.issue = issue
              article = af.create

              images.each do |image|
                image.parent = article
                image.content_key = :article
                image.parent_type = Article.to_s
                image.page_number = page_counter
                image.save
              end
            end
            page_counter += 1
          end
        end
      end
    end

    # postgres pk sequence may be corrupted somehow
    def fix_postgres
      ActiveRecord::Base.connection.tables.each { |t| ActiveRecord::Base.connection.reset_pk_sequence!(t) }
    end

    # rebuild file dir structure
    def restructurize
      `python app/lib/converter.py`
    end

    def next_id(klass)
      klass.maximum(:id) || 0
    end
  end
end
