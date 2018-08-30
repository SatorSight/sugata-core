module Auth
  class AuthService
    AUTH_URL = 'https://bridge-api.buongiorno.com/v1/oauth2/token'
    SUBSCRIPTION_INFO_URL = 'https://bridge-api.buongiorno.com/v1/res/ru/subscriptionInfo'
    GRANT_TYPE = 'client_credentials'
    CLIENT_ID = 'da3e80c5_9452334b6b47864ff57b3f4f1a1f245a'
    CLIENT_SECRET = 'e467b0c3_173509dc85cd0c5c6d77ec33ff2b6b08'
    CONTENT_JSON_TYPE = 'application/json'
    CONTENT_FORM_TYPE = 'application/x-www-form-urlencoded'

    MOBILE_PAYMENT_TYPE = 'Mobile'
    CARD_PAYMENT_TYPE = 'Card'

    def auth_actions(params)
      # realm = Realm.find(params[:realm_id])
      operator = Operator.find(params[:operator_id])
      bundle = Bundle.find(params[:bundle_id]) rescue nil

      bundle_access = find_bundle_access(operator, bundle)

      {
          action_type: :redirect,
          link: bundle_access.redirect_url
      }
    end

    def msisdn_info(params)
      set_access_token

      realm = Realm.find(params[:realm_id])
      msisdn = params[:msisdn]
      country_code_setting = realm.realm_settings.where(setting: :COUNTRY_CODE).take
      country_code = country_code_setting.value
      # bundle = Bundle.find(params[:bundle_id]) rescue nil
      # operator = Operator.find(params[:operator_id])
      # bundle_access = find_bundle_access(operator, bundle)

      bundle_accesses = BundleAccess.all
      results = []

      bundle_accesses.each do |b_a|
        service_id = b_a.service_id
        post_fields = {
            serviceId: service_id,
            country: country_code,
            userId: msisdn,
        }

        res = brute_operator(post_fields, b_a)
        results.push res if res
      end

      user_object = nil

      if results.any?
        user_object = {}
        user_object[:msisdn] = msisdn
        user_object[:bundle_accesses] = []
        results.each do |r|
          user_object[:operator] = r[:operator]
          user_object[:bundle_accesses].push r[:bundle_access].id
        end
      end

      user_object
    end

    def brute_operator(post_fields, bundle_access)
      Operator.all.each do |op|
        unless op.name == 'unknown'
          post_fields[:operator] = op.tech_name
          post_fields = post_fields.stringify_keys
          res = ask_bridge(post_fields, SUBSCRIPTION_INFO_URL, true, true)

          if res and res['status'] == 1.to_s
            return {
                operator: op,
                bundle_access: bundle_access
            }
          end
          return nil
        end
      end
    end

    def bridge_token_info(params)
      set_access_token

      realm = Realm.find(params[:realm_id])
      bridge_token = params[:bridge_token]
      country_code_setting = realm.realm_settings.where(setting: :COUNTRY_CODE).take
      country_code = country_code_setting.value
      bundle = Bundle.find(params[:bundle_id]) rescue nil
      operator = Operator.find(params[:operator_id])
      # operator = Operator.find(2)

      msisdn = nil
      bundle_accesses = find_bundle_accesses(operator, bundle)
      bundle_accesses_active = []
      bundle_accesses.each do |b_a|
        service_id = b_a.service_id

        post_fields = {
            serviceId: service_id,
            country: country_code,
            bridge_token: bridge_token
        }.stringify_keys

        result = ask_bridge(post_fields, SUBSCRIPTION_INFO_URL, true, true)
        if result.is_a? Hash and result['status']
          if result['status'] == 1.to_s
            bundle_accesses_active.push b_a
            msisdn = result['userId']
            pp result['userId']
          end
        end
      end

      bundle_accesses_ids = bundle_accesses_active.map{|b_a| b_a.id}.compact

      {
          bundle_accesses_ids: bundle_accesses_ids,
          msisdn: msisdn
      }
    end

    private

    def find_bundle_access(operator, bundle = nil)
      bundle_accesses = BundleAccess.where(operator: operator)
      bundle_access = nil

      if bundle
        bundle_accesses.each do |b_a|
          unless bundle_access
            b_a.bundles.each do |b|
              if b.id == bundle.id
                bundle_access = b_a
                break
              end
            end
          end
        end
      else
        bundle_access = bundle_accesses.first
      end

      bundle_access
    end

    def find_bundle_accesses(operator, bundle = nil)
      bundle_accesses = BundleAccess.where(operator: operator)
      bundle_access = nil

      if bundle
        bundle_accesses.each do |b_a|
          unless bundle_access
            b_a.bundles.each do |b|
              if b.id == bundle.id
                bundle_access = b_a
                break
              end
            end
          end
        end
      end

      bundle_accesses = [bundle_access] if bundle_access
      bundle_accesses
    end

    def set_access_token
      post_fields = {
          grant_type: GRANT_TYPE,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET
      }.stringify_keys

      res = ask_bridge(post_fields, AUTH_URL)
      @access_token = res['access_token']
    end


    def ask_bridge(post_fields, url, is_json = false, token_required = false)
      post = is_json ? post_fields.to_json : post_fields.to_query
      content_type = is_json ? CONTENT_JSON_TYPE : CONTENT_FORM_TYPE
      uri = URI.parse(url)

      https = Net::HTTP.new(uri.host,uri.port)
      https.use_ssl = true
      req = Net::HTTP::Post.new(uri.path)

      req.body = post
      if token_required
        headers = {
            'Content-Type': content_type,
            'Authorization': 'Bearer ' + @access_token
        }.stringify_keys
        res = https.post(uri.path, post, headers)
      else
        res = https.request(req)
      end

      JSON.parse(res.body) rescue nil
    end

  end


end