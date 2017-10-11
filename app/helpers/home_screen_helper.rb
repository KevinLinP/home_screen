module HomeScreenHelper
  include ApplicationHelper
  SEATTLE_LATITUDE = 47.639469
  SEATTLE_LONGITUDE = -122.325989

  def daylight_info
    data = []

    date = Date.yesterday
    4.times do
      data << {type: :sunrise, timestamp: unix_time_milliseconds(Sun.sunrise(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE))}
      data << {type: :sunset, timestamp: unix_time_milliseconds(Sun.sunset(date, SEATTLE_LATITUDE, SEATTLE_LONGITUDE))}

      date = date.next_day
    end

    data
  end

  def todos
    # yes, it's weird that as_json actually returns a (json-ready) hash
    Todo.all.as_json(only: [:id, :position], methods: [:text, :completed])
  end

end
