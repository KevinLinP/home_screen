module HomeScreenHelper
  SEATTLE_LATITUDE = 47.639469
  SEATTLE_LONGITUDE = -122.325989

  def daylight_info
    data = []

    date = Date.yesterday
    4.times do
      data << {type: :sunrise, timestamp: Sun.sunrise(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE).to_i * 1000}
      data << {type: :sunset, timestamp: Sun.sunset(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE).to_i * 1000}

      date = date.next_day
    end

    data
  end

end
