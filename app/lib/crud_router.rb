class CrudRouter
  def self.load
    crud_models = CrudHelper::crud_models

    Rails.application.routes.draw do
      crud_models.map do |resource|
        get "/#{resource}", to: "#{resource}#index"
        post "/#{resource}/add", to: "#{resource}#create"
        delete "/#{resource}/delete", to: "#{resource}#delete"
        patch "/#{resource}/edit", to: "#{resource}#update"

        get "/reload_crud_data/#{resource}/:page/:page_size/:order/:order_by/:filters/", to: "#{resource}#reload"
      end
    end
  end
end