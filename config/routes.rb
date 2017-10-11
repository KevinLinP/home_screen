Rails.application.routes.draw do
  root 'home_screen#show'

  resource :nicehash, only: :show
  resources :links, only: :index

  rack_offline = Rack::Offline.configure :cache_interval => 7.days.to_i do
    cache ActionController::Base.helpers.asset_path('application.css')
    cache ActionController::Base.helpers.asset_path('application.js')
    cache ActionController::Base.helpers.asset_pack_path('home_screen.js')
    # cache other assets
    network "/"
  end
  get '/application.manifest' => rack_offline
end
