source 'https://rubygems.org'
ruby "2.4.2"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.4'
gem 'graphql'
gem 'connection_pool'
gem 'pg', '~> 0.18'
gem 'puma', '~> 3.7'
# gem 'bcrypt', '~> 3.1.7'

# rails libraries
gem 'rack-offline'

# activerecord libraries
gem 'acts_as_list'

# ruby libraries
gem 'memoist'
gem 'sun'
gem 'rest-client'
gem 'chronic'

# views
gem 'webpacker', '~> 3.0', github: 'rails/webpacker'
gem 'hamlit-rails'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
# gem 'therubyracer', platforms: :ruby
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'

# asset libraries
gem 'bootstrap'
gem 'font-awesome-rails'

group :production do
  gem 'dalli'
end

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'capybara', '~> 2.13'
  gem 'selenium-webdriver'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'pry'
  gem 'graphiql-rails', git: 'https://github.com/rmosolgo/graphiql-rails'
end
