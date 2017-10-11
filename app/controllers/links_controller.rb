class LinksController < ApplicationController
  include ApplicationHelper

  def index
    links = Link.all.as_json(only: [:id, :position], methods: [:name, :url, :image])

    render json: links
  end

end
