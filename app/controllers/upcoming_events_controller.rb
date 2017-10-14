class UpcomingEventsController < ApplicationController
  include ApplicationHelper

  def index
    render_index
  end

  protected

  def render_index
    upcoming_events = [
      {name: 'a', date: Date.parse('2017-12-12')},
      {name: 'b', date: Date.parse('2018-03-17')}
    ]

    upcoming_events.each do |event|
      event[:date] = iso_date(event[:date])
    end

    render json: upcoming_events
  end

end
