class LinksController < ApplicationController
  include ApplicationHelper
  skip_before_action :verify_authenticity_token # TODO: put back

  def index
    render_index
  end

  def create
    Link.create!(link_params)

    render_index
  end

  def update
    link = Link.find(params[:id])

    position = params[:position]
    if position
      link.insert_at(position)
    else
      link.update!(link_params)
    end

    render_index
  end

  def destroy
    link = Link.find(params[:id])
    link.destroy!

    render_index
  end

  protected

  def render_index
    links = Link.all.order(:position).as_json(only: [:id, :position], methods: [:name, :url, :image])
    render json: links
  end

  def link_params
    params.permit(:name, :url, :image)
  end
end
