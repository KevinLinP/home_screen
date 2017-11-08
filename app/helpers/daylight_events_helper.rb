module DaylightEventsHelper
  SEATTLE_LATITUDE = 47.639469
  SEATTLE_LONGITUDE = -122.325989

  def daylight_events(days)
    data = []

    date = Date.yesterday
    (days + 1).times do
      data << DaylightEvent.new(type: :sunrise, timestamp: unix_time_milliseconds(Sun.sunrise(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE)))
      data << DaylightEvent.new(type: :sunset, timestamp: unix_time_milliseconds(Sun.sunset(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE)))

      date = date.next_day
    end

    data
  end

end
