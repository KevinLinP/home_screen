class DaylightInfosController < ApplicationController
  include ApplicationHelper
  SEATTLE_LATITUDE = 47.639469
  SEATTLE_LONGITUDE = -122.325989

  def show
    data = []

    date = Date.yesterday
    4.times do
      data << {type: :sunrise, timestamp: unix_time_milliseconds(Sun.sunrise(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE))}
      data << {type: :sunset, timestamp: unix_time_milliseconds(Sun.sunset(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE))}

      date = date.next_day
    end

    render json: data.to_json
  end

end
