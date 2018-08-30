Rails.application.routes.draw do
  devise_for :accounts
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  CrudRouter.load

  root to: 'admin#index'
  get '/temp', to: 'admin#temp'
  get '/accounts', to: 'accounts#index'
  post '/accounts/make', to: 'accounts#add'

  post '/image/new', to: 'images#new'
  post '/image/load', to: 'images#load'
  delete '/image/delete', to: 'images#delete'

  post '/logo/new', to: 'logos#new'
  post '/logo/load', to: 'logos#load'
  delete '/logo/delete', to: 'logos#delete'

  post '/additional_image/new', to: 'additional_images#new'
  post '/additional_image/load', to: 'additional_images#load'
  delete '/additional_image/delete', to: 'additional_images#delete'

  get '/content/add', to: 'content#add'
  post '/issue/save_articles', to: 'issues#save_articles'
  post '/issues/load_archive', to: 'issues#load_archive'
  post '/issues/load_pdf', to: 'issues#load_pdf'

  get '/content/get_article_desktop_html/:id/', to: 'content#get_article_desktop_html'
  delete '/content/destroy_article/:id/', to: 'content#destroy_article'

  get '/locales', to: 'locales#index'
  post '/locales/save', to: 'locales#save'

  get '/get_json_data/:realm_id/:secret_key/', to: 'slave_api#get_json_data'
  get '/get_zipped_images/:realm_id/:secret_key/', to: 'slave_api#get_zipped_images'

  get '/get_changed_data/:realm_id/:secret_key/', to: 'slave_api#get_changed_data'
  get '/get_changed_images/:realm_id/:secret_key/:ids/', to: 'slave_api#get_changed_images'
  get '/get_all_ids/:realm_id/:secret_key/', to: 'slave_api#get_all_ids'

  post '/change_article_chosen/:article_id/:on/', to: 'articles#change_article_chosen'
  post '/change_article_cover/:article_id/:on/', to: 'articles#change_article_cover'
  post '/change_article_linked/:article_id/:on/', to: 'articles#change_article_linked'
  post '/change_article_show_in_lists/:article_id/:on/', to: 'articles#change_article_show_in_lists'

  post '/make_article_html_jpeg/', to: 'articles#make_article_html_jpeg'

  get '/settings', to: 'settings#index'
  post '/settings/add', to: 'settings#create'
  delete '/settings/delete', to: 'settings#delete'
  patch '/settings/edit', to: 'settings#update'

  get '/auth_actions/:bundle_id/:operator_id/:realm_id/:secret_key/', to: 'slave_api#get_auth_actions'
  get '/bridge_token_info/:bridge_token/:bundle_id/:operator_id/:realm_id/:secret_key/', to: 'slave_api#bridge_token_info'
  get '/msisdn_info/:msisdn/:bundle_id/:operator_id/:realm_id/:secret_key/', to: 'slave_api#msisdn_info'
  #${page}/${page_size}/${order}/${order_by}/`;

  post '/content/upload_big_preview/', to: 'images#upload_big_preview'
  post '/content/upload_small_preview/', to: 'images#upload_small_preview'

  get '/downloader', to: 'download#index'
  post '/create_archive', to: 'download#create_archive'
  delete '/delete_archive/:name', to: 'download#delete_archive'
end