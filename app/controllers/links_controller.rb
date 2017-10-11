class LinksController < ApplicationController
  include ApplicationHelper

  def index
    links = [{
      id: 9,
      position: 0,
      url: 'https://www.nicehash.com/dashboard',
      name: 'NiceHash Dashboard',
      image: 'https://www.nicehash.com/images/icons/favicon-196x196.png?v2'
    }]

    render json: links
  end

end
