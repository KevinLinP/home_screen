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

  def sort
    json_links = JSON.parse(request.body.read, symbolize_names: true)
    sort_links(json_links)

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

  # NOTE: vulnerable to race condition
  def sort_links(json_links)
    links = Link.all.map{|link| [link.id, link]}.to_h

    json_links.each do |json_link|
      links[json_link[:id]].position = json_link[:index]
    end

    links = links.values.sort_by(&:position)
    links.each_with_index do |link, index|
      link.position = index
    end


    # bulk upsert still triggers the unique violation when I had it on 😂
    Link.import(links, on_duplicate_key_update: [:position])
  end

end
