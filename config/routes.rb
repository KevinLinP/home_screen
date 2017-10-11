Rails.application.routes.draw do
  root 'home_screen#show'

  resource :nicehash, only: :show
end
