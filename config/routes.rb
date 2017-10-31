Rails.application.routes.draw do

  root 'home_screen#show'

  resources :links, only: [:index, :create, :destroy, :update]
  resources :upcoming_events, only: [:index, :create, :destroy]
  resource :nicehash, only: :show
  resource :reddit, only: [:show, :update]
  resource :daylight_info, only: :show

  if Rails.env.production? || ENV['APP_CACHE']
    rack_offline = Rack::Offline.configure :cache_interval => 3.days.to_i do
      cache ActionController::Base.helpers.asset_path('application.css')
      cache ActionController::Base.helpers.asset_path('application.js')
      cache Webpacker.manifest.lookup("home_screen.js")

      network "*"
    end
    get '/application.manifest' => rack_offline
  end

end
