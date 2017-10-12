class LinksController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token # TODO: put back

  def index
    render_index
  end

  def create
    link_positions = Link.all.pluck(:position)
    new_position = link_positions.max + 1

    Link.create!(link_params.merge({
      position: new_position
    }))

    render_index
  end

  def destroy
    link = Link.find(params[:id])
    link.destroy!

    render_index
  end

  protected

  def render_index
    links = Link.all.as_json(only: [:id, :position], methods: [:name, :url, :image])
    render json: links
  end

  def link_params
    params.permit(:name, :url, :image)
  end

end
