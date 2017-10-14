class UpcomingEventsController < ApplicationController
  include ApplicationHelper

  def index
    render_index
  end

  def create
    UpcomingEvent.create!(upcoming_event_params)

    render_index
  end

  def destroy
    UpcomingEvent.destroy(params[:id])

    render_index
  end

  protected

  def upcoming_event_params
    params.permit(:name, :date)
  end

  def render_index
    upcoming_events = UpcomingEvent.all.sort_by(&:date).as_json(only: [:id], methods: [:name, :date])

    render json: upcoming_events
  end

end
