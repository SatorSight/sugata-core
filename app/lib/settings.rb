module Settings
  SUB_URL = 'Mobile subscription url'
  CARD_URL = 'Payment card redirect url'
  COUNTRY_CODE = 'Country code'
  SERVICE_ID = 'Service ID'

  def self.all

    {
        SUB_URL: self::SUB_URL,
        CARD_URL: self::CARD_URL,
        COUNTRY_CODE: self::COUNTRY_CODE,
        SERVICE_ID: self::SERVICE_ID
    }

  end
end